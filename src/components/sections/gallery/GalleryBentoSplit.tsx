"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { bentoSplitReveal, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveImageUrl, getImageDimensions } from "@/lib/image-url";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { CATEGORY_META } from "@/lib/categories";
import type { GallerySectionProps } from "./types";

interface BentoSplitProps extends GallerySectionProps {
  reversed?: boolean;
}

export function GalleryBentoSplit({
  album,
  reversed = false,
  priority = false,
  performanceMode = "default",
  deferOffscreen = false,
}: BentoSplitProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const coverUrl = resolveImageUrl(album.coverImage);
  const dims = getImageDimensions(album.coverImage);
  const categoryLabel = CATEGORY_META[album.category]?.label ?? album.category;
  const description = CATEGORY_META[album.category]?.description ?? "";
  const smoothMode = performanceMode === "smooth";
  const sectionStyle: CSSProperties | undefined = deferOffscreen
    ? {
        contentVisibility: "auto",
        containIntrinsicSize: "auto 100vh",
        contain: "layout style paint",
      }
    : undefined;
  const imageShellStyle: CSSProperties | undefined = smoothMode
    ? { contain: "layout paint" }
    : undefined;

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      if (reduced) {
        gsap.set(el.querySelectorAll(".bento-img-wrapper"), {
          autoAlpha: 1,
          scale: 1,
          yPercent: 0,
        });
        gsap.set(el.querySelectorAll(".bento-img-color"), { opacity: 1 });
        gsap.set(el.querySelectorAll(".bento-text > *"), {
          autoAlpha: 1,
          y: 0,
        });
        return;
      }

      // Keep /work smooth mode to one-shot entrances only.
      const wrapper = el.querySelector<HTMLElement>(".bento-img-wrapper");
      const colorLayer = el.querySelector<HTMLElement>(".bento-img-color");
      if (!smoothMode && wrapper && colorLayer) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            ...bentoSplitReveal.scrollTrigger,
            onEnter: () => {
              wrapper.style.willChange = "transform";
            },
            onLeave: () => {
              wrapper.style.willChange = "auto";
            },
            onEnterBack: () => {
              wrapper.style.willChange = "transform";
            },
            onLeaveBack: () => {
              wrapper.style.willChange = "auto";
            },
          },
        });
        tl.fromTo(wrapper, bentoSplitReveal.imageWrapper.from, bentoSplitReveal.imageWrapper.to, 0);
        tl.fromTo(
          colorLayer,
          bentoSplitReveal.colorReveal.from,
          bentoSplitReveal.colorReveal.to,
          0,
        );
      }

      // Text stagger
      const textChildren = el.querySelectorAll(".bento-text > *");
      if (textChildren.length > 0) {
        gsap.fromTo(textChildren, bentoSplitReveal.text.from, {
          ...bentoSplitReveal.text.to,
          ...withWillChange(),
          scrollTrigger: {
            trigger: el,
            ...bentoSplitReveal.text.scrollTrigger,
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [reduced, smoothMode] },
  );

  const imageCol = (
    <div
      className={`md:col-span-8 relative overflow-hidden min-h-[40vh] md:self-center group/bento ${reversed ? "md:order-2" : ""} ${reversed ? "" : "border-r border-[var(--color-outline-variant)]/10"}`}
      style={{ aspectRatio: dims ? `${dims.width}/${dims.height}` : undefined }}
    >
      <div className="absolute inset-0 transition-transform duration-[2s] ease-out group-hover/bento:scale-105">
        <div className="bento-img-wrapper absolute inset-0" style={imageShellStyle}>
          {smoothMode ? (
            <>
              {coverUrl ? (
                <Image
                  alt={album.title}
                  className="absolute inset-0 object-cover w-full h-full"
                  src={coverUrl}
                  fill
                  loading={priority ? "eager" : "lazy"}
                  sizes="(min-width: 768px) 66vw, 100vw"
                  placeholder={album.blurDataURL ? "blur" : undefined}
                  blurDataURL={album.blurDataURL}
                />
              ) : (
                <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-surface to-surface-elevated" />
              )}
              <div
                className="absolute inset-0 bg-[var(--color-surface-deep)]/12"
                aria-hidden="true"
              />
            </>
          ) : (
            <>
              {coverUrl ? (
                <Image
                  alt=""
                  aria-hidden
                  className="object-cover w-full h-full"
                  style={{ filter: bentoSplitReveal.grayFilter }}
                  src={coverUrl}
                  fill
                  loading={priority ? "eager" : "lazy"}
                  sizes="(min-width: 768px) 66vw, 100vw"
                  placeholder={album.blurDataURL ? "blur" : undefined}
                  blurDataURL={album.blurDataURL}
                />
              ) : (
                <div
                  className="h-full w-full bg-gradient-to-br from-surface to-surface-elevated"
                  style={{ filter: bentoSplitReveal.grayFilter }}
                />
              )}
              {coverUrl ? (
                <Image
                  alt={album.title}
                  className="bento-img-color absolute inset-0 object-cover w-full h-full"
                  src={coverUrl}
                  fill
                  loading={priority ? "eager" : "lazy"}
                  sizes="(min-width: 768px) 66vw, 100vw"
                  placeholder={album.blurDataURL ? "blur" : undefined}
                  blurDataURL={album.blurDataURL}
                />
              ) : (
                <div className="bento-img-color absolute inset-0 h-full w-full bg-gradient-to-br from-surface to-surface-elevated" />
              )}
            </>
          )}
        </div>
      </div>
      <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity duration-700 group-hover/bento:opacity-100" />
      <div className="absolute bottom-12 left-12">
        <span className="font-label text-[10px] tracking-[0.1em] text-primary">
          {categoryLabel} {album.year ? `| ${album.year}` : ""}
        </span>
      </div>
    </div>
  );

  const textCol = (
    <div
      className={`md:col-span-4 flex flex-col bg-[var(--color-surface)] p-12 justify-center bento-text ${reversed ? "md:order-1 border-r border-[var(--color-outline-variant)]/10" : ""}`}
    >
      <h3 className="font-display text-[length:var(--text-3xl)] text-text-heading leading-tight">
        {album.title}
      </h3>
      <div className="w-12 h-[1px] bg-primary-muted my-8" />
      <p className="font-body text-[var(--color-on-surface-variant)] text-sm leading-loose opacity-80 mb-8">
        {description}
      </p>
      <TransitionLink
        href={`/work/${album.slug.current}`}
        className="relative group/btn inline-flex w-fit overflow-hidden p-[1px]"
      >
        {/* Traveling golden light — always visible */}
        <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,var(--color-primary)_90%,transparent_100%)]" />
        {/* Button face */}
        <span className="relative z-10 inline-flex items-center gap-4 py-4 px-8 bg-[var(--color-surface)] transition-colors duration-500 group-hover/btn:bg-[var(--color-surface-elevated)]">
          <span className="font-label text-xs tracking-widest uppercase text-text-heading">
            View Series
          </span>
          <ArrowRight className="w-4 h-4 text-text-heading transition-transform duration-300 group-hover/btn:translate-x-2" />
        </span>
      </TransitionLink>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-surface grid grid-cols-1 md:grid-cols-12 overflow-hidden"
      style={sectionStyle}
      aria-label={`${album.title} — album showcase`}
    >
      {!smoothMode && <div className="grain-medium absolute inset-0 z-[2]" aria-hidden="true" />}
      {imageCol}
      {textCol}
    </section>
  );
}
