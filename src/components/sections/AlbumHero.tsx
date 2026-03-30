"use client";

import { ImageReveal } from "@/components/animations/ImageReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { CATEGORY_META } from "@/lib/categories";
import { resolveImageUrl } from "@/lib/image-url";
import { SiteMedia } from "@/components/ui/SiteMedia";
import type { SanityImage } from "@/types/project";

interface AlbumHeroProps {
  title: string;
  category?: string;
  year?: number;
  location?: string;
  heroImage?: SanityImage;
}

export function AlbumHero({ title, category, year, location, heroImage }: AlbumHeroProps) {
  const categoryLabel = category ? (CATEGORY_META[category]?.label ?? category) : undefined;
  const metaParts = [categoryLabel, year, location].filter(Boolean);
  const heroSrc = resolveImageUrl(heroImage);

  return (
    <section className="relative h-dvh overflow-hidden">
      {/* Hero image */}
      <ImageReveal className="absolute inset-0">
        <SiteMedia
          src={heroSrc}
          alt={`${title} hero`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </ImageReveal>

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 px-[var(--container-padding-x)] pb-[var(--space-16)]">
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
            <p className="mt-[var(--space-4)] font-label text-sm uppercase tracking-wider text-muted">
              {metaParts.join(" \u2022 ")}
            </p>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
