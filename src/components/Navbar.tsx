"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/data/site";
import { goTo } from "@/lib/scroll";

const FOCUS_RING = "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900";

// Overlays the top of the hero.
export default function Navbar() {
  const reduced = !!useReducedMotion();

  return (
    <motion.header
      initial={{ opacity: 0, y: reduced ? 0 : -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 top-0 z-20"
    >
      <nav
        aria-label="Primary"
        className="container flex items-center justify-between px-gutter py-6 sm:px-gutter-md lg:px-gutter-lg"
      >
        <a href="#home" className={`text-body-l font-bold ${FOCUS_RING}`}>
          {SITE.name}
          <span className="text-neon-pink">.</span>
        </a>
        <ul className="flex items-center gap-6 text-meta font-medium sm:gap-10">
          {SITE.navLinks.map(({ label, id }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={goTo(id, !reduced)}
                className={`group relative py-1 text-ink-600 transition-colors duration-200 hover:text-ink-900 ${FOCUS_RING}`}
              >
                {label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-neon-pink transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}
