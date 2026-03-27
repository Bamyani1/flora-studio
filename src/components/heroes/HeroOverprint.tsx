"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { heroOverprintSequence } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";

const seq = heroOverprintSequence;

export function HeroOverprint() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const ghostEl = root.querySelector<HTMLElement>(".hero-ghost");
      const line1El = root.querySelector<HTMLElement>(".hero-line1");
      const line2El = root.querySelector<HTMLElement>(".hero-line2");
      const line3El = root.querySelector<HTMLElement>(".hero-line3");
      const goldRuleEl = root.querySelector<HTMLElement>(".hero-gold-rule");
      const ctaEl = root.querySelector<HTMLElement>(".hero-cta");

      // --- Reduced motion: jump to final state ---
      if (reducedMotion) {
        if (ghostEl) gsap.set(ghostEl, seq.ghostText.to);
        if (line1El) gsap.set(line1El, { autoAlpha: 1 });
        if (line2El) gsap.set(line2El, { clipPath: "inset(0 0 0 0)", autoAlpha: 1 });
        if (line3El) gsap.set(line3El, { autoAlpha: 1, y: 0 });
        if (goldRuleEl) gsap.set(goldRuleEl, { scaleY: 1 });
        if (ctaEl) gsap.set(ctaEl, { autoAlpha: 1 });
        return;
      }

      // --- Set initial states ---
      if (ghostEl) gsap.set(ghostEl, seq.ghostText.from);
      if (line2El) gsap.set(line2El, seq.accentLine.from);
      if (line3El) gsap.set(line3El, seq.subtitleFade.from);
      if (goldRuleEl) gsap.set(goldRuleEl, seq.goldRule.from);
      if (ctaEl) gsap.set(ctaEl, seq.cta.from);

      // SplitText for line 1 (word-masked reveal)
      let splitLine1: SplitText | null = null;
      if (line1El) {
        splitLine1 = new SplitText(line1El, seq.taglineWords.splitConfig);
        gsap.set(splitLine1.words, seq.taglineWords.from);
      }

      // --- Build timeline ---
      const tl = gsap.timeline();

      // t=0 — Ghost text fade in
      if (ghostEl) {
        tl.fromTo(ghostEl, seq.ghostText.from, seq.ghostText.to, 0);
      }

      // t=0.3 — Line 1 words reveal via SplitText
      if (splitLine1) {
        tl.to(splitLine1.words, seq.taglineWords.to, 0.3);
      }

      // t=0.8 — Line 2 "legacy" clip-path reveal
      if (line2El) {
        tl.fromTo(line2El, seq.accentLine.from, seq.accentLine.to, 0.8);
      }

      // t=1.2 — Line 3 fade up
      if (line3El) {
        tl.fromTo(line3El, seq.subtitleFade.from, seq.subtitleFade.to, 1.2);
      }

      // t=1.8 — Gold vertical rule scale in
      if (goldRuleEl) {
        tl.fromTo(goldRuleEl, seq.goldRule.from, seq.goldRule.to, 1.8);
      }

      // t=2.2 — CTA fade in
      if (ctaEl) {
        tl.fromTo(ctaEl, seq.cta.from, seq.cta.to, 2.2);
      }

      // Cleanup SplitText on unmount
      return () => {
        if (splitLine1) splitLine1.revert();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{ backgroundColor: "var(--color-surface-lowest)" }}
    >
      {/* Ghost background text */}
      <div
        className="hero-ghost absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: "var(--font-v1-display)",
            fontSize: "35vw",
            fontWeight: 900,
            textTransform: "uppercase",
            color: "var(--color-text-heading)",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          BAHAR
        </span>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 w-full px-8 md:px-16 lg:px-24" style={{ paddingTop: "40vh" }}>
        {/* Line 1: "Where light meets" */}
        <p
          className="hero-line1"
          style={{
            fontFamily: "var(--font-v1-display)",
            fontWeight: 400,
            fontSize: "clamp(2rem, 6vw, 7rem)",
            color: "var(--color-text-heading)",
            lineHeight: 1.1,
          }}
        >
          Where light meets
        </p>

        {/* Line 2: "legacy" — italic gold accent */}
        <p
          className="hero-line2"
          style={{
            fontFamily: "var(--font-v1-display)",
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: "clamp(3rem, 10vw, 12rem)",
            color: "var(--color-primary)",
            lineHeight: 1.05,
            marginLeft: "-0.5vw",
          }}
        >
          legacy
        </p>

        {/* Line 3: "we craft your story." */}
        <p
          className="hero-line3"
          style={{
            fontFamily: "var(--font-v1-display)",
            fontWeight: 400,
            fontSize: "clamp(1.5rem, 4vw, 5rem)",
            color: "var(--color-text-heading)",
            lineHeight: 1.2,
            textAlign: "right",
            marginTop: "0.5rem",
          }}
        >
          we make it count.
        </p>

        {/* Decorative gold vertical rule */}
        <div className="flex justify-center mt-12">
          <div
            className="hero-gold-rule"
            style={{
              width: 1,
              height: 80,
              backgroundColor: "var(--color-primary)",
              transformOrigin: "top center",
            }}
          />
        </div>
      </div>

      {/* CTA at bottom */}
      <div className="hero-cta absolute bottom-0 left-0 w-full flex justify-center pb-12">
        <Button
          type="button"
          variant="outline-accent"
          size="xs"
          className="gap-3"
          style={{ fontFamily: "var(--font-v1-body)" }}
        >
          EXPLORE THE STUDIO <span aria-hidden="true">&rarr;</span>
        </Button>
      </div>
    </section>
  );
}
