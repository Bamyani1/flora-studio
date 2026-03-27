import type { Metadata } from "next";
import { getAllAlbums } from "@/lib/albums";
import { buildGalleryLayout } from "@/lib/gallery-layout";
import {
  GalleryHero,
  GalleryBentoSplit,
  GalleryFullBleed,
  GalleryTextureCards,
} from "@/components/sections/gallery";
export const metadata: Metadata = {
  title: "Work",
  description: "Selected photography by Bahar Studio.",
};

export default async function WorkPage() {
  const albums = await getAllAlbums();
  const sections = buildGalleryLayout(albums);
  const performanceMode = "default" as const;

  return (
    <main id="main-content">
      {sections.map((section, i) => {
        switch (section.type) {
          case "hero":
            return (
              <GalleryHero
                key={section.album._id}
                album={section.album}
                index={i + 1}
                priority
                performanceMode={performanceMode}
              />
            );
          case "bento":
            return (
              <GalleryBentoSplit
                key={section.album._id}
                album={section.album}
                index={i + 1}
                reversed={section.reversed}
                performanceMode={performanceMode}
                deferOffscreen={i > 0}
              />
            );
          case "fullBleed":
            return (
              <GalleryFullBleed
                key={section.album._id}
                album={section.album}
                index={i + 1}
                performanceMode={performanceMode}
                deferOffscreen={i > 0}
              />
            );
          case "textureCards":
            return (
              <GalleryTextureCards
                key={`${section.albums[0]._id}-${section.albums[1]._id}`}
                albums={section.albums}
                index={i + 1}
                performanceMode={performanceMode}
                deferOffscreen={i > 0}
              />
            );
        }
      })}
    </main>
  );
}
