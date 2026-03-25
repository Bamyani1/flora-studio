"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { heroSpliceSequence } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";
import { getLocalBlur } from "@/lib/image-manifest";

const seq = heroSpliceSequence;
const blurDataURL = getLocalBlur("/images/hero.jpg");

/* ---------- helpers ---------- */
const perforations = Array.from({ length: 10 });

export function HeroSplice() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const ghostEl = root.querySelector<HTMLElement>(".spl-ghost");
      const stripTopInner = root.querySelector<HTMLElement>(".spl-strip-top-inner");
      const stripBottomInner = root.querySelector<HTMLElement>(".spl-strip-bottom-inner");
      const imageTopEl = root.querySelector<HTMLElement>(".spl-image-top");
      const imageBottomEl = root.querySelector<HTMLElement>(".spl-image-bottom");
      const topPerfsTop = root.querySelectorAll<HTMLElement>(".spl-perf-top-t");
      const topPerfsBottom = root.querySelectorAll<HTMLElement>(".spl-perf-top-b");
      const bottomPerfsTop = root.querySelectorAll<HTMLElement>(".spl-perf-bot-t");
      const bottomPerfsBottom = root.querySelectorAll<HTMLElement>(".spl-perf-bot-b");
      const gateTopEl = root.querySelector<HTMLElement>(".spl-gate-top");
      const gateBottomEl = root.querySelector<HTMLElement>(".spl-gate-bottom");
      const spliceLeftEl = root.querySelector<HTMLElement>(".spl-mark-left");
      const spliceRightEl = root.querySelector<HTMLElement>(".spl-mark-right");
      const ruleTopEl = root.querySelector<HTMLElement>(".spl-rule-top");
      const ruleBottomEl = root.querySelector<HTMLElement>(".spl-rule-bottom");
      const betweenEl = root.querySelector<HTMLElement>(".spl-between");
      const framesEl = root.querySelector<HTMLElement>(".spl-frames");
      const storyEl = root.querySelector<HTMLElement>(".spl-story");
      const metaLeftEl = root.querySelector<HTMLElement>(".spl-meta-left");
      const metaRightEl = root.querySelector<HTMLElement>(".spl-meta-right");

      // --- Reduced motion: jump to final state ---
      if (reducedMotion) {
        if (ghostEl) gsap.set(ghostEl, { autoAlpha: 0.025 });
        if (stripTopInner) gsap.set(stripTopInner, { xPercent: 0, autoAlpha: 1 });
        if (stripBottomInner) gsap.set(stripBottomInner, { xPercent: 0, autoAlpha: 1 });
        if (imageTopEl) gsap.set(imageTopEl, { filter: "none", autoAlpha: 1 });
        if (imageBottomEl) gsap.set(imageBottomEl, { filter: "none", autoAlpha: 1 });
        if (topPerfsTop.length) gsap.set(topPerfsTop, { autoAlpha: 1 });
        if (topPerfsBottom.length) gsap.set(topPerfsBottom, { autoAlpha: 1 });
        if (bottomPerfsTop.length) gsap.set(bottomPerfsTop, { autoAlpha: 1 });
        if (bottomPerfsBottom.length) gsap.set(bottomPerfsBottom, { autoAlpha: 1 });
        if (gateTopEl) gsap.set(gateTopEl, { clipPath: "inset(0%)", autoAlpha: 1 });
        if (gateBottomEl) gsap.set(gateBottomEl, { clipPath: "inset(0%)", autoAlpha: 1 });
        if (spliceLeftEl) gsap.set(spliceLeftEl, { scale: 1, autoAlpha: 1 });
        if (spliceRightEl) gsap.set(spliceRightEl, { scale: 1, autoAlpha: 1 });
        if (ruleTopEl) gsap.set(ruleTopEl, { scaleX: 1, autoAlpha: 1 });
        if (ruleBottomEl) gsap.set(ruleBottomEl, { scaleX: 1, autoAlpha: 1 });
        if (betweenEl) gsap.set(betweenEl, { autoAlpha: 1 });
        if (framesEl) gsap.set(framesEl, { autoAlpha: 1 });
        if (storyEl) gsap.set(storyEl, { autoAlpha: 1 });
        if (metaLeftEl) gsap.set(metaLeftEl, { autoAlpha: 1 });
        if (metaRightEl) gsap.set(metaRightEl, { autoAlpha: 1 });
        return;
      }

      // --- Set initial states ---
      if (ghostEl) gsap.set(ghostEl, seq.ghostText.from);
      if (stripTopInner) gsap.set(stripTopInner, seq.stripTop.from);
      if (stripBottomInner) gsap.set(stripBottomInner, seq.stripBottom.from);
      if (imageTopEl) gsap.set(imageTopEl, seq.negativeToPositive.from);
      if (imageBottomEl) gsap.set(imageBottomEl, seq.negativeToPositive.from);
      if (topPerfsTop.length) gsap.set(topPerfsTop, seq.perforations.from);
      if (topPerfsBottom.length) gsap.set(topPerfsBottom, seq.perforations.from);
      if (bottomPerfsTop.length) gsap.set(bottomPerfsTop, seq.perforations.from);
      if (bottomPerfsBottom.length) gsap.set(bottomPerfsBottom, seq.perforations.from);
      if (gateTopEl) gsap.set(gateTopEl, seq.gate.from);
      if (gateBottomEl) gsap.set(gateBottomEl, seq.gate.from);
      if (spliceLeftEl) gsap.set(spliceLeftEl, seq.spliceMark.from);
      if (spliceRightEl) gsap.set(spliceRightEl, seq.spliceMark.from);
      if (ruleTopEl) gsap.set(ruleTopEl, seq.gapRule.from);
      if (ruleBottomEl) gsap.set(ruleBottomEl, seq.gapRule.from);
      if (betweenEl) gsap.set(betweenEl, seq.textFade.from);
      if (storyEl) gsap.set(storyEl, seq.subtitleFade.from);
      if (metaLeftEl) gsap.set(metaLeftEl, seq.metadata.from);
      if (metaRightEl) gsap.set(metaRightEl, seq.metadata.from);

      // SplitText for "frames"
      let splitFrames: SplitText | null = null;
      if (framesEl) {
        gsap.set(framesEl, { autoAlpha: 1 });
        splitFrames = new SplitText(framesEl, seq.titleChars.splitConfig);
        gsap.set(splitFrames.chars, seq.titleChars.from);
      }

      // --- Build timeline ---
      const tl = gsap.timeline();

      // t=0 — Ghost "CUT" text
      if (ghostEl) {
        tl.fromTo(ghostEl, seq.ghostText.from, seq.ghostText.to, 0);
      }

      // t=0.2 — Both strips slide from opposite sides
      if (stripTopInner) {
        tl.fromTo(stripTopInner, seq.stripTop.from, seq.stripTop.to, 0.2);
      }
      if (stripBottomInner) {
        tl.fromTo(stripBottomInner, seq.stripBottom.from, seq.stripBottom.to, 0.2);
      }

      // t=0.8 — Images negative→positive
      if (imageTopEl) {
        tl.fromTo(imageTopEl, seq.negativeToPositive.from, seq.negativeToPositive.to, 0.8);
      }
      if (imageBottomEl) {
        tl.fromTo(imageBottomEl, seq.negativeToPositive.from, seq.negativeToPositive.to, 0.8);
      }

      // t=1.2 — Perforations stagger (top strip)
      if (topPerfsTop.length) {
        tl.to(topPerfsTop, { ...seq.perforations.to, stagger: seq.perforations.stagger }, 1.2);
      }
      if (topPerfsBottom.length) {
        tl.to(topPerfsBottom, { ...seq.perforations.to, stagger: seq.perforations.stagger }, 1.2);
      }
      // Perforations (bottom strip)
      if (bottomPerfsTop.length) {
        tl.to(bottomPerfsTop, { ...seq.perforations.to, stagger: seq.perforations.stagger }, 1.2);
      }
      if (bottomPerfsBottom.length) {
        tl.to(
          bottomPerfsBottom,
          { ...seq.perforations.to, stagger: seq.perforations.stagger },
          1.2,
        );
      }

      // t=1.5 — Gold gates clip-path reveal
      if (gateTopEl) {
        tl.fromTo(gateTopEl, seq.gate.from, seq.gate.to, 1.5);
      }
      if (gateBottomEl) {
        tl.fromTo(gateBottomEl, seq.gate.from, seq.gate.to, 1.5);
      }

      // t=1.8 — Splice marks elastic
      if (spliceLeftEl) {
        tl.fromTo(spliceLeftEl, seq.spliceMark.from, seq.spliceMark.to, 1.8);
      }
      if (spliceRightEl) {
        tl.fromTo(spliceRightEl, seq.spliceMark.from, seq.spliceMark.to, 1.8);
      }

      // t=2.0 — Gap gold rules scaleX from center
      if (ruleTopEl) {
        tl.fromTo(ruleTopEl, seq.gapRule.from, seq.gapRule.to, 2.0);
      }
      if (ruleBottomEl) {
        tl.fromTo(ruleBottomEl, seq.gapRule.from, seq.gapRule.to, 2.0);
      }

      // t=2.2 — "Between the" fades in
      if (betweenEl) {
        tl.fromTo(betweenEl, seq.textFade.from, seq.textFade.to, 2.2);
      }

      // t=2.4 — "frames" SplitText chars
      if (splitFrames) {
        tl.to(splitFrames.chars, seq.titleChars.to, 2.4);
      }

      // t=2.8 — "we find the story." fades up
      if (storyEl) {
        tl.fromTo(storyEl, seq.subtitleFade.from, seq.subtitleFade.to, 2.8);
      }

      // t=3.2 — Metadata + CTA
      if (metaLeftEl) {
        tl.fromTo(metaLeftEl, seq.metadata.from, seq.metadata.to, 3.2);
      }
      if (metaRightEl) {
        tl.fromTo(metaRightEl, seq.metadata.from, seq.metadata.to, 3.2);
      }

      // Cleanup SplitText on unmount
      return () => {
        if (splitFrames) splitFrames.revert();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "var(--color-surface-abyss)" }}
    >
      {/* ---------- Ghost text "CUT" ---------- */}
      <span
        className="spl-ghost absolute pointer-events-none select-none"
        style={{
          fontFamily: "var(--font-v5-display)",
          fontWeight: 600,
          fontSize: "50vw",
          textTransform: "uppercase",
          color: "white",
          opacity: 0,
          lineHeight: 1,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        CUT
      </span>

      {/* ========== TOP FILM STRIP ========== */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "25vh", backgroundColor: "var(--color-surface-lowest)" }}
      >
        <div className="spl-strip-top-inner relative w-full h-full">
          {/* Top perforations */}
          <div
            className="absolute top-[4px] left-0 w-full flex justify-around px-6"
            style={{ zIndex: 20 }}
          >
            {perforations.map((_, i) => (
              <div
                key={`tt-${i}`}
                className="spl-perf-top-t"
                style={{
                  width: 8,
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-surface-elevated)",
                }}
              />
            ))}
          </div>

          {/* Bottom perforations */}
          <div
            className="absolute bottom-[4px] left-0 w-full flex justify-around px-6"
            style={{ zIndex: 20 }}
          >
            {perforations.map((_, i) => (
              <div
                key={`tb-${i}`}
                className="spl-perf-top-b"
                style={{
                  width: 8,
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-surface-elevated)",
                }}
              />
            ))}
          </div>

          {/* Gold gate */}
          <div
            className="spl-gate-top absolute"
            style={{
              inset: 16,
              border: "2px solid var(--color-primary)",
              zIndex: 15,
            }}
          />

          {/* Hero image (top half) */}
          <div
            className="spl-image-top absolute"
            style={{
              inset: 18,
              zIndex: 10,
            }}
          >
            <Image
              src="/images/hero.jpg"
              alt="Saffron Studios — portraiture"
              fill
              sizes="100vw"
              priority
              className="object-cover"
              style={{ objectPosition: "top" }}
              {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
            />
          </div>

          {/* Right edge mark */}
          <span
            className="absolute"
            style={{
              right: 6,
              top: "50%",
              transform: "translateY(-50%) rotate(180deg)",
              writingMode: "vertical-rl",
              fontFamily: "var(--font-v5-body)",
              fontWeight: 400,
              fontSize: 8,
              color: "var(--color-surface-elevated)",
              zIndex: 25,
            }}
          >
            FRM 014
          </span>
        </div>
      </div>

      {/* ========== GAP / SPLICE ZONE ========== */}
      <div className="relative w-full flex items-center justify-center" style={{ height: "20vh" }}>
        {/* Top gold rule */}
        <div
          className="spl-rule-top absolute top-0 left-0 w-full"
          style={{
            height: 1,
            backgroundColor: "var(--color-primary)",
            opacity: 0.3,
            transformOrigin: "center",
          }}
        />

        {/* Bottom gold rule */}
        <div
          className="spl-rule-bottom absolute bottom-0 left-0 w-full"
          style={{
            height: 1,
            backgroundColor: "var(--color-primary)",
            opacity: 0.3,
            transformOrigin: "center",
          }}
        />

        {/* Splice mark — left */}
        <div
          className="spl-mark-left absolute"
          style={{
            left: 20,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {/* Two small gold triangles pointing right */}
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "4px solid transparent",
              borderBottom: "4px solid transparent",
              borderLeft: "8px solid var(--color-primary)",
            }}
          />
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "4px solid transparent",
              borderBottom: "4px solid transparent",
              borderLeft: "8px solid var(--color-primary)",
            }}
          />
        </div>

        {/* Splice mark — right */}
        <div
          className="spl-mark-right absolute"
          style={{
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {/* Two small gold triangles pointing left */}
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "4px solid transparent",
              borderBottom: "4px solid transparent",
              borderRight: "8px solid var(--color-primary)",
            }}
          />
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "4px solid transparent",
              borderBottom: "4px solid transparent",
              borderRight: "8px solid var(--color-primary)",
            }}
          />
        </div>

        {/* Title text — centered */}
        <div className="text-center" style={{ zIndex: 10 }}>
          <p
            className="spl-between"
            style={{
              fontFamily: "var(--font-v5-display)",
              fontWeight: 400,
              fontSize: "clamp(1rem, 2.5vw, 2rem)",
              color: "white",
              lineHeight: 1.3,
            }}
          >
            Between the
          </p>
          <p
            className="spl-frames"
            style={{
              fontFamily: "var(--font-v5-display)",
              fontWeight: 600,
              fontStyle: "italic",
              fontSize: "clamp(3rem, 12vw, 10rem)",
              color: "var(--color-primary)",
              lineHeight: 1.1,
            }}
          >
            frames
          </p>
          <p
            className="spl-story"
            style={{
              fontFamily: "var(--font-v5-display)",
              fontWeight: 400,
              fontSize: "clamp(0.8rem, 1.5vw, 1.2rem)",
              color: "color-mix(in srgb, var(--color-text-heading) 60%, transparent)",
              lineHeight: 1.4,
            }}
          >
            we find the frame.
          </p>
        </div>
      </div>

      {/* ========== BOTTOM FILM STRIP ========== */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "25vh", backgroundColor: "var(--color-surface-lowest)" }}
      >
        <div className="spl-strip-bottom-inner relative w-full h-full">
          {/* Top perforations */}
          <div
            className="absolute top-[4px] left-0 w-full flex justify-around px-6"
            style={{ zIndex: 20 }}
          >
            {perforations.map((_, i) => (
              <div
                key={`bt-${i}`}
                className="spl-perf-bot-t"
                style={{
                  width: 8,
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-surface-elevated)",
                }}
              />
            ))}
          </div>

          {/* Bottom perforations */}
          <div
            className="absolute bottom-[4px] left-0 w-full flex justify-around px-6"
            style={{ zIndex: 20 }}
          >
            {perforations.map((_, i) => (
              <div
                key={`bb-${i}`}
                className="spl-perf-bot-b"
                style={{
                  width: 8,
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-surface-elevated)",
                }}
              />
            ))}
          </div>

          {/* Gold gate */}
          <div
            className="spl-gate-bottom absolute"
            style={{
              inset: 16,
              border: "2px solid var(--color-primary)",
              zIndex: 15,
            }}
          />

          {/* Hero image (bottom half) */}
          <div
            className="spl-image-bottom absolute"
            style={{
              inset: 18,
              zIndex: 10,
            }}
          >
            <Image
              src="/images/hero.jpg"
              alt="Saffron Studios — portraiture"
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "bottom" }}
              {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
            />
          </div>

          {/* Left edge mark */}
          <span
            className="absolute"
            style={{
              left: 6,
              top: "50%",
              transform: "translateY(-50%) rotate(180deg)",
              writingMode: "vertical-rl",
              fontFamily: "var(--font-v5-body)",
              fontWeight: 400,
              fontSize: 8,
              color: "var(--color-surface-elevated)",
              zIndex: 25,
            }}
          >
            SAFFRON
          </span>
        </div>
      </div>

      {/* ========== BOTTOM METADATA ========== */}
      <div className="absolute bottom-4 left-0 w-full px-8 flex justify-between items-center">
        <span
          className="spl-meta-left"
          style={{
            fontFamily: "var(--font-v5-body)",
            fontWeight: 400,
            fontSize: 8,
            color: "var(--color-surface-elevated)",
          }}
        >
          EDITED ON STEENBECK &middot; ROLL 014 &middot; SAFFRON STUDIOS
        </span>
        <button
          type="button"
          className="spl-meta-right group inline-flex items-center gap-2 bg-transparent border-none cursor-pointer"
          style={{
            fontFamily: "var(--font-v5-body)",
            fontWeight: 500,
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-primary)",
          }}
        >
          <span className="transition-opacity duration-300 group-hover:opacity-70">
            WATCH THE CUT
          </span>
          <span
            className="inline-block transition-all duration-300 group-hover:opacity-70 group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            &rarr;
          </span>
        </button>
      </div>
    </section>
  );
}
