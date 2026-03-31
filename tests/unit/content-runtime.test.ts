import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const originalEnv = { ...process.env };

describe("content runtime policy", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("defaults to local mode outside production", async () => {
    process.env = { ...process.env, NODE_ENV: "test" };

    const { getContentRuntimeMode } = await import("@/lib/content-runtime.server");

    expect(getContentRuntimeMode()).toBe("local");
  });

  it("uses preview mode for production preview environments", async () => {
    process.env = { ...process.env, NODE_ENV: "production", VERCEL_ENV: "preview" };

    const { getContentRuntimeMode } = await import("@/lib/content-runtime.server");

    expect(getContentRuntimeMode()).toBe("preview");
  });

  it("uses production mode for production without preview overrides", async () => {
    process.env = { ...process.env, NODE_ENV: "production" };
    delete process.env.VERCEL_ENV;

    const { getContentRuntimeMode } = await import("@/lib/content-runtime.server");

    expect(getContentRuntimeMode()).toBe("production");
  });

  it("honors explicit content runtime overrides", async () => {
    process.env.CONTENT_RUNTIME_MODE = "e2e";

    const { getContentRuntimeMode } = await import("@/lib/content-runtime.server");

    expect(getContentRuntimeMode()).toBe("e2e");
  });

  it("throws on invalid explicit content runtime overrides", async () => {
    process.env.CONTENT_RUNTIME_MODE = "broken";

    const { getContentRuntimeMode } = await import("@/lib/content-runtime.server");

    expect(() => getContentRuntimeMode()).toThrow('Invalid CONTENT_RUNTIME_MODE "broken"');
  });
});
