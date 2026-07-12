import type { SanityImage } from "@/types/project";
import type {
  AboutPageContent,
  AboutProcessCard,
  AboutTeamMember,
  HeroMediaItem,
  HomePageContent,
  LinkField,
  ProcessPageContent,
  ProcessStepContent,
} from "@/types/content";

function hasImageSource(image: SanityImage | null | undefined): boolean {
  return Boolean(image && (image.asset?._ref || image.asset?.url || image.url));
}

function requireImage(image: SanityImage | null | undefined, field: string): SanityImage {
  if (!image || !hasImageSource(image)) {
    throw new Error(`${field} missing image asset`);
  }
  return image;
}

function filterImages<T extends SanityImage>(images: T[] | null | undefined): T[] {
  return (images ?? []).filter((image) => hasImageSource(image));
}

export interface RawHomePage {
  _id: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  heroMediaCycle: HeroMediaItem[];
  editorialImage: SanityImage;
  editorialTitleLine1: string;
  editorialTitleLine2Lead: string;
  editorialTitleLine2Muted: string;
  editorialTitleLine2Accent: string;
  editorialDescription: string;
  editorialCta: LinkField;
  exhibitionTitleLine1: string;
  exhibitionTitleLine2: string;
  exhibitionDescription: string;
  exhibitionImage: SanityImage;
  exhibitionCta: LinkField;
  studioImage: SanityImage;
  studioCtaEyebrow: string;
  studioCtaLabel: string;
  studioCta: LinkField;
}

export function mapHomePageContent(doc: RawHomePage): HomePageContent {
  return {
    _id: doc._id,
    hero: {
      titleLine1: doc.heroTitleLine1,
      titleLine2: doc.heroTitleLine2,
      description: doc.heroDescription,
      mediaCycle: filterImages(doc.heroMediaCycle),
    },
    editorial: {
      image: requireImage(doc.editorialImage, "homePage.editorialImage"),
      titleLine1: doc.editorialTitleLine1,
      titleLine2Lead: doc.editorialTitleLine2Lead,
      titleLine2Muted: doc.editorialTitleLine2Muted,
      titleLine2Accent: doc.editorialTitleLine2Accent,
      description: doc.editorialDescription,
      cta: doc.editorialCta,
    },
    exhibition: {
      titleLine1: doc.exhibitionTitleLine1,
      titleLine2: doc.exhibitionTitleLine2,
      description: doc.exhibitionDescription,
      cta: doc.exhibitionCta,
      image: requireImage(doc.exhibitionImage, "homePage.exhibitionImage"),
    },
    studio: {
      image: requireImage(doc.studioImage, "homePage.studioImage"),
      ctaEyebrow: doc.studioCtaEyebrow,
      ctaLabel: doc.studioCtaLabel,
      cta: doc.studioCta,
    },
  };
}

export interface RawAboutPage {
  _id: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  manifestoEyebrow: string;
  manifestoQuotePrefix: string;
  manifestoQuoteAccent: string;
  manifestoQuoteSuffix: string;
  teamTitle: string;
  teamDescription: string;
  teamMembers: AboutTeamMember[];
  processTitle: string;
  processDescription: string;
  processCards: AboutProcessCard[];
  processImage: SanityImage;
  ctaTitleLine1: string;
  ctaTitleLine2: string;
  cta: LinkField;
}

export function mapAboutPageContent(doc: RawAboutPage): AboutPageContent {
  return {
    _id: doc._id,
    hero: {
      titleLine1: doc.heroTitleLine1,
      titleLine2: doc.heroTitleLine2,
      description: doc.heroDescription,
    },
    manifesto: {
      eyebrow: doc.manifestoEyebrow,
      quotePrefix: doc.manifestoQuotePrefix,
      quoteAccent: doc.manifestoQuoteAccent,
      quoteSuffix: doc.manifestoQuoteSuffix,
    },
    team: {
      title: doc.teamTitle,
      description: doc.teamDescription,
      members: (doc.teamMembers ?? []).map((member) => ({
        ...member,
        portrait: hasImageSource(member.portrait) ? member.portrait : null,
      })),
    },
    process: {
      title: doc.processTitle,
      description: doc.processDescription,
      cards: doc.processCards,
      image: requireImage(doc.processImage, "aboutPage.processImage"),
    },
    cta: {
      titleLine1: doc.ctaTitleLine1,
      titleLine2: doc.ctaTitleLine2,
      cta: doc.cta,
    },
  };
}

export interface RawProcessPage {
  _id: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroImage: SanityImage;
  introTitle: string;
  introDescription: string;
  steps: ProcessStepContent[];
  contactHeading: string;
  contactButtonLabel: string;
  contactButtonHref: string;
}

export function mapProcessPageContent(doc: RawProcessPage): ProcessPageContent {
  return {
    _id: doc._id,
    hero: {
      titleLine1: doc.heroTitleLine1,
      titleLine2: doc.heroTitleLine2,
      image: requireImage(doc.heroImage, "processPage.heroImage"),
    },
    intro: {
      title: doc.introTitle,
      description: doc.introDescription,
    },
    steps: (doc.steps ?? []).map((step) => ({
      ...step,
      images: filterImages(step.images),
    })),
    contactCta: {
      heading: doc.contactHeading,
      buttonLabel: doc.contactButtonLabel,
      buttonHref: doc.contactButtonHref,
    },
  };
}
