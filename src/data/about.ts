// About section content. Edit the text here; the layout lives in components/sections/About.tsx.

export type TitleStyle = "solid" | "outline" | "accent";
export type TitleLine = { text: string; style?: TitleStyle };
// A paragraph is a list of plain strings and { strong } highlights; accent makes a highlight pink.
export type Segment = string | { strong: string; accent?: boolean };
export type Paragraph = { size: "lead" | "body"; segments: readonly Segment[] };
export type CredentialIcon = "briefcase" | "graduation-cap";
export type Credential = { icon: CredentialIcon; label: string; index: string; title: string; meta: string };

export type AboutContent = {
  label: string;
  eyebrow: string;
  title: readonly TitleLine[];
  mindset: string;
  profileLabel: string;
  profile: readonly Paragraph[];
  credentials: readonly Credential[];
};

export const ABOUT: AboutContent = {
  label: "[ 03 // ENGINEERING BIOGRAPHY & METHODOLOGY ]",
  eyebrow: "IDENTITY / ENGINEERING MINDSET",
  title: [
    { text: "ENGINEER" },
    { text: "WHO THINKS", style: "outline" },
    { text: "IN SYSTEMS.", style: "accent" },
  ],
  mindset:
    "From interface behavior to backend infrastructure, I approach software as a connected system rather than a collection of isolated features.",
  profileLabel: "PROFILE",
  profile: [
    // {
    //   size: "lead",
    //   segments: [
    //     "Operating at the intersection of ",
    //     { strong: "client-side reactivity" },
    //     " and ",
    //     { strong: "backend infrastructure", accent: true },
    //     ", I work as a Full Stack System Engineer at ",
    //     { strong: "BotCalm (Pvt) Ltd" },
    //     ".",
    //   ],
    // },
    {
      size: "body",
      segments: [
        "My technical philosophy was shaped through rigorous academic study in the IT Department of the ",
        { strong: "Sri Lanka Institute of Advanced Technological Education (SLIATE), Galle" },
        ", where I earned a Higher National Diploma in Information Technology.",
      ],
    },
    {
      size: "body",
      segments: [
        "That foundation developed my focus on database design, computational thinking, networking, and disciplined software engineering practices. In production environments, I work across system boundaries building APIs, authentication flows, role-based access control, database-backed services, reactive interfaces, and distributed application components.",
      ],
    },
  ],
  credentials: [
    {
      icon: "briefcase",
      label: "PRODUCTION AFFILIATION",
      index: "01",
      title: "Full Stack System Engineer",
      meta: "BotCalm (Pvt) Ltd · Sri Lanka",
    },
    {
      icon: "graduation-cap",
      label: "ACADEMIC CREDENTIAL",
      index: "02",
      title: "HND in Information Technology",
      meta: "SLIATE Galle · IT Department",
    },
  ],
};
