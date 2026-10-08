// Hero section content. Edit the text here; the layout lives in components/sections/Hero.tsx.

export type HeadlineLine = { text: string; accent?: boolean }; // accent = pink gradient (use on one line only)

export type HeroContent = {
  headline: readonly HeadlineLine[];
  intro: string;
  role: string;
  ctaLabel: string;
  scrollLabel: string;
  imageAlt: string; // describes public/hero.png for screen readers
};

export const HERO: HeroContent = {
  headline: [{ text: "Turning" }, { text: "Ideas Into" }, { text: "Digital Worlds", accent: true }],
  intro: "I design and build interactive, scalable web experiences where technology meets creativity.",
  role: "Full-Stack Developer · Software Engineer",
  ctaLabel: "Explore My Work",
  scrollLabel: "Scroll",
  imageAlt: "Side profile of a woman wearing a VR headset, with neon-pink network lines flowing through her hair",
};
