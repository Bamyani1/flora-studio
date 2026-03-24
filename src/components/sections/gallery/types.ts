import type { AlbumMeta } from "@/types/project";

export interface GallerySectionProps {
  album: AlbumMeta;
  /** 1-based index for chapter numbering */
  index: number;
  /** Whether this is the first visible section (affects eager loading) */
  priority?: boolean;
}

export interface GalleryDualSectionProps {
  albums: [AlbumMeta, AlbumMeta];
  index: number;
}
