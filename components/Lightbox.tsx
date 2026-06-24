"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LightboxImage {
  src: string;
  name?: string;
  code?: string;
}

interface LightboxProps {
  images: readonly LightboxImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" || e.key === "Left") {
        handlePrev();
      } else if (e.key === "ArrowRight" || e.key === "Right") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  if (!currentImage) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="lightbox-overlay"
      onClick={(e) => {
        // Close if click is outside of content (on the overlay backdrop itself)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Close button */}
      <button
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close lightbox"
        role="button"
      >
        ✕ Close
      </button>

      {/* Navigation - Prev */}
      {images.length > 1 && (
        <button
          className="lightbox-nav lightbox-nav--prev"
          onClick={handlePrev}
          aria-label="Previous image"
          role="button"
        >
          ←
        </button>
      )}

      {/* Image container */}
      <div className="lightbox-content" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="lightbox-image-wrapper">
          <img
            src={currentImage.src}
            alt={currentImage.name || `Design preview ${currentIndex + 1}`}
            className="lightbox-image"
          />
        </div>
      </div>

      {/* Navigation - Next */}
      {images.length > 1 && (
        <button
          className="lightbox-nav lightbox-nav--next"
          onClick={handleNext}
          aria-label="Next image"
          role="button"
        >
          →
        </button>
      )}

      {/* Caption & Metadata */}
      <div className="lightbox-caption">
        <div className="lightbox-caption__inner">
          <div className="lightbox-caption__details">
            {currentImage.name && <h4 className="lightbox-caption__title">{currentImage.name}</h4>}
            {currentImage.code && <span className="lightbox-caption__code">{currentImage.code}</span>}
          </div>
          <div className="lightbox-caption__counter">
            {String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
}
