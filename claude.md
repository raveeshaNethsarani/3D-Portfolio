# Project: Alex Rivera — personal portfolio
## Stack- Next.js 14, App Router, TypeScript- Tailwind CSS (no UI kits — no shadcn, MUI, Chakra)- Framer Motion for animat- React Three Fiber + drei + @react-three/postprocessing, hero section only
## Design tokens — never hardcode a value that isn't here- page background #E9EDF2- card surface rgba(255,255,255,0.55)- ink/900 #14101F · ink/600 #14101F at 70% · ink/400 at 45% · line #14101F at 
10%- neon pink #FF2E9A · magenta #FF5FC1- accent gradient: linear-gradient(100deg, #FF2E9A, #FF5FC1)- font: Space Grotesk via next/font, weights 400/500/600/700- radius: 16px cards, 999px buttons and pills- content width 1200px; side padding 24px / 40px / 64px; section padding 
140px desktop, 80px under 1024px
## Type scale
display 76/74 bold -0.02em uppercase
h2 48/52 bold -0.015em uppercase
h3 22/28 bold
body-l 18/30 · body 16/28 · meta 13/20 · label 11/16 semibold uppercase 0.3em 
tracking
## Rules- The gradient appears on "DIGITAL WORLDS" in the hero and nowhere else.- Cards use a 1px border and the translucent white fill. No drop shadows. The 
only shadow on the page is on the primary button.- Everything is left-aligned except the contact band.- Body copy never exceeds 70 characters per line.- Every animation respects prefers-reduced-motion.- Semantic HTML, visible keyboard focus rings, WCAG AA contrast against 
#E9EDF2.- One component per file: /components for shared, /components/sections for 
sections.- Section content lives in a typed array at the top of its file.- Copy text is final. Do not rewrite it.
Page 2 of 9
Portfolio build prompts — Claude Code
Prompt 1 — Scaffold and design tokens
Set up a Next.js 14 portfolio project in this folder.- TypeScript, App Router, Tailwind CSS, ESLint. Use the src/ directory.- Install: framer-motion three @react-three/fiber @react-three/drei @react
three/postprocessing postprocessing- Load Space Grotesk through next/font/google (400, 500, 600, 700) and make 
it the default font.- Put every token from CLAUDE.md into tailwind.config.ts as theme extensions: 
the colours, fontSize entries for display / h2 / h3 / body-l / body / meta / 
label with their line heights and letter spacing, and a 1200px container.- Create app/page.tsx rendering, in order: Navbar, Hero, About, Education, 
Experience, Projects, Contact, Footer. Each is a placeholder section 
component with the right id (home, about, education, experience, projects, 
contact) and the correct section padding — no styling of the content yet.- Move hero.png into /public, and hero-depth.png too if it exists.- Set the body background to #E9EDF2 and the default text colour to #14101F.- Add metadata: title "Alex Rivera — Full-Stack Developer", description "I 
design and build interactive, scalable web experiences where technology meets 
creativity.", plus Open Graph tags.- Enable scroll-behavior: smooth, but disable it under prefers-reduced
motion.
Start the dev server and confirm a clean build before you stop