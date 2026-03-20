"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { collectionCardReveal } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveImageUrl } from "@/lib/image-url";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { FadeIn } from "@/components/animations/FadeIn";
import { ClipReveal } from "@/components/animations/ClipReveal";
import type { AlbumMeta } from "@/types/project";

interface CuratedCollectionsProps {
  albums: AlbumMeta[];
}

const CARD_LAYOUTS = [
  { colSpan: "md:col-span-7", aspect: "aspect-[4/3]", offset: "" },
  { colSpan: "md:col-span-5", aspect: "aspect-[3/4]", offset: "" },
  { colSpan: "md:col-span-4", aspect: "aspect-[3/4]", offset: "" },
  { colSpan: "md:col-span-8", aspect: "aspect-video", offset: "md:mt-16" },
] as const;

export function CuratedCollections({ albums }: CuratedCollectionsProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll<HTMLElement>(".collection-card");
      if (!cards.length) return;

      const overlays = gridRef.current.querySelectorAll<HTMLElement>(".collection-overlay");
      const images = gridRef.current.querySelectorAll<HTMLElement>(".collection-image");
      const labels = gridRef.current.querySelectorAll<HTMLElement>(".collection-label");

      if (reduced) {
        gsap.set(overlays, { scaleX: 0 });
        gsap.set(images, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(labels, { autoAlpha: 1, y: 0 });
        return;
      }

      // Set initial hidden states
      gsap.set(overlays, { scaleX: 1, transformOrigin: "left center" });
      gsap.set(images, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(labels, { autoAlpha: 0, y: collectionCardReveal.label.from.y });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          ...collectionCardReveal.scrollTrigger,
        },
      });

      cards.forEach((_, i) => {
        const offset = i * collectionCardReveal.stagger;

        // Overlay wipe away
        tl.fromTo(
          overlays[i],
          collectionCardReveal.overlay.from,
          { ...collectionCardReveal.overlay.to },
          offset,
        );

        // Image clip-path reveal
        tl.fromTo(
          images[i],
          collectionCardReveal.image.from,
          { ...collectionCardReveal.image.to },
          offset,
        );

        // Label fade up (delayed)
        tl.fromTo(
          labels[i],
          collectionCardReveal.label.from,
          { ...collectionCardReveal.label.to },
          offset + collectionCardReveal.labelDelay,
        );
      });
    },
    { scope: gridRef, dependencies: [reduced] },
  );

  return (
    <section className="px-[var(--container-padding-x)] py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[var(--max-width)]">
        {/* Section heading */}
        <div className="mb-16">
          <FadeIn>
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-3xl font-light uppercase text-text-heading md:text-5xl">
                Curated Collections
              </h2>
              <span className="hidden font-label text-xs uppercase tracking-wider text-muted md:block">
                SELECTED WORKS // 2025
              </span>
            </div>
          </FadeIn>
          <ClipReveal direction="left">
            <hr className="mt-4 border-border" />
          </ClipReveal>
        </div>

        {/* Asymmetric grid — V5 Diagonal Flow */}
        <div ref={gridRef} className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {albums.slice(0, 4).map((album, i) => {
            const layout = CARD_LAYOUTS[i] ?? CARD_LAYOUTS[0];
            const coverUrl = resolveImageUrl(album.coverImage);

            return (
              <TransitionLink
                key={album._id}
                href={`/work/${album.slug.current}`}
                className={`collection-card group block ${layout.colSpan} ${layout.offset}`}
              >
                <div
                  className={`relative overflow-hidden ${layout.aspect}`}
                >
                  {/* Image with clip-path reveal (z-0) */}
                  <div className="collection-image absolute inset-0">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={album.title}
                        fill
                        className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-75"
                        sizes="(min-width: 768px) 66vw, 100vw"
                        placeholder={album.blurDataURL ? "blur" : undefined}
                        blurDataURL={album.blurDataURL}
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-surface to-surface-elevated" />
                    )}
                  </div>

                  {/* Orange overlay wipe (z-10) */}
                  <div
                    className="collection-overlay absolute inset-0 z-10"
                    style={{ backgroundColor: collectionCardReveal.overlayColor }}
                    aria-hidden="true"
                  />

                  {/* Hover overlay (z-20) */}
                  <div className="absolute inset-0 z-20 bg-black/0 transition-colors duration-500 group-hover:bg-black/30" />
                </div>

                {/* Label */}
                <div className="collection-label mt-3 flex items-baseline justify-between">
                  <span className="font-label text-xs uppercase tracking-wider text-primary">
                    {String(i + 1).padStart(2, "0")} // COLLECTION
                  </span>
                  <h3 className="font-display text-lg font-normal uppercase text-text-heading">
                    {album.title}
                  </h3>
                </div>
              </TransitionLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
