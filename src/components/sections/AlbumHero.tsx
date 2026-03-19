"use client";

import Image from "next/image";
import { ImageReveal } from "@/components/animations/ImageReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";

interface AlbumHeroProps {
  title: string;
  category?: string;
  year?: number;
  location?: string;
  heroUrl?: string | null;
  heroBlur?: string;
}

export function AlbumHero({
  title,
  category,
  year,
  location,
  heroUrl,
  heroBlur,
}: AlbumHeroProps) {
  const metaParts = [category, year, location].filter(Boolean);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Hero image */}
      <ImageReveal className="absolute inset-0">
        {heroUrl ? (
          <Image
            src={heroUrl}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            placeholder={heroBlur ? "blur" : undefined}
            blurDataURL={heroBlur}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-surface to-surface-elevated" />
        )}
      </ImageReveal>

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 px-[--container-padding-x] pb-[--space-16]">
        <TextReveal
          variant="lines"
          as="h1"
          delay={0.3}
          className="font-display text-[length:var(--text-3xl)] leading-tight text-text-heading md:text-[length:var(--text-5xl)]"
        >
          {title}
        </TextReveal>

        {metaParts.length > 0 && (
          <FadeIn delay={0.5}>
            <p className="mt-[--space-4] font-mono text-sm uppercase tracking-wider text-muted">
              {metaParts.join(" \u2022 ")}
            </p>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
