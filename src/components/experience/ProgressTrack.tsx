"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const STEP = 0.45; // seconds between one node lighting up and the next

// Node-and-line track above the phase cards (md and up). It draws left to right
// once in view: completed phases fill with ink, the latest one turns pink.
// Visibility is tracked on the track itself, since the segments start at zero width.
export default function ProgressTrack({ count }: { count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = !!useReducedMotion();
  const shown = inView || reduced;
  const latest = count - 1;

  return (
    <div
      ref={ref}
      aria-hidden
      className="mb-5 hidden gap-4 md:grid"
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="relative h-3">
          {i < latest && (
            <>
              {/* Runs from this node's centre to the next node's centre, across the 1rem gap */}
              <span className="absolute left-1.5 top-1/2 h-px w-[calc(100%+1rem)] -translate-y-1/2 bg-line" />
              <motion.span
                initial={reduced ? false : { scaleX: 0 }}
                animate={shown ? { scaleX: 1 } : undefined}
                transition={{ duration: 0.5, delay: 0.2 + i * STEP, ease: "easeInOut" }}
                className={`absolute left-1.5 top-1/2 h-px w-[calc(100%+1rem)] -translate-y-1/2 origin-left ${
                  i === latest - 1 ? "bg-neon-pink" : "bg-ink-400"
                }`}
              />
            </>
          )}
          <motion.span
            initial={reduced ? false : { scale: 0.4, opacity: 0 }}
            animate={shown ? { scale: 1, opacity: 1 } : undefined}
            transition={{ duration: 0.35, delay: 0.1 + i * STEP }}
            className={`absolute left-0 top-0 h-3 w-3 rounded-pill border ${
              i === latest ? "border-neon-pink bg-neon-pink" : "border-ink-900 bg-ink-900"
            }`}
          >
            {i === latest && (
              <span className="absolute inset-0 rounded-pill bg-neon-pink opacity-50 motion-safe:animate-ping" />
            )}
          </motion.span>
        </div>
      ))}
    </div>
  );
}
