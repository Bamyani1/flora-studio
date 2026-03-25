"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { heroExposureSequence } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";
import { getLocalBlur } from "@/lib/image-manifest";

const seq = heroExposureSequence;
const blurDataURL = getLocalBlur("/images/hero.jpg");

/* ---------- helpers ---------- */
const perforations = Array.from({ length: 10 });

export function HeroExposure() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const stripBgEl = root.querySelector<HTMLElement>(".exp-strip-bg");
      const imageEl = root.querySelector<HTMLElement>(".exp-image");
      const ghostEl = root.querySelector<HTMLElement>(".exp-ghost");
      const topPerfs = root.querySelectorAll<HTMLElement>(".exp-perf-top");
      const bottomPerfs = root.querySelectorAll<HTMLElement>(".exp-perf-bottom");
      const gateEl = root.querySelector<HTMLElement>(".exp-gate");
      const titleEl = root.querySelector<HTMLElement>(".exp-title");
      const goldWordEl = root.querySelector<HTMLElement>(".exp-gold-word");
      const labelEl = root.querySelector<HTMLElement>(".exp-label");
      const filmStockEl = root.querySelector<HTMLElement>(".exp-film-stock");
      const studioNameEl = root.querySelector<HTMLElement>(".exp-studio-name");
      const frameNumEl = root.querySelector<HTMLElement>(".exp-frame-num");
      const expNumEl = root.querySelector<HTMLElement>(".exp-exp-num");

      // --- Reduced motion: jump to final state ---
      if (reducedMotion) {
        if (stripBgEl) gsap.set(stripBgEl, { autoAlpha: 1 });
        if (imageEl) gsap.set(imageEl, { filter: "none", autoAlpha: 1 });
        if (ghostEl) gsap.set(ghostEl, { autoAlpha: 0.6 });
        if (topPerfs.length) gsap.set(topPerfs, { autoAlpha: 1 });
        if (bottomPerfs.length) gsap.set(bottomPerfs, { autoAlpha: 1 });
        if (gateEl) gsap.set(gateEl, { clipPath: "inset(0%)", autoAlpha: 1 });
        if (titleEl) gsap.set(titleEl, { autoAlpha: 1 });
        if (goldWordEl) gsap.set(goldWordEl, { clipPath: "inset(0 0 0 0)", autoAlpha: 1 });
        if (labelEl) gsap.set(labelEl, { autoAlpha: 1 });
        if (filmStockEl) gsap.set(filmStockEl, { autoAlpha: 1 });
        if (studioNameEl) gsap.set(studioNameEl, { autoAlpha: 1 });
        if (frameNumEl) gsap.set(frameNumEl, { autoAlpha: 1 });
        if (expNumEl) gsap.set(expNumEl, { autoAlpha: 1 });
        return;
      }

      // --- Set initial states ---
      if (stripBgEl) gsap.set(stripBgEl, seq.stripBg.from);
      if (imageEl) gsap.set(imageEl, seq.negativeToPositive.from);
      if (ghostEl) gsap.set(ghostEl, seq.ghostOverlay.from);
      if (topPerfs.length) gsap.set(topPerfs, seq.perforations.from);
      if (bottomPerfs.length) gsap.set(bottomPerfs, seq.perforations.from);
      if (gateEl) gsap.set(gateEl, seq.gate.from);
      if (goldWordEl) gsap.set(goldWordEl, seq.goldWord.from);
      if (labelEl) gsap.set(labelEl, seq.label.from);
      if (filmStockEl) gsap.set(filmStockEl, seq.label.from);
      if (studioNameEl) gsap.set(studioNameEl, seq.label.from);
      if (frameNumEl) gsap.set(frameNumEl, seq.label.from);
      if (expNumEl) gsap.set(expNumEl, seq.label.from);

      // SplitText for title lines
      let splitTitle: SplitText | null = null;
      if (titleEl) {
        splitTitle = new SplitText(titleEl, seq.titleLines.splitConfig);
        gsap.set(splitTitle.lines, seq.titleLines.from);
        gsap.set(titleEl, { autoAlpha: 1 });
      }

      // --- Build timeline ---
      const tl = gsap.timeline();

      // t=0 — Strip background fades in
      if (stripBgEl) {
        tl.fromTo(stripBgEl, seq.stripBg.from, seq.stripBg.to, 0);
      }

      // t=0.3 — Image negative-to-positive (THE HERO MOMENT)
      if (imageEl) {
        tl.fromTo(imageEl, seq.negativeToPositive.from, seq.negativeToPositive.to, 0.3);
      }

      // t=0.8 — Ghost text overlay fades to 0.6
      if (ghostEl) {
        tl.fromTo(ghostEl, seq.ghostOverlay.from, seq.ghostOverlay.to, 0.8);
      }

      // t=1.0 — Perforations stagger fade in (top row then bottom row)
      if (topPerfs.length) {
        tl.to(topPerfs, { ...seq.perforations.to, stagger: seq.perforations.stagger }, 1.0);
      }
      if (bottomPerfs.length) {
        tl.to(
          bottomPerfs,
          { ...seq.perforations.to, stagger: seq.perforations.stagger },
          1.0 + 10 * seq.perforations.stagger,
        );
      }

      // t=1.4 — Gold gate border clip-path reveal
      if (gateEl) {
        tl.fromTo(gateEl, seq.gate.from, seq.gate.to, 1.4);
      }

      // t=2.0 — Title lines SplitText reveal
      if (splitTitle) {
        tl.to(splitTitle.lines, seq.titleLines.to, 2.0);
      }

      // t=2.6 — Gold word clip-path wipe
      if (goldWordEl) {
        tl.fromTo(goldWordEl, seq.goldWord.from, seq.goldWord.to, 2.6);
      }

      // t=3.0 — Labels fade in
      if (labelEl) {
        tl.fromTo(labelEl, seq.label.from, seq.label.to, 3.0);
      }
      if (filmStockEl) {
        tl.fromTo(filmStockEl, seq.label.from, seq.label.to, 3.0);
      }
      if (studioNameEl) {
        tl.fromTo(studioNameEl, seq.label.from, seq.label.to, 3.0);
      }
      if (frameNumEl) {
        tl.fromTo(frameNumEl, seq.label.from, seq.label.to, 3.0);
      }
      if (expNumEl) {
        tl.fromTo(expNumEl, seq.label.from, seq.label.to, 3.0);
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
      className="relative min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--color-surface-abyss)" }}
    >
      {/* ---------- "DOUBLE EXPOSURE" label (top-left) ---------- */}
      <span
        className="exp-label absolute top-8 left-8"
        style={{
          fontFamily: "var(--font-v2-body)",
          fontWeight: 500,
          fontSize: 9,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--color-primary)",
        }}
      >
        DOUBLE EXPOSURE
      </span>

      {/* ---------- Film strip container ---------- */}
      <div className="flex flex-col items-center justify-center">
        <div
          className="exp-strip-bg relative overflow-hidden"
          style={{
            width: "80vw",
            height: "55vh",
            backgroundColor: "var(--color-surface-lowest)",
          }}
        >
          {/* ---- Top perforation row ---- */}
          <div
            className="absolute top-[6px] left-0 w-full flex justify-around px-8"
            style={{ zIndex: 20 }}
          >
            {perforations.map((_, i) => (
              <div
                key={`top-${i}`}
                className="exp-perf-top"
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
          <div
            className="absolute bottom-[6px] left-0 w-full flex justify-around px-8"
            style={{ zIndex: 20 }}
          >
            {perforations.map((_, i) => (
              <div
                key={`bottom-${i}`}
                className="exp-perf-bottom"
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
            className="exp-gate absolute"
            style={{
              inset: 20,
              border: "2px solid var(--color-primary)",
              zIndex: 15,
            }}
          />

          {/* ---- Hero image (inside gate area) ---- */}
          <div
            className="exp-image absolute"
            style={{
              inset: 22,
              zIndex: 10,
            }}
          >
            <Image
              src="/images/hero.jpg"
              alt="Saffron Studios — double exposure"
              fill
              sizes="80vw"
              priority
              className="object-cover"
              {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
            />
          </div>

          {/* ---- Ghost text OVER image ---- */}
          <div
            className="exp-ghost absolute flex items-center justify-center pointer-events-none select-none"
            style={{
              inset: 22,
              zIndex: 12,
              mixBlendMode: "overlay",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-v2-display)",
                fontWeight: 600,
                fontSize: "30vw",
                textTransform: "uppercase",
                color: "var(--color-text-heading)",
                lineHeight: 0.85,
                whiteSpace: "nowrap",
              }}
            >
              SAFFRON
            </span>
          </div>

          {/* ---- Frame number (left edge) ---- */}
          <span
            className="exp-frame-num absolute"
            style={{
              left: 6,
              top: "50%",
              transform: "translateY(-50%) rotate(180deg)",
              writingMode: "vertical-rl",
              fontFamily: "var(--font-v2-body)",
              fontWeight: 400,
              fontSize: 8,
              color: "var(--color-border-hover)",
              zIndex: 25,
            }}
          >
            FRM 001
          </span>

          {/* ---- Exposure number (right edge) ---- */}
          <span
            className="exp-exp-num absolute"
            style={{
              right: 6,
              top: "50%",
              transform: "translateY(-50%)",
              writingMode: "vertical-rl",
              fontFamily: "var(--font-v2-body)",
              fontWeight: 400,
              fontSize: 8,
              color: "var(--color-border-hover)",
              zIndex: 25,
            }}
          >
            EXP 001
          </span>
        </div>

        {/* ---------- Title text (below strip) ---------- */}
        <div className="mt-8 text-center">
          <div className="exp-title">
            <p
              style={{
                fontFamily: "var(--font-v2-display)",
                fontWeight: 400,
                fontSize: "clamp(1.5rem, 3vw, 3rem)",
                color: "var(--color-text-heading)",
                lineHeight: 1.3,
              }}
            >
              Where cinema
            </p>
          </div>
          <div className="exp-gold-word">
            <p
              style={{
                fontFamily: "var(--font-v2-display)",
                fontWeight: 600,
                fontStyle: "italic",
                fontSize: "clamp(2rem, 5vw, 5rem)",
                color: "var(--color-primary)",
                lineHeight: 1.2,
              }}
            >
              meets memory
            </p>
          </div>
        </div>
      </div>

      {/* ---------- Bottom bar ---------- */}
      <span
        className="exp-film-stock absolute bottom-6 left-12"
        style={{
          fontFamily: "var(--font-v2-body)",
          fontWeight: 400,
          fontSize: 8,
          color: "var(--color-border)",
        }}
      >
        KODAK VISION3 500T
      </span>

      <span
        className="exp-studio-name absolute bottom-6 right-12"
        style={{
          fontFamily: "var(--font-v2-body)",
          fontWeight: 400,
          fontSize: 8,
          color: "var(--color-border)",
        }}
      >
        SAFFRON STUDIOS
      </span>
    </section>
  );
}
