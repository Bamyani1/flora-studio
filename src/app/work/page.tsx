import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { ALBUMS_QUERY } from "@/sanity/queries";
import { PLACEHOLDER_ALL_ALBUMS } from "@/lib/placeholder-data";
import { TextReveal } from "@/components/animations/TextReveal";
import { FilterableGrid } from "@/components/sections/FilterableGrid";
import type { AlbumMeta } from "@/types/project";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Browse photography albums by Silk Studio. Landscape, night sky, sports, portrait, and travel photography.",
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
    <main id="main-content" className="min-h-screen px-[var(--container-padding-x)] pt-[var(--header-height)]">
      <section className="pt-[var(--space-16)] pb-[var(--section-padding-y)]">
        <TextReveal
          variant="lines"
          as="h1"
          className="mb-[var(--space-16)] font-display font-light text-[length:var(--text-4xl)] text-text-heading md:text-[length:var(--text-6xl)]"
        >
          Work
        </TextReveal>

        <FilterableGrid albums={albums} />
      </section>
    </main>
  );
}
