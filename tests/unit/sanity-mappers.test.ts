import { describe, expect, it } from "vitest";
import {
  mapAboutPageContent,
  mapHomePageContent,
  mapProcessPageContent,
  type RawAboutPage,
  type RawHomePage,
  type RawProcessPage,
} from "@/lib/sanity-mappers";
import type { SanityImage } from "@/types/project";

function refImage(ref: string, alt = "Alt text"): SanityImage {
  return { _type: "image", asset: { _ref: ref, _type: "reference" }, alt };
}

function urlImage(url: string, alt = "Alt text"): SanityImage {
  return { _type: "image", url, alt } as SanityImage;
}

function brokenImage(): SanityImage {
  return { _type: "image", alt: "No source" } as SanityImage;
}

function buildRawHomePage(overrides: Partial<RawHomePage> = {}): RawHomePage {
  return {
    _id: "homePage",
    heroEyebrow: "Photography with intention",
    heroTitleLine1: "Every frame,",
    heroTitleLine2: "earned.",
    heroDescription: "Photography with intention.",
    heroMediaCycle: [refImage("image-hero-1"), urlImage("/images/hero/hero-02.jpg")],
    editorialImage: refImage("image-editorial"),
    editorialTitleLine1: "We pay attention",
    editorialTitleLine2Lead: "to",
    editorialTitleLine2Muted: "the",
    editorialTitleLine2Accent: "light.",
    editorialDescription: "Editorial description.",
    editorialCta: { label: "See the work", href: "/work" },
    exhibitionEyebrow: "EXHIBITION 01",
    exhibitionTitleLine1: "Before",
    exhibitionTitleLine2: "the Game",
    exhibitionDescription: "Exhibition description.",
    exhibitionImage: refImage("image-exhibition"),
    exhibitionCta: { label: "Explore Exhibition", href: "/work" },
    studioImage: refImage("image-studio"),
    studioCtaEyebrow: "Work With Us",
    studioCtaLabel: "Inquire for 2026",
    studioCta: { label: "Inquire for 2026", href: "/contact" },
    ...overrides,
  };
}

function buildRawAboutPage(overrides: Partial<RawAboutPage> = {}): RawAboutPage {
  return {
    _id: "aboutPage",
    heroEyebrow: "Flora Studio",
    heroTitleLine1: "Who We",
    heroTitleLine2: "Are.",
    heroDescription: "Hero description.",
    manifestoEyebrow: "Our Approach",
    manifestoQuotePrefix: "We make every",
    manifestoQuoteAccent: "frame",
    manifestoQuoteSuffix: "count.",
    manifestoFooterLabel: "Our Approach",
    teamEyebrow: "The People",
    teamTitle: "The Team",
    teamDescription: "Team description.",
    teamMembers: [
      { name: "Mostafa Bamyani", role: "Photographer & Designer", portrait: refImage("image-portrait") },
      { name: "Mortaza Anwari", role: "Photographer", portrait: brokenImage() },
    ],
    processEyebrow: "How It Works",
    processTitle: "How we work.",
    processDescription: "Process description.",
    processCards: [{ title: "Selection", description: "Card description." }],
    processImage: refImage("image-about-process"),
    ctaEyebrow: "What's next",
    ctaTitleLine1: "Let's make",
    ctaTitleLine2: "something.",
    cta: { label: "Get in touch", href: "/contact" },
    ...overrides,
  };
}

function buildRawProcessPage(overrides: Partial<RawProcessPage> = {}): RawProcessPage {
  return {
    _id: "processPage",
    heroTitleLine1: "Our Process:",
    heroTitleLine2: "Frame by Frame",
    heroImage: refImage("image-process-hero"),
    introTitle: "The Process",
    introDescription: "Intro description.",
    steps: [
      {
        id: "01",
        title: "Conversation",
        description: "Step description.",
        align: "left",
        layout: "single",
        images: [refImage("image-step-1"), urlImage("/images/process/01.jpg")],
      },
    ],
    contactHeading: "Get In Touch",
    contactButtonLabel: "Contact",
    contactButtonHref: "/contact",
    ...overrides,
  };
}

describe("mapHomePageContent", () => {
  it("maps a complete document fully", () => {
    const content = mapHomePageContent(buildRawHomePage());

    expect(content.hero.mediaCycle).toHaveLength(2);
    expect(content.editorial.image.asset?._ref).toBe("image-editorial");
    expect(content.exhibition.image.asset?._ref).toBe("image-exhibition");
    expect(content.studio.image.asset?._ref).toBe("image-studio");
    expect(content.studio.ctaEyebrow).toBe("Work With Us");
    expect(content.studio.cta).toEqual({ label: "Inquire for 2026", href: "/contact" });
  });

  it("filters hero media entries without a resolvable source", () => {
    const content = mapHomePageContent(
      buildRawHomePage({
        heroMediaCycle: [refImage("image-hero-1"), brokenImage(), urlImage("/images/hero-2.jpg")],
      }),
    );

    expect(content.hero.mediaCycle).toHaveLength(2);
    expect(content.hero.mediaCycle[0].asset?._ref).toBe("image-hero-1");
    expect(content.hero.mediaCycle[1].url).toBe("/images/hero-2.jpg");
  });

  it("maps a missing hero media cycle to an empty array", () => {
    const content = mapHomePageContent(
      buildRawHomePage({ heroMediaCycle: undefined as unknown as RawHomePage["heroMediaCycle"] }),
    );

    expect(content.hero.mediaCycle).toEqual([]);
  });

  it("throws when a required singular image is missing", () => {
    expect(() => mapHomePageContent(buildRawHomePage({ editorialImage: brokenImage() }))).toThrow(
      "homePage.editorialImage missing image asset",
    );
    expect(() =>
      mapHomePageContent(
        buildRawHomePage({ exhibitionImage: undefined as unknown as SanityImage }),
      ),
    ).toThrow("homePage.exhibitionImage missing image asset");
    expect(() => mapHomePageContent(buildRawHomePage({ studioImage: brokenImage() }))).toThrow(
      "homePage.studioImage missing image asset",
    );
  });
});

describe("mapAboutPageContent", () => {
  it("maps a complete document fully", () => {
    const content = mapAboutPageContent(buildRawAboutPage());

    expect(content.team.members).toHaveLength(2);
    expect(content.team.members[0].portrait?.asset?._ref).toBe("image-portrait");
    expect(content.process.image.asset?._ref).toBe("image-about-process");
  });

  it("maps team portraits without a resolvable source to null", () => {
    const content = mapAboutPageContent(buildRawAboutPage());

    expect(content.team.members[1].name).toBe("Mortaza Anwari");
    expect(content.team.members[1].portrait).toBeNull();
  });

  it("throws when the process image is missing", () => {
    expect(() =>
      mapAboutPageContent(buildRawAboutPage({ processImage: brokenImage() })),
    ).toThrow("aboutPage.processImage missing image asset");
  });
});

describe("mapProcessPageContent", () => {
  it("maps a complete document fully", () => {
    const content = mapProcessPageContent(buildRawProcessPage());

    expect(content.hero.image.asset?._ref).toBe("image-process-hero");
    expect(content.steps).toHaveLength(1);
    expect(content.steps[0].images).toHaveLength(2);
  });

  it("filters step images without a resolvable source", () => {
    const raw = buildRawProcessPage();
    raw.steps[0].images = [brokenImage(), refImage("image-step-2")];

    const content = mapProcessPageContent(raw);

    expect(content.steps[0].images).toHaveLength(1);
    expect(content.steps[0].images[0].asset?._ref).toBe("image-step-2");
  });

  it("maps missing step images to an empty array", () => {
    const raw = buildRawProcessPage();
    raw.steps[0].images = undefined as unknown as SanityImage[];

    const content = mapProcessPageContent(raw);

    expect(content.steps[0].images).toEqual([]);
  });

  it("throws when the hero image is missing", () => {
    expect(() =>
      mapProcessPageContent(buildRawProcessPage({ heroImage: brokenImage() })),
    ).toThrow("processPage.heroImage missing image asset");
  });
});
