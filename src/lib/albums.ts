import {
  albumMetaArraySchema,
  albumSchema,
  albumSlugArraySchema,
  parseSanityContent,
  SanityContentError,
} from "@/lib/cms-validation";
import { normalizeImage, normalizeImages } from "@/lib/image-url";
import {
  ALBUM_BY_SLUG_QUERY,
  ALBUM_SLUGS_QUERY,
  ALBUMS_QUERY,
  FEATURED_ALBUMS_QUERY,
} from "@/sanity/queries";
import { sanityFetch } from "@/sanity/client";
import {
  PLACEHOLDER_ALL_ALBUMS,
  PLACEHOLDER_ALBUM_MAP,
  PLACEHOLDER_FEATURED_ALBUMS,
} from "@/lib/placeholder-data";
import { E2E_ALBUMS, getE2EAlbumBySlug } from "@/lib/e2e-content";
import {
  isE2EContentRuntime,
  resolveContentAvailabilityFailure,
} from "@/lib/content-runtime.server";
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

function normalizeAlbum(album: Album): Album {
  return {
    ...normalizeAlbumMeta(album),
    heroImage: normalizeImage(album.heroImage) ?? album.heroImage,
    images: normalizeImages(album.images),
  };
}

export async function getAllAlbums(): Promise<AlbumMeta[]> {
  if (isE2EContentRuntime()) {
    return E2E_ALBUMS.map((album) => normalizeAlbumMeta(album));
  }

  try {
    const albums = parseSanityContent(
      "albums",
      albumMetaArraySchema,
      await sanityFetch<unknown>({ query: ALBUMS_QUERY }),
    );

    return albums.map((album) => normalizeAlbumMeta(album));
  } catch (error) {
    if (error instanceof SanityContentError) {
      throw error;
    }

    return resolveContentAvailabilityFailure("albums", error, () => PLACEHOLDER_ALL_ALBUMS);
  }
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

  try {
    const featuredAlbums = parseSanityContent(
      "featured albums",
      albumMetaArraySchema,
      await sanityFetch<unknown>({ query: FEATURED_ALBUMS_QUERY }),
    ).map((album) => normalizeAlbumMeta(album));

    if (featuredAlbums.length > 0) {
      return pick(featuredAlbums);
    }

    const liveAlbums = await getAllAlbums();

    if (liveAlbums.length === 0) {
      return null;
    }

    return pick(liveAlbums);
  } catch (error) {
    if (error instanceof SanityContentError) {
      throw error;
    }

    return resolveContentAvailabilityFailure("featured albums", error, () =>
      pick(PLACEHOLDER_FEATURED_ALBUMS),
    );
  }
}

export async function getAlbumSlugs(): Promise<{ slug: string }[]> {
  if (isE2EContentRuntime()) {
    return E2E_ALBUMS.map((album) => ({ slug: album.slug.current }));
  }

  try {
    return parseSanityContent(
      "album slugs",
      albumSlugArraySchema,
      await sanityFetch<unknown>({ query: ALBUM_SLUGS_QUERY }),
    );
  } catch (error) {
    if (error instanceof SanityContentError) {
      throw error;
    }

    return resolveContentAvailabilityFailure("album slugs", error, () =>
      PLACEHOLDER_ALL_ALBUMS.map((album) => ({ slug: album.slug.current })),
    );
  }
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  if (isE2EContentRuntime()) {
    return getE2EAlbumBySlug(slug);
  }

  try {
    const album = await sanityFetch<unknown | null>({ query: ALBUM_BY_SLUG_QUERY, params: { slug } });

    if (album === null) {
      return null;
    }

    return normalizeAlbum(parseSanityContent("album detail", albumSchema, album));
  } catch (error) {
    if (error instanceof SanityContentError) {
      throw error;
    }

    return resolveContentAvailabilityFailure("album detail", error, () => PLACEHOLDER_ALBUM_MAP[slug] ?? null);
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
