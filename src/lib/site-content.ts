import {
  AboutPageDocument,
  aboutPageDocumentSchema,
  ContactPageDocument,
  contactPageDocumentSchema,
  HomePageDocument,
  homePageDocumentSchema,
  parseSanityContent,
  ProcessPageDocument,
  processPageDocumentSchema,
  SanityContentError,
  SiteSettingsDocument,
  siteSettingsDocumentSchema,
} from "@/lib/cms-validation";
import { normalizeImage } from "@/lib/image-url";
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
import {
  isE2EContentRuntime,
  resolveContentAvailabilityFailure,
} from "@/lib/content-runtime.server";
import {
  ABOUT_PAGE_QUERY,
  CONTACT_PAGE_QUERY,
  HOME_PAGE_QUERY,
  PROCESS_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/queries";
import { sanityFetch } from "@/sanity/client";
import type {
  AboutPageContent,
  ContactPageContent,
  HomePageContent,
  ProcessPageContent,
  SiteSettings,
} from "@/types/content";
import type { SanityImage } from "@/types/project";

const FALLBACK_ABOUT_PORTRAITS = new Map(
  PLACEHOLDER_ABOUT_PAGE.team.members.map((member) => [member.name, member.portrait ?? null]),
);

function requireResolvedImage(image: SanityImage, label: string) {
  const normalized = normalizeImage(image);

  if (!normalized?.url) {
    throw new SanityContentError(label, "image asset could not be resolved");
  }

  return normalized;
}

function requireResolvedImages(images: SanityImage[], label: string) {
  return images.map((image, index) => requireResolvedImage(image, `${label}[${index}]`));
}

function normalizeSiteSettings(raw: SiteSettingsDocument): SiteSettings {
  return {
    _id: raw._id,
    studioName: raw.studioName,
    location: raw.location,
    email: raw.email,
    phone: raw.phone,
    socialLinks: raw.socialLinks.map((link) => ({
      label: link.label,
      platform: link.platform,
      url: link.url,
      icon: link.icon,
    })),
    sameAs: raw.sameAs,
  };
}

function normalizeHomePage(raw: HomePageDocument): HomePageContent {
  return {
    _id: raw._id,
    hero: {
      eyebrow: raw.heroEyebrow,
      titleLine1: raw.heroTitleLine1,
      titleLine2: raw.heroTitleLine2,
      description: raw.heroDescription,
      mediaCycle: requireResolvedImages(raw.heroMediaCycle, "home.heroMediaCycle"),
    },
    editorial: {
      image: requireResolvedImage(raw.editorialImage, "home.editorialImage"),
      titleLine1: raw.editorialTitleLine1,
      titleLine2Lead: raw.editorialTitleLine2Lead,
      titleLine2Muted: raw.editorialTitleLine2Muted,
      titleLine2Accent: raw.editorialTitleLine2Accent,
      description: raw.editorialDescription,
      cta: {
        label: raw.editorialCta.label,
        href: raw.editorialCta.href,
      },
    },
    exhibition: {
      eyebrow: raw.exhibitionEyebrow,
      titleLine1: raw.exhibitionTitleLine1,
      titleLine2: raw.exhibitionTitleLine2,
      description: raw.exhibitionDescription,
      cta: {
        label: raw.exhibitionCta.label,
        href: raw.exhibitionCta.href,
      },
      image: requireResolvedImage(raw.exhibitionImage, "home.exhibitionImage"),
    },
    studio: {
      image: requireResolvedImage(raw.studioImage, "home.studioImage"),
      ctaEyebrow: raw.studioCtaEyebrow,
      ctaLabel: raw.studioCtaLabel,
      cta: {
        label: raw.studioCta.label,
        href: raw.studioCta.href,
      },
    },
  };
}

function normalizeAboutPage(raw: AboutPageDocument): AboutPageContent {
  return {
    _id: raw._id,
    hero: {
      eyebrow: raw.heroEyebrow,
      titleLine1: raw.heroTitleLine1,
      titleLine2: raw.heroTitleLine2,
      description: raw.heroDescription,
    },
    manifesto: {
      eyebrow: raw.manifestoEyebrow,
      quotePrefix: raw.manifestoQuotePrefix,
      quoteAccent: raw.manifestoQuoteAccent,
      quoteSuffix: raw.manifestoQuoteSuffix,
      footerLabel: raw.manifestoFooterLabel,
    },
    team: {
      eyebrow: raw.teamEyebrow,
      title: raw.teamTitle,
      description: raw.teamDescription,
      members: raw.teamMembers.map((member, index) => ({
        name: member.name,
        role: member.role,
        portrait: member.portrait
          ? requireResolvedImage(member.portrait, `about.teamMembers[${index}].portrait`)
          : (FALLBACK_ABOUT_PORTRAITS.get(member.name) ?? null),
      })),
    },
    process: {
      eyebrow: raw.processEyebrow,
      title: raw.processTitle,
      description: raw.processDescription,
      cards: raw.processCards.map((card) => ({
        title: card.title,
        description: card.description,
      })),
      image: requireResolvedImage(raw.processImage, "about.processImage"),
    },
    cta: {
      eyebrow: raw.ctaEyebrow,
      titleLine1: raw.ctaTitleLine1,
      titleLine2: raw.ctaTitleLine2,
      cta: {
        label: raw.cta.label,
        href: raw.cta.href,
      },
    },
  };
}

function normalizeProcessPage(raw: ProcessPageDocument): ProcessPageContent {
  return {
    _id: raw._id,
    hero: {
      titleLine1: raw.heroTitleLine1,
      titleLine2: raw.heroTitleLine2,
      image: requireResolvedImage(raw.heroImage, "process.heroImage"),
    },
    intro: {
      title: raw.introTitle,
      description: raw.introDescription,
    },
    steps: raw.steps.map((step, index) => ({
      id: step.id,
      title: step.title,
      description: step.description,
      align: step.align,
      layout: step.layout,
      meta: step.meta,
      metaList: step.metaList,
      images: requireResolvedImages(step.images, `process.steps[${index}].images`),
      action: step.action
        ? {
            label: step.action.label,
            href: step.action.href,
          }
        : undefined,
    })),
    contactCta: {
      heading: raw.contactHeading,
      buttonLabel: raw.contactButtonLabel,
      buttonHref: raw.contactButtonHref,
    },
  };
}

function normalizeContactPage(raw: ContactPageDocument): ContactPageContent {
  return {
    _id: raw._id,
    titleLine1: raw.titleLine1,
    titleLine2: raw.titleLine2,
    description: raw.description,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isE2EContentRuntime()) {
    return E2E_SITE_SETTINGS;
  }

  try {
    const data = await sanityFetch<unknown>({ query: SITE_SETTINGS_QUERY });
    return normalizeSiteSettings(parseSanityContent("siteSettings", siteSettingsDocumentSchema, data));
  } catch (error) {
    if (error instanceof SanityContentError) {
      throw error;
    }

    return resolveContentAvailabilityFailure("site settings", error, () => PLACEHOLDER_SITE_SETTINGS);
  }
}

export async function getHomePageContent(): Promise<HomePageContent> {
  if (isE2EContentRuntime()) {
    return E2E_HOME_PAGE;
  }

  try {
    const data = await sanityFetch<unknown>({ query: HOME_PAGE_QUERY });
    return normalizeHomePage(parseSanityContent("homePage", homePageDocumentSchema, data));
  } catch (error) {
    if (error instanceof SanityContentError) {
      throw error;
    }

    return resolveContentAvailabilityFailure("home page", error, () => PLACEHOLDER_HOME_PAGE);
  }
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  if (isE2EContentRuntime()) {
    return E2E_ABOUT_PAGE;
  }

  try {
    const data = await sanityFetch<unknown>({ query: ABOUT_PAGE_QUERY });
    return normalizeAboutPage(parseSanityContent("aboutPage", aboutPageDocumentSchema, data));
  } catch (error) {
    if (error instanceof SanityContentError) {
      throw error;
    }

    return resolveContentAvailabilityFailure("about page", error, () => PLACEHOLDER_ABOUT_PAGE);
  }
}

export async function getProcessPageContent(): Promise<ProcessPageContent> {
  if (isE2EContentRuntime()) {
    return E2E_PROCESS_PAGE;
  }

  try {
    const data = await sanityFetch<unknown>({ query: PROCESS_PAGE_QUERY });
    return normalizeProcessPage(parseSanityContent("processPage", processPageDocumentSchema, data));
  } catch (error) {
    if (error instanceof SanityContentError) {
      throw error;
    }

    return resolveContentAvailabilityFailure("process page", error, () => PLACEHOLDER_PROCESS_PAGE);
  }
}

export async function getContactPageContent(): Promise<ContactPageContent> {
  if (isE2EContentRuntime()) {
    return E2E_CONTACT_PAGE;
  }

  try {
    const data = await sanityFetch<unknown>({ query: CONTACT_PAGE_QUERY });
    return normalizeContactPage(
      parseSanityContent("contactPage", contactPageDocumentSchema, data),
    );
  } catch (error) {
    if (error instanceof SanityContentError) {
      throw error;
    }

    return resolveContentAvailabilityFailure("contact page", error, () => PLACEHOLDER_CONTACT_PAGE);
  }
}
