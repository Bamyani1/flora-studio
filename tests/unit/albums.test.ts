import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  PLACEHOLDER_ALL_ALBUMS,
  PLACEHOLDER_ALBUM_MAP,
  PLACEHOLDER_FEATURED_ALBUMS,
} from "@/lib/placeholder-data";

const { mockFetch } = vi.hoisted(() => ({
  mockFetch: vi.fn(),
}));

vi.mock("@/sanity/client", () => ({
  client: {
    fetch: mockFetch,
  },
}));

import {
  getAlbumBySlug,
  getAlbumSlugs,
  getAlbumWithNavigation,
  getAllAlbums,
  getFeaturedAlbum,
} from "@/lib/albums";

describe("album loaders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns fetched albums when Sanity succeeds", async () => {
    const albums = PLACEHOLDER_ALL_ALBUMS.slice(0, 2);
    mockFetch.mockResolvedValue(albums);

    await expect(getAllAlbums()).resolves.toEqual(albums);
  });

  it("falls back to placeholder albums when Sanity fails", async () => {
    mockFetch.mockRejectedValue(new Error("cms down"));

    await expect(getAllAlbums()).resolves.toEqual(PLACEHOLDER_ALL_ALBUMS);
  });

  it("returns a random featured album and falls back to placeholders when empty", async () => {
    const albums = [PLACEHOLDER_ALL_ALBUMS[0], PLACEHOLDER_ALL_ALBUMS[1]];
    mockFetch.mockResolvedValueOnce(albums);
    const result = await getFeaturedAlbum();
    expect(albums).toContainEqual(result);

    mockFetch.mockResolvedValueOnce([]);
    const fallback = await getFeaturedAlbum();
    expect(PLACEHOLDER_FEATURED_ALBUMS).toContainEqual(fallback);
  });

  it("normalizes album slugs and falls back when the result is empty", async () => {
    mockFetch.mockResolvedValueOnce([{ slug: "first" }, { slug: 42 }, { nope: true }]);
    await expect(getAlbumSlugs()).resolves.toEqual([{ slug: "first" }]);

    mockFetch.mockResolvedValueOnce([]);
    await expect(getAlbumSlugs()).resolves.toEqual(
      PLACEHOLDER_ALL_ALBUMS.map((album) => ({ slug: album.slug.current })),
    );
  });

  it("returns placeholder album detail when the cms lookup fails", async () => {
    mockFetch.mockRejectedValue(new Error("cms down"));

    await expect(getAlbumBySlug("march-madness")).resolves.toEqual(
      PLACEHOLDER_ALBUM_MAP["march-madness"],
    );
  });

  it("builds previous and next navigation when the slug is present", async () => {
    const targetSlug = PLACEHOLDER_ALL_ALBUMS[1].slug.current;

    mockFetch
      .mockResolvedValueOnce(PLACEHOLDER_ALBUM_MAP[targetSlug])
      .mockResolvedValueOnce(PLACEHOLDER_ALL_ALBUMS.slice(0, 3));

    await expect(getAlbumWithNavigation(targetSlug)).resolves.toMatchObject({
      album: PLACEHOLDER_ALBUM_MAP[targetSlug],
      previous: {
        title: PLACEHOLDER_ALL_ALBUMS[0].title,
        slug: PLACEHOLDER_ALL_ALBUMS[0].slug.current,
      },
      next: {
        title: PLACEHOLDER_ALL_ALBUMS[2].title,
        slug: PLACEHOLDER_ALL_ALBUMS[2].slug.current,
      },
    });
  });

  it("returns null neighbors when the album slug is missing from the album list", async () => {
    mockFetch
      .mockResolvedValueOnce(PLACEHOLDER_ALBUM_MAP["march-madness"])
      .mockResolvedValueOnce(
        PLACEHOLDER_ALL_ALBUMS.filter((album) => album.slug.current !== "march-madness"),
      );

    await expect(getAlbumWithNavigation("march-madness")).resolves.toMatchObject({
      album: PLACEHOLDER_ALBUM_MAP["march-madness"],
      previous: null,
      next: null,
    });
  });

  it("keeps fallback albums on the shared media model", () => {
    expect(PLACEHOLDER_ALBUM_MAP["the-graduate"]).not.toHaveProperty("heroLayers");
    expect(PLACEHOLDER_ALBUM_MAP["the-graduate"]).not.toHaveProperty("heroBlur");
    expect(PLACEHOLDER_ALBUM_MAP["the-graduate"].coverImage.url).toContain("/images/");
    expect(PLACEHOLDER_ALBUM_MAP["milestone"].videoUrl).toBe("/videos/milestone.mp4");
  });
});
