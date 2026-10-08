// Education section content. Edit the text here; the layout lives in components/sections/Education.tsx.

export type EducationEntry = { dates: string; degree: string; school: string; description: string };

export type EducationContent = {
  label: string;
  title: string;
  entries: readonly EducationEntry[]; // newest first
};

export const EDUCATION: EducationContent = {
  label: "EDUCATION",
  title: "FOUNDATIONS.",
  entries: [
    {
      dates: "2021 — 2025",
      degree: "BSc (Hons) in Software Engineering",
      school: "Northbridge Institute of Technology",
      description:
        "Focused on software architecture, distributed systems, databases, algorithms, and modern web application development.",
    },
    {
      dates: "2019 — 2021",
      degree: "Diploma in Information Technology",
      school: "Westfield Technical College",
      description:
        "Focused on programming fundamentals, web development, databases, and software development practices.",
    },
  ],
};
