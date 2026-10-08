"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { useElementHeight, useMediaQuery, useOnScreen, usePointer } from "@/components/hero/hooks";
import { HERO } from "@/data/hero";
import { goTo } from "@/lib/scroll";

const HeroCanvas = dynamic(() => import("@/components/hero/HeroCanvas"), { ssr: false });

const GUTTER = "container px-gutter sm:px-gutter-md lg:px-gutter-lg";
const FOCUS_RING = "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900";

type HeroProps = {
  imageSrc?: string;
  depthSrc?: string | null;
  projectsId?: string;
};

export default function Hero({ imageSrc = "/hero.png", depthSrc = "/hero-depth.png", projectsId = "projects" }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const compact = useMediaQuery("(max-width: 1023px)");
  const touch = useMediaQuery("(hover: none), (pointer: coarse)");
  const onScreen = useOnScreen(heroRef);
  const stagePx = useElementHeight(stageRef);
  const pointer = usePointer(heroRef, !touch && !reduced);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -90]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // Entrance: headline lines, then paragraph, role line, button.
  const sequence: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.16, delayChildren: 0.3 } } };
  const lines: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: reduced ? 0.4 : 0.85, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative isolate flex min-h-svh w-full flex-col overflow-hidden bg-page text-ink-900"
    >
      {/* 3D layer: fills the hero and sits behind the text */}
      <div
        role="img"
        aria-label={HERO.imageAlt}
        className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <HeroCanvas
          imageSrc={imageSrc}
          depthSrc={depthSrc}
          pointer={pointer}
          scroll={scrollYProgress}
          compact={compact}
          touch={touch}
          reduced={reduced}
          stagePx={stagePx}
          onScreen={onScreen}
          onReady={onReady}
        />
      </div>

      {/* Softens the cut where the photo meets the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-linear-to-t from-page to-transparent"
      />

      {/* Copy */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className={`${GUTTER} relative z-10 flex flex-1 flex-col pt-28 lg:justify-center lg:pb-10 lg:pt-24`}
      >
        <motion.div variants={sequence} initial="hidden" animate="show" className="w-full lg:max-w-[40vw]">
          <motion.h1
            variants={lines}
            className="text-[length:clamp(2.25rem,9.6vw,3.5rem)] font-bold uppercase leading-[calc(74/76)] tracking-[-0.02em] lg:text-[length:clamp(2.75rem,4.6vw,4.75rem)]"
          >
            {HERO.headline.map(({ text, accent }) => (
              <motion.span key={text} variants={rise} className="block whitespace-nowrap">
                {accent ? (
                  <span className="bg-accent-gradient bg-clip-text pr-[0.06em] text-transparent">{text}</span>
                ) : (
                  text
                )}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p variants={rise} className="mt-6 max-w-[480px] text-body text-ink-600 sm:text-body-l">
            {HERO.intro}
          </motion.p>

          <motion.p variants={rise} className="mt-7 text-label uppercase text-ink-600">
            {HERO.role}
          </motion.p>

          {/* The wrapper animates in; the link keeps its own hover transform. */}
          <motion.div variants={rise} className="mt-9">
            <a
              href={`#${projectsId}`}
              onClick={goTo(projectsId, !reduced)}
              className="group inline-flex items-center gap-3 rounded-pill bg-neon-pink px-7 py-3.5 text-body font-semibold text-ink-900 shadow-[0_10px_30px_-12px_rgba(255,46,154,0.7)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_0_6px_rgba(255,46,154,0.14),0_18px_48px_-10px_rgba(255,46,154,0.9)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {HERO.ctaLabel}
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none"
              >
                <path d="M3 10h13M11 5l5 5-5 5" />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        {/* Mobile: the space the photo occupies below the text */}
        <div ref={stageRef} aria-hidden className="min-h-[40svh] flex-1 lg:hidden" />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div style={{ opacity: hintOpacity }} className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <motion.a
          href={`#${projectsId}`}
          onClick={goTo(projectsId, !reduced)}
          aria-label="Scroll to projects"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className={`flex flex-col items-center gap-3 ${FOCUS_RING}`}
        >
          <span className="text-label uppercase text-ink-600">{HERO.scrollLabel}</span>
          <span className="relative block h-10 w-px overflow-hidden bg-line">
            <motion.span
              className="absolute left-0 top-0 block h-4 w-px bg-neon-pink"
              animate={reduced ? undefined : { y: [-16, 40] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}
