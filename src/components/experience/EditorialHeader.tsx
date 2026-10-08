import { Terminal } from "lucide-react";
import Reveal from "@/components/Reveal";

type EditorialHeaderProps = {
  eyebrow: string;
  title: readonly [solid: string, outline: string];
  titleId: string;
  overview: string;
  path: string;
};

export default function EditorialHeader({ eyebrow, title, titleId, overview, path }: EditorialHeaderProps) {
  return (
    <div className="mb-12 grid grid-cols-1 gap-10 border-b border-line pb-10 sm:mb-16 sm:gap-12 sm:pb-12 lg:mb-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 xl:gap-20">
      <Reveal delay={0.05}>
        <p className="mb-6 flex items-center gap-3 text-label uppercase text-ink-600">
          <Terminal aria-hidden className="h-3.5 w-3.5 text-neon-pink" />
          <span>{eyebrow}</span>
        </p>
        <h2
          id={titleId}
          className="text-[length:clamp(2.5rem,12vw,5rem)] font-bold uppercase leading-[calc(74/76)] tracking-[-0.02em] text-ink-900 lg:text-[length:clamp(3rem,7vw,5.5rem)]"
        >
          <span className="block whitespace-nowrap">{title[0]}</span>
          <span className="block whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_#14101F]">{title[1]}</span>
        </h2>
      </Reveal>

      <Reveal delay={0.13} className="flex flex-col justify-end">
        <p className="max-w-[70ch] text-body text-ink-600">{overview}</p>
        <p className="mt-6 flex flex-wrap items-center gap-2 text-label uppercase text-neon-pink">
          <span aria-hidden className="h-2 w-2 rounded-pill bg-neon-pink motion-safe:animate-pulse" />
          <span>Engineering progression</span>
          <span aria-hidden className="text-ink-400">{"//"}</span>
          <span className="text-ink-900">{path}</span>
        </p>
      </Reveal>
    </div>
  );
}
