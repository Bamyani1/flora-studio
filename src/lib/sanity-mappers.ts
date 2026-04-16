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

export interface RawHomePage {
  _id: string;
  heroEyebrow: string;
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
  exhibitionEyebrow: string;
  exhibitionTitleLine1: string;
  exhibitionTitleLine2: string;
  exhibitionDescription: string;
  exhibitionImage: SanityImage;
  exhibitionCta: LinkField;
  studioImage: SanityImage;
  studioCtaLabel: string;
  studioCta: LinkField;
}

export function mapHomePageContent(doc: RawHomePage): HomePageContent {
  return {
    _id: doc._id,
    hero: {
      eyebrow: doc.heroEyebrow,
      titleLine1: doc.heroTitleLine1,
      titleLine2: doc.heroTitleLine2,
      description: doc.heroDescription,
      mediaCycle: doc.heroMediaCycle,
    },
    editorial: {
      image: doc.editorialImage,
      titleLine1: doc.editorialTitleLine1,
      titleLine2Lead: doc.editorialTitleLine2Lead,
      titleLine2Muted: doc.editorialTitleLine2Muted,
      titleLine2Accent: doc.editorialTitleLine2Accent,
      description: doc.editorialDescription,
      cta: doc.editorialCta,
    },
    exhibition: {
      eyebrow: doc.exhibitionEyebrow,
      titleLine1: doc.exhibitionTitleLine1,
      titleLine2: doc.exhibitionTitleLine2,
      description: doc.exhibitionDescription,
      cta: doc.exhibitionCta,
      image: doc.exhibitionImage,
    },
    studio: {
      image: doc.studioImage,
      ctaLabel: doc.studioCtaLabel,
      cta: doc.studioCta,
    },
  };
}

export interface RawAboutPage {
  _id: string;
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  manifestoEyebrow: string;
  manifestoQuotePrefix: string;
  manifestoQuoteAccent: string;
  manifestoQuoteSuffix: string;
  manifestoFooterLabel: string;
  teamEyebrow: string;
  teamTitle: string;
  teamDescription: string;
  teamMembers: AboutTeamMember[];
  processEyebrow: string;
  processTitle: string;
  processDescription: string;
  processCards: AboutProcessCard[];
  processImage: SanityImage;
  ctaEyebrow: string;
  ctaTitleLine1: string;
  ctaTitleLine2: string;
  cta: LinkField;
}

export function mapAboutPageContent(doc: RawAboutPage): AboutPageContent {
  return {
    _id: doc._id,
    hero: {
      eyebrow: doc.heroEyebrow,
      titleLine1: doc.heroTitleLine1,
      titleLine2: doc.heroTitleLine2,
      description: doc.heroDescription,
    },
    manifesto: {
      eyebrow: doc.manifestoEyebrow,
      quotePrefix: doc.manifestoQuotePrefix,
      quoteAccent: doc.manifestoQuoteAccent,
      quoteSuffix: doc.manifestoQuoteSuffix,
      footerLabel: doc.manifestoFooterLabel,
    },
    team: {
      eyebrow: doc.teamEyebrow,
      title: doc.teamTitle,
      description: doc.teamDescription,
      members: doc.teamMembers,
    },
    process: {
      eyebrow: doc.processEyebrow,
      title: doc.processTitle,
      description: doc.processDescription,
      cards: doc.processCards,
      image: doc.processImage,
    },
    cta: {
      eyebrow: doc.ctaEyebrow,
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
      image: doc.heroImage,
    },
    intro: {
      title: doc.introTitle,
      description: doc.introDescription,
    },
    steps: doc.steps,
    contactCta: {
      heading: doc.contactHeading,
      buttonLabel: doc.contactButtonLabel,
      buttonHref: doc.contactButtonHref,
    },
  };
}
