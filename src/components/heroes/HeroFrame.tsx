"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { heroFrameSequence } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";
import { getLocalBlur } from "@/lib/image-manifest";

const seq = heroFrameSequence;
const blurDataURL = getLocalBlur("/images/hero.jpg");

export function HeroFrame() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const bgImageEl = root.querySelector<HTMLElement>(".frame-bg-image");
      const diagonalEl = root.querySelector<HTMLElement>(".frame-diagonal");
      const fgFrameEl = root.querySelector<HTMLElement>(".frame-fg");
      const titleEl = root.querySelector<HTMLElement>(".frame-title");
      const labelEl = root.querySelector<HTMLElement>(".frame-label");
      const metaLeftEl = root.querySelector<HTMLElement>(".frame-meta-left");
      const metaRightEl = root.querySelector<HTMLElement>(".frame-meta-right");

      // --- Reduced motion: jump to final state ---
      if (reducedMotion) {
        if (bgImageEl) gsap.set(bgImageEl, { autoAlpha: 1, scale: 1 });
        if (diagonalEl) gsap.set(diagonalEl, { scaleX: 1 });
        if (fgFrameEl) gsap.set(fgFrameEl, { clipPath: "inset(0 0 0 0)", autoAlpha: 1 });
        if (titleEl) gsap.set(titleEl, { autoAlpha: 1 });
        if (labelEl) gsap.set(labelEl, { autoAlpha: 1 });
        if (metaLeftEl) gsap.set(metaLeftEl, { autoAlpha: 1 });
        if (metaRightEl) gsap.set(metaRightEl, { autoAlpha: 1 });
        return;
      }

      // --- Set initial states ---
      if (bgImageEl) gsap.set(bgImageEl, seq.bgImage.from);
      if (diagonalEl) gsap.set(diagonalEl, seq.diagonal.from);
      if (fgFrameEl) gsap.set(fgFrameEl, seq.fgFrame.from);
      if (labelEl) gsap.set(labelEl, seq.label.from);
      if (metaLeftEl) gsap.set(metaLeftEl, seq.metadata.from);
      if (metaRightEl) gsap.set(metaRightEl, seq.metadata.from);

      // SplitText for title chars
      let splitTitle: SplitText | null = null;
      if (titleEl) {
        splitTitle = new SplitText(titleEl, {
          ...seq.title.splitConfig,
          mask: "chars",
        });
        gsap.set(splitTitle.chars, seq.title.from);
      }

      // --- Build timeline ---
      const tl = gsap.timeline();

      // t=0 — Background image fade + scale
      if (bgImageEl) {
        tl.fromTo(bgImageEl, seq.bgImage.from, seq.bgImage.to, 0);
      }

      // t=0.4 — Diagonal gold line scaleX
      if (diagonalEl) {
        tl.fromTo(
          diagonalEl,
          seq.diagonal.from,
          { ...seq.diagonal.to, transformOrigin: "center center" },
          0.4,
        );
      }

      // t=0.7 — Foreground frame clip-path wipe from left
      if (fgFrameEl) {
        tl.fromTo(fgFrameEl, seq.fgFrame.from, seq.fgFrame.to, 0.7);
      }

      // t=1.0 — Title chars masked reveal
      if (splitTitle) {
        tl.to(splitTitle.chars, seq.title.to, 1.0);
      }

      // t=2.0 — "STUDIO" label fade in
      if (labelEl) {
        tl.fromTo(labelEl, seq.label.from, seq.label.to, 2.0);
      }

      // t=2.5 — Metadata bar fade in
      if (metaLeftEl) {
        tl.fromTo(metaLeftEl, seq.metadata.from, seq.metadata.to, 2.5);
      }
      if (metaRightEl) {
        tl.fromTo(metaRightEl, seq.metadata.from, seq.metadata.to, 2.5);
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
      className="relative h-screen overflow-hidden"
      style={{ backgroundColor: "var(--color-surface-deep)" }}
    >
      {/* Layer 1 — Background image (z-10) */}
      <div
        className="frame-bg-image absolute inset-0"
        style={{
          zIndex: 10,
          filter: "grayscale(100%) brightness(0.25) contrast(1.2)",
        }}
      >
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
          {...(blurDataURL
            ? { placeholder: "blur" as const, blurDataURL }
            : {})}
        />
      </div>

      {/* Layer 2 — Diagonal gold line (z-20) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 20 }}
      >
        <div
          className="frame-diagonal absolute"
          style={{
            width: "150%",
            height: 1,
            backgroundColor: "var(--color-primary)",
            opacity: 0.35,
            transform: "rotate(25deg)",
            left: "-25%",
            top: "50%",
          }}
        />
      </div>

      {/* Layer 3 — Title "SILK ROAD" (z-30, behind the foreground frame) */}
      <h1
        className="frame-title absolute overflow-hidden px-12 lg:px-24"
        style={{
          zIndex: 30,
          top: "32%",
          fontFamily: "var(--font-v2-display)",
          fontWeight: 500,
          fontSize: "clamp(5rem, 18vw, 20rem)",
          color: "var(--color-text-heading)",
          textTransform: "uppercase",
          lineHeight: 0.85,
        }}
      >
        SILK ROAD
      </h1>

      {/* Layer 4 — Foreground image frame (z-40, above the title) */}
      <div
        className="frame-fg absolute overflow-hidden"
        style={{
          zIndex: 40,
          right: "8%",
          top: "18%",
          width: "50vw",
          height: "55vh",
          border: "1px solid var(--color-primary)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        <Image
          src="/images/hero.jpg"
          alt="Silk Road Studio — cinematic portraiture"
          fill
          sizes="50vw"
          priority
          className="object-cover"
          style={{ filter: "saturate(1.1) contrast(1.05)" }}
          {...(blurDataURL
            ? { placeholder: "blur" as const, blurDataURL }
            : {})}
        />
      </div>

      {/* "STUDIO" label (z-50) */}
      <span
        className="frame-label absolute px-12 lg:px-24"
        style={{
          zIndex: 50,
          top: "calc(32% + clamp(5rem, 18vw, 20rem) * 0.85 + 1rem)",
          fontFamily: "var(--font-v2-body)",
          fontWeight: 500,
          fontSize: 12,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "var(--color-primary)",
        }}
      >
        STUDIO
      </span>

      {/* Bottom metadata bar (z-50) */}
      <div
        className="absolute bottom-10 w-full px-12 lg:px-24 flex justify-between"
        style={{ zIndex: 50 }}
      >
        <span
          className="frame-meta-left"
          style={{
            fontFamily: "var(--font-v2-body)",
            fontWeight: 400,
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "color-mix(in srgb, var(--color-text-heading) 35%, transparent)",
          }}
        >
          CINEMATIC PORTRAITURE
        </span>
        <span
          className="frame-meta-right"
          style={{
            fontFamily: "var(--font-v2-body)",
            fontWeight: 400,
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "color-mix(in srgb, var(--color-text-heading) 35%, transparent)",
          }}
        >
          EST 2024 &middot; LOS ANGELES
        </span>
      </div>
    </section>
  );
}
