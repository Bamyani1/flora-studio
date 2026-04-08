"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { fadeUp, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/layout/TransitionLink";

interface LandingStudioCardsProps {
  ctaLabel: string;
  ctaHref: string;
}

export function LandingStudioCards({ ctaLabel, ctaHref }: LandingStudioCardsProps) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    const els = [leftRef.current, rightRef.current].filter(Boolean);
    if (els.length === 0) return;

    if (reducedMotion) {
      gsap.set(els, { autoAlpha: 1 });
      return;
    }

    if (leftRef.current) {
      gsap.fromTo(leftRef.current, fadeUp.from, {
        ...fadeUp.to,
        duration: 0.8,
        ...withWillChange(),
        scrollTrigger: {
          trigger: leftRef.current,
          start: "top 95%",
          end: "top 20%",
          toggleActions: "play none none none",
        },
      });
    }

    if (rightRef.current) {
      gsap.fromTo(rightRef.current, fadeUp.from, {
        ...fadeUp.to,
        duration: 0.8,
        delay: 0.15,
        ...withWillChange(),
        scrollTrigger: {
          trigger: rightRef.current,
          start: "top 95%",
          end: "top 20%",
          toggleActions: "play none none none",
        },
      });
    }
  }, [reducedMotion]);

  return (
    <div className="grid gap-12 md:grid-cols-2 md:gap-8 items-center max-w-6xl mx-auto px-6 md:px-16">
      {/* Left — heading + body */}
      <div ref={leftRef}>
        <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl uppercase tracking-[0.12em] leading-[1.15] text-text mb-8">
          Work
          <br />
          With Us
        </h2>
        <p className="font-body text-base md:text-lg leading-relaxed text-muted max-w-lg">
          We take on a handful of projects each season. Enough to give every frame the time it
          deserves. If you have a vision, we&apos;d love to hear about it.
        </p>
      </div>

      {/* Right — CTA button */}
      <div ref={rightRef} className="flex md:justify-end">
        <TransitionLink
          href={ctaHref}
          className="inline-block bg-text px-10 py-5 font-label text-xs uppercase tracking-[0.2em] text-surface-deep transition-colors duration-500 hover:bg-text/85"
        >
          {ctaLabel}
        </TransitionLink>
      </div>
    </div>
  );
}
