"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { SanityImage } from "@/types/project";

interface HorizontalScrollGalleryProps {
  images: (SanityImage & { blurDataURL?: string })[];
}

export function HorizontalScrollGallery({
  images,
}: HorizontalScrollGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current || !trackRef.current || reduced) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current!;
        const scrollDistance = track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            end: () => "+=" + track.scrollWidth,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section ref={sectionRef} className="overflow-hidden" aria-label="Photo gallery">
      <div
        ref={trackRef}
        className="flex flex-col gap-[--space-8] px-[--container-padding-x] py-[--section-padding-y] md:flex-row md:h-screen md:items-center md:gap-[--space-4] md:py-0"
      >
        {images.map((img, i) => {
          const hasRef = img.asset?._ref && img.asset._ref !== "";
          return (
            <div
              key={i}
              className="w-full md:h-screen md:w-auto md:flex-shrink-0"
            >
              {hasRef ? (
                <Image
                  src={`https://cdn.sanity.io/images/placeholder/production/${img.asset._ref}`}
                  alt={img.alt || `Album photograph ${i + 1}`}
                  width={1200}
                  height={800}
                  className="h-auto w-full object-cover md:h-full md:w-auto"
                  placeholder={img.blurDataURL ? "blur" : undefined}
                  blurDataURL={img.blurDataURL}
                />
              ) : (
                <div
                  className="aspect-[3/2] w-full bg-gradient-to-br from-surface to-surface-elevated md:h-[80vh] md:w-[60vw] md:aspect-auto"
                  role="img"
                  aria-label={`Album photograph ${i + 1}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
