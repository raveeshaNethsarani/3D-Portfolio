import type { TitleLine } from "./types";

// Projects section content. Edit the text here; the layout lives in components/sections/Projects.tsx.

export type Project = {
  name: string;
  subtitle: string;
  description: string;
  stack: string; // shown as written, e.g. "Next.js · TypeScript"
  liveUrl: string;
  repoUrl: string;
};

export type ProjectsContent = {
  eyebrow: string;
  title: readonly TitleLine[];
  projects: readonly Project[];
};

// Links are "#" placeholders until the real demos and repositories are ready.
export const PROJECTS: ProjectsContent = {
  eyebrow: "SELECTED WORK",
  title: [{ text: "PROJECT" }, { text: "SHOWCASE.", style: "outline" }],
  projects: [
    {
      name: "NEXORA",
      subtitle: "AI-Powered Productivity Platform",
      description:
        "A modern productivity platform that combines intelligent task management, automation, and analytics.",
      stack: "Next.js · TypeScript · PostgreSQL · OpenAI · Tailwind CSS",
      liveUrl: "#",
      repoUrl: "#",
    },
    {
      name: "LUMEN",
      subtitle: "Creative E-Commerce Experience",
      description: "A visually immersive e-commerce platform designed for independent lifestyle brands.",
      stack: "React · Node.js · MongoDB · Stripe · Framer Motion",
      liveUrl: "#",
      repoUrl: "#",
    },
    {
      name: "LUMEN",
      subtitle: "Creative E-Commerce Experience",
      description: "A visually immersive e-commerce platform designed for independent lifestyle brands.",
      stack: "React · Node.js · MongoDB · Stripe · Framer Motion",
      liveUrl: "#",
      repoUrl: "#",
    },
    {
      name: "LUMEN",
      subtitle: "Creative E-Commerce Experience",
      description: "A visually immersive e-commerce platform designed for independent lifestyle brands.",
      stack: "React · Node.js · MongoDB · Stripe · Framer Motion",
      liveUrl: "#",
      repoUrl: "#",
    },
    {
      name: "LUMEN",
      subtitle: "Creative E-Commerce Experience",
      description: "A visually immersive e-commerce platform designed for independent lifestyle brands.",
      stack: "React · Node.js · MongoDB · Stripe · Framer Motion",
      liveUrl: "#",
      repoUrl: "#",
    },
    {
      name: "PULSE",
      subtitle: "Real-Time Analytics Dashboard",
      description:
        "A real-time monitoring dashboard for tracking application performance, user activity, and system metrics.",
      stack: "React · TypeScript · Go · WebSockets · Redis",
      liveUrl: "#",
      repoUrl: "#",
    },
    {
      name: "ORBIT",
      subtitle: "Team Collaboration Platform",
      description:
        "A collaborative workspace for teams to manage projects, tasks, discussions, and shared resources.",
      stack: "Next.js · Node.js · PostgreSQL · Docker",
      liveUrl: "#",
      repoUrl: "#",
    },
  ],
};
