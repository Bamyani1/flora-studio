import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PLACEHOLDER_ALL_ALBUMS,
  PLACEHOLDER_ALBUM_MAP,
  PLACEHOLDER_FEATURED_ALBUMS,
} from "@/lib/placeholder-data";
import { E2E_ALBUMS, E2E_PRIMARY_ALBUM_SLUG } from "@/lib/e2e-content";

vi.mock("server-only", () => ({}));

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

  it("returns placeholder albums directly", async () => {
    const { getAllAlbums } = await import("@/lib/albums");

    await expect(getAllAlbums()).resolves.toEqual(PLACEHOLDER_ALL_ALBUMS);
  });

  it("returns a featured album from placeholders", async () => {
    const { getFeaturedAlbum } = await import("@/lib/albums");

    const result = await getFeaturedAlbum();

    expect(PLACEHOLDER_FEATURED_ALBUMS).toContainEqual(result);
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

    const { getAllAlbums, getAlbumBySlug, getAlbumSlugs, getFeaturedAlbum } =
      await import("@/lib/albums");

    await expect(getAllAlbums()).resolves.toEqual(E2E_ALBUMS);
    await expect(getAlbumSlugs()).resolves.toEqual([{ slug: E2E_PRIMARY_ALBUM_SLUG }]);
    await expect(getAlbumBySlug(E2E_PRIMARY_ALBUM_SLUG)).resolves.toEqual(E2E_ALBUMS[0]);
    await expect(getFeaturedAlbum()).resolves.toEqual(E2E_ALBUMS[0]);
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
    expect(result.previous).toEqual({
      title: PLACEHOLDER_ALL_ALBUMS[0].title,
      slug: PLACEHOLDER_ALL_ALBUMS[0].slug.current,
    });
    expect(result.next).toEqual({
      title: PLACEHOLDER_ALL_ALBUMS[2].title,
      slug: PLACEHOLDER_ALL_ALBUMS[2].slug.current,
    });
  });

  it("returns null neighbors when slug is missing from album list", async () => {
    const { getAlbumWithNavigation } = await import("@/lib/albums");

    const result = await getAlbumWithNavigation("nonexistent");

    expect(result).toEqual({ album: null, previous: null, next: null });
  });

  it("keeps fallback albums on the shared media model", () => {
    expect(PLACEHOLDER_ALBUM_MAP["the-graduate"]).not.toHaveProperty("heroLayers");
    expect(PLACEHOLDER_ALBUM_MAP["the-graduate"]).not.toHaveProperty("heroBlur");
    expect(PLACEHOLDER_ALBUM_MAP["the-graduate"].coverImage.url).toContain("/images/");
    expect(PLACEHOLDER_ALBUM_MAP["milestone"].videoUrl).toBe("/videos/milestone.mp4");
  });
});
