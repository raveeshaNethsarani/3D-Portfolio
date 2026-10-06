import type { MouseEvent } from "react";

// Scrolls to a section by id; falls back to the plain anchor if it isn't on the page.
export const goTo = (id: string, smooth: boolean) => (e: MouseEvent<HTMLAnchorElement>) => {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
};
