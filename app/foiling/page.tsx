import { PageHero, ContactCTA } from "@/components/sections";
import { Marquee } from "@/components/Marquee";
import { CollectionsGrid } from "@/components/CollectionsGrid";
import { content } from "@/lib/content";

export const metadata = {
  title: "Foiling — 14 families — Foil Crafts",
};

const FOILING_FAMILIES = [
  "ft-metallic",
  "animal-prints",
  "abstract",
  "holographic",
  "crackles",
  "florals",
  "acid-foils",
  "distress",
  "hand-painted",
  "small-prints",
  "stripes",
  "tie-and-dye",
  "transparent-patents",
  "wrinkled",
] as const;

export default function FoilingPage() {
  return (
    <>
      <PageHero
        eyebrow="02 — Foiling"
        title="Fourteen foiling families.<br><em>One Italian mill.</em>"
        image="/images/foiling/ft-metallic/Compressed/FC-1063.jpg"
        sub="The complete C.F.M. transfer-foil archive we currently stock — metallic, holographic, animal, abstract, crackle, floral, acid, distress, hand-painted, small-print, stripe, tie & dye, transparent patent, and wrinkle."
      />
      <Marquee items={content.marquee} />
      <CollectionsGrid filter={FOILING_FAMILIES} />
      <ContactCTA />
    </>
  );
}
