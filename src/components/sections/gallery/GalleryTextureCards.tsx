"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { textureCardReveal, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveImageUrl } from "@/lib/image-url";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { CATEGORY_META } from "@/lib/categories";
import type { GalleryDualSectionProps } from "./types";

export function GalleryTextureCards({ albums }: GalleryDualSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

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
        if (img) {
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
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--color-outline-variant)]/10"
      aria-label="Album pair"
    >
      <div className="grain-medium absolute inset-0 z-[2]" aria-hidden="true" />
      {albums.map((album) => {
        const coverUrl = resolveImageUrl(album.coverImage);
        const categoryLabel = CATEGORY_META[album.category]?.label ?? album.category;

        return (
          <TransitionLink
            key={album._id}
            href={`/work/${album.slug.current}`}
            className="texture-card relative bg-surface overflow-hidden min-h-[50vh] md:min-h-screen group/texture cursor-pointer block"
          >
            <div className="absolute inset-0 transition-transform duration-[2s] ease-out group-hover/texture:scale-105">
              {coverUrl ? (
                <Image
                  alt={album.title}
                  className="texture-img object-cover w-full h-full opacity-80"
                  src={coverUrl}
                  fill
                  loading="lazy"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  placeholder={album.blurDataURL ? "blur" : undefined}
                  blurDataURL={album.blurDataURL}
                />
              ) : (
                <div className="texture-img h-full w-full bg-gradient-to-br from-surface to-surface-elevated" />
              )}
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
