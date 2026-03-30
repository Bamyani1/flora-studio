import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateClient, mockFetch } = vi.hoisted(() => ({
  mockCreateClient: vi.fn(),
  mockFetch: vi.fn(),
}));

const originalEnv = { ...process.env };

vi.mock("server-only", () => ({}));
vi.mock("next-sanity", () => ({
  createClient: mockCreateClient,
}));

describe("sanity fetch client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = {
      ...originalEnv,
      NODE_ENV: "production",
      NEXT_PUBLIC_SANITY_PROJECT_ID: "tm8qd2gj",
      NEXT_PUBLIC_SANITY_DATASET: "production",
      NEXT_PUBLIC_SANITY_API_VERSION: "2024-07-11",
      SANITY_READ_TOKEN: "viewer-token",
    };
    mockFetch.mockResolvedValue({ ok: true });
    mockCreateClient.mockReturnValue({ fetch: mockFetch });
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("attaches SANITY_READ_TOKEN for published reads", async () => {
    const { sanityFetch } = await import("@/sanity/client");

    await sanityFetch({ query: "*[_type == 'album']" });

    expect(mockCreateClient).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: "tm8qd2gj",
        dataset: "production",
        apiVersion: "2024-07-11",
        perspective: "published",
        token: "viewer-token",
        useCdn: false,
      }),
    );
  });

  it("keeps SANITY_READ_TOKEN attached for preview reads", async () => {
    const { sanityFetch } = await import("@/sanity/client");

    await sanityFetch({ query: "*[_type == 'album']", perspective: "previewDrafts" });

    expect(mockCreateClient).toHaveBeenCalledWith(
      expect.objectContaining({
        perspective: "previewDrafts",
        token: "viewer-token",
        useCdn: false,
      }),
    );
  });

  it("throws when the project is configured but SANITY_READ_TOKEN is missing", async () => {
    delete process.env.SANITY_READ_TOKEN;

    const { sanityFetch } = await import("@/sanity/client");

    await expect(sanityFetch({ query: "*[_type == 'album']" })).rejects.toMatchObject({
      name: "SanityConfigurationError",
      message: "Missing SANITY_READ_TOKEN for server-side Sanity reads.",
    });
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it("passes Next cache options through to the client fetch", async () => {
    const { sanityFetch } = await import("@/sanity/client");

    await sanityFetch({ query: "*[_type == 'album']", revalidate: false });

    expect(mockFetch).toHaveBeenCalledWith(
      "*[_type == 'album']",
      {},
      expect.objectContaining({
        cache: "no-store",
        next: undefined,
      }),
    );
  });
});
