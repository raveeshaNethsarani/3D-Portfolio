import { useEffect, useState } from "react";

// Id of the section currently crossing a thin band just above the middle of the viewport.
// Ids that aren't on the page are skipped.
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const sections = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  return active;
}
