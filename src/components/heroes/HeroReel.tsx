"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { heroReelSequence } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";
import { getLocalBlur } from "@/lib/image-manifest";

const seq = heroReelSequence;
const blurDataURL = getLocalBlur("/images/hero.jpg");

/* ---------- helpers ---------- */
const perforationSlots = Array.from({ length: 16 });

const frames = [
  { num: "001", position: "top" as const, filter: "grayscale(0.5)" },
  { num: "002", position: "center" as const, filter: "none" },
  { num: "003", position: "bottom" as const, filter: "sepia(0.2) brightness(1.1)" },
];

export function HeroReel() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const ghostEl = root.querySelector<HTMLElement>(".reel-ghost");
      const stripInnerEl = root.querySelector<HTMLElement>(".reel-strip-inner");
      const frameEls = root.querySelectorAll<HTMLElement>(".reel-frame");
      const leftPerfs = root.querySelectorAll<HTMLElement>(".reel-perf-left");
      const rightPerfs = root.querySelectorAll<HTMLElement>(".reel-perf-right");
      const wordEveryEl = root.querySelector<HTMLElement>(".reel-word-every");
      const wordFrameEl = root.querySelector<HTMLElement>(".reel-word-frame");
      const wordTellsEl = root.querySelector<HTMLElement>(".reel-word-tells");
      const studioLabelEl = root.querySelector<HTMLElement>(".reel-label-studio");
      const filmLabelEl = root.querySelector<HTMLElement>(".reel-label-film");

      // --- Reduced motion: jump to final state ---
      if (reducedMotion) {
        if (ghostEl) gsap.set(ghostEl, { autoAlpha: 0.03 });
        if (stripInnerEl) gsap.set(stripInnerEl, { xPercent: 0, autoAlpha: 1 });
        if (frameEls.length) gsap.set(frameEls, { clipPath: "inset(0 0 0% 0)", autoAlpha: 1 });
        if (leftPerfs.length) gsap.set(leftPerfs, { autoAlpha: 1 });
        if (rightPerfs.length) gsap.set(rightPerfs, { autoAlpha: 1 });
        if (wordEveryEl) gsap.set(wordEveryEl, { x: 0, autoAlpha: 1 });
        if (wordFrameEl) gsap.set(wordFrameEl, { autoAlpha: 1 });
        if (wordTellsEl) gsap.set(wordTellsEl, { x: 0, autoAlpha: 1 });
        if (studioLabelEl) gsap.set(studioLabelEl, { autoAlpha: 1 });
        if (filmLabelEl) gsap.set(filmLabelEl, { autoAlpha: 1 });
        return;
      }

      // --- Set initial states ---
      if (ghostEl) gsap.set(ghostEl, seq.ghostText.from);
      if (stripInnerEl) gsap.set(stripInnerEl, seq.strip.from);
      if (frameEls.length) gsap.set(frameEls, seq.frameReveal.from);
      if (leftPerfs.length) gsap.set(leftPerfs, seq.perforations.from);
      if (rightPerfs.length) gsap.set(rightPerfs, seq.perforations.from);
      if (wordEveryEl) gsap.set(wordEveryEl, seq.wordFade.from);
      if (wordTellsEl) gsap.set(wordTellsEl, seq.wordFade.from);
      if (studioLabelEl) gsap.set(studioLabelEl, seq.label.from);
      if (filmLabelEl) gsap.set(filmLabelEl, seq.label.from);

      // SplitText for "frame"
      let splitFrame: SplitText | null = null;
      if (wordFrameEl) {
        splitFrame = new SplitText(wordFrameEl, seq.wordCenter.splitConfig);
        gsap.set(splitFrame.chars, seq.wordCenter.from);
        gsap.set(wordFrameEl, { autoAlpha: 1 });
      }

      // --- Build timeline ---
      const tl = gsap.timeline();

      // t=0 — Ghost text fades to 3%
      if (ghostEl) {
        tl.fromTo(ghostEl, seq.ghostText.from, seq.ghostText.to, 0);
      }

      // t=0.3 — Strip slides in from right
      if (stripInnerEl) {
        tl.fromTo(stripInnerEl, seq.strip.from, seq.strip.to, 0.3);
      }

      // t=0.8 — Frames clip-path stagger reveal
      if (frameEls.length) {
        tl.to(frameEls, { ...seq.frameReveal.to, stagger: seq.frameReveal.stagger }, 0.8);
      }

      // t=1.5 — "Every" fades in
      if (wordEveryEl) {
        tl.fromTo(wordEveryEl, seq.wordFade.from, seq.wordFade.to, 1.5);
      }

      // t=1.7 — "frame" SplitText chars reveal
      if (splitFrame) {
        tl.to(splitFrame.chars, seq.wordCenter.to, 1.7);
      }

      // t=2.0 — "tells." fades in
      if (wordTellsEl) {
        tl.fromTo(wordTellsEl, seq.wordFade.from, seq.wordFade.to, 2.0);
      }

      // t=2.5 — Perforations stagger in (left then right)
      if (leftPerfs.length) {
        tl.to(leftPerfs, { ...seq.perforations.to, stagger: seq.perforations.stagger }, 2.5);
      }
      if (rightPerfs.length) {
        tl.to(
          rightPerfs,
          { ...seq.perforations.to, stagger: seq.perforations.stagger },
          2.5 + 16 * seq.perforations.stagger,
        );
      }

      // t=3.0 — Labels fade in
      if (studioLabelEl) {
        tl.fromTo(studioLabelEl, seq.label.from, seq.label.to, 3.0);
      }
      if (filmLabelEl) {
        tl.fromTo(filmLabelEl, seq.label.from, seq.label.to, 3.0);
      }

      // Cleanup SplitText on unmount
      return () => {
        if (splitFrame) splitFrame.revert();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "var(--color-surface-deep)" }}
    >
      {/* ---------- Ghost text (background) ---------- */}
      <div
        className="reel-ghost absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: "var(--font-v3-display)",
            fontWeight: 900,
            fontSize: "28vw",
            textTransform: "uppercase",
            color: "var(--color-text-heading)",
            opacity: 0,
            transform: "rotate(-15deg)",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          CINEMATIC
        </span>
      </div>

      {/* ---------- Title text (left side) ---------- */}
      <div className="absolute left-8 lg:left-16 top-1/2 -translate-y-1/2" style={{ zIndex: 20 }}>
        {/* "Every" */}
        <p
          className="reel-word-every"
          style={{
            fontFamily: "var(--font-v3-display)",
            fontWeight: 400,
            fontSize: "clamp(2rem, 4vw, 4rem)",
            color: "var(--color-text-heading)",
            lineHeight: 1.2,
          }}
        >
          Every
        </p>

        {/* "frame" — SplitText target */}
        <p
          className="reel-word-frame"
          style={{
            fontFamily: "var(--font-v3-display)",
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: "clamp(4rem, 10vw, 10rem)",
            color: "var(--color-primary)",
            lineHeight: 1.1,
          }}
        >
          frame
        </p>

        {/* "tells." */}
        <p
          className="reel-word-tells"
          style={{
            fontFamily: "var(--font-v3-display)",
            fontWeight: 400,
            fontSize: "clamp(2rem, 4vw, 4rem)",
            color: "var(--color-text-heading)",
            lineHeight: 1.2,
          }}
        >
          tells.
        </p>
      </div>

      {/* ---------- Vertical film strip (right side) ---------- */}
      <div
        className="absolute right-0 top-0 h-full w-[35vw] overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-lowest)", zIndex: 10 }}
      >
        {/* Inner wrapper — animated xPercent 100→0 */}
        <div className="reel-strip-inner relative w-full h-full">
          {/* ---- Left edge perforations ---- */}
          <div
            className="absolute left-[4px] top-0 h-full flex flex-col justify-around py-4"
            style={{ zIndex: 20 }}
          >
            {perforationSlots.map((_, i) => (
              <div
                key={`left-${i}`}
                className="reel-perf-left"
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

          {/* ---- Right edge perforations ---- */}
          <div
            className="absolute right-[4px] top-0 h-full flex flex-col justify-around py-4"
            style={{ zIndex: 20 }}
          >
            {perforationSlots.map((_, i) => (
              <div
                key={`right-${i}`}
                className="reel-perf-right"
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

          {/* ---- Image frames ---- */}
          <div className="flex flex-col gap-[8px] p-[20px] h-full">
            {frames.map((frame, idx) => (
              <div key={frame.num} className="flex-1 flex flex-col">
                {/* Frame */}
                <div
                  className="reel-frame relative w-full flex-1 overflow-hidden"
                  style={{
                    border: "1px solid var(--color-primary)",
                  }}
                >
                  <Image
                    src="/images/hero.jpg"
                    alt={`Film frame ${frame.num}`}
                    fill
                    sizes="35vw"
                    priority={idx === 0}
                    className="object-cover"
                    style={{
                      objectPosition: frame.position,
                      filter: frame.filter,
                    }}
                    {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
                  />
                </div>

                {/* Frame number */}
                <span
                  className="text-center mt-1"
                  style={{
                    fontFamily: "var(--font-v3-body)",
                    fontWeight: 300,
                    fontSize: 8,
                    color: "var(--color-surface-elevated)",
                  }}
                >
                  {frame.num}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Bottom-left label ---------- */}
      <span
        className="reel-label-studio absolute bottom-8 left-8"
        style={{
          fontFamily: "var(--font-v3-body)",
          fontWeight: 300,
          fontSize: 10,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--color-primary)",
          zIndex: 20,
        }}
      >
        SAFFRON STUDIOS
      </span>

      {/* ---------- Bottom-center label ---------- */}
      <span
        className="reel-label-film absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{
          fontFamily: "var(--font-v3-body)",
          fontWeight: 300,
          fontSize: 8,
          textTransform: "uppercase",
          color: "var(--color-border)",
          zIndex: 20,
        }}
      >
        35MM MOTION PICTURE FILM
      </span>
    </section>
  );
}
