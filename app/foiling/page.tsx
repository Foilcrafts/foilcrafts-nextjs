import { PageHero, ContactCTA } from "@/components/sections";
import { Marquee } from "@/components/Marquee";
import { CollectionsGrid } from "@/components/CollectionsGrid";
import { createClient } from "@/utils/supabase/server";
import { content } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Foiling — 19 families — Foil Crafts",
};

/* Pull the filter list from content.ts so new families are picked up automatically */
const foilingPage = content.pages.find((p) => p.slug === "foiling") as
  | { collections_filter?: readonly string[] }
  | undefined;
const FOILING_FAMILIES = foilingPage?.collections_filter ?? [];

export default async function FoilingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isApproved = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", user.id)
      .single();
    isApproved = profile?.status === "approved";
  }

  return (
    <>
      <PageHero
        eyebrow="02 — Foiling"
        title={`Nineteen foiling families.<br><em>One Italian mill.</em>`}
        image="/images/foiling/ft-metallic/Compressed/FC-1063.jpg"
        sub="The complete C.F.M. transfer-foil archive we currently stock — metallic, holographic, animal, abstract, crackle, floral, acid, distress, hand-painted, small-print, stripe, tie &amp; dye, transparent patent, wrinkle, camo, checks &amp; fabric, children prints, denim, and snake &amp; python."
      />
      <Marquee items={content.marquee} />
      <CollectionsGrid filter={FOILING_FAMILIES} isApproved={isApproved} />
      <ContactCTA />
    </>
  );
}

