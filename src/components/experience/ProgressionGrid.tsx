import type { CSSProperties } from "react";
import { Layers } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { ProgressionPhase } from "@/data/experience";
import ProgressTrack from "./ProgressTrack";

const pad = (n: number) => String(n).padStart(2, "0");

export default function ProgressionGrid({ phases }: { phases: readonly ProgressionPhase[] }) {
  const latest = phases.length - 1;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h4 className="flex items-center gap-2 text-label uppercase text-ink-900">
          <Layers aria-hidden className="h-4 w-4 text-ink-600" />
          Engineering progression
        </h4>
        <span className="hidden text-label uppercase text-ink-600 sm:block">{pad(phases.length)} development phases</span>
      </div>

      <ProgressTrack count={phases.length} />

      <ol
        role="list"
        className="grid list-none grid-cols-1 gap-4 md:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
        style={{ "--cols": phases.length } as CSSProperties}
      >
        {phases.map((phase, i) => {
          const isLatest = i === latest;
          return (
            <li key={phase.number}>
              <Reveal
                delay={0.15 + i * 0.15}
                className={`group h-full rounded-card border bg-page p-6 transition-[translate,border-color] duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                  isLatest ? "border-neon-pink/40" : "border-line hover:border-ink-400"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Outlined number that fills in on hover */}
                  <span className="text-h2 text-transparent transition-colors duration-300 [-webkit-text-stroke:1px_#14101F] group-hover:text-ink-900">
                    {phase.number}
                  </span>
                  <span className="rounded-pill border border-line px-2.5 py-1 text-label uppercase text-ink-600">
                    {phase.label}
                  </span>
                </div>
                {isLatest && (
                  <p className="mt-4 flex items-center gap-2 text-label uppercase text-neon-pink">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-pill bg-neon-pink" />
                    Latest
                  </p>
                )}
                <h5 className="mt-6 text-h3 text-ink-900">{phase.title}</h5>
                <p className="mt-2 text-meta text-ink-600">{phase.description}</p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
