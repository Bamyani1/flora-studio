"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { heroParallaxSequence } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";
import { getLocalBlur } from "@/lib/image-manifest";

const seq = heroParallaxSequence;
const blurDataURL = getLocalBlur("/images/hero.jpg");

export function HeroParallax() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const ghostEl = root.querySelector<HTMLElement>(".plx-ghost");
      const imageEl = root.querySelector<HTMLElement>(".plx-image");
      const wordLeftEl = root.querySelector<HTMLElement>(".plx-word-left");
      const wordCenterEl = root.querySelector<HTMLElement>(".plx-word-center");
      const wordRightEl = root.querySelector<HTMLElement>(".plx-word-right");
      const uiTopLeftEl = root.querySelector<HTMLElement>(".plx-ui-top-left");
      const uiScrollEl = root.querySelector<HTMLElement>(".plx-ui-scroll");
      const scrollLineEl = root.querySelector<HTMLElement>(".plx-scroll-line");

      const layer0El = root.querySelector<HTMLElement>(".plx-layer0");
      const layer2El = root.querySelector<HTMLElement>(".plx-layer2");
      const layer3El = root.querySelector<HTMLElement>(".plx-layer3");

      // --- Reduced motion: jump to final state ---
      if (reducedMotion) {
        if (ghostEl) gsap.set(ghostEl, { autoAlpha: 0.025 });
        if (imageEl)
          gsap.set(imageEl, {
            autoAlpha: 1,
            scale: 1.05,
            filter: "blur(0px) brightness(1)",
          });
        if (wordLeftEl) gsap.set(wordLeftEl, { autoAlpha: 1, x: 0 });
        if (wordCenterEl) gsap.set(wordCenterEl, { autoAlpha: 1 });
        if (wordRightEl) gsap.set(wordRightEl, { autoAlpha: 1, x: 0 });
        if (uiTopLeftEl) gsap.set(uiTopLeftEl, { autoAlpha: 1 });
        if (uiScrollEl) gsap.set(uiScrollEl, { autoAlpha: 1 });
        return;
      }

      // --- Set initial states ---
      if (ghostEl) gsap.set(ghostEl, seq.ghostText.from);
      if (imageEl) gsap.set(imageEl, seq.image.from);
      if (wordLeftEl) gsap.set(wordLeftEl, seq.wordLeft.from);
      if (wordRightEl) gsap.set(wordRightEl, seq.wordRight.from);
      if (uiTopLeftEl) gsap.set(uiTopLeftEl, seq.ui.from);
      if (uiScrollEl) gsap.set(uiScrollEl, seq.ui.from);

      // SplitText for "Story" chars
      let splitCenter: SplitText | null = null;
      if (wordCenterEl) {
        splitCenter = new SplitText(wordCenterEl, {
          ...seq.wordCenter.splitConfig,
          mask: "chars",
        });
        gsap.set(splitCenter.chars, seq.wordCenter.from);
      }

      // --- Build entrance timeline ---
      const tl = gsap.timeline();

      // t=0 — Ghost text fades to 0.025
      if (ghostEl) {
        tl.fromTo(ghostEl, seq.ghostText.from, seq.ghostText.to, 0);
      }

      // t=0.3 — Image cinematic reveal: blur/brightness/scale
      if (imageEl) {
        tl.fromTo(imageEl, seq.image.from, seq.image.to, 0.3);
      }

      // t=1.2 — "Your" fades in from left
      if (wordLeftEl) {
        tl.fromTo(wordLeftEl, seq.wordLeft.from, seq.wordLeft.to, 1.2);
      }

      // t=1.4 — "Story" SplitText char reveal
      if (splitCenter) {
        tl.to(splitCenter.chars, seq.wordCenter.to, 1.4);
      }

      // t=1.8 — "Awaits" fades in from right
      if (wordRightEl) {
        tl.fromTo(wordRightEl, seq.wordRight.from, seq.wordRight.to, 1.8);
      }

      // t=2.5 — UI elements fade in
      if (uiTopLeftEl) {
        tl.fromTo(uiTopLeftEl, seq.ui.from, seq.ui.to, 2.5);
      }
      if (uiScrollEl) {
        tl.fromTo(uiScrollEl, seq.ui.from, seq.ui.to, 2.5);
      }

      // t=2.5 — Scroll indicator pulse begins
      if (scrollLineEl) {
        tl.fromTo(
          scrollLineEl,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 0.8,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
            repeatDelay: 0.5,
          },
          2.5,
        );
      }

      // --- Scroll parallax ---
      const triggerConfig = {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };

      // Layer 0 — Deep ghost text (slowest)
      if (layer0El) {
        gsap.to(layer0El, {
          yPercent: seq.parallaxSpeeds.layer0 * 100,
          ease: "none",
          scrollTrigger: triggerConfig,
        });
      }

      // Layer 2 — Hero image (medium)
      if (layer2El) {
        gsap.to(layer2El, {
          yPercent: seq.parallaxSpeeds.layer2 * 100,
          ease: "none",
          scrollTrigger: triggerConfig,
        });
      }

      // Layer 3 — Title text (fastest — closest to camera)
      if (layer3El) {
        gsap.to(layer3El, {
          yPercent: seq.parallaxSpeeds.layer3 * 100,
          ease: "none",
          scrollTrigger: triggerConfig,
        });
      }

      // Cleanup SplitText on unmount
      return () => {
        if (splitCenter) splitCenter.revert();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        minHeight: "200vh",
        background:
          "radial-gradient(ellipse at 50% 40%, var(--color-background) 0%, var(--color-surface-deep) 70%)",
      }}
    >
      {/* Sticky container — holds all layers in viewport while scrolling */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ============================
            Layer 0 — Deep ghost text
            ============================ */}
        <div className="plx-layer0 absolute inset-0">
          <div
            className="plx-ghost absolute inset-0 flex items-center justify-center select-none pointer-events-none"
            aria-hidden="true"
          >
            <span
              style={{
                fontFamily: "var(--font-v4-display)",
                fontSize: "clamp(8rem, 22vw, 24rem)",
                fontWeight: 400,
                textTransform: "uppercase",
                color: "var(--color-text-heading)",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              PHOTOGRAPHY
            </span>
          </div>
        </div>

        {/* ============================
            Layer 1 — Grain overlay (no parallax)
            ============================ */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.04,
            background: "repeating-conic-gradient(#fff 0 25%, transparent 0 50%) 0 0 / 3px 3px",
            zIndex: 10,
          }}
          aria-hidden="true"
        />

        {/* ============================
            Layer 2 — Hero image
            ============================ */}
        <div className="plx-layer2 absolute inset-0" style={{ zIndex: 20 }}>
          {/* Centered image container */}
          <div
            className="plx-image absolute"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "48vw",
              height: "60vh",
            }}
          >
            <Image
              src="/images/hero.jpg"
              alt="Saffron Studios"
              fill
              sizes="48vw"
              priority
              className="object-cover"
              style={{ filter: "saturate(0.85) contrast(1.1)" }}
              {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
            />
            {/* Vignette overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, transparent 40%, var(--color-surface-deep) 100%)",
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* ============================
            Layer 3 — Title text (triangular composition)
            ============================ */}
        <div className="plx-layer3 absolute inset-0" style={{ zIndex: 30 }}>
          {/* "Your" — top-left of image area */}
          <span
            className="plx-word-left absolute"
            style={{
              left: "22%",
              top: "25%",
              fontFamily: "var(--font-v4-display)",
              fontWeight: 400,
              fontSize: "clamp(1.2rem, 3vw, 2.5rem)",
              color: "var(--color-text-heading)",
              lineHeight: 1,
            }}
          >
            Your
          </span>

          {/* "Story" — centered dominant element */}
          <span
            className="plx-word-center absolute"
            style={{
              left: "50%",
              top: "45%",
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-v4-display)",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(4rem, 14vw, 14rem)",
              color: "var(--color-primary)",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            Story
          </span>

          {/* "Awaits" — bottom-right of image area */}
          <span
            className="plx-word-right absolute"
            style={{
              right: "22%",
              bottom: "25%",
              fontFamily: "var(--font-v4-display)",
              fontWeight: 400,
              fontSize: "clamp(1.2rem, 3vw, 2.5rem)",
              color: "var(--color-text-heading)",
              lineHeight: 1,
            }}
          >
            Awaits
          </span>
        </div>

        {/* ============================
            Layer 4 — UI (no parallax)
            ============================ */}

        {/* Top-left studio label */}
        <div
          className="plx-ui-top-left absolute top-8 left-8 lg:left-12"
          style={{
            zIndex: 40,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-v4-body)",
              fontWeight: 300,
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--color-primary)",
            }}
          >
            SAFFRON STUDIOS
          </span>
        </div>

        {/* Bottom-center scroll indicator */}
        <div
          className="plx-ui-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{
            zIndex: 40,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-v4-body)",
              fontWeight: 300,
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "color-mix(in srgb, var(--color-text-heading) 40%, transparent)",
            }}
          >
            SCROLL
          </span>
          <div
            className="plx-scroll-line"
            style={{
              width: 1,
              height: 30,
              backgroundColor: "var(--color-primary)",
              transformOrigin: "top center",
            }}
          />
        </div>
      </div>
    </section>
  );
}
