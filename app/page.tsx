import { HeroSlider } from "@/components/HeroSlider";
import { Marquee } from "@/components/Marquee";
import { Manifesto, Capabilities, CatalogsSection, ContactCTA } from "@/components/sections";
import { content } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <HeroSlider slides={content.slider.slides} />
      <Marquee items={content.marquee} />
      <Manifesto />
      <Capabilities />
      <CatalogsSection />
      <ContactCTA />
    </>
  );
}
