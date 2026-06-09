"use client";

// CustomCursor — replaces the native cursor with the .cursor dot + .cursor-ring
// that are styled in globals.css. Mirrors the original static-build vanilla JS.
// Only active on pointer (mouse) devices — touch devices get native cursor via CSS.

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Lerped ring position for smooth trailing effect
    let ringX = -100;
    let ringY = -100;
    let mouseX = -100;
    let mouseY = -100;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot snaps instantly
      dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
    };

    // Hover enlargement — watch every interactive element
    const HOVER_SELECTOR = "a, button, input, textarea, select, label, [role='button']";

    const onEnter = () => dot.classList.add("hover");
    const onLeave = () => dot.classList.remove("hover");

    document.querySelectorAll(HOVER_SELECTOR).forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // MutationObserver so dynamically added elements also get the hover listeners
    const observer = new MutationObserver(() => {
      document.querySelectorAll(HOVER_SELECTOR).forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Ring lerps toward mouse each frame for smooth trailing
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    document.addEventListener("mousemove", onMove);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      document.querySelectorAll(HOVER_SELECTOR).forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor"      aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
