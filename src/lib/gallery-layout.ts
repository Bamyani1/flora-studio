import type { AlbumMeta } from "@/types/project";

export type SectionAssignment =
  | { type: "hero"; album: AlbumMeta }
  | { type: "grid"; albums: AlbumMeta[] };

/**
 * Maps N albums to a hero + grid layout.
 * First album is the hero. Remaining albums go into an asymmetric grid.
 */
export function buildGalleryLayout(albums: AlbumMeta[]): SectionAssignment[] {
  if (albums.length === 0) return [];

  const sections: SectionAssignment[] = [
    { type: "hero", album: albums[0] },
  ];

  if (albums.length > 1) {
    sections.push({ type: "grid", albums: albums.slice(1) });
  }

  return sections;
}
