"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { heroSequence } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ScrollIndicator } from "@/components/layout/ScrollIndicator";

interface HeroProps {
  imageUrl?: string | null;
  tagline?: string;
}

export function Hero({
  imageUrl,
  tagline = "Cinematic photography for the stories that matter",
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const heroTitle = el.querySelector(".hero-title");
      const heroRule = el.querySelector(".hero-rule");
      const heroSubtitle = el.querySelector(".hero-subtitle-brand");
      const heroImage = el.querySelector(".hero-image");
      const heroTagline = el.querySelector(".hero-tagline");
      const scrollIndicator = el.querySelector(".scroll-indicator");

      if (reduced) {
        gsap.set([heroTitle, heroRule, heroSubtitle, heroImage, heroTagline, scrollIndicator].filter(Boolean), {
          autoAlpha: 1,
        });
        if (heroRule) gsap.set(heroRule, { scaleX: 1 });
        return;
      }

      // Set initial hidden states before timeline builds
      if (scrollIndicator) gsap.set(scrollIndicator, { autoAlpha: 0 });

      const tl = gsap.timeline();
      let split: SplitText | null = null;

      // Step 1 (pos 0.2): Rule line
      if (heroRule) {
        const step = heroSequence.steps[1];
        tl.fromTo(heroRule, step.from!, step.to!, step.position);
      }

      // Step 2 (pos 0.5): Title — SplitText lines
      if (heroTitle) {
        const step = heroSequence.steps[2];
        split = new SplitText(heroTitle, { type: "lines", mask: "lines", autoSplit: true });
        tl.fromTo(
          split.lines,
          { yPercent: 100 },
          { yPercent: 0, duration: 1.0, ease: "power3.out", stagger: step.stagger ?? 0.12 },
          step.position,
        );
      }

      // Step 3 (pos 1.2): Subtitle brand
      if (heroSubtitle) {
        const step = heroSequence.steps[3];
        tl.fromTo(heroSubtitle, step.from!, step.to!, step.position);
      }

      // Step 4 (pos 1.4): Hero image
      if (heroImage) {
        const step = heroSequence.steps[4];
        tl.fromTo(heroImage, step.from!, step.to!, step.position);
      }

      // Step 5 (pos 2.2): Tagline
      if (heroTagline) {
        const step = heroSequence.steps[5];
        tl.fromTo(heroTagline, step.from!, step.to!, step.position);
      }

      // Step 6 (pos 2.8): Scroll indicator reveal
      if (scrollIndicator) {
        const step = heroSequence.steps[6];
        tl.to(scrollIndicator, { autoAlpha: 1, duration: 0.5, ease: "power3.out" }, step.position);
      }

      return () => {
        split?.revert();
      };
    },
    { scope: containerRef, dependencies: [reduced] },
  );

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Background image */}
      <div className="hero-image absolute inset-0" style={{ opacity: 0, visibility: "hidden" }}>
        {imageUrl ? (
          <Image src={imageUrl} alt="" fill priority className="object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-surface via-background to-background" />
        )}
        {/* Darken overlay for text legibility */}
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-[--container-padding-x]">
        <div
          className="hero-rule mb-6 h-[1px] w-24 bg-primary"
          style={{ transform: "scaleX(0)" }}
        />

        <h1 className="hero-title font-display text-[length:var(--text-hero-mobile)] leading-none tracking-[--tracking-hero] text-text-heading md:text-[length:var(--text-hero)]">
          BAMYAN
        </h1>

        <p
          className="hero-subtitle-brand mt-4 font-body text-[length:var(--text-2xl)] uppercase tracking-[0.3em] text-text-heading"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          STORYWORKS
        </p>

        <p
          className="hero-tagline mt-6 max-w-md text-center font-body text-[length:var(--text-lg)] text-muted"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          {tagline}
        </p>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator className="absolute bottom-8 right-8" />
    </section>
  );
}
