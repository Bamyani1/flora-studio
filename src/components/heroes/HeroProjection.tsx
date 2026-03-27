"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { heroProjectionSequence } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Image from "next/image";
import { getLocalBlur } from "@/lib/image-manifest";

const seq = heroProjectionSequence;
const blurDataURL = getLocalBlur("/images/hero.jpg");

/* ---------- dust particle configs ---------- */
const dustParticles = [
  { w: 2, h: 2, top: "30%", left: "25%", opacity: 0.15, delay: 0, dur: 5 },
  { w: 3, h: 3, top: "50%", left: "45%", opacity: 0.2, delay: 1.2, dur: 4 },
  { w: 2, h: 2, top: "65%", left: "60%", opacity: 0.12, delay: 0.5, dur: 6 },
  { w: 4, h: 4, top: "40%", left: "70%", opacity: 0.25, delay: 2.1, dur: 3.5 },
  { w: 2, h: 3, top: "75%", left: "35%", opacity: 0.1, delay: 3.0, dur: 7 },
  { w: 3, h: 2, top: "20%", left: "55%", opacity: 0.18, delay: 0.8, dur: 4.5 },
  { w: 2, h: 2, top: "55%", left: "80%", opacity: 0.14, delay: 1.8, dur: 5.5 },
];

/* ---------- film gate perforations (2 above, 2 below) ---------- */
const gatePerfs = [
  { top: -10, left: 20 },
  { top: -10, left: 52 },
  { bottom: -10, left: 20 },
  { bottom: -10, left: 52 },
];

export function HeroProjection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const gateEl = root.querySelector<HTMLElement>(".proj-gate");
      const beamEl = root.querySelector<HTMLElement>(".proj-beam");
      const imageEl = root.querySelector<HTMLElement>(".proj-image");
      const ghostEl = root.querySelector<HTMLElement>(".proj-ghost");
      const dustEls = root.querySelectorAll<HTMLElement>(".proj-dust");
      const titleWrapEl = root.querySelector<HTMLElement>(".proj-title-wrap");
      const goldWordEl = root.querySelector<HTMLElement>(".proj-gold-word");
      const metaEl = root.querySelector<HTMLElement>(".proj-metadata");

      // --- Reduced motion: jump to final state ---
      if (reducedMotion) {
        if (gateEl) gsap.set(gateEl, { scale: 1, autoAlpha: 1 });
        if (beamEl) gsap.set(beamEl, { clipPath: seq.beam.to.clipPath, autoAlpha: 1 });
        if (imageEl) gsap.set(imageEl, { autoAlpha: 1 });
        if (ghostEl) gsap.set(ghostEl, { autoAlpha: 0.04 });
        if (dustEls.length) gsap.set(dustEls, { autoAlpha: 0.2 });
        if (titleWrapEl) gsap.set(titleWrapEl, { autoAlpha: 1 });
        if (goldWordEl) gsap.set(goldWordEl, { clipPath: "inset(0 0 0 0)", autoAlpha: 1 });
        if (metaEl) gsap.set(metaEl, { autoAlpha: 1 });
        return;
      }

      // --- Set initial states ---
      if (gateEl) gsap.set(gateEl, seq.gate.from);
      if (beamEl) gsap.set(beamEl, seq.beam.from);
      if (imageEl) gsap.set(imageEl, seq.image.from);
      if (ghostEl) gsap.set(ghostEl, seq.ghostText.from);
      if (dustEls.length) gsap.set(dustEls, { autoAlpha: 0 });
      if (goldWordEl) gsap.set(goldWordEl, seq.goldWord.from);
      if (metaEl) gsap.set(metaEl, seq.metadata.from);

      // SplitText for title lines
      let splitTitle: SplitText | null = null;
      if (titleWrapEl) {
        splitTitle = new SplitText(titleWrapEl, seq.titleReveal.splitConfig);
        gsap.set(splitTitle.lines, seq.titleReveal.from);
      }

      // --- Build timeline ---
      const tl = gsap.timeline();

      // t=0.3 — Film gate illuminates (scale 0 -> 1)
      if (gateEl) {
        tl.fromTo(gateEl, seq.gate.from, seq.gate.to, 0.3);
      }

      // t=0.6 — Beam expands via clip-path
      if (beamEl) {
        tl.fromTo(beamEl, seq.beam.from, seq.beam.to, 0.6);
      }

      // t=1.0 — Image fades in inside beam
      if (imageEl) {
        tl.fromTo(imageEl, seq.image.from, seq.image.to, 1.0);
      }

      // t=1.5 — Ghost "LIGHT" text fades to 0.04 opacity
      if (ghostEl) {
        tl.fromTo(ghostEl, seq.ghostText.from, seq.ghostText.to, 1.5);
      }

      // t=1.8 — Dust particles become visible
      if (dustEls.length) {
        tl.to(dustEls, { autoAlpha: 1, duration: 0.4, stagger: 0.05 }, 1.8);
      }

      // t=2.0 — Title SplitText line reveal
      if (splitTitle) {
        tl.to(splitTitle.lines, seq.titleReveal.to, 2.0);
      }

      // t=2.8 — Gold word clip-path reveal
      if (goldWordEl) {
        tl.fromTo(goldWordEl, seq.goldWord.from, seq.goldWord.to, 2.8);
      }

      // t=3.2 — Bottom metadata fade in
      if (metaEl) {
        tl.fromTo(metaEl, seq.metadata.from, seq.metadata.to, 3.2);
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
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "var(--color-black)" }}
    >
      {/* ---------- Dust particle float keyframes ---------- */}
      <style>{`
        @keyframes proj-float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(12px, -20px); }
          50% { transform: translate(-8px, 15px); }
          75% { transform: translate(18px, 25px); }
        }
      `}</style>

      {/* ---------- Layer 1 — Ghost text "LIGHT" (behind beam) z-10 ---------- */}
      <div
        className="proj-ghost absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ zIndex: 10 }}
      >
        <span
          style={{
            fontFamily: "var(--font-v1-display)",
            fontWeight: 900,
            fontSize: "35vw",
            textTransform: "uppercase",
            color: "var(--color-text-heading)",
            lineHeight: 1,
          }}
        >
          LIGHT
        </span>
      </div>

      {/* ---------- Layer 2 — Projector beam (clip-path animated) z-20 ---------- */}
      <div className="proj-beam absolute inset-0" style={{ zIndex: 20 }}>
        {/* Hero image inside beam */}
        <div className="proj-image absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Bahar Studio — portraiture"
            fill
            sizes="100vw"
            priority
            className="object-cover"
            style={{ filter: "contrast(0.9) sepia(0.1) brightness(1.1)" }}
            {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
          />
        </div>

        {/* Warm gold gradient overlay inside beam */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 5%, transparent) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ---------- Layer 3 — Film gate at source z-30 ---------- */}
      <div
        className="proj-gate absolute"
        style={{
          zIndex: 30,
          bottom: "10%",
          left: "3%",
          width: 80,
          height: 60,
          border: "1px solid var(--color-primary)",
          boxShadow:
            "0 0 40px color-mix(in srgb, var(--color-primary) 20%, transparent), 0 0 80px color-mix(in srgb, var(--color-primary) 10%, transparent)",
        }}
      >
        {/* Perforations (2 above, 2 below) */}
        {gatePerfs.map((pos, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: 4,
              height: 6,
              borderRadius: 2,
              backgroundColor: "var(--color-border)",
              border: "1px solid var(--color-border-hover)",
              left: pos.left,
              ...(pos.top !== undefined ? { top: pos.top } : {}),
              ...(pos.bottom !== undefined ? { bottom: pos.bottom } : {}),
            }}
          />
        ))}
      </div>

      {/* ---------- Layer 4 — Dust particles z-25 ---------- */}
      {dustParticles.map((p, i) => (
        <div
          key={i}
          className="proj-dust absolute rounded-full pointer-events-none"
          style={{
            zIndex: 25,
            width: p.w,
            height: p.h,
            top: p.top,
            left: p.left,
            backgroundColor: "var(--color-text-heading)",
            opacity: p.opacity,
            animation: `proj-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* ---------- Layer 5 — Title text z-40 ---------- */}
      <div className="absolute text-right" style={{ zIndex: 40, top: "15%", right: "8%" }}>
        <div className="proj-title-wrap">
          <p
            style={{
              fontFamily: "var(--font-v1-display)",
              fontWeight: 400,
              fontSize: "clamp(1.5rem, 3vw, 3rem)",
              color: "color-mix(in srgb, var(--color-text-heading) 70%, transparent)",
              lineHeight: 1.3,
            }}
          >
            Stories told
          </p>
        </div>
        <div className="proj-gold-word">
          <p
            style={{
              fontFamily: "var(--font-v1-display)",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: "clamp(2rem, 5vw, 5rem)",
              color: "var(--color-primary)",
              lineHeight: 1.2,
            }}
          >
            in projected light
          </p>
        </div>
      </div>

      {/* ---------- Layer 6 — Bottom metadata z-40 ---------- */}
      <div
        className="proj-metadata absolute bottom-6 left-0 w-full flex justify-center"
        style={{ zIndex: 40 }}
      >
        <span
          style={{
            fontFamily: "var(--font-v1-body)",
            fontWeight: 400,
            fontSize: 9,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-border)",
          }}
        >
          16MM PROJECTION &middot; BAHAR STUDIO
        </span>
      </div>
    </section>
  );
}
