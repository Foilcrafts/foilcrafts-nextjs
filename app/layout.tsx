import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { content } from "@/lib/content";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { RevealObserver } from "@/components/RevealObserver";
import "./globals.css";

// Optimised font loading via next/font — replaces the inline Google Fonts <link>
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-fraunces",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});
const jbm = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jbm",
});

export const metadata: Metadata = {
  title: `${content.brand.name} — ${content.brand.tagline}`,
  description: content.brand.description,
  // Staging gate — set to public in production via env. See SUPABASE-SETUP.md.
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jbm.variable}`}
    >
      <body>
        <CustomCursor />
        <RevealObserver />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
