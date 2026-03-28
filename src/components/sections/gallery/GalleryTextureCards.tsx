"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { textureCardReveal, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getImageDimensions } from "@/lib/image-url";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { CATEGORY_META } from "@/lib/categories";
import { SiteMedia } from "@/components/ui/SiteMedia";
import type { GalleryDualSectionProps } from "./types";

export function GalleryTextureCards({
  albums,
  performanceMode = "default",
  deferOffscreen = false,
}: GalleryDualSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const smoothMode = performanceMode === "smooth";
  const sectionStyle: CSSProperties | undefined = deferOffscreen
    ? {
        contentVisibility: "auto",
        containIntrinsicSize: "auto 100vh",
        contain: "layout style paint",
      }
    : undefined;

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      if (reduced) {
        gsap.set(el.querySelectorAll(".texture-card, .texture-img"), {
          autoAlpha: 1,
          y: 0,
          scale: 1,
        });
        return;
      }

      const cards = el.querySelectorAll<HTMLElement>(".texture-card");

      cards.forEach((card) => {
        // Card entrance
        gsap.fromTo(card, textureCardReveal.card.from, {
          ...textureCardReveal.card.to,
          ...withWillChange(),
          scrollTrigger: {
            trigger: card,
            ...textureCardReveal.card.scrollTrigger,
          },
        });

        // Inner image parallax
        const img = card.querySelector<HTMLElement>(".texture-img");
        if (!smoothMode && img) {
          gsap.fromTo(img, textureCardReveal.image.from, {
            ...textureCardReveal.image.to,
            scrollTrigger: {
              trigger: card,
              ...textureCardReveal.image.scrollTrigger,
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
      });
    },
    { scope: sectionRef, dependencies: [reduced, smoothMode] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col md:flex-row gap-px bg-[var(--color-outline-variant)]/10"
      style={sectionStyle}
      aria-label="Album pair"
    >
      {!smoothMode && <div className="grain-medium absolute inset-0 z-[2]" aria-hidden="true" />}
      {albums.map((album) => {
        const dims = getImageDimensions(album.coverImage);
        const categoryLabel = CATEGORY_META[album.category]?.label ?? album.category;

        return (
          <TransitionLink
            key={album._id}
            href={`/work/${album.slug.current}`}
            className="texture-card relative bg-surface overflow-hidden min-h-[40vh] w-full md:flex-1 group/texture cursor-pointer block"
            style={{
              aspectRatio: dims ? `${dims.width}/${dims.height}` : undefined,
              ...(smoothMode ? { contain: "layout paint" as const } : {}),
            }}
          >
            <div className="absolute inset-0 transition-transform duration-[2s] ease-out group-hover/texture:scale-105">
              <SiteMedia
                alt={`${album.title} cover placeholder`}
                className="texture-img object-cover w-full h-full opacity-80"
                src={album.coverImage.url}
                fill
                loading="lazy"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-12 transition-transform duration-500 group-hover/texture:translate-y-[-10px]">
              <h5 className="font-display text-[length:var(--text-2xl)] text-text-heading mb-2 transition-colors duration-300 group-hover/texture:text-primary">
                {album.title}
              </h5>
              <p className="font-body text-xs text-[var(--color-on-surface-variant)]/70 uppercase tracking-widest">
                {categoryLabel}
              </p>
            </div>
          </TransitionLink>
        );
      })}
    </section>
  );
}
