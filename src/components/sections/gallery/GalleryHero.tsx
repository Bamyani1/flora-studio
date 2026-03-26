"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { cinematicHeroReveal, layeredHeroReveal, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveImageUrl } from "@/lib/image-url";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { CATEGORY_META } from "@/lib/categories";
import type { GallerySectionProps } from "./types";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export function GalleryHero({
  album,
  index,
  priority = false,
  performanceMode = "default",
  deferOffscreen = false,
}: GallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const coverUrl = resolveImageUrl(album.coverImage);
  const categoryLabel = CATEGORY_META[album.category]?.label ?? album.category;
  const smoothMode = performanceMode === "smooth";
  const sectionStyle: CSSProperties | undefined =
    smoothMode && deferOffscreen
      ? { contentVisibility: "auto", containIntrinsicSize: "100vh", contain: "layout paint" }
      : undefined;
  const imageShellStyle: CSSProperties | undefined = smoothMode
    ? { contain: "layout paint" }
    : undefined;

  // Layered hero: background + title + subject
  const hasLayers = !!album.heroLayers;
  const bgUrl = hasLayers ? resolveImageUrl(album.heroLayers!.background) : null;
  const subjectUrl = hasLayers ? resolveImageUrl(album.heroLayers!.subject) : null;

  // --- Layered hero animation ---
  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el || !hasLayers) return;

      if (reduced) {
        gsap.set(
          el.querySelectorAll(
            ".layered-hero-bg, .layered-hero-title, .layered-hero-subject, .gallery-hero-label, .gallery-hero-title-line, .gallery-hero-desc, .gallery-hero-scroll",
          ),
          { autoAlpha: 1, y: 0, scale: 1, rotationX: 0 },
        );
        gsap.set(el.querySelector(".gallery-hero-dark-overlay"), { opacity: 0 });
        gsap.set(el.querySelector(".gallery-hero-blur-overlay"), { opacity: 0 });
        return;
      }

      const tl = gsap.timeline({ ...withWillChange() });

      // Background scale reveal
      tl.fromTo(el.querySelector(".layered-hero-bg"), layeredHeroReveal.background.from, {
        ...layeredHeroReveal.background.to,
      });

      // Dark + blur overlays fade out (same timing as background)
      tl.fromTo(
        el.querySelector(".gallery-hero-dark-overlay"),
        cinematicHeroReveal.darkOverlay.from,
        { ...cinematicHeroReveal.darkOverlay.to },
        0,
      );
      tl.fromTo(
        el.querySelector(".gallery-hero-blur-overlay"),
        cinematicHeroReveal.blurOverlay.from,
        { ...cinematicHeroReveal.blurOverlay.to },
        0,
      );

      // Title emerges between layers (starts at 1s)
      tl.fromTo(
        el.querySelector(".layered-hero-title"),
        layeredHeroReveal.title.from,
        { ...layeredHeroReveal.title.to },
        1.0,
      );

      // Subject fades in on top (starts at 1.5s)
      tl.fromTo(
        el.querySelector(".layered-hero-subject"),
        layeredHeroReveal.subject.from,
        { ...layeredHeroReveal.subject.to },
        1.5,
      );

      // Bottom UI elements
      tl.fromTo(
        el.querySelector(".gallery-hero-label"),
        cinematicHeroReveal.chapterLabel.from,
        { ...cinematicHeroReveal.chapterLabel.to },
        "-=1.0",
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

      // Differential parallax for depth
      if (!smoothMode) {
        const parallaxTargets = [
          { sel: ".layered-hero-bg", config: layeredHeroReveal.parallax.background },
          { sel: ".layered-hero-title", config: layeredHeroReveal.parallax.title },
          { sel: ".layered-hero-subject", config: layeredHeroReveal.parallax.subject },
        ];

        for (const { sel, config } of parallaxTargets) {
          const target = el.querySelector<HTMLElement>(sel);
          if (target) {
            gsap.to(target, {
              ...config.to,
              scrollTrigger: {
                trigger: el,
                ...config.scrollTrigger,
                onEnter: () => {
                  target.style.willChange = "transform";
                },
                onLeave: () => {
                  target.style.willChange = "auto";
                },
                onEnterBack: () => {
                  target.style.willChange = "transform";
                },
                onLeaveBack: () => {
                  target.style.willChange = "auto";
                },
              },
            });
          }
        }
      }
    },
    { scope: sectionRef, dependencies: [reduced, smoothMode, hasLayers] },
  );

  // --- Standard (non-layered) animation ---
  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el || hasLayers) return;

      if (reduced) {
        gsap.set(
          el.querySelectorAll(
            ".gallery-hero-img, .gallery-hero-label, .gallery-hero-title-line, .gallery-hero-desc, .gallery-hero-scroll",
          ),
          { autoAlpha: 1, y: 0, scale: 1, rotationX: 0 },
        );
        gsap.set(el.querySelector(".gallery-hero-dark-overlay"), { opacity: 0 });
        gsap.set(el.querySelector(".gallery-hero-blur-overlay"), { opacity: 0 });
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
        el.querySelector(".gallery-hero-blur-overlay"),
        cinematicHeroReveal.blurOverlay.from,
        { ...cinematicHeroReveal.blurOverlay.to },
        0,
      );

      tl.fromTo(
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
    { scope: sectionRef, dependencies: [reduced, smoothMode, hasLayers] },
  );

  // ==========================================================================
  // Layered hero render
  // ==========================================================================
  if (hasLayers && bgUrl && subjectUrl) {
    return (
      <section
        ref={sectionRef}
        className="relative h-dvh w-full overflow-hidden"
        style={sectionStyle}
        aria-label={`${album.title} — featured album`}
      >
        {/* Layer 1: Background image (farthest) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden" style={imageShellStyle}>
          <Image
            alt=""
            className="layered-hero-bg object-cover w-full h-full"
            src={bgUrl}
            fill
            priority={priority}
            sizes="100vw"
          />
          {/* Cinematic overlays */}
          <div
            className="gallery-hero-blur-overlay absolute inset-0"
            style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
            aria-hidden="true"
          />
          <div className="gallery-hero-dark-overlay absolute inset-0 bg-black" aria-hidden="true" />
        </div>

        {!smoothMode && <div className="grain-medium absolute inset-0 z-[3]" aria-hidden="true" />}

        {/* Layer 2: Title text (middle depth) */}
        <div className="layered-hero-title absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
          <h2
            className="font-display text-[15vw] md:text-[12vw] text-text-heading leading-[0.85] tracking-tight text-center select-none"
            style={{ textShadow: "0 4px 60px rgba(0,0,0,0.4)" }}
          >
            {album.title}
          </h2>
        </div>

        {/* Layer 3: Subject cutout (closest) */}
        <div className="absolute inset-0 z-[8] w-full h-full overflow-hidden pointer-events-none">
          <Image
            alt={album.title}
            className="layered-hero-subject object-cover w-full h-full"
            src={subjectUrl}
            fill
            priority={priority}
            sizes="100vw"
          />
        </div>

        {/* Bottom gradient for text readability */}
        <div
          className="absolute inset-0 z-[12] bg-gradient-to-b from-transparent via-transparent to-[var(--color-surface-lowest)]/90"
          aria-hidden="true"
        />

        {/* UI Content */}
        <div
          className="relative z-[20] h-full flex flex-col justify-end p-[var(--container-padding-x)] pb-12 md:p-24 max-w-7xl mx-auto"
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

  // ==========================================================================
  // Standard (single-image) hero render
  // ==========================================================================
  return (
    <section
      ref={sectionRef}
      className="relative h-dvh w-full overflow-hidden"
      style={sectionStyle}
      aria-label={`${album.title} — featured album`}
    >
      {!smoothMode && <div className="grain-medium absolute inset-0 z-[2]" aria-hidden="true" />}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-[var(--color-surface-lowest)]/80"
        aria-hidden="true"
      />

      <div className="absolute inset-0 w-full h-full overflow-hidden" style={imageShellStyle}>
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
        <div
          className="gallery-hero-blur-overlay absolute inset-0"
          style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
          aria-hidden="true"
        />
        <div className="gallery-hero-dark-overlay absolute inset-0 bg-black" aria-hidden="true" />
      </div>

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
