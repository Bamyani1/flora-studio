"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "lenis/react";
import { SiteMedia } from "@/components/ui/SiteMedia";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { resolveImageUrl } from "@/lib/image-url";
import { cn } from "@/lib/utils";
import type { SanityImage } from "@/types/project";

interface AlbumLightboxProps {
  images: SanityImage[];
  index: number;
  title: string;
  onNavigate: (index: number) => void;
  onClose: () => void;
}

const SWIPE_MIN_PX = 50;

const pad = (n: number) => String(n).padStart(2, "0");

const arrowClass =
  "absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-text/20 bg-surface-abyss/60 text-lg text-text transition-colors can-hover:hover:border-primary can-hover:hover:text-primary";

export function AlbumLightbox({ images, index, title, onNavigate, onClose }: AlbumLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lenis = useLenis();
  const count = images.length;
  const current = images[index];

  const step = (delta: number) => onNavigate((index + delta + count) % count);

  // Declared before the focus trap so, on close, the page scroll is restored
  // before focus returns to the tile that opened the viewer.
  useEffect(() => {
    lenis?.stop();
    const body = document.body;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    // position:fixed is the lock iOS Safari respects; overflow:hidden alone is not
    Object.assign(body.style, {
      position: "fixed",
      top: `-${scrollY}px`,
      left: "0",
      right: "0",
      width: "100%",
    });

    return () => {
      lenis?.start();
      Object.assign(body.style, previous);
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, [lenis]);

  useFocusTrap(dialogRef, true);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (count > 1 && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
        event.preventDefault();
        onNavigate((index + (event.key === "ArrowRight" ? 1 : -1) + count) % count);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [index, count, onNavigate, onClose]);

  // Touch events rather than pointer events: the browser keeps pinch-zoom and
  // never cancels the gesture out from under us.
  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStartRef.current =
      event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch || count < 2) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
  };

  // The current photo plus its neighbours, so stepping shows an already-loaded frame
  const rendered =
    count > 1 ? [...new Set([(index - 1 + count) % count, index, (index + 1) % count])] : [index];

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title}: photo viewer`}
      data-lenis-prevent
      className="fixed inset-0 z-lightbox flex flex-col bg-surface-abyss text-text"
    >
      <div className="flex items-center justify-between px-[var(--container-padding-x)] py-3">
        <p className="eyebrow text-text/80" aria-hidden="true">
          {pad(index + 1)} / {pad(count)}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="eyebrow flex min-h-[44px] items-center gap-3 px-2 text-text transition-colors can-hover:hover:text-primary"
        >
          Close
          <span aria-hidden="true" className="text-base leading-none">
            &times;
          </span>
        </button>
      </div>

      <div className="relative flex-1" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {rendered.map((i) => (
          <div
            key={i}
            aria-hidden={i === index ? undefined : true}
            data-lightbox-frame={i === index ? "current" : "neighbour"}
            className={cn(
              "absolute inset-x-2 inset-y-0 md:inset-x-24",
              i === index ? "visible" : "invisible",
            )}
          >
            <SiteMedia
              src={resolveImageUrl(images[i])}
              alt={images[i].alt || `${title}, photo ${i + 1}`}
              fill
              loading="eager"
              sizes="100vw"
              quality={90}
              className="object-contain"
            />
          </div>
        ))}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className={cn(arrowClass, "left-3 md:left-6")}
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className={cn(arrowClass, "right-3 md:right-6")}
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          </>
        )}
      </div>

      <p className="min-h-[3.5rem] px-[var(--container-padding-x)] py-4 text-center text-sm text-text/70">
        {current?.caption}
      </p>

      <p className="sr-only" aria-live="polite">
        Photo {index + 1} of {count}
        {current?.alt ? `: ${current.alt}` : ""}
      </p>
    </div>,
    document.body,
  );
}
