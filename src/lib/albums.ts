import { client } from "@/sanity/client";
import {
  ALBUM_BY_SLUG_QUERY,
  ALBUM_SLUGS_QUERY,
  ALBUMS_QUERY,
  FEATURED_ALBUMS_QUERY,
} from "@/sanity/queries";
import {
  PLACEHOLDER_ALL_ALBUMS,
  PLACEHOLDER_ALBUM_MAP,
  PLACEHOLDER_FEATURED_ALBUMS,
} from "@/lib/placeholder-data";
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

export async function getAllAlbums(): Promise<AlbumMeta[]> {
  try {
    const albums = await client.fetch(ALBUMS_QUERY);
    return Array.isArray(albums) && albums.length > 0 ? albums : PLACEHOLDER_ALL_ALBUMS;
  } catch {
    return PLACEHOLDER_ALL_ALBUMS;
  }
}

export async function getFeaturedAlbum(): Promise<AlbumMeta> {
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  try {
    const albums = await client.fetch(FEATURED_ALBUMS_QUERY);
    return Array.isArray(albums) && albums.length > 0
      ? pick(albums)
      : pick(PLACEHOLDER_FEATURED_ALBUMS);
  } catch {
    return pick(PLACEHOLDER_FEATURED_ALBUMS);
  }
}

export async function getAlbumSlugs(): Promise<{ slug: string }[]> {
  try {
    const slugs = await client.fetch(ALBUM_SLUGS_QUERY);
    const normalized = Array.isArray(slugs)
      ? slugs.filter((entry): entry is { slug: string } => typeof entry?.slug === "string")
      : [];
    return normalized.length > 0
      ? normalized
      : PLACEHOLDER_ALL_ALBUMS.map((album) => ({ slug: album.slug.current }));
  } catch {
    return PLACEHOLDER_ALL_ALBUMS.map((album) => ({ slug: album.slug.current }));
  }
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  try {
    const album = await client.fetch(ALBUM_BY_SLUG_QUERY, { slug });
    return album ?? PLACEHOLDER_ALBUM_MAP[slug] ?? null;
  } catch {
    return PLACEHOLDER_ALBUM_MAP[slug] ?? null;
  }
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
