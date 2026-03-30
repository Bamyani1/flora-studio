import type { Metadata } from "next";
import { getAllAlbums } from "@/lib/albums";
import { buildGalleryLayout } from "@/lib/gallery-layout";
import { GalleryHero } from "@/components/sections/gallery";
import { ProjectCard } from "@/components/sections/ProjectCard";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected photography by Bahar Studio.",
};

export default async function WorkPage() {
  const albums = await getAllAlbums();
  const sections = buildGalleryLayout(albums);

  return (
    <main id="main-content">
      {sections.map((section) => {
        if (section.type === "hero") {
          return (
            <GalleryHero
              key={section.album._id}
              album={section.album}
              index={1}
              priority
            />
          );
        }

        return (
          <section
            key="gallery-grid"
            className="relative w-full bg-surface"
          >
            <div className="grain-medium absolute inset-0 z-[2]" aria-hidden="true" />
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
  );
}
