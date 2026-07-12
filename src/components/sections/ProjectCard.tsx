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
  /** Position in the full archive — the featured hero album is 01 */
  number: number;
  large?: boolean;
  eagerImage?: boolean;
  gridSide?: "left" | "right";
}

export function ProjectCard({
  album,
  number,
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

  const metaLine = [
    categoryLabel,
    album.year,
    album.imageCount
      ? `${album.imageCount} photograph${album.imageCount === 1 ? "" : "s"}`
      : undefined,
  ]
    .filter(Boolean)
    .join(" · ");

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
              className="object-cover transition-transform duration-700 can-hover:group-hover:scale-105"
              sizes={large ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
            />
          </div>
        </div>

        {/* Museum label — always visible; hover only accents it */}
        <div className="mt-4">
          <div className="flex items-baseline gap-3">
            <span className="font-label text-[10px] tracking-[0.2em] text-primary/70">
              {String(number).padStart(2, "0")}
            </span>
            <h3 className="font-display text-lg text-text-heading transition-colors md:text-xl can-hover:group-hover:text-primary">
              {album.title}
            </h3>
            <span
              aria-hidden="true"
              className="ml-auto text-muted transition-all duration-300 can-hover:group-hover:translate-x-1 can-hover:group-hover:text-primary"
            >
              &rarr;
            </span>
          </div>
          <p className="mt-1.5 font-label text-[10px] uppercase tracking-[0.2em] text-muted">
            {metaLine}
          </p>
        </div>
      </div>
    </TransitionLink>
  );
}
