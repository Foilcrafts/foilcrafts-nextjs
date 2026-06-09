"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = {
  image: string;
  destination?: string;
  label?: string;
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
        <Link
          key={i}
          className={`hero-slide${i === idx ? " active" : ""}`}
          href={s.destination ?? "#"}
          style={{ backgroundImage: `url(${s.image})` }}
          aria-label={s.label ?? `Slide ${i + 1}`}
        />
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
