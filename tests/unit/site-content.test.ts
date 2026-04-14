import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PLACEHOLDER_ABOUT_PAGE,
  PLACEHOLDER_CONTACT_PAGE,
  PLACEHOLDER_HOME_PAGE,
  PLACEHOLDER_PROCESS_PAGE,
  PLACEHOLDER_SITE_SETTINGS,
} from "@/lib/placeholder-site-content";
import {
  E2E_ABOUT_PAGE,
  E2E_CONTACT_PAGE,
  E2E_HOME_PAGE,
  E2E_PROCESS_PAGE,
  E2E_SITE_SETTINGS,
} from "@/lib/e2e-content";

vi.mock("server-only", () => ({}));

const originalEnv = { ...process.env };

describe("site content loaders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns placeholder content directly", async () => {
    const {
      getAboutPageContent,
      getContactPageContent,
      getHomePageContent,
      getProcessPageContent,
      getSiteSettings,
    } = await import("@/lib/site-content");

    await expect(getSiteSettings()).resolves.toEqual(PLACEHOLDER_SITE_SETTINGS);
    await expect(getHomePageContent()).resolves.toEqual(PLACEHOLDER_HOME_PAGE);
    await expect(getAboutPageContent()).resolves.toEqual(PLACEHOLDER_ABOUT_PAGE);
    await expect(getProcessPageContent()).resolves.toEqual(PLACEHOLDER_PROCESS_PAGE);
    await expect(getContactPageContent()).resolves.toEqual(PLACEHOLDER_CONTACT_PAGE);
  });

  it("returns code-based site settings", async () => {
    const { getSiteSettings } = await import("@/lib/site-content");

    const settings = await getSiteSettings();
    expect(settings.studioName).toBe("Flora Studio");
  });

  it("returns deterministic fixture content in e2e mode", async () => {
    process.env.CONTENT_RUNTIME_MODE = "e2e";

    const {
      getAboutPageContent,
      getContactPageContent,
      getHomePageContent,
      getProcessPageContent,
      getSiteSettings,
    } = await import("@/lib/site-content");

    await expect(getSiteSettings()).resolves.toEqual(E2E_SITE_SETTINGS);
    await expect(getHomePageContent()).resolves.toEqual(E2E_HOME_PAGE);
    await expect(getAboutPageContent()).resolves.toEqual(E2E_ABOUT_PAGE);
    await expect(getProcessPageContent()).resolves.toEqual(E2E_PROCESS_PAGE);
    await expect(getContactPageContent()).resolves.toEqual(E2E_CONTACT_PAGE);
  });
});
