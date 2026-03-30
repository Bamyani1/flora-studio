import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PLACEHOLDER_ALL_ALBUMS,
  PLACEHOLDER_ALBUM_MAP,
  PLACEHOLDER_FEATURED_ALBUMS,
} from "@/lib/placeholder-data";

const { MockSanityConfigurationError, mockSanityFetch } = vi.hoisted(() => {
  class MockSanityConfigurationError extends Error {
    constructor(message = "Missing SANITY_READ_TOKEN for server-side Sanity reads.") {
      super(message);
      this.name = "SanityConfigurationError";
    }
  }

  return {
    MockSanityConfigurationError,
    mockSanityFetch: vi.fn(),
  };
});

const originalEnv = { ...process.env };

vi.mock("@/sanity/client", () => ({
  SanityConfigurationError: MockSanityConfigurationError,
  sanityFetch: mockSanityFetch,
}));

describe("album loaders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns fetched albums when Sanity succeeds", async () => {
    const albums = PLACEHOLDER_ALL_ALBUMS.slice(0, 2);
    mockSanityFetch.mockResolvedValue(albums);

    const { getAllAlbums } = await import("@/lib/albums");

    await expect(getAllAlbums()).resolves.toEqual(albums);
  });

  it("returns an empty album list when Sanity succeeds with no albums", async () => {
    mockSanityFetch.mockResolvedValue([]);

    const { getAllAlbums } = await import("@/lib/albums");

    await expect(getAllAlbums()).resolves.toEqual([]);
  });

  it("falls back to placeholder albums when Sanity is unavailable", async () => {
    mockSanityFetch.mockRejectedValue(new Error("cms down"));

    const { getAllAlbums } = await import("@/lib/albums");

    await expect(getAllAlbums()).resolves.toEqual(PLACEHOLDER_ALL_ALBUMS);
  });

  it("rethrows a Sanity configuration error instead of falling back", async () => {
    mockSanityFetch.mockRejectedValue(new MockSanityConfigurationError());

    const { getAllAlbums } = await import("@/lib/albums");

    await expect(getAllAlbums()).rejects.toMatchObject({
      name: "SanityConfigurationError",
    });
  });

  it("throws on invalid published album list data", async () => {
    mockSanityFetch.mockResolvedValue([{ slug: { current: "broken" } }]);

    const { getAllAlbums } = await import("@/lib/albums");

    await expect(getAllAlbums()).rejects.toMatchObject({
      name: "SanityContentError",
    });
  });

  it("prefers live featured albums and falls back to any live album before placeholders", async () => {
    const liveAlbums = [PLACEHOLDER_ALL_ALBUMS[0], PLACEHOLDER_ALL_ALBUMS[1]];
    mockSanityFetch.mockResolvedValueOnce([]).mockResolvedValueOnce(liveAlbums);

    const { getFeaturedAlbum } = await import("@/lib/albums");

    const result = await getFeaturedAlbum();

    expect(liveAlbums).toContainEqual(result);
  });

  it("returns null when Sanity is available but there are no published albums", async () => {
    mockSanityFetch.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    const { getFeaturedAlbum } = await import("@/lib/albums");

    await expect(getFeaturedAlbum()).resolves.toBeNull();
  });

  it("falls back to placeholder featured albums when Sanity is unavailable", async () => {
    mockSanityFetch.mockRejectedValue(new Error("cms down"));

    const { getFeaturedAlbum } = await import("@/lib/albums");

    const result = await getFeaturedAlbum();

    expect(PLACEHOLDER_FEATURED_ALBUMS).toContainEqual(result);
  });

  it("returns normalized album slugs and preserves an empty live result", async () => {
    mockSanityFetch.mockResolvedValueOnce([{ slug: "first" }, { slug: "second" }]);

    const { getAlbumSlugs } = await import("@/lib/albums");

    await expect(getAlbumSlugs()).resolves.toEqual([{ slug: "first" }, { slug: "second" }]);

    mockSanityFetch.mockResolvedValueOnce([]);
    await expect(getAlbumSlugs()).resolves.toEqual([]);
  });

  it("normalizes Sanity image refs into usable urls", async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "studio123";
    process.env.NEXT_PUBLIC_SANITY_DATASET = "production";

    mockSanityFetch.mockResolvedValue({
      ...PLACEHOLDER_ALBUM_MAP["march-madness"],
      coverImage: {
        _type: "image",
        asset: { _type: "reference", _ref: "image-coverabc-1600x900-jpg" },
        alt: "March Madness cover",
      },
      heroImage: {
        _type: "image",
        asset: { _type: "reference", _ref: "image-heroabc-1600x900-jpg" },
        alt: "March Madness hero",
      },
      images: [
        {
          _type: "image",
          asset: { _type: "reference", _ref: "image-galleryabc-1600x900-jpg" },
          alt: "March Madness 1",
        },
      ],
    });

    const { getAlbumBySlug } = await import("@/lib/albums");

    const album = await getAlbumBySlug("march-madness");

    expect(album?.coverImage.url).toBe(
      "https://cdn.sanity.io/images/studio123/production/coverabc-1600x900.jpg",
    );
    expect(album?.heroImage.url).toBe(
      "https://cdn.sanity.io/images/studio123/production/heroabc-1600x900.jpg",
    );
    expect(album?.images[0]?.url).toBe(
      "https://cdn.sanity.io/images/studio123/production/galleryabc-1600x900.jpg",
    );
  });

  it("returns null for a real album miss from Sanity", async () => {
    mockSanityFetch.mockResolvedValue(null);

    const { getAlbumBySlug } = await import("@/lib/albums");

    await expect(getAlbumBySlug("march-madness")).resolves.toBeNull();
  });

  it("returns placeholder album detail when Sanity is unavailable", async () => {
    mockSanityFetch.mockRejectedValue(new Error("cms down"));

    const { getAlbumBySlug } = await import("@/lib/albums");

    await expect(getAlbumBySlug("march-madness")).resolves.toEqual(
      PLACEHOLDER_ALBUM_MAP["march-madness"],
    );
  });

  it("builds previous and next navigation when the slug is present", async () => {
    const targetSlug = PLACEHOLDER_ALL_ALBUMS[1].slug.current;
    mockSanityFetch
      .mockResolvedValueOnce(PLACEHOLDER_ALBUM_MAP[targetSlug])
      .mockResolvedValueOnce(PLACEHOLDER_ALL_ALBUMS.slice(0, 3));

    const { getAlbumWithNavigation } = await import("@/lib/albums");

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
    mockSanityFetch
      .mockResolvedValueOnce(PLACEHOLDER_ALBUM_MAP["march-madness"])
      .mockResolvedValueOnce(
        PLACEHOLDER_ALL_ALBUMS.filter((album) => album.slug.current !== "march-madness"),
      );

    const { getAlbumWithNavigation } = await import("@/lib/albums");

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
