"use client";

import { ImageReveal } from "@/components/animations/ImageReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { CATEGORY_META } from "@/lib/categories";
import { resolveImageUrl } from "@/lib/image-url";
import { SiteMedia } from "@/components/ui/SiteMedia";
import type { AlbumSeries } from "@/lib/albums";
import type { SanityImage } from "@/types/project";

interface AlbumHeroProps {
  title: string;
  category?: string;
  year?: number;
  location?: string;
  heroImage?: SanityImage;
  blurDataURL?: string;
  series?: AlbumSeries;
}

export function AlbumHero({
  title,
  category,
  year,
  location,
  heroImage,
  blurDataURL,
  series,
}: AlbumHeroProps) {
  const categoryLabel = category ? (CATEGORY_META[category]?.label ?? category) : undefined;
  const metaParts = [categoryLabel, year, location].filter(Boolean);
  const heroSrc = resolveImageUrl(heroImage);

  return (
    <section className="relative h-dvh overflow-hidden">
      {/* Hero image */}
      <ImageReveal className="absolute inset-0">
        <SiteMedia
          src={heroSrc}
          alt={heroImage?.alt || title}
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
          blurDataURL={blurDataURL}
        />
      </ImageReveal>

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      {/* Localized scrim behind the title block — guarantees legibility over
          bright hero photographs where the global gradient thins out */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 58% 42% at 16% 96%, color-mix(in srgb, var(--color-background) 82%, transparent), transparent 72%)",
        }}
      />

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 px-[var(--container-padding-x)] pb-[var(--space-16)]">
        {/* immediate: the title must reveal on mount — on short viewports it can
            sit below the scroll-trigger line and would otherwise never fire */}
        <TextReveal
          variant="lines"
          as="h1"
          delay={0.3}
          immediate
          className="font-display text-[length:var(--text-3xl)] leading-tight text-text-heading md:text-[length:var(--text-5xl)]"
        >
          {title}
        </TextReveal>

        {metaParts.length > 0 && (
          <FadeIn delay={0.5} immediate>
            <p className="mt-[var(--space-4)] font-label text-sm uppercase tracking-wider text-text/80">
              {metaParts.join(" \u2022 ")}
            </p>
          </FadeIn>
        )}

        {/* A multi-volume series announces itself and lets the reader switch
            volumes \u2014 landing on Vol. II should never hide Vol. I and III */}
        {series && (
          <FadeIn delay={0.65} immediate>
            <div className="mt-[var(--space-4)] flex items-center gap-4">
              <span className="eyebrow text-text/80">
                {series.name} &mdash; Volume{" "}
                {series.volumes[series.position - 1]?.numeral} of{" "}
                {series.volumes[series.volumes.length - 1]?.numeral}
              </span>
              <span className="h-px w-6 bg-primary/50" aria-hidden="true" />
              <nav aria-label={`${series.name} series volumes`} className="flex items-center gap-3">
                {series.volumes.map((volume) =>
                  volume.current ? (
                    <span key={volume.slug} aria-current="page" className="eyebrow text-primary">
                      {volume.numeral}
                    </span>
                  ) : (
                    <TransitionLink
                      key={volume.slug}
                      href={`/work/${volume.slug}`}
                      aria-label={volume.title}
                      className="eyebrow py-2 -my-2 text-muted transition-colors can-hover:hover:text-text"
                    >
                      {volume.numeral}
                    </TransitionLink>
                  ),
                )}
              </nav>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
