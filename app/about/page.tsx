import {
  PageHero,
  AboutBlock,
  ProcessGrid,
  Founders,
  HeritageStats,
  ContactCTA,
} from "@/components/sections";
import { Marquee } from "@/components/Marquee";
import { content } from "@/lib/content";

export const metadata = {
  title: "About — Foil Crafts",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="01 — About"
        title="Italian foils.<br><em>Indian craftsmanship.</em>"
        image="/images/about/workshop-wide.jpg"
        sub="Three generations of one trade, in one Sector 57 atelier. Authorised C.F.M. distributor since 1994."
      />
      <Marquee items={content.marquee} />
      <AboutBlock data={content.about_block_1} />
      <AboutBlock data={content.about_block_2} imageLeft alt />
      <ProcessGrid />
      <Founders />
      <HeritageStats />
      <ContactCTA />
    </>
  );
}
