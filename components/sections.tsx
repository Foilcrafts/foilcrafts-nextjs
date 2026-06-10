/* Foil Crafts — static section components (server components).
   Each takes the relevant data slice from lib/content.ts and renders
   the same DOM the static HTML build produced — pixel-perfect.
*/

import Link from "next/link";
import Image from "next/image";
import { content } from "@/lib/content";
import { ContactCTAClient } from "@/components/ContactCTAClient";

// Helper to render strings that may contain <br> or <em>
const html = (s: string) => ({ dangerouslySetInnerHTML: { __html: s } });

// ─────────────────────────────────────────────────────────────
//  MANIFESTO
// ─────────────────────────────────────────────────────────────
export function Manifesto() {
  return (
    <section className="manifesto reveal">
      <div className="container">
        <p {...html(content.manifesto)} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  CAPABILITIES (3 home cards)
// ─────────────────────────────────────────────────────────────
export function Capabilities() {
  const c = content.capabilities;
  return (
    <section className="capabilities" id="capabilities">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="section-head__num">00 — Capabilities</div>
            <h2 {...html(c.heading)} />
          </div>
          <div className="section-head__copy">{c.copy}</div>
        </div>
        <div className="cap-grid">
          {c.items.map((it, i) => (
            <Link
              key={i}
              className="cap-card reveal"
              href={it.href ?? "#"}
            >
              <div
                className="cap-card__bg"
                style={{ backgroundImage: `url(${it.image})` }}
              />
              <div className="cap-card__overlay" />
              <div className="cap-card__content">
                <div className="cap-card__num">{it.number}</div>
                <div className="cap-card__bot">
                  <div>
                    <div className="cap-card__sub">{it.sub}</div>
                    <h3
                      className="cap-card__title"
                      {...html(it.title)}
                    />
                  </div>
                  <div className="cap-card__arrow">→</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  ABOUT BLOCK (two-column, image-right or image-left)
// ─────────────────────────────────────────────────────────────
export function AboutBlock({
  data,
  imageLeft = false,
  alt = false,
}: {
  data: {
    eyebrow: string;
    heading: string;
    image: string;
    paragraphs: readonly string[];
  };
  imageLeft?: boolean;
  alt?: boolean;
}) {
  return (
    <section className={`about-block${alt ? " alt" : ""}`} id={imageLeft ? "about-2" : "about-1"}>
      <div className={`about-grid${imageLeft ? " image-left" : ""}`}>
        <div className="about-text reveal">
          <div className="about-text__eyebrow">{data.eyebrow}</div>
          <h2 {...html(data.heading)} />
          {data.paragraphs.map((p, i) => (
            <p key={i} {...html(p)} />
          ))}
        </div>
        <div
          className="about-image reveal"
          style={{ backgroundImage: `url(${data.image})` }}
        />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  PROCESS GRID (4 figures in spec order)
// ─────────────────────────────────────────────────────────────
export function ProcessGrid() {
  const pg = content.process_grid;
  return (
    <section className="process-grid-section" id="process">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="section-head__num">{pg.eyebrow ?? "02 — Process"}</div>
            <h2 {...html(pg.heading)} />
          </div>
          <div className="section-head__copy">{pg.copy}</div>
        </div>
        <div className="process-grid-grid">
          {pg.figures.map((f, i) => (
            <div key={i} className="pg-figure reveal">
              <div
                className="pg-figure__bg"
                style={{ backgroundImage: `url(${f.image})` }}
              />
              <div className="pg-figure__caption">
                <div className="pg-figure__label">{f.label}</div>
                <div className="pg-figure__title">{f.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  FOUNDERS
// ─────────────────────────────────────────────────────────────
export function Founders() {
  const f = content.founders;
  return (
    <section className="founders-section" id="founders">
      <div className="founders-grid">
        <div
          className="founders-image reveal"
          style={{ backgroundImage: `url(${f.image})` }}
        />
        <div className="founders-text reveal">
          <div className="founders-text__eyebrow">{f.eyebrow ?? "Founders"}</div>
          <h2 {...html(f.heading)} />
          {f.paragraphs.map((p, i) => (
            <p key={i} {...html(p)} />
          ))}
          {f.signature && (
            <div className="founders-text__signature">— {f.signature}</div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  HERITAGE STATS
// ─────────────────────────────────────────────────────────────
export function HeritageStats() {
  const h = content.heritage;
  return (
    <section className="stats" id="heritage">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="section-head__num">{h.eyebrow ?? "05 — Heritage"}</div>
            <h2 {...html(h.heading)} />
          </div>
          <div className="section-head__copy">{h.copy}</div>
        </div>
        <div className="stats-grid">
          {h.stats.map((s, i) => (
            <div key={i} className="stat reveal">
              <div className="stat__num" {...html(s.num)} />
              <div className="stat__label">{s.label}</div>
              <p className="stat__copy">{s.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  CATALOGS (PDF download cards)
// ─────────────────────────────────────────────────────────────
export function CatalogsSection() {
  const c = content.catalogs;
  return (
    <section className="catalogs" id="catalogs">
      <div className="container">
        <div className="section-head reveal">
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
              className="cat-card reveal"
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
  );
}

// ─────────────────────────────────────────────────────────────
//  CONTACT CTA (with optional secondary action + CFM mark)
// ─────────────────────────────────────────────────────────────
export function ContactCTA() {
  const c = content.cta;
  return (
    <section className="cta" id="contact">
      <div
        className="cta__bg"
        style={{ backgroundImage: `url(${c.bg_image})` }}
      />
      <div className="cta__inner">
        <ContactCTAClient
          headline={c.headline}
          action={c.action}
          secondaryAction={c.secondary_action}
        />
        <div className="cta__sub">{c.contact_line}</div>
        {c.cfm_mark && (
          <div className="cfm-mark">
            <Image
              src={c.cfm_mark}
              alt="C.F.M. Authorised Distributor"
              width={22}
              height={22}
              style={{ height: 22, width: "auto" }}
            />
            <span>Authorised C.F.M. Distributor</span>
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  PAGE HERO (used by subpages)
// ─────────────────────────────────────────────────────────────
export function PageHero({
  eyebrow,
  title,
  image,
  sub,
}: {
  eyebrow: string;
  title: string;
  image: string;
  sub?: string;
}) {
  return (
    <section className="page-hero" id="page-hero">
      <div
        className="page-hero__bg"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="page-hero__inner">
        <div className="page-hero__eyebrow">{eyebrow}</div>
        <h1 {...html(title)} />
        {sub && <p className="page-hero__sub">{sub}</p>}
      </div>
    </section>
  );
}
