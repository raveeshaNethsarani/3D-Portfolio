"use client";

import type { Ref } from "react";
import { motion } from "framer-motion";

type MenuButtonProps = {
  open: boolean;
  onClick: () => void;
  controls: string; // id of the menu panel
  reduced: boolean;
  ref?: Ref<HTMLButtonElement>;
};

// Three lines that cross into an X while the menu is open. 12px box: lines at 0, 5.25 and 10.5px.
const SHIFT = 5.25;

export default function MenuButton({ open, onClick, controls, reduced, ref }: MenuButtonProps) {
  const transition = { duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] as const };
  const line = "absolute left-0 h-[1.5px] w-5 rounded-pill bg-current";

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? "Close menu" : "Open menu"}
      className="relative flex h-11 w-11 items-center justify-center rounded-pill border border-line text-ink-900 transition-colors duration-200 hover:border-ink-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900 md:hidden"
    >
      <span aria-hidden className="relative block h-3 w-5">
        <motion.span
          className={`${line} top-0`}
          animate={open ? { y: SHIFT, rotate: 45 } : { y: 0, rotate: 0 }}
          transition={transition}
        />
        <motion.span
          className={`${line} top-[5.25px]`}
          animate={open ? { opacity: 0, scaleX: 0.3 } : { opacity: 1, scaleX: 1 }}
          transition={transition}
        />
        <motion.span
          className={`${line} top-[10.5px]`}
          animate={open ? { y: -SHIFT, rotate: -45 } : { y: 0, rotate: 0 }}
          transition={transition}
        />
      </span>
    </button>
  );
}
