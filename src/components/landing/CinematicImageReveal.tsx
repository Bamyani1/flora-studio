"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { cinematicImageReveal, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CinematicImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
  blurDataURL?: string | null;
  priority?: boolean;
  sizes?: string;
}

export function CinematicImageReveal({
  src,
  alt,
  className = "",
  overlay = false,
  blurDataURL,
  priority = false,
  sizes = "100vw",
}: CinematicImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const imageWrapper = el.querySelector(".cinematic-img-wrapper") as HTMLElement;
      if (!imageWrapper) return;

      if (reduced) {
        gsap.set(el, { clipPath: "inset(0% 0 0 0)" });
        gsap.set(imageWrapper, { yPercent: 0, scale: 1 });
        return;
      }

      // Set initial hidden state before ScrollTrigger fires
      gsap.set(el, cinematicImageReveal.reveal.from);

      // Clip-path reveal on enter
      gsap.fromTo(
        el,
        cinematicImageReveal.reveal.from,
        {
          ...cinematicImageReveal.reveal.to,
          scrollTrigger: {
            trigger: el,
            ...cinematicImageReveal.reveal.scrollTrigger,
          },
          ...withWillChange("clip-path"),
        },
      );

      // Parallax on scroll
      gsap.fromTo(
        imageWrapper,
        cinematicImageReveal.parallax.from,
        {
          ...cinematicImageReveal.parallax.to,
          scrollTrigger: {
            trigger: el,
            ...cinematicImageReveal.parallax.scrollTrigger,
          },
        },
      );
    },
    { scope: containerRef, dependencies: [reduced] },
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div className="cinematic-img-wrapper absolute inset-0 h-full w-full origin-bottom">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
          placeholder={blurDataURL ? "blur" : undefined}
          blurDataURL={blurDataURL ?? undefined}
        />
      </div>
      {overlay && (
        <div className="absolute inset-0 bg-black/20 transition-colors duration-1000 hover:bg-transparent" />
      )}
    </div>
  );
}
