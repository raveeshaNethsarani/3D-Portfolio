import { Briefcase, GraduationCap, Terminal, Zap, type LucideIcon } from "lucide-react";
import ParticleField from "@/components/ParticleField";
import Reveal from "@/components/Reveal";

type TitleStyle = "solid" | "outline" | "accent";
type TitleLine = { text: string; style?: TitleStyle };
type Segment = string | { strong: string; accent?: boolean };
type Paragraph = { size: "lead" | "body"; segments: readonly Segment[] };
type Credential = { icon: LucideIcon; label: string; index: string; title: string; meta: string };

const SECTION_LABEL = "[ 03 // ENGINEERING BIOGRAPHY & METHODOLOGY ]";
const EYEBROW = "IDENTITY / ENGINEERING MINDSET";
const TITLE: readonly TitleLine[] = [
  { text: "ENGINEER" },
  { text: "WHO THINKS", style: "outline" },
  { text: "IN SYSTEMS.", style: "accent" },
];
const MINDSET =
  "From interface behavior to backend infrastructure, I approach software as a connected system rather than a collection of isolated features.";
const PROFILE_LABEL = "PROFILE";
const PROFILE: readonly Paragraph[] = [
  // {
  //   size: "lead",
  //   segments: [
  //     "Operating at the intersection of ",
  //     { strong: "client-side reactivity" },
  //     " and ",
  //     { strong: "backend infrastructure", accent: true },
  //     ", I work as a Full Stack System Engineer at ",
  //     { strong: "BotCalm (Pvt) Ltd" },
  //     ".",
  //   ],
  // },
  {
    size: "body",
    segments: [
      "My technical philosophy was shaped through rigorous academic study in the IT Department of the ",
      { strong: "Sri Lanka Institute of Advanced Technological Education (SLIATE), Galle" },
      ", where I earned a Higher National Diploma in Information Technology.",
    ],
  },
  {
    size: "body",
    segments: [
      "That foundation developed my focus on database design, computational thinking, networking, and disciplined software engineering practices. In production environments, I work across system boundaries building APIs, authentication flows, role-based access control, database-backed services, reactive interfaces, and distributed application components.",
    ],
  },
];
const CREDENTIALS: readonly Credential[] = [
  {
    icon: Briefcase,
    label: "PRODUCTION AFFILIATION",
    index: "01",
    title: "Full Stack System Engineer",
    meta: "BotCalm (Pvt) Ltd · Sri Lanka",
  },
  {
    icon: GraduationCap,
    label: "ACADEMIC CREDENTIAL",
    index: "02",
    title: "HND in Information Technology",
    meta: "SLIATE Galle · IT Department",
  },
];

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
          <p className="text-label uppercase text-neon-pink">{SECTION_LABEL}</p>
        </Reveal> */}

        <div className="grid grid-cols-1 gap-12 sm:gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:gap-20">
          {/* Left: headline, pinned while the biography scrolls */}
          <div>
            <div className="lg:sticky lg:top-24">
              <Reveal className="mb-6 flex items-center gap-3 text-label uppercase text-ink-600">
                <Terminal aria-hidden className="h-3.5 w-3.5 text-neon-pink" />
                <span>{EYEBROW}</span>
              </Reveal>

              <Reveal delay={0.06}>
                <h2
                  id="about-title"
                  className="text-[length:clamp(2.5rem,13vw,5rem)] font-bold uppercase leading-[calc(74/76)] tracking-[-0.02em] text-ink-900 lg:text-[length:clamp(3rem,7vw,5.5rem)]"
                >
                  {TITLE.map(({ text, style }) => (
                    <span key={text} className={`block whitespace-nowrap ${TITLE_STYLES[style ?? "solid"]}`}>
                      {text}
                    </span>
                  ))}
                </h2>
              </Reveal>

              <Reveal delay={0.12} className="mt-8 flex max-w-xl items-start gap-4 border-l border-neon-pink pl-5 sm:mt-10">
                <Zap aria-hidden className="mt-1.5 h-4 w-4 shrink-0 text-neon-pink" />
                <p className="text-body text-ink-600">{MINDSET}</p>
              </Reveal>
            </div>
          </div>

          {/* Right: biography */}
          <div className="max-w-[70ch] space-y-6">
            <Reveal delay={0.08} className="flex items-center gap-3 text-label uppercase text-neon-pink">
              <span aria-hidden className="h-px w-8 bg-neon-pink" />
              <span>{PROFILE_LABEL}</span>
            </Reveal>

            {PROFILE.map(({ size, segments }, i) => (
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
          {CREDENTIALS.map(({ icon: Icon, label, index, title, meta }, i) => (
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
          ))}
        </div> */}
      </div>
    </section>
  );
}
