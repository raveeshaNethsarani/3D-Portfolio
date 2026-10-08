import SectionHeader from "@/components/SectionHeader";
import { EDUCATION } from "@/data/education";

export default function Education() {
  return (
    <section id="education" className="py-section-sm lg:py-section">
      <div className="container px-gutter sm:px-gutter-md lg:px-gutter-lg">
        <SectionHeader label={EDUCATION.label} title={EDUCATION.title} />

        {/* role="list" keeps list semantics in Safari/VoiceOver despite list-style: none. */}
        <ol role="list" className="mt-16 list-none space-y-14 border-l border-line">
          {EDUCATION.entries.map(({ dates, degree, school, description }) => (
            <li key={degree} className="relative pl-12">
              {/* 10px dot centred on the 1px rail, level with the date line */}
              <span aria-hidden className="absolute -left-[5.5px] top-[5px] h-2.5 w-2.5 rounded-pill bg-neon-pink" />
              <p className="text-meta text-ink-600">{dates}</p>
              <h3 className="mt-2 text-h3 text-ink-900">{degree}</h3>
              <p className="mt-1 text-body text-ink-600">{school}</p>
              <p className="mt-3 max-w-[70ch] text-body text-ink-400">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
