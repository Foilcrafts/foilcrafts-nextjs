/* Items-inline grid — for digital-printing and cut-plates-embossing pages.
   Auth-aware:
     • First 10 items are always visible (logged-out or logged-in).
     • If there are more than 10 items AND the user is NOT approved,
       show a "+N More Articles" teaser card after the 10th item.
     • If the user IS approved, show ALL items with no teaser.
   Server component — no interactivity needed.
*/

import Link from "next/link";
import { content } from "@/lib/content";

const PUBLIC_PREVIEW_COUNT = 8;

interface Props {
  fromSlug: string;
  isApproved: boolean;
}

export function ItemsInline({ fromSlug, isApproved }: Props) {
  const col = content.collections.find((c) => c.slug === fromSlug);
  if (!col) return null;

  const allItems = col.items ?? [];
  const totalCount = allItems.length;
  const hiddenCount = totalCount - PUBLIC_PREVIEW_COUNT;
  const showTeaser = !isApproved && hiddenCount > 0;
  const visibleItems = isApproved ? allItems : allItems.slice(0, PUBLIC_PREVIEW_COUNT);

  return (
    <section className="ii-section" id="items-inline">
      <div className="ii-grid">
        {visibleItems.map((it, i) => (
          <div key={i} className="ii-card">
            <div
              className="ii-card__bg"
              style={{ backgroundImage: `url('${it.image}')` }}
            />
            <div className="ii-card__caption">
              <span className="ii-card__name">{it.name}</span>
              <span className="ii-card__code">{it.code}</span>
            </div>
          </div>
        ))}

        {/* "+N More Articles" teaser card for guests */}
        {showTeaser && (
          <Link href="/contact#customer-login" className="ii-card ii-card--teaser">
            <div className="ii-teaser__inner">
              <div className="ii-teaser__icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div className="ii-teaser__count">+{hiddenCount} More Articles</div>
              <div className="ii-teaser__sub">TRADE PARTNERS ONLY</div>
              <span className="ii-teaser__btn">Partner Login →</span>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
