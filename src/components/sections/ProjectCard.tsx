"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { staggerGrid } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/layout/TransitionLink";
import type { AlbumMeta } from "@/types/project";

interface ProjectCardProps {
  album: AlbumMeta;
  index: number;
  large?: boolean;
}

export function ProjectCard({ album, index, large = false }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const hoverTl = useRef<gsap.core.Timeline | null>(null);
  const reduced = useReducedMotion();

  const coverUrl = album.coverImage?.asset?._ref ? undefined : null;

  // Scroll entrance + hover timeline
  useGSAP(
    () => {
      if (!cardRef.current) return;

      if (reduced) {
        gsap.set(cardRef.current, { autoAlpha: 1, y: 0 });
        return;
      }

      // Staggered scroll entrance
      gsap.fromTo(
        cardRef.current,
        staggerGrid.from,
        {
          ...staggerGrid.to,
          delay: index * 0.1,
          stagger: 0,
          scrollTrigger: {
            trigger: cardRef.current,
            ...staggerGrid.scrollTrigger,
          },
        },
      );

      // Hover timeline (paused)
      if (imageRef.current && overlayRef.current && titleRef.current) {
        const tl = gsap.timeline({ paused: true });

        tl.to(imageRef.current, {
          scale: 1.05,
          duration: 0.4,
          ease: "power2.out",
        }, 0);

        tl.fromTo(
          overlayRef.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.4, ease: "power2.inOut" },
          0,
        );

        tl.fromTo(
          titleRef.current,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.3, ease: "power2.out" },
          0.15,
        );

        hoverTl.current = tl;
      }
    },
    { scope: cardRef, dependencies: [reduced, index] },
  );

  const handleMouseEnter = useCallback(() => {
    hoverTl.current?.play();
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTl.current?.reverse();
  }, []);

  return (
    <TransitionLink
      href={`/work/${album.slug.current}`}
      transitionType="morph"
      flipId={album.slug.current}
      className="block"
    >
      <div
        ref={cardRef}
        className="group cursor-pointer"
        style={{ opacity: 0, visibility: "hidden" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image container */}
        <div
          className={`relative overflow-hidden ${large ? "aspect-[3/4]" : "aspect-video"}`}
          data-flip-id={album.slug.current}
        >
          <div ref={imageRef} className="h-full w-full">
            {coverUrl !== null ? (
              <Image
                src={coverUrl!}
                alt={album.title}
                fill
                className="object-cover"
                placeholder={album.blurDataURL ? "blur" : undefined}
                blurDataURL={album.blurDataURL}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-surface to-surface-elevated" />
            )}
          </div>

          {/* Hover overlay */}
          <div
            ref={overlayRef}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backgroundColor: "rgba(123, 147, 176, 0.3)",
              clipPath: "inset(100% 0% 0% 0%)",
            }}
            aria-hidden="true"
          >
            <span
              ref={titleRef}
              className="font-display text-2xl text-text-heading"
              style={{ clipPath: "inset(0% 0% 100% 0%)" }}
            >
              View Project
            </span>
          </div>
        </div>

        {/* Card info */}
        <div className="mt-4 flex items-baseline justify-between">
          <h3 className="font-display text-xl text-text-heading">{album.title}</h3>
          <span className="font-mono text-xs uppercase tracking-wider text-muted">
            {album.category}
          </span>
        </div>
      </div>
    </TransitionLink>
  );
}
