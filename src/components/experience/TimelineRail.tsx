"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Draws the rail top-down and pops in the node; sits in a relatively positioned wrapper.
// Visibility is tracked on the untransformed wrapper: the rail and node start at scale 0,
// and zero-size elements aren't reliably reported as in view.
export default function TimelineRail() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = !!useReducedMotion();
  const shown = inView || reduced;

  return (
    <div ref={ref} aria-hidden className="absolute inset-y-0 left-0 w-px">
      <motion.div
        initial={reduced ? false : { scaleY: 0 }}
        animate={shown ? { scaleY: 1 } : undefined}
        transition={{ duration: 0.75, ease: EASE }}
        className="absolute inset-0 origin-top bg-linear-to-b from-neon-pink via-neon-pink/50 to-transparent"
      />
      <motion.div
        initial={reduced ? false : { scale: 0, opacity: 0 }}
        animate={shown ? { scale: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
        className="absolute -left-[6.5px] top-0 flex h-3.5 w-3.5 items-center justify-center rounded-pill border border-neon-pink bg-page"
      >
        <span className="absolute inset-0 rounded-pill border border-neon-pink/40 motion-safe:animate-ping" />
        <span className="h-1.5 w-1.5 rounded-pill bg-neon-pink motion-safe:animate-pulse" />
      </motion.div>
    </div>
  );
}
