import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

describe("resolveImageUrl", () => {
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
});
