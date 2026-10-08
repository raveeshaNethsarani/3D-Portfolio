"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import MenuButton from "@/components/navbar/MenuButton";
import MobileMenu from "@/components/navbar/MobileMenu";
import { SITE } from "@/data/site";
import { goTo } from "@/lib/scroll";
import { useActiveSection } from "@/lib/useActiveSection";
import { useScrolled } from "@/lib/useScrolled";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FOCUS_RING = "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900";
const MENU_ID = "mobile-menu";
// "home" is tracked too, so no link is highlighted while the hero is in view.
const SECTION_IDS = ["home", ...SITE.navLinks.map((link) => link.id)];

// Fixed to the top: transparent over the hero, solid once the page scrolls.
// Below 768px the links move into a full-screen menu behind a hamburger button.
export default function Navbar() {
  const reduced = !!useReducedMotion();
  const scrolled = useScrolled();
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const solid = scrolled || open;

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    document.documentElement.style.overflow = ""; // unlock now, so a following scroll isn't blocked
    if (restoreFocus) menuButton.current?.focus();
  }, []);

  // While open: lock page scroll, close on Escape, and close if the viewport grows past mobile.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 768px)");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onResize = () => {
      if (desktop.matches) close();
    };
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open, close]);

  const navigate = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    close();
    goTo(id, !reduced)(e);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: reduced ? 0 : -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          solid ? "border-line bg-page/85 backdrop-blur-md" : "border-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className={`container flex items-center justify-between px-gutter transition-[padding] duration-300 sm:px-gutter-md lg:px-gutter-lg ${
            scrolled ? "py-3" : "py-5"
          }`}
        >
          <a href="#home" onClick={navigate("home")} className={`text-body-l font-bold ${FOCUS_RING}`}>
            {SITE.name}
            <span className="text-neon-pink">.</span>
          </a>

          <ul className="hidden items-center gap-8 text-meta font-medium md:flex lg:gap-10">
            {SITE.navLinks.map(({ label, id }) => {
              const isActive = active === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={goTo(id, !reduced)}
                    aria-current={isActive ? "location" : undefined}
                    className={`group relative py-1 transition-colors duration-200 ${
                      isActive ? "text-ink-900" : "text-ink-600 hover:text-ink-900"
                    } ${FOCUS_RING}`}
                  >
                    {label}
                    {isActive ? (
                      // Slides from link to link as the active section changes
                      <motion.span
                        layoutId="nav-underline"
                        transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                        className="absolute inset-x-0 -bottom-0.5 h-px bg-neon-pink"
                      />
                    ) : (
                      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-neon-pink/60 transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <MenuButton
            ref={menuButton}
            open={open}
            onClick={() => (open ? close() : setOpen(true))}
            controls={MENU_ID}
            reduced={reduced}
          />
        </nav>
      </motion.header>

      <MobileMenu
        id={MENU_ID}
        open={open}
        links={SITE.navLinks}
        active={active}
        reduced={reduced}
        onNavigate={navigate}
      />
    </>
  );
}
