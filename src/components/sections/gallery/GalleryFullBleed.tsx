"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { fullBleedShowcase, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveImageUrl } from "@/lib/image-url";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { CATEGORY_META } from "@/lib/categories";
import type { GallerySectionProps } from "./types";

export function GalleryFullBleed({
  album,
  performanceMode = "default",
  deferOffscreen = false,
}: GallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const coverUrl = resolveImageUrl(album.coverImage);
  const categoryLabel = CATEGORY_META[album.category]?.label ?? album.category;
  const smoothMode = performanceMode === "smooth";
  const sectionStyle: CSSProperties | undefined = deferOffscreen
    ? {
        contentVisibility: "auto",
        containIntrinsicSize: "auto 100vh",
        contain: "layout style paint",
      }
    : undefined;
  const imageShellStyle: CSSProperties | undefined = smoothMode
    ? { contain: "layout paint" }
    : undefined;

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      if (reduced) {
        gsap.set(el.querySelectorAll(".fullbleed-img, .fullbleed-text"), {
          autoAlpha: 1,
          y: 0,
          scale: 1,
        });
        return;
      }

      // Image parallax
      const img = el.querySelector<HTMLElement>(".fullbleed-img");
      if (!smoothMode && img) {
        gsap.fromTo(img, fullBleedShowcase.image.from, {
          ...fullBleedShowcase.image.to,
          scrollTrigger: {
            trigger: el,
            ...fullBleedShowcase.image.scrollTrigger,
            onEnter: () => {
              img.style.willChange = "transform";
            },
            onLeave: () => {
              img.style.willChange = "auto";
            },
            onEnterBack: () => {
              img.style.willChange = "transform";
            },
            onLeaveBack: () => {
              img.style.willChange = "auto";
            },
          },
        });
      }

      // Text entrance
      const text = el.querySelector(".fullbleed-text");
      if (text) {
        gsap.fromTo(text, fullBleedShowcase.text.from, {
          ...fullBleedShowcase.text.to,
          ...withWillChange(),
          scrollTrigger: {
            trigger: el,
            ...fullBleedShowcase.text.scrollTrigger,
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [reduced, smoothMode] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-dvh w-full flex items-center justify-center bg-[var(--color-surface-lowest)] overflow-hidden group/bleed"
      style={sectionStyle}
      aria-label={`${album.title} — featured`}
    >
      {!smoothMode && <div className="grain-medium absolute inset-0 z-[2]" aria-hidden="true" />}
      {!smoothMode && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-video opacity-40 blur-3xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 transition-opacity duration-1000 group-hover/bleed:opacity-60"
          aria-hidden="true"
        />
      )}

      {/* Centered image */}
      <TransitionLink
        href={`/work/${album.slug.current}`}
        className="relative z-10 w-4/5 md:w-2/3 aspect-[16/10] overflow-hidden block"
        style={imageShellStyle}
      >
        <div className="absolute inset-0 transition-transform duration-[3s] ease-out group-hover/bleed:scale-110">
          {coverUrl ? (
            <Image
              alt={album.title}
              className="fullbleed-img object-cover w-full h-full"
              src={coverUrl}
              fill
              loading="lazy"
              sizes="(min-width: 768px) 66vw, 80vw"
              placeholder={album.blurDataURL ? "blur" : undefined}
              blurDataURL={album.blurDataURL}
            />
          ) : (
            <div className="fullbleed-img h-full w-full bg-gradient-to-br from-surface to-surface-elevated" />
          )}
        </div>
        <div className="absolute inset-0 border border-white/5 pointer-events-none" />

        {/* Text overlay */}
        <div
          className={`fullbleed-text absolute inset-0 flex items-center justify-center transition-all duration-700 ${
            smoothMode
              ? "bg-gradient-to-t from-[var(--color-surface-lowest)]/55 via-[var(--color-surface)]/15 to-transparent group-hover/bleed:bg-gradient-to-t"
              : "bg-[var(--color-surface)]/20 backdrop-blur-[2px] group-hover/bleed:bg-[var(--color-surface)]/10 group-hover/bleed:backdrop-blur-none"
          }`}
        >
          <div className="text-center space-y-4 transition-transform duration-700 group-hover/bleed:scale-105">
            <h4 className="font-display text-[length:var(--text-4xl)] text-text-heading">
              {album.title}
            </h4>
            <p className="font-label text-[10px] tracking-[0.4em] uppercase text-primary">
              {categoryLabel} {album.year ? `— ${album.year}` : ""}
            </p>
          </div>
        </div>
      </TransitionLink>

      {/* Vertical text branding */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block">
        <span className="font-label text-[8px] tracking-[1em] text-[var(--color-on-surface-variant)]/30 uppercase [writing-mode:vertical-lr] rotate-180">
          Saffron Studios {album.year ?? ""}
        </span>
      </div>
    </section>
  );
}
