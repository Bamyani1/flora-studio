"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { heroNegativeSequence } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";
import { getLocalBlur } from "@/lib/image-manifest";

const seq = heroNegativeSequence;
const blurDataURL = getLocalBlur("/images/hero.jpg");

/* ---------- helpers ---------- */
const perforations = Array.from({ length: 12 });

export function HeroNegative() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const stripInnerEl = root.querySelector<HTMLElement>(".neg-strip-inner");
      const imageEl = root.querySelector<HTMLElement>(".neg-image");
      const topPerfs = root.querySelectorAll<HTMLElement>(".neg-perf-top");
      const bottomPerfs = root.querySelectorAll<HTMLElement>(".neg-perf-bottom");
      const gateEl = root.querySelector<HTMLElement>(".neg-gate");
      const labelEl = root.querySelector<HTMLElement>(".neg-label");
      const titleEl = root.querySelector<HTMLElement>(".neg-title");
      const goldLineEl = root.querySelector<HTMLElement>(".neg-gold-line");
      const frameNumEl = root.querySelector<HTMLElement>(".neg-frame-num");
      const studioNameEl = root.querySelector<HTMLElement>(".neg-studio-name");
      const filmStockEl = root.querySelector<HTMLElement>(".neg-film-stock");
      const ctaEl = root.querySelector<HTMLElement>(".neg-cta");

      // --- Reduced motion: jump to final state ---
      if (reducedMotion) {
        if (stripInnerEl) gsap.set(stripInnerEl, { xPercent: 0, autoAlpha: 1 });
        if (imageEl) gsap.set(imageEl, { filter: "none", autoAlpha: 1 });
        if (topPerfs.length) gsap.set(topPerfs, { autoAlpha: 1 });
        if (bottomPerfs.length) gsap.set(bottomPerfs, { autoAlpha: 1 });
        if (gateEl) gsap.set(gateEl, { clipPath: "inset(0%)", autoAlpha: 1 });
        if (labelEl) gsap.set(labelEl, { autoAlpha: 1 });
        if (titleEl) gsap.set(titleEl, { autoAlpha: 1 });
        if (goldLineEl) gsap.set(goldLineEl, { clipPath: "inset(0 0 0 0)", autoAlpha: 1 });
        if (frameNumEl) gsap.set(frameNumEl, { autoAlpha: 1 });
        if (studioNameEl) gsap.set(studioNameEl, { autoAlpha: 1 });
        if (filmStockEl) gsap.set(filmStockEl, { autoAlpha: 1 });
        if (ctaEl) gsap.set(ctaEl, { autoAlpha: 1 });
        return;
      }

      // --- Set initial states ---
      if (stripInnerEl) gsap.set(stripInnerEl, seq.strip.from);
      if (imageEl) gsap.set(imageEl, seq.negativeToPositive.from);
      if (topPerfs.length) gsap.set(topPerfs, seq.perforations.from);
      if (bottomPerfs.length) gsap.set(bottomPerfs, seq.perforations.from);
      if (gateEl) gsap.set(gateEl, seq.gate.from);
      if (labelEl) gsap.set(labelEl, seq.label.from);
      if (goldLineEl) gsap.set(goldLineEl, seq.goldLine.from);
      if (frameNumEl) gsap.set(frameNumEl, seq.edgeMarks.from);
      if (studioNameEl) gsap.set(studioNameEl, seq.edgeMarks.from);
      if (filmStockEl) gsap.set(filmStockEl, seq.edgeMarks.from);
      if (ctaEl) gsap.set(ctaEl, seq.edgeMarks.from);

      // SplitText for title lines
      let splitTitle: SplitText | null = null;
      if (titleEl) {
        splitTitle = new SplitText(titleEl, seq.titleLines.splitConfig);
        gsap.set(splitTitle.lines, seq.titleLines.from);
      }

      // --- Build timeline ---
      const tl = gsap.timeline();

      // t=0 — Strip slides in from right
      if (stripInnerEl) {
        tl.fromTo(stripInnerEl, seq.strip.from, seq.strip.to, 0);
      }

      // t=0.6 — Image negative-to-positive (THE HERO MOMENT)
      if (imageEl) {
        tl.fromTo(imageEl, seq.negativeToPositive.from, seq.negativeToPositive.to, 0.6);
      }

      // t=1.2 — Perforations stagger fade in (top row then bottom row)
      if (topPerfs.length) {
        tl.to(topPerfs, { ...seq.perforations.to, stagger: seq.perforations.stagger }, 1.2);
      }
      if (bottomPerfs.length) {
        tl.to(
          bottomPerfs,
          { ...seq.perforations.to, stagger: seq.perforations.stagger },
          1.2 + 12 * seq.perforations.stagger,
        );
      }

      // t=1.6 — Gold gate border clip-path reveal
      if (gateEl) {
        tl.fromTo(gateEl, seq.gate.from, seq.gate.to, 1.6);
      }

      // t=2.2 — "CINEMATIC PORTRAITURE" label fade in
      if (labelEl) {
        tl.fromTo(labelEl, seq.label.from, seq.label.to, 2.2);
      }

      // t=2.5 — Title lines SplitText reveal
      if (splitTitle) {
        tl.to(splitTitle.lines, seq.titleLines.to, 2.5);
      }

      // t=3.0 — Gold italic line clip-path wipe
      if (goldLineEl) {
        tl.fromTo(goldLineEl, seq.goldLine.from, seq.goldLine.to, 3.0);
      }

      // t=3.4 — Frame numbers, film stock, CTA fade in
      if (frameNumEl) {
        tl.fromTo(frameNumEl, seq.edgeMarks.from, seq.edgeMarks.to, 3.4);
      }
      if (studioNameEl) {
        tl.fromTo(studioNameEl, seq.edgeMarks.from, seq.edgeMarks.to, 3.4);
      }
      if (filmStockEl) {
        tl.fromTo(filmStockEl, seq.edgeMarks.from, seq.edgeMarks.to, 3.4);
      }
      if (ctaEl) {
        tl.fromTo(ctaEl, seq.edgeMarks.from, seq.edgeMarks.to, 3.4);
      }

      // Cleanup SplitText on unmount
      return () => {
        if (splitTitle) splitTitle.revert();
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
      {/* ---------- "CINEMATIC PORTRAITURE" label ---------- */}
      <span
        className="neg-label mb-10 text-center"
        style={{
          fontFamily: "var(--font-v5-body)",
          fontWeight: 500,
          fontSize: 10,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--color-primary)",
        }}
      >
        CINEMATIC PORTRAITURE
      </span>

      {/* ---------- Film strip band ---------- */}
      <div className="relative w-full overflow-hidden" style={{ height: "42vh", backgroundColor: "var(--color-surface-lowest)" }}>
        {/* Inner content wrapper — animated via xPercent */}
        <div className="neg-strip-inner relative w-full h-full">
          {/* ---- Top perforation row ---- */}
          <div className="absolute top-[6px] left-0 w-full flex justify-around px-8" style={{ zIndex: 20 }}>
            {perforations.map((_, i) => (
              <div
                key={`top-${i}`}
                className="neg-perf-top"
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

          {/* ---- Bottom perforation row ---- */}
          <div className="absolute bottom-[6px] left-0 w-full flex justify-around px-8" style={{ zIndex: 20 }}>
            {perforations.map((_, i) => (
              <div
                key={`bottom-${i}`}
                className="neg-perf-bottom"
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

          {/* ---- Film gate (inner gold border) ---- */}
          <div
            className="neg-gate absolute"
            style={{
              inset: 24,
              border: "2px solid var(--color-primary)",
              zIndex: 15,
            }}
          />

          {/* ---- Hero image (inside gate area) ---- */}
          <div
            className="neg-image absolute"
            style={{
              inset: 26,
              zIndex: 10,
            }}
          >
            <Image
              src="/images/hero.jpg"
              alt="Silk Road Studio — cinematic portraiture"
              fill
              sizes="100vw"
              priority
              className="object-cover"
              {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
            />
          </div>

          {/* ---- Frame number (left edge) ---- */}
          <span
            className="neg-frame-num absolute"
            style={{
              left: 6,
              top: "50%",
              transform: "translateY(-50%) rotate(180deg)",
              writingMode: "vertical-rl",
              fontFamily: "var(--font-v5-body)",
              fontWeight: 400,
              fontSize: 8,
              color: "var(--color-border)",
              zIndex: 25,
            }}
          >
            FRM 001
          </span>

          {/* ---- Studio name (right edge) ---- */}
          <span
            className="neg-studio-name absolute"
            style={{
              right: 6,
              top: "50%",
              transform: "translateY(-50%)",
              writingMode: "vertical-rl",
              fontFamily: "var(--font-v5-body)",
              fontWeight: 400,
              fontSize: 8,
              color: "var(--color-border)",
              zIndex: 25,
            }}
          >
            SILK ROAD STUDIO
          </span>
        </div>
      </div>

      {/* ---------- Title text (below strip) ---------- */}
      <div className="neg-title mt-10 text-center">
        <p
          style={{
            fontFamily: "var(--font-v5-display)",
            fontWeight: 400,
            fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)",
            color: "var(--color-text)",
            lineHeight: 1.3,
          }}
        >
          We tell stories
        </p>
        <div className="neg-gold-line">
          <p
            style={{
              fontFamily: "var(--font-v5-display)",
              fontWeight: 600,
              fontStyle: "italic",
              fontSize: "clamp(2rem, 5vw, 5rem)",
              color: "var(--color-primary)",
              lineHeight: 1.2,
            }}
          >
            in light and shadow
          </p>
        </div>
      </div>

      {/* ---------- Film stock marking (bottom-left) ---------- */}
      <span
        className="neg-film-stock absolute bottom-6 left-12"
        style={{
          fontFamily: "var(--font-v5-body)",
          fontWeight: 400,
          fontSize: 8,
          color: "var(--color-surface)",
        }}
      >
        5219 500T
      </span>

      {/* ---------- CTA (bottom-right) ---------- */}
      <button
        type="button"
        className="neg-cta absolute bottom-6 right-12 group inline-flex items-center gap-2 bg-transparent border-none cursor-pointer"
        style={{
          fontFamily: "var(--font-v5-body)",
          fontWeight: 500,
          fontSize: 10,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--color-primary)",
        }}
      >
        <span className="transition-opacity duration-300 group-hover:opacity-70">VIEW REEL</span>
        <span
          className="inline-block transition-all duration-300 group-hover:opacity-70 group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          &rarr;
        </span>
      </button>
    </section>
  );
}
