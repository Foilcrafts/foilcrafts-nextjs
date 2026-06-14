import { PageHero, ContactCTA } from "@/components/sections";
import { Marquee } from "@/components/Marquee";
import { ItemsInline } from "@/components/ItemsInline";
import { content } from "@/lib/content";

export const metadata = {
  title: "Cut Plates and Embossing — Foil Crafts",
};

export default function CutPlatesEmbossingPage() {
  return (
    <>
      <PageHero
        eyebrow="04 — Cut Plates and Embossing"
        title="Cut plates &amp;<br><em>embossing dies.</em>"
        image="/images/cut-plates/CP-001.jpg"
        sub="Our in-house cut and embossing library — 24 cut plates and 23 embossing dies, used independently of foiling or as the structural layer beneath it."
      />
      <Marquee items={content.marquee} />
      <ItemsInline fromSlug="cut-plates" isApproved={true} />
      <ContactCTA />
    </>
  );
}
