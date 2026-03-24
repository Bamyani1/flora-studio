"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { heroDiptychSequence } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";
import { getLocalBlur } from "@/lib/image-manifest";

const seq = heroDiptychSequence;
const blurDataURL = getLocalBlur("/images/hero.jpg");

export function HeroDiptych() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const imageEl = root.querySelector<HTMLElement>(".dipt-image");
      const dividerEl = root.querySelector<HTMLElement>(".dipt-divider");
      const cornerHEl = root.querySelector<HTMLElement>(".dipt-corner-h");
      const cornerVEl = root.querySelector<HTMLElement>(".dipt-corner-v");
      const silkEl = root.querySelector<HTMLElement>(".dipt-silk");
      const roadEl = root.querySelector<HTMLElement>(".dipt-road");
      const studioEl = root.querySelector<HTMLElement>(".dipt-studio");
      const goldRuleEl = root.querySelector<HTMLElement>(".dipt-gold-rule");
      const taglineEl = root.querySelector<HTMLElement>(".dipt-tagline");
      const ctaEl = root.querySelector<HTMLElement>(".dipt-cta");
      const pageIndicatorEl = root.querySelector<HTMLElement>(".dipt-page-indicator");

      // --- Reduced motion: jump to final state ---
      if (reducedMotion) {
        if (imageEl) gsap.set(imageEl, { scale: 1, autoAlpha: 1, filter: "blur(0px)" });
        if (dividerEl) gsap.set(dividerEl, { scaleY: 1 });
        if (cornerHEl) gsap.set(cornerHEl, { scaleX: 1 });
        if (cornerVEl) gsap.set(cornerVEl, { scaleY: 1 });
        if (silkEl) gsap.set(silkEl, { autoAlpha: 1 });
        if (roadEl) gsap.set(roadEl, { autoAlpha: 1 });
        if (studioEl) gsap.set(studioEl, { clipPath: "inset(0 0 0 0)", autoAlpha: 1 });
        if (goldRuleEl) gsap.set(goldRuleEl, { scaleX: 1 });
        if (taglineEl) gsap.set(taglineEl, { autoAlpha: 1, y: 0 });
        if (ctaEl) gsap.set(ctaEl, { autoAlpha: 1 });
        if (pageIndicatorEl) gsap.set(pageIndicatorEl, { autoAlpha: 1 });
        return;
      }

      // --- Set initial states ---
      if (imageEl) gsap.set(imageEl, seq.image.from);
      if (dividerEl) gsap.set(dividerEl, seq.divider.from);
      if (cornerHEl) gsap.set(cornerHEl, { scaleX: 0, transformOrigin: "left top" });
      if (cornerVEl) gsap.set(cornerVEl, { scaleY: 0, transformOrigin: "left top" });
      if (studioEl) gsap.set(studioEl, seq.studioClip.from);
      if (goldRuleEl) gsap.set(goldRuleEl, { ...seq.goldRule.from, transformOrigin: "left center" });
      if (taglineEl) gsap.set(taglineEl, seq.tagline.from);
      if (ctaEl) gsap.set(ctaEl, seq.cta.from);
      if (pageIndicatorEl) gsap.set(pageIndicatorEl, seq.cta.from);

      // SplitText for SILK and ROAD chars
      let splitSilk: SplitText | null = null;
      let splitRoad: SplitText | null = null;

      if (silkEl) {
        splitSilk = new SplitText(silkEl, seq.titleChars.splitConfig);
        gsap.set(splitSilk.chars, seq.titleChars.from);
      }
      if (roadEl) {
        splitRoad = new SplitText(roadEl, seq.titleChars.splitConfig);
        gsap.set(splitRoad.chars, seq.titleChars.from);
      }

      // --- Build timeline ---
      const tl = gsap.timeline();

      // t=0 — Left panel image: scale 1.12→1, autoAlpha 0→1, blur 12→0
      if (imageEl) {
        tl.fromTo(imageEl, seq.image.from, seq.image.to, 0);
      }

      // t=0.3 — Dividing line: scaleY 0→1 from center
      if (dividerEl) {
        tl.fromTo(dividerEl, seq.divider.from, seq.divider.to, 0.3);
      }

      // t=0.6 — Gold corner accent lines
      if (cornerHEl) {
        tl.fromTo(
          cornerHEl,
          { scaleX: 0 },
          { scaleX: 1, duration: seq.cornerAccent.to.duration, ease: seq.cornerAccent.to.ease },
          0.6,
        );
      }
      if (cornerVEl) {
        tl.fromTo(
          cornerVEl,
          { scaleY: 0 },
          { scaleY: 1, duration: seq.cornerAccent.to.duration, ease: seq.cornerAccent.to.ease },
          0.6,
        );
      }

      // t=0.8 — "SILK" chars reveal
      if (splitSilk) {
        tl.to(splitSilk.chars, seq.titleChars.to, 0.8);
      }

      // t=1.0 — "ROAD" chars reveal
      if (splitRoad) {
        tl.to(splitRoad.chars, seq.titleChars.to, 1.0);
      }

      // t=1.3 — "Studio" clip-path reveal
      if (studioEl) {
        tl.fromTo(studioEl, seq.studioClip.from, seq.studioClip.to, 1.3);
      }

      // t=1.8 — Gold horizontal rule
      if (goldRuleEl) {
        tl.fromTo(
          goldRuleEl,
          seq.goldRule.from,
          { ...seq.goldRule.to, transformOrigin: "left center" },
          1.8,
        );
      }

      // t=2.0 — Tagline fade up
      if (taglineEl) {
        tl.fromTo(taglineEl, seq.tagline.from, seq.tagline.to, 2.0);
      }

      // t=2.3 — CTA + page indicator fade in
      if (ctaEl) {
        tl.fromTo(ctaEl, seq.cta.from, seq.cta.to, 2.3);
      }
      if (pageIndicatorEl) {
        tl.fromTo(pageIndicatorEl, seq.cta.from, seq.cta.to, 2.3);
      }

      // Cleanup SplitText on unmount
      return () => {
        if (splitSilk) splitSilk.revert();
        if (splitRoad) splitRoad.revert();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen overflow-hidden"
    >
      {/* ─── Left Panel: Atmospheric Image ─── */}
      <div className="relative h-screen w-[58%] overflow-hidden">
        {/* Hero image */}
        <div className="dipt-image absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Silk Road Studio — cinematic landscape"
            fill
            priority
            sizes="58vw"
            className="object-cover"
            {...(blurDataURL
              ? { placeholder: "blur" as const, blurDataURL }
              : {})}
          />
        </div>

        {/* Gradient bleed: image → black */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to right, transparent 50%, var(--color-surface-deep) 100%)",
          }}
        />

        {/* Gold corner accent (top-left L-shape) */}
        <div className="absolute left-6 top-6">
          <div
            className="dipt-corner-h"
            style={{
              width: 30,
              height: 1,
              backgroundColor: "var(--color-primary)",
              transformOrigin: "left top",
            }}
          />
          <div
            className="dipt-corner-v"
            style={{
              width: 1,
              height: 30,
              backgroundColor: "var(--color-primary)",
              transformOrigin: "left top",
            }}
          />
        </div>

        {/* Page indicator (bottom-left) */}
        <div
          className="dipt-page-indicator absolute bottom-6 left-6"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: 10,
            letterSpacing: "0.1em",
            color: "color-mix(in srgb, var(--color-text-heading) 30%, transparent)",
          }}
        >
          01 / 06
        </div>
      </div>

      {/* ─── Glowing Gold Divider ─── */}
      <div
        className="dipt-divider absolute z-10"
        style={{
          left: "58%",
          top: 0,
          height: "100%",
          width: 1,
          backgroundColor: "var(--color-primary)",
          boxShadow:
            "0 0 30px color-mix(in srgb, var(--color-primary) 15%, transparent), 0 0 60px color-mix(in srgb, var(--color-primary) 8%, transparent)",
          transformOrigin: "center center",
        }}
      />

      {/* ─── Right Panel: Title Stack ─── */}
      <div
        className="flex h-screen w-[42%] flex-col justify-center pl-12 pr-8 lg:pl-16"
        style={{ backgroundColor: "var(--color-surface-deep)" }}
      >
        {/* "SILK" */}
        <div style={{ overflow: "hidden" }}>
          <div
            className="dipt-silk"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(3rem, 9vw, 8rem)",
              color: "var(--color-text-heading)",
              textTransform: "uppercase",
              lineHeight: 0.85,
            }}
          >
            SILK
          </div>
        </div>

        {/* "ROAD" */}
        <div style={{ overflow: "hidden" }}>
          <div
            className="dipt-road"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(3rem, 9vw, 8rem)",
              color: "var(--color-text-heading)",
              textTransform: "uppercase",
              lineHeight: 0.85,
              marginTop: "-0.1em",
            }}
          >
            ROAD
          </div>
        </div>

        {/* "Studio" — italic gold accent */}
        <div
          className="dipt-studio"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontStyle: "italic",
            fontSize: "clamp(2rem, 5vw, 5rem)",
            color: "var(--color-primary)",
            lineHeight: 1.2,
            marginTop: "0.5rem",
          }}
        >
          Studio
        </div>

        {/* Gold horizontal rule */}
        <div
          className="dipt-gold-rule"
          style={{
            width: 40,
            height: 1,
            backgroundColor: "var(--color-primary)",
            marginTop: "2rem",
            transformOrigin: "left center",
          }}
        />

        {/* Tagline */}
        <p
          className="dipt-tagline"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "clamp(12px, 1.2vw, 15px)",
            color: "color-mix(in srgb, var(--color-text-heading) 50%, transparent)",
            maxWidth: 280,
            lineHeight: 1.625,
            marginTop: "1.5rem",
          }}
        >
          Where cinematic vision meets authentic storytelling
        </p>

        {/* CTA */}
        <div
          className="dipt-cta"
          style={{ marginTop: "2.5rem" }}
        >
          <a
            href="#portfolio"
            className="group inline-flex items-center gap-2"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-primary)",
              textDecoration: "none",
              transition: "opacity 0.3s ease",
            }}
          >
            <span className="underline-offset-4 transition-all duration-300 group-hover:underline">
              VIEW PORTFOLIO
            </span>
            <span
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
