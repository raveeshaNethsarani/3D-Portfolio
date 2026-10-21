import DisplayHeading from "@/components/DisplayHeading";
import ParticleField from "@/components/ParticleField";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import { PROJECTS } from "@/data/projects";

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative isolate py-section-sm lg:py-section">
      <ParticleField />
      <div className="container relative px-gutter sm:px-gutter-md lg:px-gutter-lg">
        <DisplayHeading eyebrow={PROJECTS.eyebrow} lines={PROJECTS.title} id="projects-title" />
        <ProjectShowcase projects={PROJECTS.projects} />
      </div>
    </section>
  );
}
