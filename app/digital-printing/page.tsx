import { PageHero, ContactCTA } from "@/components/sections";
import { Marquee } from "@/components/Marquee";
import { ItemsInline } from "@/components/ItemsInline";
import { createClient } from "@/utils/supabase/server";
import { content } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Digital Printing — Foil Crafts",
};

export default async function DigitalPrintingPage() {
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
        eyebrow="03 — Digital Printing"
        title="Direct-to-leather<br><em>digital printing.</em>"
        image="/images/digital-printing/FC-1567.jpg"
        sub="Ten curated prints from our digital direct-to-hide capability — first shown at IILF 23. Custom artwork accepted for production."
      />
      <Marquee items={content.marquee} />
      <ItemsInline fromSlug="digital-printing" isApproved={isApproved} />
      <ContactCTA />
    </>
  );
}
