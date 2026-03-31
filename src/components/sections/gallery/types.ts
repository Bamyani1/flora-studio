import type { AlbumMeta } from "@/types/project";

export type GalleryPerformanceMode = "default" | "smooth";

export interface GallerySectionProps {
  album: AlbumMeta;
  /** 1-based index for chapter numbering */
  index: number;
  /** Whether this is the first visible section (affects eager loading) */
  priority?: boolean;
  performanceMode?: GalleryPerformanceMode;
  deferOffscreen?: boolean;
  blurDataURL?: string;
}

export interface GalleryDualSectionProps {
  albums: [AlbumMeta, AlbumMeta];
  index: number;
  performanceMode?: GalleryPerformanceMode;
  deferOffscreen?: boolean;
}
