"use client";

import { ExternalLink } from "lucide-react";
import { Card, Carousel, type Card as CarouselCard } from "@/components/ui/apple-cards-carousel";
import type { Project } from "@/data/projects";

type ProjectShowcaseProps = {
  projects: readonly Project[];
};

function ProjectDetails({ project }: { project: Project }) {
  const technologies = project.stack.split("·").map((technology) => technology.trim());

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-label uppercase text-neon-pink">{project.subtitle}</h4>
        <p className="mt-3 text-body text-ink-600">{project.description}</p>
      </div>

      <div>
        <h4 className="text-label uppercase text-neon-pink">Technologies</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <span key={technology} className="rounded-full border border-line bg-white/60 px-3 py-1.5 text-meta font-medium text-ink-600">
              {technology}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-line pt-6">
        {project.liveUrl !== "#" && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-neon-pink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-magenta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
          >
            Live demo <ExternalLink aria-hidden className="h-4 w-4" />
          </a>
        )}
        {project.repoUrl !== "#" && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/50 px-5 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
          >
            GitHub <ExternalLink aria-hidden className="h-4 w-4" />
          </a>
        )}
        {project.liveUrl === "#" && project.repoUrl === "#" && (
          <p className="text-sm text-ink-400">Project links coming soon.</p>
        )}
      </div>
    </div>
  );
}

export default function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const cards: CarouselCard[] = projects.map((project, index) => ({
    title: project.name,
    category: `Selected work / ${String(index + 1).padStart(2, "0")}`,
    cover: (
      <span aria-hidden className="absolute inset-0 overflow-hidden bg-[#f4f0f5]">
        <span className="absolute -right-8 -top-16 h-64 w-64 rounded-full border border-ink-900/10">
          <span className="absolute inset-8 rounded-full border border-neon-pink/35" />
          <span className="absolute inset-16 rounded-full border border-ink-900/10" />
        </span>
        <span className="absolute bottom-[-2.8rem] right-4 text-[8rem] font-bold leading-none text-ink-900/[0.04]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute bottom-7 left-8 h-2 w-2 rounded-full bg-neon-pink shadow-[0_0_18px_#FF2E9A]" />
      </span>
    ),
    content: <ProjectDetails project={project} />,
  }));

  return (
    <div className="mt-14 sm:mt-16">
      <p className="mb-2 text-meta text-ink-600">A selection of things I&apos;ve designed and built.</p>
      <p className="text-label uppercase text-ink-400">Scroll sideways to explore the projects</p>
      <div className="-mx-gutter mt-2 sm:-mx-gutter-md lg:-mx-gutter-lg">
        <Carousel
          label="Project showcase"
          items={cards.map((card, index) => (
            <Card key={`${card.title}-${index}`} card={card} index={index} />
          ))}
        />
      </div>
    </div>
  );
}
