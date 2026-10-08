// Site-wide content: name, page metadata and navigation.

export type NavLink = { label: string; id: string }; // id = the section id to scroll to

export type SiteContent = {
  name: string;
  title: string; // browser tab and social share title
  description: string; // search and social share description
  navLinks: readonly NavLink[];
};

export const SITE: SiteContent = {
  name: "Alex Rivera",
  title: "Alex Rivera — Full-Stack Developer",
  description: "I design and build interactive, scalable web experiences where technology meets creativity.",
  navLinks: [
    { label: "About Me", id: "about" },
    { label: "Experience", id: "experience" },
    { label: "Projects", id: "projects" },
    { label: "Contact", id: "contact" },
  ],
};
