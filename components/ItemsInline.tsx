/* Items-inline grid — for digital-printing and cut-plates-embossing pages.
   Auth-aware: shows all items to approved users, locked teaser to guests.
   Server component — no interactivity needed.
*/

import Link from "next/link";
import { content } from "@/lib/content";

interface Props {
  fromSlug: string;
  isApproved: boolean;
}

export function ItemsInline({ fromSlug, isApproved }: Props) {
  const col = content.collections.find((c) => c.slug === fromSlug);
  if (!col) return null;

  return (
    <section className="ii-section" id="items-inline">
      {isApproved ? (
        /* ── Approved: show all items ── */
        <div className="ii-grid">
          {col.items?.map((it, i) => (
            <div key={i} className="ii-card">
              <div
                className="ii-card__bg"
                style={{ backgroundImage: `url(${it.image})` }}
              />
              <div className="ii-card__caption">
                <span className="ii-card__name">{it.name}</span>
                <span className="ii-card__code">{it.code}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Guest / pending: locked teaser ── */
        <div className="ii-locked">
          <div className="ii-locked__icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="ii-locked__heading">Trade-partner access only</div>
          <p className="ii-locked__copy">
            Our full image library is available to verified trade partners.
            Sign in to your approved account to browse all articles.
          </p>
          <div className="ii-locked__actions">
            <Link href="/login" className="cat-locked__btn cat-locked__btn--primary">
              Sign in to view
            </Link>
            <Link href="/signup" className="cat-locked__btn cat-locked__btn--secondary">
              Request access
            </Link>
          </div>
          {/* Blurred preview grid */}
          <div className="ii-grid ii-locked__preview" aria-hidden="true">
            {col.items?.map((it, i) => (
              <div key={i} className="ii-card">
                <div
                  className="ii-card__bg"
                  style={{ backgroundImage: `url(${it.image})` }}
                />
                <div className="ii-card__caption">
                  <span className="ii-card__name">{it.name}</span>
                  <span className="ii-card__code">{it.code}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
