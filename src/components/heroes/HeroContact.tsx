"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { heroContactSequence } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";
import { getLocalBlur } from "@/lib/image-manifest";

const seq = heroContactSequence;
const blurDataURL = getLocalBlur("/images/hero.jpg");

/* ---------- static data ---------- */
const leftPerforations = Array.from({ length: 8 });
const rightPerforations = Array.from({ length: 8 });

const gridCells = [
  { frame: "01A", objectPosition: "left top" },
  { frame: "02A", objectPosition: "center top" },
  { frame: "03A", objectPosition: "right top" },
  { frame: "04A", objectPosition: "left bottom" },
  { frame: "05A", objectPosition: "center" },
  { frame: "06A", objectPosition: "right bottom" },
];

const SELECTED_INDEX = 3;

export function HeroContact() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const ghostEl = root.querySelector<HTMLElement>(".cs-ghost");
      const cells = root.querySelectorAll<HTMLElement>(".cs-cell");
      const leftPerfs = root.querySelectorAll<HTMLElement>(".cs-perf-left");
      const rightPerfs = root.querySelectorAll<HTMLElement>(".cs-perf-right");
      const circleEl = root.querySelector<HTMLElement>(".cs-circle");
      const selectedImageEl = root.querySelector<HTMLElement>(".cs-selected-image");
      const titleEl = root.querySelector<HTMLElement>(".cs-title");
      const goldWordEl = root.querySelector<HTMLElement>(".cs-gold-word");
      const topLabelEl = root.querySelector<HTMLElement>(".cs-top-label");
      const bottomLabelEl = root.querySelector<HTMLElement>(".cs-bottom-label");

      // --- Reduced motion: jump to final state ---
      if (reducedMotion) {
        if (ghostEl) gsap.set(ghostEl, { autoAlpha: 0.03 });
        if (cells.length) gsap.set(cells, { clipPath: "inset(0 0 0 0)", autoAlpha: 1 });
        if (leftPerfs.length) gsap.set(leftPerfs, { autoAlpha: 1 });
        if (rightPerfs.length) gsap.set(rightPerfs, { autoAlpha: 1 });
        if (circleEl) gsap.set(circleEl, { scale: 1, autoAlpha: 1 });
        if (selectedImageEl) gsap.set(selectedImageEl, { filter: "grayscale(0) contrast(1)" });
        if (titleEl) gsap.set(titleEl, { autoAlpha: 1 });
        if (goldWordEl) gsap.set(goldWordEl, { clipPath: "inset(0 0 0 0)", autoAlpha: 1 });
        if (topLabelEl) gsap.set(topLabelEl, { autoAlpha: 1 });
        if (bottomLabelEl) gsap.set(bottomLabelEl, { autoAlpha: 1 });
        return;
      }

      // --- Set initial states ---
      if (ghostEl) gsap.set(ghostEl, seq.ghostText.from);
      if (cells.length) gsap.set(cells, seq.gridReveal.from);
      if (leftPerfs.length) gsap.set(leftPerfs, seq.perforations.from);
      if (rightPerfs.length) gsap.set(rightPerfs, seq.perforations.from);
      if (circleEl) gsap.set(circleEl, seq.selectionCircle.from);
      if (selectedImageEl) gsap.set(selectedImageEl, seq.selectedSaturate.from);
      if (goldWordEl) gsap.set(goldWordEl, seq.goldWord.from);
      if (topLabelEl) gsap.set(topLabelEl, seq.label.from);
      if (bottomLabelEl) gsap.set(bottomLabelEl, seq.label.from);

      // SplitText for title lines
      let splitTitle: SplitText | null = null;
      if (titleEl) {
        splitTitle = new SplitText(titleEl, seq.titleLines.splitConfig);
        gsap.set(splitTitle.lines, seq.titleLines.from);
      }

      // --- Build timeline ---
      const tl = gsap.timeline();

      // t=0 — Ghost text fades in
      if (ghostEl) {
        tl.fromTo(ghostEl, seq.ghostText.from, seq.ghostText.to, 0);
      }

      // t=0.3 — Grid cells clip-path stagger reveal
      if (cells.length) {
        tl.to(cells, { ...seq.gridReveal.to, stagger: seq.gridReveal.stagger }, 0.3);
      }

      // t=1.0 — Sprocket perforations stagger in
      if (leftPerfs.length) {
        tl.to(leftPerfs, { ...seq.perforations.to, stagger: seq.perforations.stagger }, 1.0);
      }
      if (rightPerfs.length) {
        tl.to(
          rightPerfs,
          { ...seq.perforations.to, stagger: seq.perforations.stagger },
          1.0 + 8 * seq.perforations.stagger,
        );
      }

      // t=1.2 — Gold selection circle elastic reveal
      if (circleEl) {
        tl.fromTo(circleEl, seq.selectionCircle.from, seq.selectionCircle.to, 1.2);
      }

      // t=1.5 — Selected frame saturates (grayscale removed)
      if (selectedImageEl) {
        tl.fromTo(selectedImageEl, seq.selectedSaturate.from, seq.selectedSaturate.to, 1.5);
      }

      // t=2.0 — Title SplitText lines reveal
      if (splitTitle) {
        tl.to(splitTitle.lines, seq.titleLines.to, 2.0);
      }

      // t=2.5 — Gold word clip-path wipe
      if (goldWordEl) {
        tl.fromTo(goldWordEl, seq.goldWord.from, seq.goldWord.to, 2.5);
      }

      // t=3.0 — Labels fade in
      if (topLabelEl) {
        tl.fromTo(topLabelEl, seq.label.from, seq.label.to, 3.0);
      }
      if (bottomLabelEl) {
        tl.fromTo(bottomLabelEl, seq.label.from, seq.label.to, 3.0);
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
      className="relative flex min-h-screen flex-col items-center justify-center"
      style={{ backgroundColor: "var(--color-surface-deep)" }}
    >
      {/* ---------- Ghost text ---------- */}
      <span
        className="cs-ghost pointer-events-none absolute"
        style={{
          fontFamily: "var(--font-v4-display)",
          fontWeight: 400,
          fontSize: "40vw",
          textTransform: "uppercase",
          color: "var(--color-text-heading)",
          lineHeight: 1,
        }}
      >
        PROOF
      </span>

      {/* ---------- Contact sheet container ---------- */}
      <div className="relative flex gap-0">
        {/* ---- Left sprocket column ---- */}
        <div className="flex w-[30px] flex-col justify-around py-8">
          {leftPerforations.map((_, i) => (
            <div
              key={`left-${i}`}
              className="cs-perf-left"
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

        {/* ---- Image grid ---- */}
        <div className="grid grid-cols-3" style={{ gap: 3 }}>
          {gridCells.map((cell, i) => {
            const isSelected = i === SELECTED_INDEX;
            return (
              <div
                key={cell.frame}
                className="cs-cell relative overflow-hidden"
                style={{
                  aspectRatio: "3 / 2",
                  width: 240,
                  border: "1px solid var(--color-border)",
                }}
              >
                {/* Image */}
                <div
                  className={isSelected ? "cs-selected-image" : undefined}
                  style={{
                    position: "absolute",
                    inset: 0,
                    filter: isSelected ? undefined : "grayscale(0.3) contrast(1.1)",
                  }}
                >
                  <Image
                    src="/images/hero.jpg"
                    alt={`Contact sheet frame ${cell.frame}`}
                    fill
                    sizes="240px"
                    priority={i === 0}
                    className="object-cover"
                    style={{ objectPosition: cell.objectPosition }}
                    {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
                  />
                </div>

                {/* Frame number */}
                <span
                  className="absolute bottom-1 left-1"
                  style={{
                    fontFamily: "var(--font-v4-body)",
                    fontWeight: 400,
                    fontSize: 7,
                    color: "var(--color-muted)",
                  }}
                >
                  {cell.frame}
                </span>

                {/* Gold selection circle (only on selected frame) */}
                {isSelected && (
                  <div
                    className="cs-circle absolute rounded-full"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 40,
                      height: 40,
                      border: "2px solid var(--color-primary)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ---- Right sprocket column ---- */}
        <div className="flex w-[30px] flex-col justify-around py-8">
          {rightPerforations.map((_, i) => (
            <div
              key={`right-${i}`}
              className="cs-perf-right"
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
      </div>

      {/* ---------- Title (below contact sheet) ---------- */}
      <div className="cs-title mt-8 text-center">
        <p
          style={{
            fontFamily: "var(--font-v4-display)",
            fontWeight: 400,
            fontSize: "clamp(1.5rem, 3vw, 3rem)",
            color: "var(--color-text-heading)",
            lineHeight: 1.3,
          }}
        >
          Every collection starts
        </p>
        <div className="cs-gold-word">
          <p
            style={{
              fontFamily: "var(--font-v4-display)",
              fontWeight: 400,
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              color: "var(--color-text-heading)",
              lineHeight: 1.2,
            }}
          >
            with a{" "}
            <span style={{ fontStyle: "italic", color: "var(--color-primary)" }}>
              conversation.
            </span>
          </p>
        </div>
      </div>

      {/* ---------- Top label ---------- */}
      <span
        className="cs-top-label absolute top-8 left-1/2 -translate-x-1/2"
        style={{
          fontFamily: "var(--font-v4-body)",
          fontWeight: 400,
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--color-primary)",
        }}
      >
        CONTACT SHEET &middot; ROLL 014
      </span>

      {/* ---------- Bottom label ---------- */}
      <span
        className="cs-bottom-label absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{
          fontFamily: "var(--font-v4-body)",
          fontWeight: 300,
          fontSize: 8,
          color: "var(--color-border)",
        }}
      >
        BAHAR STUDIO &middot; PROCESSED C-41
      </span>
    </section>
  );
}
