import { PageHero, ContactCTA } from "@/components/sections";
import { Marquee } from "@/components/Marquee";
import { CustomerLoginSection } from "@/components/CustomerLoginSection";
import { content } from "@/lib/content";

export const metadata = {
  title: "Contact — Foil Crafts",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="06 — Contact"
        title="Write to the<br><em>atelier.</em>"
        image="/images/about/founders-conversation.jpg"
        sub="Samples, custom development, trade enquiries — the founders read every inbound."
      />
      <Marquee items={content.marquee} />
      <ContactCTA />
      <CustomerLoginSection />
    </>
  );
}
