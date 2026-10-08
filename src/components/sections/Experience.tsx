import ParticleField from "@/components/ParticleField";
import SectionEyebrow from "@/components/SectionEyebrow";
import CompanyHeader from "@/components/experience/CompanyHeader";
import EditorialHeader from "@/components/experience/EditorialHeader";
import ProgressionGrid from "@/components/experience/ProgressionGrid";
import ProjectCarousel from "@/components/experience/ProjectCarousel";
import TimelineRail from "@/components/experience/TimelineRail";
import { EXPERIENCE } from "@/data/experience";

export default function Experience() {
  const current = EXPERIENCE.roles[0];

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative isolate py-section-sm lg:py-section">
      <ParticleField />
      <div className="container relative px-gutter sm:px-gutter-md lg:px-gutter-lg">
        {/* <SectionEyebrow label={EXPERIENCE.label} aside={`Tenure: ${current.period}`} /> */}
        <EditorialHeader
          eyebrow={EXPERIENCE.eyebrow}
          title={EXPERIENCE.title}
          titleId="experience-title"
          overview={current.overview}
          path={current.progressionPath}
        />

        {/* Timeline: rail and node on the left; the role sits beside it directly on the page */}
        <div className="relative pl-5 sm:pl-10">
          <TimelineRail />
          <div className="space-y-14 sm:space-y-16">
            <CompanyHeader
              company={current.company}
              role={current.role}
              period={current.period}
              status={current.status}
              location={current.location}
              primaryStack={current.primaryStack}
            />
            <ProgressionGrid phases={current.progression} />
            <ProjectCarousel projects={current.projects} />
          </div>
        </div>
      </div>
    </section>
  );
}
