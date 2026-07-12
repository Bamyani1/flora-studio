import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PLACEHOLDER_ALL_ALBUMS, PLACEHOLDER_ALBUM_MAP } from "@/lib/placeholder-data";
import { E2E_ALBUMS, E2E_PRIMARY_ALBUM_SLUG } from "@/lib/e2e-content";
import type { Album, SanityImage } from "@/types/project";

vi.mock("server-only", () => ({}));

// Mirrors folioImageCount in @/lib/albums: gallery images excluding the page hero
function expectedFolioCount(album: Album): number {
  const key = (img: SanityImage) => img.url ?? img.asset?._ref;
  const heroKey = album.heroImage ? key(album.heroImage) : undefined;
  return album.images.filter((img) => Boolean(key(img)) && key(img) !== heroKey).length;
}

const originalEnv = { ...process.env };

describe("album loaders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns placeholder albums with derived image counts", async () => {
    const { getAllAlbums } = await import("@/lib/albums");

    await expect(getAllAlbums()).resolves.toEqual(
      PLACEHOLDER_ALL_ALBUMS.map((a) => ({ ...a, imageCount: expectedFolioCount(a) })),
    );
  });

  it("returns placeholder album slugs", async () => {
    const { getAlbumSlugs } = await import("@/lib/albums");

    const slugs = await getAlbumSlugs();

    expect(slugs).toEqual(PLACEHOLDER_ALL_ALBUMS.map((a) => ({ slug: a.slug.current })));
  });

  it("returns placeholder album detail by slug", async () => {
    const { getAlbumBySlug } = await import("@/lib/albums");

    await expect(getAlbumBySlug("march-madness")).resolves.toEqual(
      PLACEHOLDER_ALBUM_MAP["march-madness"],
    );
  });

  it("returns null for unknown slugs", async () => {
    const { getAlbumBySlug } = await import("@/lib/albums");

    await expect(getAlbumBySlug("nonexistent")).resolves.toBeNull();
  });

  it("returns deterministic fixture content in e2e mode", async () => {
    process.env.CONTENT_RUNTIME_MODE = "e2e";

    const { getAllAlbums, getAlbumBySlug, getAlbumSlugs } = await import("@/lib/albums");

    await expect(getAllAlbums()).resolves.toEqual(
      E2E_ALBUMS.map((a) => ({ ...a, imageCount: expectedFolioCount(a) })),
    );
    await expect(getAlbumSlugs()).resolves.toEqual([{ slug: E2E_PRIMARY_ALBUM_SLUG }]);
    await expect(getAlbumBySlug(E2E_PRIMARY_ALBUM_SLUG)).resolves.toEqual(E2E_ALBUMS[0]);
  });

  it("returns null for non-fixture album slugs in e2e mode", async () => {
    process.env.CONTENT_RUNTIME_MODE = "e2e";

    const { getAlbumBySlug } = await import("@/lib/albums");

    await expect(getAlbumBySlug("the-graduate")).resolves.toBeNull();
  });

  it("builds previous and next navigation", async () => {
    const targetSlug = PLACEHOLDER_ALL_ALBUMS[1].slug.current;

    const { getAlbumWithNavigation } = await import("@/lib/albums");

    const result = await getAlbumWithNavigation(targetSlug);

    expect(result.album).toEqual(PLACEHOLDER_ALBUM_MAP[targetSlug]);
    expect(result.previous).toMatchObject({
      title: PLACEHOLDER_ALL_ALBUMS[0].title,
      slug: PLACEHOLDER_ALL_ALBUMS[0].slug.current,
      position: 1,
      total: PLACEHOLDER_ALL_ALBUMS.length,
      wraps: false,
    });
    expect(result.next).toMatchObject({
      title: PLACEHOLDER_ALL_ALBUMS[2].title,
      slug: PLACEHOLDER_ALL_ALBUMS[2].slug.current,
      position: 3,
      wraps: false,
    });
  });

  it("marks the hand-off as wrapping at the archive boundaries", async () => {
    const firstSlug = PLACEHOLDER_ALL_ALBUMS[0].slug.current;
    const lastSlug = PLACEHOLDER_ALL_ALBUMS[PLACEHOLDER_ALL_ALBUMS.length - 1].slug.current;

    const { getAlbumWithNavigation } = await import("@/lib/albums");

    const first = await getAlbumWithNavigation(firstSlug);
    expect(first.previous?.wraps).toBe(true);
    expect(first.next?.wraps).toBe(false);

    const last = await getAlbumWithNavigation(lastSlug);
    expect(last.next?.wraps).toBe(true);
  });

  it("detects a multi-volume series from album titles", async () => {
    const { getAlbumWithNavigation } = await import("@/lib/albums");

    const result = await getAlbumWithNavigation("nature-vol-ii");

    expect(result.series).toMatchObject({ name: "Nature", position: 2 });
    expect(result.series?.volumes.map((v) => v.numeral)).toEqual(["I", "II", "III"]);

    const nonSeries = await getAlbumWithNavigation("the-graduate");
    expect(nonSeries.series).toBeNull();
  });

  it("returns null neighbors when slug is missing from album list", async () => {
    const { getAlbumWithNavigation } = await import("@/lib/albums");

    const result = await getAlbumWithNavigation("nonexistent");

    expect(result).toEqual({ album: null, previous: null, next: null, series: null });
  });

  it("keeps fallback albums on the shared media model", () => {
    expect(PLACEHOLDER_ALBUM_MAP["the-graduate"]).not.toHaveProperty("heroLayers");
    expect(PLACEHOLDER_ALBUM_MAP["the-graduate"]).not.toHaveProperty("heroBlur");
    expect(PLACEHOLDER_ALBUM_MAP["the-graduate"].coverImage.url).toContain("/images/");
    expect(PLACEHOLDER_ALBUM_MAP["milestone"].videoUrl).toBe("/videos/milestone.mp4");
  });
});
