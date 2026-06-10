"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { content } from "@/lib/content";

type Collection = (typeof content.collections)[number];

const html = (s: string) => ({ dangerouslySetInnerHTML: { __html: s } });

export function CollectionsGrid({
  filter,
  isApproved = false,
}: {
  filter?: readonly string[];
  isApproved?: boolean;
}) {
  const collections: readonly Collection[] = filter
    ? content.collections.filter((c) => filter.includes(c.slug))
    : content.collections;
  const [active, setActive] = useState<Collection | null>(null);

  // Lock body scroll when modal open
  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  // Escape closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <section id="collections">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <div className="section-head__num">01 — Collections</div>
              <h2 {...html(content.collections_section.heading)} />
            </div>
            <div className="section-head__copy">
              {content.collections_section.copy}
            </div>
          </div>
          <div className="collections-grid">
            {collections.map((c) => (
              <div
                key={c.slug}
                className={`col-card size-${c.size ?? "sm"}`}
                onClick={() => setActive(c)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setActive(c);
                }}
              >
                <div
                  className="col-card__bg"
                  style={{ backgroundImage: `url('${c.hero_image}')` }}
                />
                <div className="col-card__overlay" />
                <div className="col-card__content">
                  <div className="col-card__num">{c.number}</div>
                  <div className="col-card__title-wrap">
                    <div>
                      <div className="col-card__count">{c.count}</div>
                      <h3 className="col-card__title">{c.title_short}</h3>
                    </div>
                    <div className="col-card__arrow">→</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Drill-down modal — full screen */}
      <div
        className={`detail${active ? " open" : ""}`}
        id="detail"
        aria-hidden={!active}
      >
        {active && (() => {
          const allItems = active.items ?? [];
          const totalCount = allItems.length;
          const hiddenCount = totalCount - 3;
          const showTeaser = !isApproved && hiddenCount > 0;
          const visibleItems = isApproved ? allItems : allItems.slice(0, 3);

          return (
            <>
              <button
                className="detail__close"
                onClick={() => setActive(null)}
                aria-label="Close"
              >
                ✕ Close
              </button>
              <div className="detail__hero">
                <div
                  className="detail__hero-bg"
                  style={{ backgroundImage: `url('${active.hero_image}')` }}
                />
                <div className="detail__hero-content">
                  <div className="eyebrow">{active.eyebrow}</div>
                  <h1 {...html(active.title)} />
                  <div className="detail__meta">
                    <span>{active.count}</span>
                    <span>{active.origin}</span>
                    <span>MOQ on request</span>
                  </div>
                </div>
              </div>
              <div className="detail__intro">
                <p className="lead">{active.lead}</p>
                <p>{active.body}</p>
              </div>
              <div className="detail__items">
                {visibleItems.map((it, i) => (
                  <div key={i} className="item">
                    <div
                      className="item__bg"
                      style={{ backgroundImage: `url('${it.image}')` }}
                    />
                    <div className="item__caption">
                      <div className="item__name">{it.name}</div>
                      <div className="item__code">{it.code}</div>
                    </div>
                  </div>
                ))}
                {showTeaser && (
                  <Link href="/contact#customer-login" className="item item--teaser ii-card--teaser">
                    <div className="ii-teaser__inner">
                      <div className="ii-teaser__icon" aria-hidden="true">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </div>
                      <div className="ii-teaser__count">+{hiddenCount} More Designs</div>
                      <div className="ii-teaser__sub">TRADE PARTNERS ONLY</div>
                      <span className="ii-teaser__btn">Partner Login →</span>
                    </div>
                  </Link>
                )}
              </div>
            </>
          );
        })()}
      </div>
    </>
  );
}
