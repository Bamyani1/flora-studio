import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { ALBUMS_QUERY } from "@/sanity/queries";
import { PLACEHOLDER_ALL_ALBUMS } from "@/lib/placeholder-data";
import { buildGalleryLayout } from "@/lib/gallery-layout";
import {
  GalleryHero,
  GalleryBentoSplit,
  GalleryFullBleed,
  GalleryTextureCards,
} from "@/components/sections/gallery";
import type { AlbumMeta } from "@/types/project";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected photography by Saffron Studios.",
};

async function getAllAlbums(): Promise<AlbumMeta[]> {
  try {
    return await client.fetch(ALBUMS_QUERY);
  } catch {
    return PLACEHOLDER_ALL_ALBUMS;
  }
}

export default async function WorkPage() {
  const albums = await getAllAlbums();
  const sections = buildGalleryLayout(albums);

  return (
    <main id="main-content">
      {sections.map((section, i) => {
        switch (section.type) {
          case "hero":
            return (
              <GalleryHero key={section.album._id} album={section.album} index={i + 1} priority />
            );
          case "bento":
            return (
              <GalleryBentoSplit
                key={section.album._id}
                album={section.album}
                index={i + 1}
                reversed={section.reversed}
              />
            );
          case "fullBleed":
            return <GalleryFullBleed key={section.album._id} album={section.album} index={i + 1} />;
          case "textureCards":
            return (
              <GalleryTextureCards
                key={`${section.albums[0]._id}-${section.albums[1]._id}`}
                albums={section.albums}
                index={i + 1}
              />
            );
        }
      })}
    </main>
  );
}
