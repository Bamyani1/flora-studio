import type { AlbumMeta } from "@/types/project";

export type SectionAssignment =
  | { type: "hero"; album: AlbumMeta }
  | { type: "bento"; album: AlbumMeta; reversed: boolean }
  | { type: "fullBleed"; album: AlbumMeta }
  | { type: "textureCards"; albums: [AlbumMeta, AlbumMeta] };

/**
 * Maps N albums to a cinematic gallery layout.
 *
 * Pattern: hero → [bento, fullBleed, textureCards(2)] repeating.
 * Bento sections alternate `reversed` for visual variety.
 */
export function buildGalleryLayout(albums: AlbumMeta[]): SectionAssignment[] {
  const sections: SectionAssignment[] = [];
  if (albums.length === 0) return sections;

  let idx = 0;
  let bentoCount = 0;

  // First album is always the hero
  sections.push({ type: "hero", album: albums[idx++] });

  // Remaining albums follow the cycle: bento, fullBleed, textureCards(2)
  while (idx < albums.length) {
    const remaining = albums.length - idx;

    if (remaining >= 4) {
      sections.push({ type: "bento", album: albums[idx++], reversed: bentoCount % 2 !== 0 });
      bentoCount++;
      sections.push({ type: "fullBleed", album: albums[idx++] });
      sections.push({ type: "textureCards", albums: [albums[idx++], albums[idx++]] });
    } else if (remaining === 3) {
      sections.push({ type: "bento", album: albums[idx++], reversed: bentoCount % 2 !== 0 });
      bentoCount++;
      sections.push({ type: "fullBleed", album: albums[idx++] });
      sections.push({ type: "bento", album: albums[idx++], reversed: bentoCount % 2 !== 0 });
      bentoCount++;
    } else if (remaining === 2) {
      sections.push({ type: "bento", album: albums[idx++], reversed: bentoCount % 2 !== 0 });
      bentoCount++;
      sections.push({ type: "fullBleed", album: albums[idx++] });
    } else {
      sections.push({ type: "bento", album: albums[idx++], reversed: bentoCount % 2 !== 0 });
      bentoCount++;
    }
  }

  return sections;
}
