import Link from "next/link";
import { Marquee } from "@/components/Marquee";
import { PageHero, ContactCTA } from "@/components/sections";
import { content } from "@/lib/content";

export const metadata = {
  title: "Catalogs — Foil Crafts",
};

const html = (s: string) => ({ dangerouslySetInnerHTML: { __html: s } });

export default function CatalogsPage() {
  const c = content.catalogs;

  return (
    <>
      <PageHero
        eyebrow="05 — Catalogs"
        title="Explore our<br><em>catalogs.</em>"
        image="/images/about/embossing-rolls.jpg"
        sub="Collection 26 and Collection 26/27 — the full archive on paper, ready for your design table."
      />
      <Marquee items={content.marquee} />

      {/* ── Catalog downloads section ───────────────────────────────── */}
      <section className="catalogs" id="catalogs">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-head__num">05 — Catalogs</div>
              <h2 {...html(c.heading)} />
            </div>
            <div className="section-head__copy">{c.copy}</div>
          </div>

          <div className="catalogs-grid">
            {c.items.map((it, i) => (
              <Link
                key={i}
                className="cat-card"
                href={it.file}
                prefetch={false}
              >
                <div
                  className="cat-card__cover"
                  style={{ backgroundImage: `url(${it.cover})` }}
                />
                <div>
                  <div className="cat-card__eyebrow">{it.eyebrow}</div>
                  <h3 className="cat-card__title">{it.title}</h3>
                  <div className="cat-card__meta">{it.meta}</div>
                  <div className="cat-card__action">{it.action ?? "Download PDF"}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}

