"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { landingHeroGridSequence } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getLocalBlur } from "@/lib/image-manifest";


const blurDataURL = getLocalBlur("/images/landing-hero.jpg");

export function LandingHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const curvesRef = useRef<HTMLDivElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const refs: Record<string, React.RefObject<HTMLElement | null>> = {
        divider: dividerRef,
        bgImage: bgImageRef,
        eyebrow: eyebrowRef,
        headline: headlineRef,
        description: descRef,
        curves: curvesRef,
        dash: dashRef,
      };

      if (reducedMotion) {
        for (const ref of Object.values(refs)) {
          if (ref.current) gsap.set(ref.current, { autoAlpha: 1, y: 0 });
        }
        return;
      }

      const tl = gsap.timeline();

      for (const step of landingHeroGridSequence.steps) {
        const el = refs[step.target]?.current;
        if (!el) continue;
        gsap.set(el, step.from);
        tl.fromTo(el, { ...step.from }, { ...step.to }, step.position);
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* Vertical divider */}
      <div
        ref={dividerRef}
        className="fixed left-[44%] top-0 bottom-0 w-px bg-hero-divider z-[5]"
      />

      <div className="relative min-h-screen grid grid-cols-1 md:grid-cols-[44%_56%]">
        {/* Left column — image */}
        <div className="relative row-start-1 col-start-1 overflow-hidden min-h-[60vh] md:min-h-0">
          <div
            ref={bgImageRef}
            className="absolute inset-0"
          >
            <Image
              src="/images/landing-hero.jpg"
              alt="Cinematic atmospheric photograph"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              placeholder={blurDataURL ? "blur" : undefined}
              blurDataURL={blurDataURL}
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, transparent 60%, var(--color-background) 100%), linear-gradient(to bottom, var(--color-background) 0%, transparent 20%, transparent 80%, var(--color-background) 100%)",
                opacity: 0.7,
              }}
            />
          </div>
          <div className="relative flex items-end h-full px-6 md:px-12 pb-[30vh]">
            <div
              ref={dashRef}
              className="w-20 h-px bg-hero-divider"
            />
          </div>
        </div>

        {/* Right column — content */}
        <div className="relative row-start-2 md:row-start-1 md:col-start-2 flex flex-col justify-center px-6 md:px-12 py-12 md:py-0 md:pt-[8vh]">
          <span
            ref={eyebrowRef}
            className="font-label-serif text-[11px] tracking-[0.35em] uppercase mb-5 text-hero-gold"
          >
            Cinematic Direction
          </span>

          <h1
            ref={headlineRef}
            className="font-headline-serif font-bold leading-[0.95] tracking-tight mb-12"
          >
            <span className="block text-[clamp(2.5rem,9vw,8rem)] text-text">
              Your Story
            </span>
            <span className="block text-[clamp(2.5rem,9vw,8rem)] text-hero-gold">
              Starts Here.
            </span>
          </h1>

          <p
            ref={descRef}
            className="font-headline-serif font-normal text-[clamp(1.1rem,1.8vw,1.4rem)] leading-relaxed max-w-[340px] mb-12 text-hero-muted"
          >
            Vision, craft, and narrative &mdash;
            <br />
            three frames, one story.
          </p>

          {/* Decorative curves */}
          <div
            ref={curvesRef}
            className="absolute bottom-[12vh] right-0 w-[60%] h-20 hidden md:block"
          >
            <svg
              viewBox="0 0 400 80"
              fill="none"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <path
                d="M0 60 Q100 20 200 50 T400 30"
                stroke="rgba(196,154,92,0.2)"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M0 70 Q120 30 240 60 T400 40"
                stroke="rgba(196,154,92,0.1)"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
