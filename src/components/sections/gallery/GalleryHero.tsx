"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { cinematicHeroReveal, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { CATEGORY_META } from "@/lib/categories";
import { resolveImageUrl } from "@/lib/image-url";
import { SiteMedia } from "@/components/ui/SiteMedia";
import type { GallerySectionProps } from "./types";


export function GalleryHero({
  album,
  priority = false,
  performanceMode = "default",
  deferOffscreen = false,
  blurDataURL,
}: GallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const categoryLabel = CATEGORY_META[album.category]?.label ?? album.category;
  const coverSrc = resolveImageUrl(album.coverImage);
  const smoothMode = performanceMode === "smooth";
  const sectionStyle: CSSProperties | undefined =
    smoothMode && deferOffscreen
      ? { contentVisibility: "auto", containIntrinsicSize: "100vh", contain: "layout paint" }
      : undefined;
  const imageShellStyle: CSSProperties | undefined = smoothMode
    ? { contain: "layout paint" }
    : undefined;

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      if (reduced) {
        gsap.set(
          el.querySelectorAll(
            ".gallery-hero-img, .gallery-hero-label, .gallery-hero-title-line, .gallery-hero-desc, .gallery-hero-scroll",
          ),
          { autoAlpha: 1, y: 0, scale: 1, rotationX: 0 },
        );
        gsap.set(el.querySelector(".gallery-hero-dark-overlay"), { autoAlpha: 0 });
        return;
      }

      const tl = gsap.timeline({ ...withWillChange() });

      tl.fromTo(el.querySelector(".gallery-hero-img"), cinematicHeroReveal.image.from, {
        ...cinematicHeroReveal.image.to,
      });

      tl.fromTo(
        el.querySelector(".gallery-hero-dark-overlay"),
        cinematicHeroReveal.darkOverlay.from,
        { ...cinematicHeroReveal.darkOverlay.to },
        0,
      );
      tl.fromTo(
          el.querySelectorAll(".gallery-hero-title-line"),
          cinematicHeroReveal.titleLine.from,
          { ...cinematicHeroReveal.titleLine.to },
          "-=1.2",
        )
        .fromTo(
          el.querySelector(".gallery-hero-desc"),
          cinematicHeroReveal.description.from,
          { ...cinematicHeroReveal.description.to },
          "-=0.6",
        )
        .fromTo(
          el.querySelector(".gallery-hero-scroll"),
          cinematicHeroReveal.scrollCue.from,
          { ...cinematicHeroReveal.scrollCue.to },
          "-=0.4",
        );

      const img = el.querySelector<HTMLElement>(".gallery-hero-img");
      if (!smoothMode && img) {
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
    { scope: sectionRef, dependencies: [reduced, smoothMode] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-dvh w-full overflow-hidden"
      style={sectionStyle}
      aria-label={`${album.title} — featured album`}
    >
      {!smoothMode && <div className="grain-medium absolute inset-0 z-grain" aria-hidden="true" />}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-[var(--color-surface-lowest)]/80"
        aria-hidden="true"
      />

      <div className="absolute inset-0 w-full h-full overflow-hidden" style={imageShellStyle}>
        <SiteMedia
          src={coverSrc}
          alt={album.coverImage.alt || `${album.title} cover`}
          className="gallery-hero-img object-cover w-full h-full"
          fill
          priority={priority}
          sizes="100vw"
          blurDataURL={blurDataURL}
        />
        <div className="gallery-hero-dark-overlay absolute inset-0 bg-black" aria-hidden="true" />
      </div>

      <div
        className="relative z-20 h-full flex flex-col justify-end items-end text-right p-[var(--container-padding-x)] pb-12 md:p-24 max-w-7xl mx-auto"
        style={{ perspective: "1000px" }}
      >
        <TransitionLink href={`/work/${album.slug.current}`} className="group block mt-4">
          <h2 className="font-display text-[length:var(--text-5xl)] md:text-[length:var(--text-7xl)] text-text-heading leading-none transition-colors duration-500 group-hover:text-primary">
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
