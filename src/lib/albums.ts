import { normalizeImage } from "@/lib/image-url";
import { PLACEHOLDER_ALL_ALBUMS, PLACEHOLDER_ALBUM_MAP } from "@/lib/placeholder-data";
import { E2E_ALBUMS, getE2EAlbumBySlug } from "@/lib/e2e-content";
import {
  getContentRuntimeMode,
  isE2EContentRuntime,
  resolveContentAvailabilityFailure,
} from "@/lib/content-runtime.server";
import { sanityFetch } from "@/sanity/client";
import { ALBUMS_QUERY, ALBUM_BY_SLUG_QUERY, ALBUM_SLUGS_QUERY } from "@/sanity/queries";
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

function shouldFetchFromSanity() {
  const mode = getContentRuntimeMode();
  return mode === "production" || mode === "preview";
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

// Folio plate count: gallery images excluding the hero (which renders at the page top)
function folioImageCount(album: Album): number {
  const key = (img: Album["heroImage"]) => img.url ?? img.asset?._ref;
  const heroKey = album.heroImage ? key(album.heroImage) : undefined;
  return album.images.filter((img) => {
    const k = key(img);
    return Boolean(k) && k !== heroKey;
  }).length;
}

function normalizeAlbumMeta(album: AlbumMeta): AlbumMeta {
  return {
    ...album,
    coverImage: normalizeImage(album.coverImage) ?? album.coverImage,
  };
}

export async function getAllAlbums(): Promise<AlbumMeta[]> {
  if (isE2EContentRuntime()) {
    return E2E_ALBUMS.map((album) =>
      normalizeAlbumMeta({ ...album, imageCount: folioImageCount(album) }),
    );
  }
  if (!shouldFetchFromSanity()) {
    return PLACEHOLDER_ALL_ALBUMS.map((album) => ({
      ...album,
      imageCount: folioImageCount(album),
    }));
  }

  try {
    const albums = await sanityFetch<AlbumMeta[]>({ query: ALBUMS_QUERY });
    return albums.map(normalizeAlbumMeta);
  } catch (error) {
    return resolveContentAvailabilityFailure("albums", error, () => PLACEHOLDER_ALL_ALBUMS);
  }
}

export async function getAlbumSlugs(): Promise<{ slug: string }[]> {
  if (isE2EContentRuntime()) {
    return E2E_ALBUMS.map((album) => ({ slug: album.slug.current }));
  }
  if (!shouldFetchFromSanity()) {
    return PLACEHOLDER_ALL_ALBUMS.map((album) => ({ slug: album.slug.current }));
  }

  try {
    return await sanityFetch<{ slug: string }[]>({ query: ALBUM_SLUGS_QUERY });
  } catch (error) {
    return resolveContentAvailabilityFailure("albumSlugs", error, () =>
      PLACEHOLDER_ALL_ALBUMS.map((album) => ({ slug: album.slug.current })),
    );
  }
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  if (isE2EContentRuntime()) {
    return getE2EAlbumBySlug(slug);
  }
  if (!shouldFetchFromSanity()) return PLACEHOLDER_ALBUM_MAP[slug] ?? null;

  try {
    return await sanityFetch<Album | null>({
      query: ALBUM_BY_SLUG_QUERY,
      params: { slug },
    });
  } catch (error) {
    return resolveContentAvailabilityFailure("album", error, () =>
      PLACEHOLDER_ALBUM_MAP[slug] ?? null,
    );
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
