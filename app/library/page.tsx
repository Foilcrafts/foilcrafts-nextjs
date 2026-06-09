import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/actions/auth";
import { content } from "@/lib/content";

export const metadata = {
  title: "Customer Library — Foil Crafts",
};

const html = (s: string) => ({ dangerouslySetInnerHTML: { __html: s } });

export default async function LibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("full_name, company")
        .eq("id", user.id)
        .single()
    : { data: null };

  const name = profile?.full_name ?? user?.email?.split("@")[0] ?? "Trade Partner";
  const company = profile?.company ?? null;

  return (
    <>
      {/* Library hero — brand-aligned welcome banner */}
      <section
        className="page-hero"
        id="library-hero"
        style={{ minHeight: "60dvh" }}
      >
        <div
          className="page-hero__bg"
          style={{ backgroundImage: `url(/images/foiling/ft-metallic/Compressed/FC-1063.jpg)` }}
        />
        <div className="page-hero__inner">
          <div className="page-hero__eyebrow">
            Customer Library · Approved Access
          </div>
          <h1>
            Welcome, <em>{name}.</em>
          </h1>
          {company && (
            <p className="page-hero__sub">
              Signed in as {company}. Browse the full archive below — every
              foiling family, our complete cut-plate library, the digital print
              catalogue, and the latest collection PDFs.
            </p>
          )}
        </div>
      </section>

      {/* Catalog downloads — protected via /api/asset */}
      <section className="catalogs" id="library-catalogs">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-head__num">01 — Catalogs</div>
              <h2 {...html(content.catalogs.heading)} />
            </div>
            <div className="section-head__copy">
              High-resolution PDFs — yours to download, share with your team,
              and reference during sample selection.
            </div>
          </div>
          <div className="catalogs-grid">
            {content.catalogs.items.map((it, i) => (
              <Link
                key={i}
                className="cat-card"
                href={`/api/asset/${it.file.replace(/^\//, "")}`}
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
                  <div className="cat-card__action">
                    {it.action ?? "Download PDF"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Full archive — links to gallery pages (already public; in v2 these
          could move to /library/foiling etc. with deeper article data) */}
      <section style={{ background: "var(--bone)", paddingTop: 80 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-head__num">02 — Full Archive</div>
              <h2>
                Browse the <em>collections.</em>
              </h2>
            </div>
            <div className="section-head__copy">
              Click through to each capability for the full set of article
              numbers, samples, and high-resolution imagery.
            </div>
          </div>
          <div className="cap-grid">
            <Link className="cap-card" href="/foiling">
              <div
                className="cap-card__bg"
                style={{ backgroundImage: `url(/images/hero/card_foiling.jpg)` }}
              />
              <div className="cap-card__overlay" />
              <div className="cap-card__content">
                <div className="cap-card__num">/01</div>
                <div className="cap-card__bot">
                  <div>
                    <div className="cap-card__sub">14 families</div>
                    <h3 className="cap-card__title">Foiling Archive</h3>
                  </div>
                  <div className="cap-card__arrow">→</div>
                </div>
              </div>
            </Link>
            <Link className="cap-card" href="/digital-printing">
              <div
                className="cap-card__bg"
                style={{ backgroundImage: `url(/images/hero/card_digital.jpg)` }}
              />
              <div className="cap-card__overlay" />
              <div className="cap-card__content">
                <div className="cap-card__num">/02</div>
                <div className="cap-card__bot">
                  <div>
                    <div className="cap-card__sub">Direct-to-leather</div>
                    <h3 className="cap-card__title">Digital Printing</h3>
                  </div>
                  <div className="cap-card__arrow">→</div>
                </div>
              </div>
            </Link>
            <Link className="cap-card" href="/cut-plates-embossing">
              <div
                className="cap-card__bg"
                style={{ backgroundImage: `url(/images/hero/card_cut.jpg)` }}
              />
              <div className="cap-card__overlay" />
              <div className="cap-card__content">
                <div className="cap-card__num">/03</div>
                <div className="cap-card__bot">
                  <div>
                    <div className="cap-card__sub">In-house dies</div>
                    <h3 className="cap-card__title">Cut Plates &amp; Embossing</h3>
                  </div>
                  <div className="cap-card__arrow">→</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Sign out — a soft footer card */}
      <section style={{ padding: "80px var(--gut)", textAlign: "center" }}>
        <div className="container">
          <div
            className="section-head__copy"
            style={{ margin: "0 auto", maxWidth: 520 }}
          >
            Need to update your details or have a custom request?{" "}
            <a href="mailto:info@foilcrafts.com" style={{ color: "var(--oxblood)", textDecoration: "underline" }}>
              Email the team
            </a>
            .
          </div>
          <form action={signOut} style={{ marginTop: 28 }}>
            <button
              type="submit"
              style={{
                padding: "14px 26px",
                background: "transparent",
                border: "1px solid var(--ink)",
                borderRadius: 100,
                fontFamily: "var(--mono)",
                fontSize: 12,
                letter_spacing: ".2em",
                textTransform: "uppercase",
                cursor: "pointer",
                color: "var(--ink)",
              } as React.CSSProperties}
            >
              Sign out
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
