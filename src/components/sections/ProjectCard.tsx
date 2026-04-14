"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { CATEGORY_META } from "@/lib/categories";
import type { AlbumMeta } from "@/types/project";
import { SiteMedia } from "@/components/ui/SiteMedia";
import { getImageDimensions, resolveImageUrl } from "@/lib/image-url";

interface ProjectCardProps {
  album: AlbumMeta;
  index: number;
  large?: boolean;
  eagerImage?: boolean;
  gridSide?: "left" | "right";
}

export function ProjectCard({
  album,
  large = false,
  eagerImage = false,
  gridSide,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const categoryLabel = CATEGORY_META[album.category]?.label ?? album.category;
  const dims = getImageDimensions(album.coverImage);
  const isPortrait = dims ? dims.height > dims.width : false;
  const coverSrc = resolveImageUrl(album.coverImage);

  useGSAP(
    () => {
      if (!cardRef.current || reduced) return;

      gsap.fromTo(
        cardRef.current,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: cardRef, dependencies: [reduced] },
  );

  return (
    <TransitionLink
      href={`/work/${album.slug.current}`}
      className={`block ${large ? `md:col-span-2 md:row-span-2 h-full ${gridSide === "right" ? "md:col-start-2" : ""}` : ""}`}
    >
      <div
        ref={cardRef}
        data-animate
        className={`group cursor-pointer ${large ? "md:flex md:h-full md:flex-col" : ""}`}
      >
        <div
          className={`relative overflow-hidden ${large ? "aspect-[3/4] md:aspect-auto md:flex-1" : isPortrait ? "aspect-[3/4]" : "aspect-video"}`}
        >
          <div className="relative h-full w-full">
            <SiteMedia
              src={coverSrc}
              alt={album.coverImage.alt || `${album.title} cover`}
              fill
              loading={eagerImage ? "eager" : undefined}
              className="object-cover"
              sizes={large ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
            />
          </div>

          {/* Info panel — slides up from bottom on hover */}
          <div className="absolute inset-x-0 bottom-0 px-6 py-5 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms] ease-[cubic-bezier(0.33,1,0.68,1)]">
            <h3 className="font-display text-xl text-white font-bold">{album.title}</h3>
            <span className="block mt-1 font-label text-[10px] uppercase tracking-[0.2em] text-white/80">
              {categoryLabel}
            </span>
          </div>
        </div>
      </div>
    </TransitionLink>
  );
}
