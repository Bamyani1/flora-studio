"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveImageUrl } from "@/lib/image-url";
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
            scrub: true,
            end: () => "+=" + track.scrollWidth,
            invalidateOnRefresh: true,
            onEnter: () => { track.style.willChange = "transform"; },
            onLeaveBack: () => { track.style.willChange = "auto"; },
            onLeave: () => { track.style.willChange = "auto"; },
            onEnterBack: () => { track.style.willChange = "transform"; },
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
        className="flex flex-col gap-[var(--space-8)] px-[var(--container-padding-x)] py-[var(--section-padding-y)] md:flex-row md:h-screen md:items-center md:gap-[var(--space-4)] md:py-0"
      >
        {images.map((img, i) => {
          const imgUrl = resolveImageUrl(img);
          return (
            <div
              key={i}
              className="w-full md:h-screen md:w-auto md:flex-shrink-0"
            >
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={img.alt || `Album photograph ${i + 1}`}
                  width={1200}
                  height={800}
                  className="h-auto w-full object-cover md:h-full md:w-auto"
                  sizes="(min-width: 768px) 60vw, 90vw"
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
