import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { ALBUMS_QUERY } from "@/sanity/queries";
import { PLACEHOLDER_ALL_ALBUMS } from "@/lib/placeholder-data";
import { TextReveal } from "@/components/animations/TextReveal";
import { FilterableGrid } from "@/components/sections/FilterableGrid";
import type { AlbumMeta } from "@/types/project";

export const metadata: Metadata = {
  title: "Work — Bamyan Storyworks",
  description:
    "Browse photography albums by Bamyan Storyworks. Personal, event, sports, and solo portrait collections.",
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

  return (
    <main className="min-h-screen px-[--container-padding-x] pt-[--header-height]">
      <section className="py-[--section-padding-y]">
        <TextReveal
          variant="lines"
          as="h1"
          className="mb-[--space-16] font-display text-[length:var(--text-6xl)] text-text-heading"
        >
          Work
        </TextReveal>

        <FilterableGrid albums={albums} />
      </section>
    </main>
  );
}
