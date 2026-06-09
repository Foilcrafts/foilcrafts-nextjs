import { PageHero, ContactCTA } from "@/components/sections";
import { Marquee } from "@/components/Marquee";
import { ItemsInline } from "@/components/ItemsInline";
import { createClient } from "@/utils/supabase/server";
import { content } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cut Plates and Embossing — Foil Crafts",
};

export default async function CutPlatesEmbossingPage() {
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
        eyebrow="04 — Cut Plates and Embossing"
        title="Cut plates &amp;<br><em>embossing dies.</em>"
        image="/images/cut-plates/CP-001.jpg"
        sub="Our in-house cut and embossing library — 24 cut plates and 23 embossing dies, used independently of foiling or as the structural layer beneath it."
      />
      <Marquee items={content.marquee} />
      <ItemsInline fromSlug="cut-plates" isApproved={isApproved} />
      <ContactCTA />
    </>
  );
}
