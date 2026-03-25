"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { heroMonolithSequence } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";
import { getLocalBlur } from "@/lib/image-manifest";

const seq = heroMonolithSequence;

export function HeroMonolith() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const imageEl = root.querySelector<HTMLElement>(".mono-image");
      const overlayEl = root.querySelector<HTMLElement>(".mono-overlay");
      const giantTextEl = root.querySelector<HTMLElement>(".mono-giant-text");
      const subtitleEl = root.querySelector<HTMLElement>(".mono-subtitle");
      const goldLineLeftEl = root.querySelector<HTMLElement>(".mono-gold-left");
      const goldLineRightEl = root.querySelector<HTMLElement>(".mono-gold-right");
      const taglineEl = root.querySelector<HTMLElement>(".mono-tagline");
      const ctaEl = root.querySelector<HTMLElement>(".mono-cta");

      // --- Reduced motion: jump to final state ---
      if (reducedMotion) {
        if (overlayEl) gsap.set(overlayEl, { opacity: 0.82 });
        if (giantTextEl) gsap.set(giantTextEl, { autoAlpha: 1 });
        if (imageEl) gsap.set(imageEl, { scale: 1 });
        if (subtitleEl) gsap.set(subtitleEl, { autoAlpha: 1 });
        if (goldLineLeftEl) gsap.set(goldLineLeftEl, { scaleX: 1 });
        if (goldLineRightEl) gsap.set(goldLineRightEl, { scaleX: 1 });
        if (taglineEl) gsap.set(taglineEl, { autoAlpha: 1, y: 0 });
        if (ctaEl) gsap.set(ctaEl, { autoAlpha: 1 });
        return;
      }

      // --- Set initial states ---
      if (imageEl) gsap.set(imageEl, seq.imageScale.from);
      if (overlayEl) gsap.set(overlayEl, seq.overlayReveal.from);
      if (giantTextEl) gsap.set(giantTextEl, seq.giantText.from);
      if (subtitleEl) gsap.set(subtitleEl, seq.subtitle.from);
      if (goldLineLeftEl) gsap.set(goldLineLeftEl, seq.goldLines.from);
      if (goldLineRightEl) gsap.set(goldLineRightEl, seq.goldLines.from);
      if (taglineEl) gsap.set(taglineEl, seq.tagline.from);
      if (ctaEl) gsap.set(ctaEl, seq.cta.from);

      // --- Build entrance timeline ---
      const tl = gsap.timeline();

      // t=0.3 — Giant "LIGHT" text fades in (white on black)
      if (giantTextEl) {
        tl.fromTo(giantTextEl, seq.giantText.from, seq.giantText.to, 0.3);
      }

      // t=1.0 — THE REVEAL: overlay fades from 1→0.82, image bleeds through letters
      if (overlayEl) {
        tl.fromTo(overlayEl, seq.overlayReveal.from, seq.overlayReveal.to, 1.0);
      }

      // t=2.0 — Gold lines expand from center + subtitle fades in
      if (goldLineLeftEl) {
        tl.fromTo(goldLineLeftEl, seq.goldLines.from, seq.goldLines.to, 2.0);
      }
      if (goldLineRightEl) {
        tl.fromTo(goldLineRightEl, seq.goldLines.from, seq.goldLines.to, 2.0);
      }
      if (subtitleEl) {
        tl.fromTo(subtitleEl, seq.subtitle.from, seq.subtitle.to, 2.0);
      }

      // t=2.5 — Tagline fades up
      if (taglineEl) {
        tl.fromTo(taglineEl, seq.tagline.from, seq.tagline.to, 2.5);
      }

      // t=3.0 — CTA fades in
      if (ctaEl) {
        tl.fromTo(ctaEl, seq.cta.from, seq.cta.to, 3.0);
      }

      // --- Scroll-driven behaviors ---
      // Overlay: 0.82 → 0.65 on scroll
      if (overlayEl) {
        gsap.to(overlayEl, {
          ...seq.overlayScroll.to,
          scrollTrigger: {
            trigger: root,
            ...seq.overlayScroll.scrollTrigger,
          },
        });
      }

      // Image: scale 1.05 → 1 on scroll
      if (imageEl) {
        gsap.fromTo(imageEl, seq.imageScale.from, {
          ...seq.imageScale.to,
          scrollTrigger: {
            trigger: root,
            ...seq.imageScale.scrollTrigger,
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  const blurDataURL = getLocalBlur("/images/hero.jpg");

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
      style={{ backgroundColor: "var(--color-black)" }}
    >
      {/* Layer 0 — Hero image (z-[1]) */}
      <div className="mono-image absolute inset-0 z-[1]">
        <Image
          src="/images/hero.jpg"
          alt="Saffron Studios hero photograph"
          fill
          sizes="100vw"
          priority
          className="object-cover"
          {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
        />
      </div>

      {/* Layer 1 — Black overlay (z-[2]) */}
      <div
        className="mono-overlay absolute inset-0 z-[2]"
        style={{ backgroundColor: "var(--color-black)" }}
      />

      {/* Layer 2 — Giant text "LIGHT" with mix-blend-mode: screen (z-[3]) */}
      <div
        className="mono-giant-text absolute inset-0 z-[3] flex items-center justify-center select-none pointer-events-none"
        style={{
          mixBlendMode: "screen",
        }}
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: "var(--font-v3-display)",
            fontWeight: 900,
            fontSize: "clamp(15rem, 42vw, 45rem)",
            textTransform: "uppercase",
            color: "var(--color-text-heading)",
            letterSpacing: "0.05em",
            lineHeight: 0.85,
          }}
        >
          LIGHT
        </span>
      </div>

      {/* Layer 3 — UI content (z-[4]), isolated from blend-mode */}
      <div
        className="absolute inset-0 z-[4] flex flex-col items-center"
        style={{ isolation: "isolate" }}
      >
        {/* Subtitle row — positioned ~60% from top */}
        <div className="absolute flex items-center justify-center gap-4" style={{ top: "60%" }}>
          {/* Left gold line */}
          <div
            className="mono-gold-left"
            style={{
              width: 40,
              height: 1,
              backgroundColor: "var(--color-primary)",
              transformOrigin: "center center",
            }}
          />

          {/* Studio name */}
          <span
            className="mono-subtitle"
            style={{
              fontFamily: "var(--font-v3-body)",
              fontWeight: 300,
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--color-primary)",
            }}
          >
            SAFFRON STUDIOS
          </span>

          {/* Right gold line */}
          <div
            className="mono-gold-right"
            style={{
              width: 40,
              height: 1,
              backgroundColor: "var(--color-primary)",
              transformOrigin: "center center",
            }}
          />
        </div>

        {/* Tagline — below subtitle */}
        <p
          className="mono-tagline absolute text-center px-4"
          style={{
            top: "calc(60% + 2.5rem)",
            fontFamily: "var(--font-v3-display)",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "clamp(0.8rem, 1.8vw, 1.3rem)",
            color: "color-mix(in srgb, var(--color-text-heading) 50%, transparent)",
          }}
        >
          Photography built on patience and craft
        </p>

        {/* CTA — anchored to bottom */}
        <div className="mono-cta absolute bottom-10 flex justify-center">
          <button
            type="button"
            className="group inline-flex items-center gap-2 bg-transparent border-none cursor-pointer transition-opacity duration-300 hover:opacity-70"
            style={{
              fontFamily: "var(--font-v3-body)",
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-primary)",
            }}
          >
            <span>ENTER THE STUDIO</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
}
