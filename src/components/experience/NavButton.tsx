import type { ReactNode } from "react";

type NavButtonProps = {
  onClick: () => void;
  label: string;
  children: ReactNode;
};

export default function NavButton({ onClick, label, children }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-pill border border-line bg-page text-ink-600 transition-[translate,scale,color,border-color] duration-200 hover:-translate-y-px hover:scale-105 hover:border-neon-pink/60 hover:text-neon-pink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900 active:scale-95 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
    >
      {children}
    </button>
  );
}
