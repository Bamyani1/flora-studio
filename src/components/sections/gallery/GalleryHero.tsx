"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { cinematicHeroReveal, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveImageUrl } from "@/lib/image-url";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { CATEGORY_META } from "@/lib/categories";
import type { GallerySectionProps } from "./types";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export function GalleryHero({ album, index, priority = false }: GallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const coverUrl = resolveImageUrl(album.coverImage);
  const categoryLabel = CATEGORY_META[album.category]?.label ?? album.category;

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      if (reduced) {
        gsap.set(
          el.querySelectorAll(
            ".gallery-hero-img, .gallery-hero-label, .gallery-hero-title-line, .gallery-hero-desc, .gallery-hero-scroll",
          ),
          { autoAlpha: 1, y: 0, scale: 1, filter: "none", rotationX: 0 },
        );
        return;
      }

      const tl = gsap.timeline({ ...withWillChange() });

      tl.fromTo(el.querySelector(".gallery-hero-img"), cinematicHeroReveal.image.from, {
        ...cinematicHeroReveal.image.to,
      })
        .fromTo(
          el.querySelector(".gallery-hero-label"),
          cinematicHeroReveal.chapterLabel.from,
          { ...cinematicHeroReveal.chapterLabel.to },
          "-=1.5",
        )
        .fromTo(
          el.querySelectorAll(".gallery-hero-title-line"),
          cinematicHeroReveal.titleLine.from,
          { ...cinematicHeroReveal.titleLine.to },
          "-=1.2",
        )
        .fromTo(
          el.querySelector(".gallery-hero-desc"),
          cinematicHeroReveal.description.from,
          { ...cinematicHeroReveal.description.to },
          "-=1",
        )
        .fromTo(
          el.querySelector(".gallery-hero-scroll"),
          cinematicHeroReveal.scrollCue.from,
          { ...cinematicHeroReveal.scrollCue.to },
          "-=0.5",
        );

      // Parallax on scroll
      const img = el.querySelector<HTMLElement>(".gallery-hero-img");
      if (img) {
        gsap.to(img, {
          ...cinematicHeroReveal.parallax.to,
          scrollTrigger: {
            trigger: el,
            ...cinematicHeroReveal.parallax.scrollTrigger,
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
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-dvh w-full overflow-hidden"
      aria-label={`${album.title} — featured album`}
    >
      <div className="grain-medium absolute inset-0 z-[2]" aria-hidden="true" />
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-[var(--color-surface-lowest)]/80"
        aria-hidden="true"
      />

      {/* Hero image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {coverUrl ? (
          <Image
            alt={album.title}
            className="gallery-hero-img object-cover w-full h-full"
            src={coverUrl}
            fill
            priority={priority}
            sizes="100vw"
            placeholder={album.blurDataURL ? "blur" : undefined}
            blurDataURL={album.blurDataURL}
          />
        ) : (
          <div className="gallery-hero-img h-full w-full bg-gradient-to-br from-surface to-surface-elevated" />
        )}
      </div>

      {/* Content */}
      <div
        className="relative z-20 h-full flex flex-col justify-end p-[var(--container-padding-x)] pb-12 md:p-24 max-w-7xl mx-auto"
        style={{ perspective: "1000px" }}
      >
        <span className="gallery-hero-label font-label text-xs tracking-[0.3em] text-primary uppercase">
          Chapter {ROMAN[index - 1] ?? index}
        </span>

        <TransitionLink href={`/work/${album.slug.current}`} className="block mt-4">
          <h2 className="font-display text-[length:var(--text-5xl)] md:text-[length:var(--text-7xl)] text-text-heading leading-none -ml-1">
            <div className="overflow-hidden">
              <div className="gallery-hero-title-line">{album.title}</div>
            </div>
          </h2>
        </TransitionLink>

        <p className="gallery-hero-desc max-w-md font-body text-[var(--color-on-surface-variant)]/70 text-sm leading-relaxed mt-4">
          {categoryLabel} {album.year ? `— ${album.year}` : ""}{" "}
          {album.location ? `| ${album.location}` : ""}
        </p>

        <div className="gallery-hero-scroll mt-12 flex items-center gap-4">
          <div className="w-[1px] h-12 bg-primary/30" />
          <span className="font-label text-[10px] tracking-[0.2em] uppercase text-[var(--color-on-surface-variant)]/50">
            Scroll to Explore
          </span>
        </div>
      </div>
    </section>
  );
}
