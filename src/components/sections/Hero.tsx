"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { heroArchiveSequence, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { ScrollIndicator } from "@/components/layout/ScrollIndicator";

interface HeroProps {
  imageUrl?: string | null;
  blurDataURL?: string | null;
}

export function Hero({ imageUrl, blurDataURL }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const heroImage = el.querySelector(".hero-image");
      const heroLabel = el.querySelector(".hero-label");
      const heroTitleLine = el.querySelector(".hero-title-line");
      const heroTitleStroke = el.querySelector(".hero-title-stroke");
      const heroDescription = el.querySelector(".hero-description");
      const heroCta = el.querySelector(".hero-cta");
      const scrollIndicator = el.querySelector(".scroll-indicator");

      if (reduced) {
        gsap.set(
          [
            heroImage,
            heroLabel,
            heroTitleLine,
            heroTitleStroke,
            heroDescription,
            heroCta,
            scrollIndicator,
          ].filter(Boolean),
          { autoAlpha: 1 },
        );
        return;
      }

      // Set initial hidden states
      if (heroImage) gsap.set(heroImage, { autoAlpha: 0, scale: 1.1 });
      if (heroLabel) gsap.set(heroLabel, { autoAlpha: 0 });
      if (heroDescription) gsap.set(heroDescription, { autoAlpha: 0, y: 20 });
      if (heroCta) gsap.set(heroCta, { autoAlpha: 0, y: 20 });
      if (scrollIndicator) gsap.set(scrollIndicator, { autoAlpha: 0 });

      const tl = gsap.timeline(withWillChange());
      const splits: SplitText[] = [];

      // Step 0: Hero image
      if (heroImage) {
        const step = heroArchiveSequence.steps[0];
        tl.fromTo(heroImage, step.from!, step.to!, step.position);
      }

      // Step 1: Label
      if (heroLabel) {
        const step = heroArchiveSequence.steps[1];
        tl.fromTo(heroLabel, step.from!, step.to!, step.position);
      }

      // Step 2: Title line ("THE")
      if (heroTitleLine) {
        const step = heroArchiveSequence.steps[2];
        const split = new SplitText(heroTitleLine, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });
        splits.push(split);
        tl.fromTo(
          split.lines,
          { yPercent: 100 },
          { yPercent: 0, duration: 1.0, ease: "power3.out", stagger: step.stagger ?? 0.12 },
          step.position,
        );
      }

      // Step 3: Stroke text ("ARCHIVE")
      if (heroTitleStroke) {
        const step = heroArchiveSequence.steps[3];
        const split = new SplitText(heroTitleStroke, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });
        splits.push(split);
        tl.fromTo(
          split.lines,
          { yPercent: 100 },
          { yPercent: 0, duration: 1.0, ease: "power3.out", stagger: step.stagger ?? 0.12 },
          step.position,
        );
      }

      // Step 4: Description
      if (heroDescription) {
        const step = heroArchiveSequence.steps[4];
        tl.fromTo(heroDescription, step.from!, step.to!, step.position);
      }

      // Step 5: CTA button
      if (heroCta) {
        const step = heroArchiveSequence.steps[5];
        tl.fromTo(heroCta, step.from!, step.to!, step.position);
      }

      // Step 6: Scroll indicator
      if (scrollIndicator) {
        const step = heroArchiveSequence.steps[6];
        tl.to(scrollIndicator, { autoAlpha: 1, duration: 0.5, ease: "power3.out" }, step.position);
      }

      return () => {
        splits.forEach((s) => s.revert());
      };
    },
    { scope: containerRef, dependencies: [reduced] },
  );

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Background image */}
      <div className="hero-image absolute inset-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            priority
            className="object-cover grayscale brightness-50"
            sizes="100vw"
            placeholder={blurDataURL ? "blur" : undefined}
            blurDataURL={blurDataURL ?? undefined}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-surface via-background to-background" />
        )}
        {/* Bottom gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content — bottom-aligned */}
      <div className="relative z-10 flex h-full flex-col justify-end px-[var(--container-padding-x)] pb-24 md:pb-32">
        {/* Label */}
        <span className="hero-label mb-6 font-label text-xs uppercase tracking-wider text-primary">
          [ PHOTOGRAPHY WITH INTENTION ]
        </span>

        {/* Title */}
        <h1
          className="font-display font-light uppercase leading-[0.8] text-text-heading"
          style={{ fontSize: "var(--text-hero-display)" }}
        >
          <span className="hero-title-line block">SILK</span>
          <span className="hero-title-stroke text-stroke block">STUDIO</span>
        </h1>

        {/* Description */}
        <p className="hero-description mt-8 max-w-md font-body text-base leading-relaxed text-muted md:text-lg">
          Every frame, earned. Photography built on light, shadow, and the moments that define you.
        </p>

        {/* CTA */}
        <div className="hero-cta mt-8">
          <TransitionLink
            href="/work"
            className="inline-flex items-center justify-center bg-primary px-8 py-3 font-label text-sm uppercase tracking-wider text-background transition-colors duration-300 hover:bg-primary-muted"
          >
            View Work
          </TransitionLink>
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator className="absolute bottom-8 right-8" />
    </section>
  );
}
