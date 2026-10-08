"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { NavLink } from "@/data/site";

type MobileMenuProps = {
  id: string;
  open: boolean;
  links: readonly NavLink[];
  active: string | null;
  reduced: boolean;
  onNavigate: (id: string) => (e: MouseEvent<HTMLAnchorElement>) => void;
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const pad = (n: number) => String(n).padStart(2, "0");

// Full-screen link list under the fixed header, below 768px only.
export default function MobileMenu({ id, open, links, active, reduced, onNavigate }: MobileMenuProps) {
  const firstLink = useRef<HTMLAnchorElement>(null);

  // Move focus into the menu when it opens.
  useEffect(() => {
    if (open) firstLink.current?.focus();
  }, [open]);

  const list: Variants = {
    hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          key="mobile-menu"
          initial={{ opacity: 0, y: reduced ? 0 : -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -12 }}
          transition={{ duration: reduced ? 0.15 : 0.3, ease: EASE }}
          className="fixed inset-0 z-40 overflow-y-auto bg-page px-gutter pb-10 pt-28 sm:px-gutter-md md:hidden"
        >
          <nav aria-label="Mobile">
            <motion.ul
              role="list"
              variants={list}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="list-none divide-y divide-line border-y border-line"
            >
              {links.map(({ label, id: target }, i) => {
                const isActive = active === target;
                return (
                  <motion.li key={target} variants={item}>
                    <a
                      ref={i === 0 ? firstLink : undefined}
                      href={`#${target}`}
                      onClick={onNavigate(target)}
                      aria-current={isActive ? "location" : undefined}
                      className="group flex items-baseline gap-4 rounded-sm py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900"
                    >
                      <span className="text-label text-ink-600">{pad(i + 1)}</span>
                      <span className="text-[length:clamp(1.75rem,9vw,3rem)] font-bold uppercase leading-none tracking-[-0.015em] text-ink-900 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
                        {label}
                      </span>
                      {isActive && <span aria-hidden className="ml-auto h-2 w-2 self-center rounded-pill bg-neon-pink" />}
                    </a>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
