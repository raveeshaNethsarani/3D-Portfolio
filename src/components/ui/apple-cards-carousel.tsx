"use client";

// Adapted from Aceternity UI "Apple Cards Carousel":
// https://ui.aceternity.com/components/apple-cards-carousel
// Changes from the original:
// - project tokens instead of its colours; framer-motion and lucide-react (already installed)
//   instead of motion and @tabler/icons-react
// - the expanded card is a portal-rendered dialog (aria-modal, labelled, focus moved in and
//   restored), so it sits above the fixed navbar and isn't trapped by section stacking contexts+
// - Escape and scroll locking only while a card is open (the original closed every card,
//   and scrolled the carousel, on any Escape press)
// - prefers-reduced-motion: no slide-in, no layout morph, instant scrolling
// - optional `cover` node for cards without an image; next/image for images
// - closing scrolls the card back into view by its real position

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Image, { type ImageProps } from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";

type CarouselProps = {
  items: ReactNode[];
  initialScroll?: number;
  label?: string; // accessible name for the carousel region
};

export type Card = {
  src?: string; // full-card image; when absent, `cover` is shown instead
  cover?: ReactNode;
  title: string;
  category: string;
  content: ReactNode; // shown in the expanded view
};

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900";
const SCROLL_STEP = 300;

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

const noopSubscribe = () => () => {};
// True on the client only, so portals are never created during server rendering.
const useIsClient = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

export const Carousel = ({ items, initialScroll = 0, label = "Carousel" }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduced = !!useReducedMotion();
  const behavior: ScrollBehavior = reduced ? "auto" : "smooth";

  const checkScrollability = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollLeft = initialScroll;
    // Also re-checks the arrows whenever the carousel is resized.
    const ro = new ResizeObserver(checkScrollability);
    ro.observe(el);
    return () => ro.disconnect();
  }, [initialScroll, checkScrollability]);

  const scrollBy = (direction: 1 | -1) => carouselRef.current?.scrollBy({ left: direction * SCROLL_STEP, behavior });

  const handleCardClose = useCallback(
    (index: number) => {
      const card = carouselRef.current?.querySelectorAll<HTMLElement>("[data-carousel-item]")[index];
      card?.scrollIntoView({ inline: "nearest", block: "nearest", behavior });
      setCurrentIndex(index);
    },
    [behavior],
  );

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div role="region" aria-roledescription="carousel" aria-label={label} className="relative w-full">
        <div
          ref={carouselRef}
          onScroll={checkScrollability}
          className="flex w-full overflow-x-scroll overscroll-x-auto py-10 [scrollbar-width:none] md:py-20 [&::-webkit-scrollbar]:hidden"
        >
          <ul role="list" className="flex list-none flex-row justify-start gap-4">
            {items.map((item, index) => (
              <motion.li
                key={"card" + index}
                data-carousel-item
                initial={{ opacity: 0, y: reduced ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: reduced ? 0 : 0.2 * index, ease: "easeOut" }}
                className="shrink-0 rounded-card last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            aria-label="Scroll to previous cards"
            className={cn(
              "relative z-40 flex h-10 w-10 items-center justify-center rounded-pill border border-line bg-surface text-ink-900 transition-colors hover:border-ink-400 disabled:opacity-40",
              FOCUS_RING,
            )}
          >
            <ArrowLeft aria-hidden className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            aria-label="Scroll to next cards"
            className={cn(
              "relative z-40 flex h-10 w-10 items-center justify-center rounded-pill border border-line bg-surface text-ink-900 transition-colors hover:border-ink-400 disabled:opacity-40",
              FOCUS_RING,
            )}
          >
            <ArrowRight aria-hidden className="h-5 w-5" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({ card, index, layout = false }: { card: Card; index: number; layout?: boolean }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { onCardClose } = useContext(CarouselContext);
  const reduced = !!useReducedMotion();
  const isClient = useIsClient();
  const titleId = useId();
  const morph = layout && !reduced;
  const onImage = Boolean(card.src);

  const handleClose = useCallback(() => {
    setOpen(false);
    onCardClose(index);
    triggerRef.current?.focus({ preventScroll: true });
  }, [index, onCardClose]);

  // While open: lock page scroll, focus the close button, close on Escape.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, handleClose]);

  useOutsideClick(containerRef, handleClose);

  return (
    <>
      {isClient &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[60] h-screen overflow-auto px-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 h-full w-full bg-ink-900/40 backdrop-blur-lg"
                />
                <motion.div
                  ref={containerRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={titleId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layoutId={morph ? `card-${card.title}` : undefined}
                  className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-card border border-line bg-page p-6 md:p-10"
                >
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={handleClose}
                    aria-label="Close"
                    className={cn(
                      "sticky top-4 right-0 ml-auto flex h-10 w-10 items-center justify-center rounded-pill bg-ink-900 text-page",
                      FOCUS_RING,
                    )}
                  >
                    <X aria-hidden className="h-5 w-5" />
                  </button>
                  <motion.p
                    layoutId={morph ? `category-${card.title}` : undefined}
                    className="text-label uppercase text-neon-pink"
                  >
                    {card.category}
                  </motion.p>
                  <motion.h3
                    id={titleId}
                    layoutId={morph ? `title-${card.title}` : undefined}
                    className="mt-4 text-h2 uppercase text-ink-900"
                  >
                    {card.title}
                  </motion.h3>
                  <div className="py-10">{card.content}</div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      <motion.button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        layoutId={morph ? `card-${card.title}` : undefined}
        className={cn(
          "group relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-card border border-line bg-surface text-left md:h-[40rem] md:w-96",
          FOCUS_RING,
        )}
      >
        {onImage && (
          <span className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-linear-to-b from-ink-900/50 via-transparent to-transparent" />
        )}
        <span className="relative z-40 block p-8">
          <motion.span
            layoutId={morph ? `category-${card.title}` : undefined}
            className={cn("block text-label uppercase", onImage ? "text-page" : "text-neon-pink")}
          >
            {card.category}
          </motion.span>
          <motion.span
            layoutId={morph ? `title-${card.title}` : undefined}
            className={cn(
              "mt-2 block max-w-xs text-[28px] font-bold uppercase leading-tight tracking-[0.02em] [text-wrap:balance]",
              onImage ? "text-page" : "text-ink-900",
            )}
          >
            {card.title}
          </motion.span>
        </span>
        {card.src ? (
          <BlurImage
            src={card.src}
            alt=""
            fill
            sizes="(min-width: 768px) 384px, 224px"
            className="absolute inset-0 z-10 object-cover"
          />
        ) : (
          <span className="absolute inset-0 z-10 block">{card.cover}</span>
        )}
      </motion.button>
    </>
  );
};

export const BlurImage = ({ className, alt, ...rest }: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn("h-full w-full transition duration-300", isLoading ? "blur-sm" : "blur-0", className)}
      onLoad={() => setLoading(false)}
      alt={alt}
      {...rest}
    />
  );
};
