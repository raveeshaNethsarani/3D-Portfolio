import { Briefcase, GraduationCap, Terminal, Zap, type LucideIcon } from "lucide-react";
import ParticleField from "@/components/ParticleField";
import Reveal from "@/components/Reveal";
import { ABOUT, type CredentialIcon, type Paragraph, type TitleStyle } from "@/data/about";

// Used by the credential cards (currently commented out below).
const CREDENTIAL_ICONS: Record<CredentialIcon, LucideIcon> = { briefcase: Briefcase, "graduation-cap": GraduationCap };

const TITLE_STYLES: Record<TitleStyle, string> = {
  solid: "",
  outline: "text-transparent [-webkit-text-stroke:1.5px_#14101F]",
  accent: "text-neon-pink",
};
const PARAGRAPH_STYLES: Record<Paragraph["size"], string> = {
  lead: "text-body-l text-ink-900",
  body: "text-body text-ink-600 sm:text-justify",
};

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative isolate py-section-sm lg:py-section">
      <ParticleField />
      <div className="container relative px-gutter sm:px-gutter-md lg:px-gutter-lg">
        {/* <Reveal className="mb-10 flex items-center gap-3 border-b border-line pb-4 sm:mb-16 lg:mb-24">
          <span aria-hidden className="h-2 w-2 shrink-0 rounded-pill bg-neon-pink" />
          <p className="text-label uppercase text-neon-pink">{ABOUT.label}</p>
        </Reveal> */}

        <div className="grid grid-cols-1 gap-12 sm:gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:gap-20">
          {/* Left: headline, pinned while the biography scrolls */}
          <div>
            <div className="lg:sticky lg:top-24">
              <Reveal className="mb-6 flex items-center gap-3 text-label uppercase text-ink-600">
                <Terminal aria-hidden className="h-3.5 w-3.5 text-neon-pink" />
                <span>{ABOUT.eyebrow}</span>
              </Reveal>

              <Reveal delay={0.06}>
                <h2
                  id="about-title"
                  className="text-[length:clamp(2.5rem,13vw,5rem)] font-bold uppercase leading-[calc(74/76)] tracking-[-0.02em] text-ink-900 lg:text-[length:clamp(3rem,7vw,5.5rem)]"
                >
                  {ABOUT.title.map(({ text, style }) => (
                    <span key={text} className={`block whitespace-nowrap ${TITLE_STYLES[style ?? "solid"]}`}>
                      {text}
                    </span>
                  ))}
                </h2>
              </Reveal>

              <Reveal delay={0.12} className="mt-8 flex max-w-xl items-start gap-4 border-l border-neon-pink pl-5 sm:mt-10">
                <Zap aria-hidden className="mt-1.5 h-4 w-4 shrink-0 text-neon-pink" />
                <p className="text-body text-ink-600">{ABOUT.mindset}</p>
              </Reveal>
            </div>
          </div>

          {/* Right: biography */}
          <div className="max-w-[70ch] space-y-6">
            <Reveal delay={0.08} className="flex items-center gap-3 text-label uppercase text-neon-pink">
              <span aria-hidden className="h-px w-8 bg-neon-pink" />
              <span>{ABOUT.profileLabel}</span>
            </Reveal>

            {ABOUT.profile.map(({ size, segments }, i) => (
              <Reveal key={i} delay={0.18 + i * 0.1}>
                <p className={PARAGRAPH_STYLES[size]}>
                  {segments.map((seg, j) =>
                    typeof seg === "string" ? (
                      seg
                    ) : (
                      <strong
                        key={j}
                        className={`font-semibold  ${seg.accent ? "text-neon-pink" : "text-ink-900"}`}
                      >
                        {seg.strong}
                      </strong>
                    ),
                  )}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Credential cards */}
        {/* <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2">
          {ABOUT.credentials.map(({ icon, label, index, title, meta }, i) => {
            const Icon = CREDENTIAL_ICONS[icon];
            return (
            <Reveal
              key={index}
              delay={0.05 + i * 0.07}
              className="rounded-card border border-line bg-surface p-10 transition-[translate,border-color] duration-300 hover:-translate-y-1 hover:border-neon-pink/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-label uppercase text-neon-pink">
                  <Icon aria-hidden className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </p>
                <span className="text-meta text-ink-600">{index}</span>
              </div>
              <h3 className="mt-6 text-h3 text-ink-900">{title}</h3>
              <p className="mt-2 text-meta text-ink-600">{meta}</p>
            </Reveal>
            );
          })}
        </div> */}
      </div>
    </section>
  );
}
