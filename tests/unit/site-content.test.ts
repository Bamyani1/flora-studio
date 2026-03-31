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

function rawSiteSettings(overrides: Record<string, unknown> = {}) {
  return {
    _id: PLACEHOLDER_SITE_SETTINGS._id,
    studioName: PLACEHOLDER_SITE_SETTINGS.studioName,
    location: PLACEHOLDER_SITE_SETTINGS.location,
    email: PLACEHOLDER_SITE_SETTINGS.email,
    phone: PLACEHOLDER_SITE_SETTINGS.phone,
    socialLinks: PLACEHOLDER_SITE_SETTINGS.socialLinks,
    sameAs: PLACEHOLDER_SITE_SETTINGS.sameAs,
    ...overrides,
  };
}

function rawHomePage(overrides: Record<string, unknown> = {}) {
  return {
    _id: PLACEHOLDER_HOME_PAGE._id,
    heroEyebrow: PLACEHOLDER_HOME_PAGE.hero.eyebrow,
    heroTitleLine1: PLACEHOLDER_HOME_PAGE.hero.titleLine1,
    heroTitleLine2: PLACEHOLDER_HOME_PAGE.hero.titleLine2,
    heroDescription: PLACEHOLDER_HOME_PAGE.hero.description,
    heroMediaCycle: PLACEHOLDER_HOME_PAGE.hero.mediaCycle,
    editorialImage: PLACEHOLDER_HOME_PAGE.editorial.image,
    editorialTitleLine1: PLACEHOLDER_HOME_PAGE.editorial.titleLine1,
    editorialTitleLine2Lead: PLACEHOLDER_HOME_PAGE.editorial.titleLine2Lead,
    editorialTitleLine2Muted: PLACEHOLDER_HOME_PAGE.editorial.titleLine2Muted,
    editorialTitleLine2Accent: PLACEHOLDER_HOME_PAGE.editorial.titleLine2Accent,
    editorialDescription: PLACEHOLDER_HOME_PAGE.editorial.description,
    editorialCta: PLACEHOLDER_HOME_PAGE.editorial.cta,
    exhibitionEyebrow: PLACEHOLDER_HOME_PAGE.exhibition.eyebrow,
    exhibitionTitleLine1: PLACEHOLDER_HOME_PAGE.exhibition.titleLine1,
    exhibitionTitleLine2: PLACEHOLDER_HOME_PAGE.exhibition.titleLine2,
    exhibitionDescription: PLACEHOLDER_HOME_PAGE.exhibition.description,
    exhibitionImage: PLACEHOLDER_HOME_PAGE.exhibition.image,
    exhibitionCta: PLACEHOLDER_HOME_PAGE.exhibition.cta,
    studioImage: PLACEHOLDER_HOME_PAGE.studio.image,
    studioCtaEyebrow: PLACEHOLDER_HOME_PAGE.studio.ctaEyebrow,
    studioCtaLabel: PLACEHOLDER_HOME_PAGE.studio.ctaLabel,
    studioCta: PLACEHOLDER_HOME_PAGE.studio.cta,
    ...overrides,
  };
}

function rawAboutPage(overrides: Record<string, unknown> = {}) {
  return {
    _id: PLACEHOLDER_ABOUT_PAGE._id,
    heroEyebrow: PLACEHOLDER_ABOUT_PAGE.hero.eyebrow,
    heroTitleLine1: PLACEHOLDER_ABOUT_PAGE.hero.titleLine1,
    heroTitleLine2: PLACEHOLDER_ABOUT_PAGE.hero.titleLine2,
    heroDescription: PLACEHOLDER_ABOUT_PAGE.hero.description,
    manifestoEyebrow: PLACEHOLDER_ABOUT_PAGE.manifesto.eyebrow,
    manifestoQuotePrefix: PLACEHOLDER_ABOUT_PAGE.manifesto.quotePrefix,
    manifestoQuoteAccent: PLACEHOLDER_ABOUT_PAGE.manifesto.quoteAccent,
    manifestoQuoteSuffix: PLACEHOLDER_ABOUT_PAGE.manifesto.quoteSuffix,
    manifestoFooterLabel: PLACEHOLDER_ABOUT_PAGE.manifesto.footerLabel,
    teamEyebrow: PLACEHOLDER_ABOUT_PAGE.team.eyebrow,
    teamTitle: PLACEHOLDER_ABOUT_PAGE.team.title,
    teamDescription: PLACEHOLDER_ABOUT_PAGE.team.description,
    teamMembers: PLACEHOLDER_ABOUT_PAGE.team.members,
    processEyebrow: PLACEHOLDER_ABOUT_PAGE.process.eyebrow,
    processTitle: PLACEHOLDER_ABOUT_PAGE.process.title,
    processDescription: PLACEHOLDER_ABOUT_PAGE.process.description,
    processCards: PLACEHOLDER_ABOUT_PAGE.process.cards,
    processImage: PLACEHOLDER_ABOUT_PAGE.process.image,
    ctaEyebrow: PLACEHOLDER_ABOUT_PAGE.cta.eyebrow,
    ctaTitleLine1: PLACEHOLDER_ABOUT_PAGE.cta.titleLine1,
    ctaTitleLine2: PLACEHOLDER_ABOUT_PAGE.cta.titleLine2,
    cta: PLACEHOLDER_ABOUT_PAGE.cta.cta,
    ...overrides,
  };
}

function rawProcessPage(overrides: Record<string, unknown> = {}) {
  return {
    _id: PLACEHOLDER_PROCESS_PAGE._id,
    heroTitleLine1: PLACEHOLDER_PROCESS_PAGE.hero.titleLine1,
    heroTitleLine2: PLACEHOLDER_PROCESS_PAGE.hero.titleLine2,
    heroImage: PLACEHOLDER_PROCESS_PAGE.hero.image,
    introTitle: PLACEHOLDER_PROCESS_PAGE.intro.title,
    introDescription: PLACEHOLDER_PROCESS_PAGE.intro.description,
    steps: PLACEHOLDER_PROCESS_PAGE.steps,
    contactHeading: PLACEHOLDER_PROCESS_PAGE.contactCta.heading,
    contactButtonLabel: PLACEHOLDER_PROCESS_PAGE.contactCta.buttonLabel,
    contactButtonHref: PLACEHOLDER_PROCESS_PAGE.contactCta.buttonHref,
    ...overrides,
  };
}

describe("site content loaders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("falls back to placeholder singleton content when Sanity is unavailable", async () => {
    mockSanityFetch.mockRejectedValue(new Error("cms down"));

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

  it("keeps placeholder fallback in preview mode when Sanity is unavailable", async () => {
    process.env.CONTENT_RUNTIME_MODE = "preview";
    mockSanityFetch.mockRejectedValue(new Error("cms down"));

    const { getHomePageContent } = await import("@/lib/site-content");

    await expect(getHomePageContent()).resolves.toEqual(PLACEHOLDER_HOME_PAGE);
  });

  it("throws a content-unavailable error in production mode when Sanity is unavailable", async () => {
    process.env.CONTENT_RUNTIME_MODE = "production";
    mockSanityFetch.mockRejectedValue(new MockSanityConfigurationError());

    const { getHomePageContent } = await import("@/lib/site-content");

    await expect(getHomePageContent()).rejects.toMatchObject({
      name: "ContentUnavailableError",
      resource: "home page",
    });
  });

  it("preserves an empty sameAs array from published site settings", async () => {
    mockSanityFetch.mockResolvedValue(rawSiteSettings({ sameAs: [] }));

    const { getSiteSettings } = await import("@/lib/site-content");

    await expect(getSiteSettings()).resolves.toMatchObject({ sameAs: [] });
  });

  it("throws when a singleton document is missing from Sanity", async () => {
    mockSanityFetch.mockResolvedValue(null);

    const { getHomePageContent } = await import("@/lib/site-content");

    await expect(getHomePageContent()).rejects.toMatchObject({
      name: "SanityContentError",
    });
  });

  it("fills missing about-team portraits from deterministic placeholders", async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "studio123";
    process.env.NEXT_PUBLIC_SANITY_DATASET = "production";

    mockSanityFetch.mockResolvedValue(
      rawAboutPage({
        teamMembers: [
          {
            name: "Mostafa Bamyani",
            role: "Photographer & Designer",
            portrait: {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: "image-mostafa-1000x1500-jpg",
              },
            },
          },
          {
            name: "Murtaza Anwari",
            role: "Photographer",
            portrait: null,
          },
          {
            name: "Enayatullah Anwari",
            role: "Photographer",
            portrait: null,
          },
        ],
      }),
    );

    const { getAboutPageContent } = await import("@/lib/site-content");

    const aboutPage = await getAboutPageContent();

    expect(aboutPage.team.members[0].portrait?.url).toBe(
      "https://cdn.sanity.io/images/studio123/production/mostafa-1000x1500.jpg",
    );
    expect(aboutPage.team.members[1].portrait?.url).toContain("placeholder://bahar-studio/media");
    expect(aboutPage.team.members[2].portrait?.url).toContain("placeholder://bahar-studio/media");
  });

  it("treats invalid published process content as a content error", async () => {
    mockSanityFetch.mockResolvedValue(
      rawProcessPage({
        steps: [
          {
            ...PLACEHOLDER_PROCESS_PAGE.steps[0],
            images: [],
          },
        ],
      }),
    );

    const { getProcessPageContent } = await import("@/lib/site-content");

    await expect(getProcessPageContent()).rejects.toMatchObject({
      name: "SanityContentError",
    });
  });

  it("normalizes valid published home page content without placeholder substitution", async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "studio123";
    process.env.NEXT_PUBLIC_SANITY_DATASET = "production";

    mockSanityFetch.mockResolvedValue(
      rawHomePage({
        heroEyebrow: "CMS eyebrow",
        heroMediaCycle: [
          {
            _type: "image",
            asset: { _type: "reference", _ref: "image-home-1600x900-jpg" },
            alt: "Hero image",
          },
        ],
      }),
    );

    const { getHomePageContent } = await import("@/lib/site-content");

    const homePage = await getHomePageContent();

    expect(homePage.hero.eyebrow).toBe("CMS eyebrow");
    expect(homePage.hero.mediaCycle).toHaveLength(1);
    expect(homePage.hero.mediaCycle[0]?.url).toBe(
      "https://cdn.sanity.io/images/studio123/production/home-1600x900.jpg",
    );
  });

  it("returns deterministic fixture content in e2e mode without calling Sanity", async () => {
    process.env.CONTENT_RUNTIME_MODE = "e2e";
    mockSanityFetch.mockRejectedValue(new Error("should not be called"));

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
    expect(mockSanityFetch).not.toHaveBeenCalled();
  });
});
