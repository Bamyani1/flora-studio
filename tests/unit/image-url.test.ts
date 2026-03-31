import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

describe("image url helpers", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns the explicit image url when present", async () => {
    const { resolveImageUrl } = await import("@/lib/image-url");

    expect(resolveImageUrl({ url: "https://example.com/image.jpg" } as never)).toBe(
      "https://example.com/image.jpg",
    );
  });

  it("returns the dereferenced asset url when present", async () => {
    const { resolveImageUrl } = await import("@/lib/image-url");

    expect(resolveImageUrl({ asset: { url: "https://cdn.example.com/image.jpg" } } as never)).toBe(
      "https://cdn.example.com/image.jpg",
    );
  });

  it("builds Sanity CDN urls from the configured dataset and project", async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "studio123";
    process.env.NEXT_PUBLIC_SANITY_DATASET = "staging";

    const { resolveImageUrl } = await import("@/lib/image-url");

    expect(
      resolveImageUrl({
        asset: { _ref: "image-abc123-1600x900-jpg" },
      } as never),
    ).toBe("https://cdn.sanity.io/images/studio123/staging/abc123-1600x900.jpg");
  });

  it("returns null for ref-based images when the project id is missing", async () => {
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

    const { resolveImageUrl } = await import("@/lib/image-url");

    expect(
      resolveImageUrl({
        asset: { _ref: "image-abc123-1600x900-jpg" },
      } as never),
    ).toBeNull();
  });

  it("normalizes image objects with explicit urls and ref-based urls", async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "studio123";

    const { normalizeImage, normalizeImages } = await import("@/lib/image-url");

    expect(
      normalizeImage({
        _type: "image",
        asset: { _type: "reference", _ref: "image-abc123-1600x900-jpg" },
      } as never),
    ).toMatchObject({
      url: "https://cdn.sanity.io/images/studio123/production/abc123-1600x900.jpg",
    });

    expect(
      normalizeImages([
        null,
        {
          _type: "image",
          asset: { _type: "reference", _ref: "image-def456-800x600-jpg" },
        },
        {
          _type: "image",
          asset: { _type: "reference", _ref: "image-ghi789-1024x768-jpg" },
          url: "https://example.com/override.jpg",
        },
      ] as never),
    ).toEqual([
      expect.objectContaining({
        url: "https://cdn.sanity.io/images/studio123/production/def456-800x600.jpg",
      }),
      expect.objectContaining({
        url: "https://example.com/override.jpg",
      }),
    ]);
  });
});
