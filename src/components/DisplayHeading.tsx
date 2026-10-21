import { Terminal } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { TitleLine, TitleStyle } from "@/data/types";

type DisplayHeadingProps = {
  eyebrow: string;
  lines: readonly TitleLine[];
  id: string; // for the section's aria-labelledby
};

const LINE_STYLES: Record<TitleStyle, string> = {
  solid: "",
  outline: "text-transparent [-webkit-text-stroke:1.5px_#14101F]",
  accent: "text-neon-pink",
};

// Eyebrow with a terminal icon over a large multi-line h2, as in the About section.
export default function DisplayHeading({ eyebrow, lines, id }: DisplayHeadingProps) {
  return (
    <div>
      <Reveal className="mb-6 flex items-center gap-3 text-label uppercase text-ink-600">
        <Terminal aria-hidden className="h-3.5 w-3.5 text-neon-pink" />
        <span>{eyebrow}</span>
      </Reveal>

      <Reveal delay={0.06}>
        <h2
          id={id}
          className="text-[length:clamp(2.5rem,13vw,5rem)] font-bold uppercase leading-[calc(74/76)] tracking-[-0.02em] text-ink-900 lg:text-[length:clamp(3rem,7vw,5.5rem)]"
        >
          {lines.map(({ text, style }) => (
            <span key={text} className={`block whitespace-nowrap ${LINE_STYLES[style ?? "solid"]}`}>
              {text}
            </span>
          ))}
        </h2>
      </Reveal>
    </div>
  );
}
