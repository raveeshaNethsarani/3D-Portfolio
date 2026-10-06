import type { Config } from "tailwindcss";

// Design tokens from claude.md. Loaded by Tailwind v4 via `@config` in src/app/globals.css.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#E9EDF2",
        surface: "rgba(255, 255, 255, 0.55)",
        ink: {
          900: "#14101F",
          600: "rgb(20 16 31 / 0.7)",
          400: "rgb(20 16 31 / 0.45)",
        },
        line: "rgb(20 16 31 / 0.1)",
        "neon-pink": "#FF2E9A",
        magenta: "#FF5FC1",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(100deg, #FF2E9A, #FF5FC1)",
      },
      // display, h2 and label are also uppercase — pair with the `uppercase` utility.
      fontSize: {
        display: [
          "76px",
          { lineHeight: "74px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        h2: [
          "48px",
          { lineHeight: "52px", letterSpacing: "-0.015em", fontWeight: "700" },
        ],
        h3: ["22px", { lineHeight: "28px", fontWeight: "700" }],
        "body-l": ["18px", { lineHeight: "30px" }],
        body: ["16px", { lineHeight: "28px" }],
        meta: ["13px", { lineHeight: "20px" }],
        label: [
          "11px",
          { lineHeight: "16px", letterSpacing: "0.3em", fontWeight: "600" },
        ],
      },
      borderRadius: {
        card: "16px",
        pill: "999px",
      },
      maxWidth: {
        container: "1200px",
      },
      spacing: {
        gutter: "24px",
        "gutter-md": "40px",
        "gutter-lg": "64px",
        section: "140px",
        "section-sm": "80px",
      },
    },
  },
};

export default config;
