import Reveal from "@/components/Reveal";

type SectionEyebrowProps = {
  label: string;
  aside?: string; // right-aligned meta, hidden under 640px
};

// Full-width label row with a rule underneath, e.g. "[ 04 // PROFESSIONAL LEDGER ]".
export default function SectionEyebrow({ label, aside }: SectionEyebrowProps) {
  return (
    <Reveal className="mb-10 flex items-center justify-between gap-4 border-b border-line pb-4 sm:mb-16 lg:mb-24">
      <p className="flex min-w-0 items-center gap-3 text-label uppercase text-neon-pink">
        <span aria-hidden className="h-2 w-2 shrink-0 rounded-pill bg-neon-pink motion-safe:animate-pulse" />
        <span className="text-balance">{label}</span>
      </p>
      {aside && <p className="hidden shrink-0 whitespace-nowrap text-label uppercase text-ink-600 sm:block">{aside}</p>}
    </Reveal>
  );
}
