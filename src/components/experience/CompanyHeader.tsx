import { Calendar, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { ExperienceData } from "@/data/experience";

type CompanyHeaderProps = Pick<ExperienceData, "company" | "role" | "period" | "status" | "location" | "primaryStack">;

export default function CompanyHeader({ company, role, period, status, location, primaryStack }: CompanyHeaderProps) {
  return (
    <div className="flex flex-col gap-8 border-b border-line pb-10 lg:flex-row lg:items-end lg:justify-between">
      <Reveal delay={0.1}>
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-2 rounded-pill border border-line bg-page px-3 py-1 text-label uppercase text-ink-900">
            <span aria-hidden className="h-1.5 w-1.5 rounded-pill bg-neon-pink" />
            {status}
          </span>
          <span className="flex items-center gap-1.5 text-meta text-ink-600">
            <Calendar aria-hidden className="h-3.5 w-3.5" />
            {period}
          </span>
          <span className="flex items-center gap-1.5 text-meta text-ink-600">
            <MapPin aria-hidden className="h-3.5 w-3.5" />
            {location}
          </span>
        </div>

        <h3 className="text-[length:clamp(1.75rem,8vw,3rem)] font-bold uppercase leading-none tracking-[-0.015em] text-ink-900">
          {company}
        </h3>
        <p className="mt-3 text-body-l font-medium text-neon-pink">{role}</p>
      </Reveal>

      <Reveal delay={0.2} className="lg:max-w-sm lg:text-right">
        <p className="text-label uppercase text-ink-600">Primary stack</p>
        <ul role="list" className="mt-3 flex list-none flex-wrap gap-2 lg:justify-end">
          {primaryStack.map((tech) => (
            <li key={tech} className="rounded-pill border border-line bg-page px-3 py-1 text-meta text-ink-900">
              {tech}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
