import { normalizeImage } from "@/lib/image-url";
import {
  PLACEHOLDER_ALL_ALBUMS,
  PLACEHOLDER_ALBUM_MAP,
  PLACEHOLDER_FEATURED_ALBUMS,
} from "@/lib/placeholder-data";
import { E2E_ALBUMS, getE2EAlbumBySlug } from "@/lib/e2e-content";
import { isE2EContentRuntime } from "@/lib/content-runtime.server";
import type { Album, AlbumMeta } from "@/types/project";

export interface AlbumNavigationItem {
  title: string;
  slug: string;
}

export interface AlbumWithNavigation {
  album: Album | null;
  previous: AlbumNavigationItem | null;
  next: AlbumNavigationItem | null;
}

function buildAlbumNavigation(
  albums: AlbumMeta[],
  slug: string,
): Pick<AlbumWithNavigation, "previous" | "next"> {
  if (albums.length <= 1) {
    return { previous: null, next: null };
  }

  const currentIndex = albums.findIndex((album) => album.slug.current === slug);
  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  const previousIndex = currentIndex === 0 ? albums.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === albums.length - 1 ? 0 : currentIndex + 1;

  return {
    previous: {
      title: albums[previousIndex].title,
      slug: albums[previousIndex].slug.current,
    },
    next: {
      title: albums[nextIndex].title,
      slug: albums[nextIndex].slug.current,
    },
  };
}

function normalizeAlbumMeta(album: AlbumMeta): AlbumMeta {
  return {
    ...album,
    coverImage: normalizeImage(album.coverImage) ?? album.coverImage,
  };
}

// Sanity disconnected — all album content served from code-first placeholders.

export async function getAllAlbums(): Promise<AlbumMeta[]> {
  if (isE2EContentRuntime()) {
    return E2E_ALBUMS.map((album) => normalizeAlbumMeta(album));
  }
  return PLACEHOLDER_ALL_ALBUMS;
}

export async function getFeaturedAlbum(): Promise<AlbumMeta | null> {
  const pick = <T>(arr: T[]): T => {
    const now = new Date();
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
    );
    return arr[dayOfYear % arr.length];
  };

  if (isE2EContentRuntime()) {
    const featuredAlbum = E2E_ALBUMS.find((album) => album.featured) ?? E2E_ALBUMS[0] ?? null;
    return featuredAlbum ? normalizeAlbumMeta(featuredAlbum) : null;
  }

  return pick(PLACEHOLDER_FEATURED_ALBUMS);
}

export async function getAlbumSlugs(): Promise<{ slug: string }[]> {
  if (isE2EContentRuntime()) {
    return E2E_ALBUMS.map((album) => ({ slug: album.slug.current }));
  }
  return PLACEHOLDER_ALL_ALBUMS.map((album) => ({ slug: album.slug.current }));
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  if (isE2EContentRuntime()) {
    return getE2EAlbumBySlug(slug);
  }
  return PLACEHOLDER_ALBUM_MAP[slug] ?? null;
}

export async function getAlbumWithNavigation(slug: string): Promise<AlbumWithNavigation> {
  const [album, albums] = await Promise.all([getAlbumBySlug(slug), getAllAlbums()]);

  if (!album) {
    return { album: null, previous: null, next: null };
  }

  return {
    album,
    ...buildAlbumNavigation(albums, slug),
  };
}
