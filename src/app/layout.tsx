import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { SITE } from "@/data/site";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const { title, description } = SITE;

// Only advertise the OG image once public/hero.png has been added.
const hasHeroImage = existsSync(join(process.cwd(), "public", "hero.png"));

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
    images: hasHeroImage ? [{ url: "/hero.png", alt: title }] : undefined,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${spaceGrotesk.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
