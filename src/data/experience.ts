// Experience section content. Edit the text here; the layout lives in components/sections/Experience.tsx.

// Icon names rather than components so the data can be passed from server to client components.
export type ProjectIcon = "database" | "globe" | "shield";

export type ExperienceProject = {
  code: string;
  title: string;
  category: string;
  icon: ProjectIcon;
  description: string;
  responsibilities: readonly string[];
  stack: readonly string[];
};

export type ProgressionPhase = {
  number: string;
  label: string;
  title: string;
  description: string;
};

export type ExperienceData = {
  company: string;
  role: string;
  period: string;
  status: string;
  location: string;
  overview: string;
  progressionPath: string;
  primaryStack: readonly string[];
  progression: readonly ProgressionPhase[];
  projects: readonly ExperienceProject[];
};

export type ExperienceContent = {
  label: string;
  eyebrow: string;
  title: readonly [solid: string, outline: string];
  roles: readonly ExperienceData[]; // the first role is shown as the current one
};

export const EXPERIENCE: ExperienceContent = {
  label: "[ 04 // PROFESSIONAL LEDGER & SYSTEM ROLES ]",
  eyebrow: "CAREER / ENGINEERING PROGRESSION",
  title: ["PRODUCTION", "EXPERIENCE."],
  roles: [
    {
      company: "BotCalm (Pvt) Ltd",
      role: "Full Stack System Engineer Intern",
      period: "Sep 2025 – Sep 2026",
      status: "INTERNSHIP",
      location: "Sri Lanka",
      overview:
        "Worked across multiple software engineering initiatives, progressing from MERN-based application development to Next.js and TypeScript systems, and eventually contributing to Vesant — a multi-tenant enterprise compliance platform built around Go, microservices, PostgreSQL, and distributed infrastructure.",
      progressionPath: "MERN → NEXT.JS → GO / MICROSERVICES",
      primaryStack: ["MERN", "Next.js", "TypeScript", "Go", "PostgreSQL"],
      progression: [
        {
          number: "01",
          label: "MERN",
          title: "Application Foundations",
          description:
            "Built full-stack application features using MongoDB, Express, React, and Node.js, focusing on REST APIs, authentication, permissions, notifications, and cloud-based file management.",
        },
        {
          number: "02",
          label: "NEXT.JS",
          title: "Modern Full Stack",
          description:
            "Developed a full-stack HR management system using Next.js, React, TypeScript, and Tailwind CSS with API integration, authentication, responsive interfaces, and theme support.",
        },
        {
          number: "03",
          label: "GO / SERVICES",
          title: "Enterprise Systems",
          description:
            "Contributed to Vesant, working across Go services, PostgreSQL, Next.js, microservices, compliance workflows, audit systems, and distributed development infrastructure.",
        },
      ],
      projects: [
        {
          code: "PRJ-01",
          title: "Product Management System",
          category: "MERN APPLICATION",
          icon: "database",
          description:
            "Developed a full-stack product management platform using the MERN stack, implementing product workflows, authentication, role-based permissions, notifications, pagination, and cloud-based asset management.",
          responsibilities: [
            "Built responsive React interfaces and reusable components",
            "Developed REST APIs using Node.js and Express",
            "Implemented JWT authentication and role-based permissions",
            "Integrated MongoDB for product and user data",
            "Implemented pagination and backend notification workflows",
            "Integrated Cloudinary and AWS S3 for file and image uploads",
            "Implemented email workflows using EmailJS and Nodemailer",
          ],
          stack: ["MongoDB", "Express", "React", "Node.js", "JWT", "Cloudinary", "AWS S3"],
        },
        {
          code: "PRJ-02",
          title: "HR Management System",
          category: "NEXT.JS APPLICATION",
          icon: "globe",
          description:
            "Built a full-stack HR management system using Next.js, React, TypeScript, and Tailwind CSS, covering employee management workflows, API integration, authentication, authorization, and responsive interface development.",
          responsibilities: [
            "Developed frontend interfaces using Next.js and React",
            "Implemented backend functionality and REST API integration",
            "Built employee and HR management workflows",
            "Implemented authentication and authorization flows",
            "Tested and validated APIs using Postman",
            "Developed responsive interfaces with Tailwind CSS",
            "Implemented dark and light theme support",
          ],
          stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST API", "Postman"],
        },
        {
          code: "PRJ-03",
          title: "Vesant Compliance Platform",
          category: "ENTERPRISE / MICROSERVICES",
          icon: "shield",
          description:
            "Contributed to Vesant, a multi-tenant enterprise compliance platform supporting AML, KYC, fraud monitoring, case management, and tax compliance workflows. Worked across frontend and backend services while gaining practical experience with Go, PostgreSQL, microservices, and distributed infrastructure.",
          responsibilities: [
            "Developed enterprise interfaces using Next.js, React, and TypeScript",
            "Contributed to Go-based backend services and REST APIs",
            "Worked with PostgreSQL and database-backed service workflows",
            "Implemented and maintained RBAC and permission-based workflows",
            "Worked across AML, KYC, fraud monitoring, and tax compliance modules",
            "Worked on evidence request and case management workflows",
            "Worked on notification and user-facing workflow states",
            "Investigated and fixed audit logging inconsistencies across modules",
            "Worked on tax compliance exports and reporting workflows",
            "Worked on customer profile and transaction-related workflows",
            "Debugged distributed frontend and backend issues across services",
            "Worked with Docker, Kubernetes, Redis, Kafka, and service infrastructure",
          ],
          stack: ["Next.js", "React", "TypeScript", "Go", "PostgreSQL", "Redis", "Kafka", "Docker", "Kubernetes"],
        },
      ],
    },
  ],
};
