import { ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";

type CardLink = { href: string; label: string; srSuffix: string };

// Lifts 4px with a pink border on hover (no lift under prefers-reduced-motion).
export default function ProjectCard({ name, subtitle, description, stack, liveUrl, repoUrl }: Project) {
  const links: CardLink[] = [
    { href: liveUrl, label: "Live Demo", srSuffix: ` of ${name}` },
    { href: repoUrl, label: "GitHub", srSuffix: ` repository for ${name}` },
  ];

  return (
    <article className="flex min-h-[420px] flex-col justify-end rounded-card border border-line bg-surface p-10 transition-[translate,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-neon-pink/40 motion-reduce:hover:translate-y-0">
      <h3 className="text-[28px] font-bold uppercase leading-tight tracking-[0.02em] text-ink-900">{name}</h3>
      <p className="mt-3 text-label uppercase text-neon-pink">{subtitle}</p>
      <p className="mt-5 max-w-[70ch] text-body text-ink-600">{description}</p>

      <hr className="my-8 border-line" />

      <p className="text-label uppercase text-ink-400">Tech stack</p>
      <p className="mt-2 text-sm font-medium text-ink-900">{stack}</p>

      <div className="mt-8 flex flex-wrap gap-6">
        {links.map(({ href, label, srSuffix }) => (
          <a
            key={label}
            href={href}
            className="group inline-flex items-center gap-2 rounded-sm text-body font-medium text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900"
          >
            {label}
            <span className="sr-only">{srSuffix}</span>
            <ArrowRight
              aria-hidden
              className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
          </a>
        ))}
      </div>
    </article>
  );
}
