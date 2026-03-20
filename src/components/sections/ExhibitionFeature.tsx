"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { exhibitionParallax } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ExhibitionFeatureProps {
  blurDataURL?: string | null;
}

export function ExhibitionFeature({ blurDataURL }: ExhibitionFeatureProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!imageRef.current || reduced) return;

      gsap.fromTo(imageRef.current, exhibitionParallax.from, {
        ...exhibitionParallax.to,
        scrollTrigger: {
          trigger: sectionRef.current,
          ...exhibitionParallax.scrollTrigger,
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-[var(--container-padding-x)] py-[var(--section-padding-y)]"
    >
      {/* Background image */}
      <div ref={imageRef} className="absolute inset-0">
        <Image
          src="/images/high-country/hero.jpg"
          alt=""
          fill
          className="object-cover grayscale opacity-60"
          sizes="100vw"
          placeholder={blurDataURL ? "blur" : undefined}
          blurDataURL={blurDataURL ?? undefined}
        />
        <div className="absolute inset-0 bg-background/50" />
      </div>

      {/* Top-right label */}
      <div className="absolute right-[var(--container-padding-x)] top-[var(--section-padding-y)] z-10 max-w-xs text-right">
        <span className="font-label text-xs uppercase tracking-wider text-primary">
          [ FEATURED COLLECTION ]
        </span>
        <p className="mt-3 font-body text-sm leading-relaxed text-muted">
          From the Rockies to the Smokies — alpine drama where mist, light,
          and granite converge.
        </p>
      </div>

      {/* Bottom-left title */}
      <div className="absolute bottom-[var(--section-padding-y)] left-[var(--container-padding-x)] z-10">
        <h2 className="font-display text-5xl font-light uppercase leading-none text-text-heading md:text-7xl lg:text-[length:var(--text-hero)]">
          High{" "}
          <span className="text-primary">Country</span>
        </h2>
      </div>
    </section>
  );
}
