import Link from "next/link";
import { Marquee } from "@/components/Marquee";
import { PageHero, ContactCTA } from "@/components/sections";
import { createClient } from "@/utils/supabase/server";
import { content } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catalogs — Foil Crafts",
};

const html = (s: string) => ({ dangerouslySetInnerHTML: { __html: s } });

export default async function CatalogsPage() {
  // Check auth server-side — no flash, no client round-trip
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isApproved = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", user.id)
      .single();
    isApproved = profile?.status === "approved";
  }

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
            <div className="section-head__copy">
              {isApproved
                ? "High-resolution PDFs — yours to download, share with your team, and reference during sample selection."
                : c.copy}
            </div>
          </div>

          {isApproved ? (
            /* ── Approved: show all PDF download cards ── */
            <div className="catalogs-grid">
              {c.items.map((it, i) => (
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
                    <div className="cat-card__action">{it.action ?? "Download PDF"}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* ── Guest / pending: locked teaser ── */
            <div className="cat-locked">
              <div className="cat-locked__icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div className="cat-locked__heading">Trade-partner access only</div>
              <p className="cat-locked__copy">
                Our PDF catalogs are available exclusively to verified trade partners.
                Sign in to your approved account to download the full collection.
              </p>
              <div className="cat-locked__actions">
                <Link href="/login" className="cat-locked__btn cat-locked__btn--primary">
                  Sign in to download
                </Link>
                <Link href="/signup" className="cat-locked__btn cat-locked__btn--secondary">
                  Request access
                </Link>
              </div>
              {/* Preview cards — blurred/locked */}
              <div className="catalogs-grid cat-locked__preview" aria-hidden="true">
                {c.items.map((it, i) => (
                  <div key={i} className="cat-card cat-card--locked" aria-hidden="true">
                    <div
                      className="cat-card__cover"
                      style={{ backgroundImage: `url(${it.cover})` }}
                    />
                    <div>
                      <div className="cat-card__eyebrow">{it.eyebrow}</div>
                      <h3 className="cat-card__title">{it.title}</h3>
                      <div className="cat-card__meta">{it.meta}</div>
                      <div className="cat-card__action cat-card__action--locked">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        Login to download
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
