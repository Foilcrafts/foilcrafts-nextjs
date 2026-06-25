"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SlideButton = {
  label: string;
  href: string;
  primary: boolean;
};

type Slide = {
  image: string;
  mobileImage?: string;
  destination?: string;
  label?: string;
  eyebrow?: string;
  title?: string;
  sub?: string;
  meta?: readonly string[];
  buttons?: readonly SlideButton[];
};

export function HeroSlider({ slides }: { slides: readonly Slide[] }) {
  const [idx, setIdx] = useState(0);
  const total = slides.length;

  // Auto-advance every 5.5s
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 5500);
    return () => clearInterval(t);
  }, [total]);

  return (
    <section className="hero-slider" id="hero-slider">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`hero-slide${i === idx ? " active" : ""}`}
          style={
            {
              "--bg-desktop": `url(${s.image})`,
              "--bg-mobile": `url(${s.mobileImage ?? s.image})`,
            } as React.CSSProperties
          }
          aria-label={s.label ?? `Slide ${i + 1}`}
        >
          {/* Inner content overlay */}
          <div className="hero-slide__inner">
            <div className="hero-slide__content">
              {s.eyebrow && (
                <div className={`hero-slide__eyebrow ${i === 0 || i === total - 1 ? "hide-mobile" : ""}`}>
                  {s.eyebrow}
                </div>
              )}
              {s.title && (
                <h1
                  className="hero-slide__title"
                  dangerouslySetInnerHTML={{ __html: s.title }}
                />
              )}
              {s.sub && (
                <p className={`hero-slide__sub ${i === 0 || i === total - 1 ? "hide-mobile" : ""}`}>
                  {s.sub}
                </p>
              )}

              {/* Meta tags */}
              {s.meta && s.meta.length > 0 && (
                <div className={`hero-slide__meta ${i === 0 || i === total - 1 ? "hide-mobile" : ""}`}>
                  {s.meta.map((item, mIdx) => (
                    <span key={mIdx} className="hero-slide__meta-item">
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA buttons */}
              {s.buttons && s.buttons.length > 0 && (
                <div className="hero-slide__buttons">
                  {s.buttons.map((btn, bIdx) => (
                    <Link
                      key={bIdx}
                      href={btn.href}
                      className={`hero-slide__action ${
                        btn.primary
                          ? "hero-slide__action--primary"
                          : "hero-slide__action--secondary"
                      }`}
                      role="button"
                    >
                      {btn.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="hero-slider__counter">
        <span id="sliderCounter">{String(idx + 1).padStart(2, "0")}</span> / 0{total}
      </div>
      <div className="hero-slider__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-slider__dot${i === idx ? " active" : ""}`}
            data-idx={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
      <div className="hero-slider__nav">
        <button
          className="hero-slider__btn"
          id="sliderPrev"
          aria-label="Previous"
          onClick={() => setIdx((i) => (i - 1 + total) % total)}
        >
          ←
        </button>
        <button
          className="hero-slider__btn"
          id="sliderNext"
          aria-label="Next"
          onClick={() => setIdx((i) => (i + 1) % total)}
        >
          →
        </button>
      </div>
    </section>
  );
}
