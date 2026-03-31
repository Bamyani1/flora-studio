import type { Metadata } from "next";
import { getAllAlbums } from "@/lib/albums";
import { buildGalleryLayout } from "@/lib/gallery-layout";
import { generateLqipDataUrl } from "@/lib/lqip";
import { resolveImageUrl } from "@/lib/image-url";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { publicEnv } from "@/lib/public-env";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { GalleryHero } from "@/components/sections/gallery";
import { ProjectCard } from "@/components/sections/ProjectCard";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Browse the portfolio of Bahar Studio — milestones, gatherings, portraits, motion, and professional photography captured in Dayton, Ohio.",
};

export default async function WorkPage() {
  const albums = await getAllAlbums();
  const sections = buildGalleryLayout(albums);

  const heroSection = sections.find((s) => s.type === "hero");
  const heroBlurDataURL =
    heroSection?.type === "hero"
      ? await generateLqipDataUrl(resolveImageUrl(heroSection.album.coverImage))
      : undefined;

  const SITE_URL = publicEnv.siteUrl;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Work", url: `${SITE_URL}/work` },
  ]);

  if (sections.length === 0) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
        <main
        id="main-content"
        className="flex min-h-screen items-center justify-center bg-surface px-6 py-24 text-center"
      >
        <div className="max-w-2xl">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-primary">
            Work
          </p>
          <h1 className="mt-6 font-display text-4xl text-text-heading md:text-5xl">
            No published albums right now.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted">
            The work archive is being updated. Check back soon or get in touch if you want to
            discuss a session.
          </p>
          <TransitionLink
            href="/contact"
            className="mt-10 inline-flex min-h-[44px] items-center border border-border px-6 py-3 font-label text-sm uppercase tracking-wider text-text transition-colors hover:border-border-hover hover:text-text-heading"
          >
            Contact
          </TransitionLink>
        </div>
      </main>
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <main id="main-content">
      {sections.map((section) => {
        if (section.type === "hero") {
          return (
            <GalleryHero
              key={section.album._id}
              album={section.album}
              index={1}
              priority
              blurDataURL={heroBlurDataURL}
            />
          );
        }

        return (
          <section
            key="gallery-grid"
            className="relative w-full bg-surface"
          >
            <div className="grain-medium absolute inset-0 z-grain" aria-hidden="true" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-px md:[grid-auto-flow:dense]">
              {section.albums.map((album, albumIdx) => {
                const groupIndex = Math.floor(albumIdx / 3);
                const isLarge = albumIdx % 3 === 0;
                const side = groupIndex % 2 === 0 ? "left" : "right";

                return (
                  <ProjectCard
                    key={album._id}
                    album={album}
                    index={albumIdx}
                    large={isLarge}
                    gridSide={isLarge ? side : undefined}
                    eagerImage={albumIdx < 3}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
    </>
  );
}
