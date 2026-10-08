"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Cpu, Database, Globe, Shield, type LucideIcon } from "lucide-react";
import NavButton from "./NavButton";
import type { ExperienceProject, ProjectIcon } from "@/data/experience";

const ICONS: Record<ProjectIcon, LucideIcon> = { database: Database, globe: Globe, shield: Shield };
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SWIPE_PX = 80;
const FOCUS_RING = "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900";
// 6px square rotated 45°, matching the bullets used elsewhere on the page.
const BULLET =
  "relative pl-5 before:absolute before:left-0 before:top-[7px] before:h-1.5 before:w-1.5 before:rotate-45 before:bg-neon-pink";

const pad = (n: number) => String(n).padStart(2, "0");

export default function ProjectCarousel({ projects }: { projects: readonly ExperienceProject[] }) {
  const reduced = !!useReducedMotion();
  // [active index, direction]; direction picks which side slides enter and exit from.
  const [[active, direction], setActive] = useState<[number, number]>([0, 0]);
  const count = projects.length;

  const next = () => setActive([(active + 1) % count, 1]);
  const previous = () => setActive([(active - 1 + count) % count, -1]);
  const goTo = (index: number) => {
    if (index !== active) setActive([index, index > active ? 1 : -1]);
  };

  const shift = reduced ? 0 : 90;
  const slide: Variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? shift : -shift, scale: reduced ? 1 : 0.98 }),
    center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.45, ease: EASE } },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir >= 0 ? -shift : shift,
      scale: reduced ? 1 : 0.98,
      transition: { duration: 0.3, ease: "easeIn" },
    }),
  };
  const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
  const item: Variants = {
    hidden: { opacity: 0, x: reduced ? 0 : -12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
  };

  const project = projects[active];
  const Icon = ICONS[project.icon];

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Projects and production systems" className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
        <div className="min-w-0">
          <h4 className="mb-2 flex items-center gap-2 text-label uppercase text-ink-900">
            <Cpu aria-hidden className="h-4 w-4 text-ink-600" />
            Projects &amp; production systems
          </h4>
          <p className="text-label uppercase text-ink-600">Select system {"//"} drag or navigate</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <NavButton onClick={previous} label="Previous project">
            <ArrowLeft aria-hidden className="h-4 w-4" />
          </NavButton>
          <NavButton onClick={next} label="Next project">
            <ArrowRight aria-hidden className="h-4 w-4" />
          </NavButton>
        </div>
      </div>

      {/* Viewport */}
      <div aria-live="polite" className="relative overflow-hidden rounded-card">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.article
            key={project.code}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_PX) next();
              else if (info.offset.x > SWIPE_PX) previous();
            }}
            aria-label={`${project.title}, ${active + 1} of ${count}`}
            className="cursor-grab rounded-card border border-line bg-page p-4 active:cursor-grabbing sm:p-8 lg:p-10"
          >
            {/* Project header */}
            <div className="mb-6 flex flex-col gap-4 border-b border-line pb-6 sm:mb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:pb-7">
              <div className="flex min-w-0 flex-col gap-3 min-[400px]:flex-row sm:gap-4">
                <motion.div
                  initial={reduced ? false : { scale: 0.6, rotate: -12, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card border border-line bg-page text-neon-pink"
                >
                  <Icon aria-hidden className="h-5 w-5" />
                </motion.div>
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-label uppercase text-ink-900">{project.code}</span>
                    <span aria-hidden className="h-1 w-1 rounded-pill bg-line" />
                    <span className="text-label uppercase text-ink-600">{project.category}</span>
                  </div>
                  <h5 className="break-words text-h3 uppercase text-ink-900">{project.title}</h5>
                </div>
              </div>
              <p className="text-label uppercase text-ink-600">
                System {pad(active + 1)} / {pad(count)}
              </p>
            </div>

            <p className="mb-8 max-w-[70ch] text-body text-ink-600 sm:mb-10">{project.description}</p>

            <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12">
              {/* Contributions */}
              <div className="lg:col-span-8">
                <p className="mb-4 flex items-center gap-2 text-label uppercase text-ink-600">
                  <span aria-hidden className="h-px w-5 bg-ink-400" />
                  Contributions
                </p>
                <motion.ul
                  role="list"
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="grid list-none grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2"
                >
                  {project.responsibilities.map((line) => (
                    <motion.li key={line} variants={item} className={`${BULLET} text-meta text-ink-900`}>
                      {line}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              {/* Technology */}
              <div className="lg:col-span-4">
                <p className="mb-4 flex items-center gap-2 text-label uppercase text-ink-600">
                  <span aria-hidden className="h-px w-5 bg-ink-400" />
                  Technology
                </p>
                <motion.ul
                  role="list"
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="flex list-none flex-wrap gap-2"
                >
                  {project.stack.map((tag) => (
                    <motion.li
                      key={tag}
                      variants={item}
                      className="rounded-pill border border-line px-3 py-1.5 text-meta text-ink-600 transition-colors hover:border-ink-400 hover:text-ink-900"
                    >
                      {tag}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          {projects.map((p, index) => (
            <button
              key={p.code}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to ${p.title}`}
              aria-current={active === index ? "true" : undefined}
              className={`group -mx-1.5 -my-4 flex items-center px-1.5 py-4 ${FOCUS_RING}`}
            >
              <span
                className={`h-1.5 rounded-pill transition-all duration-300 motion-reduce:transition-none ${
                  active === index ? "w-10 bg-neon-pink" : "w-3 bg-line group-hover:bg-ink-400"
                }`}
              />
            </button>
          ))}
        </div>

        <p className="text-label uppercase text-ink-600">
          System <span className="text-ink-900">{pad(active + 1)}</span> / {pad(count)}
        </p>

        <p aria-hidden className="hidden items-center gap-2 text-label uppercase text-ink-600 sm:flex">
          <ArrowLeft className="h-3 w-3" />
          <span>Drag to explore</span>
          <ArrowRight className="h-3 w-3" />
        </p>
      </div>
    </div>
  );
}
