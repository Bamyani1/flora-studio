import type { SanityImage } from "@/types/project";

export interface LinkField {
  label: string;
  href: string;
}

export type SocialIcon = "instagram";

export interface SocialLink {
  label: string;
  platform: string;
  url: string;
  icon: SocialIcon;
}

export interface SiteSettings {
  _id: string;
  studioName: string;
  location: string;
  email: string;
  phone: string;
  socialLinks: SocialLink[];
  sameAs: string[];
}

export interface HeroMediaItem extends SanityImage {
  objectPosition?: string;
  mobileObjectPosition?: string;
}

export interface HomeHeroContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  mediaCycle: HeroMediaItem[];
}

export interface HomeEditorialContent {
  image: SanityImage;
  titleLine1: string;
  titleLine2Lead: string;
  titleLine2Muted: string;
  titleLine2Accent: string;
  description: string;
  cta: LinkField;
}

export interface HomeExhibitionContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  cta: LinkField;
  image: SanityImage;
}

export interface HomeStudioContent {
  image: SanityImage;
  ctaLabel: string;
  cta: LinkField;
}

export interface HomePageContent {
  _id: string;
  hero: HomeHeroContent;
  editorial: HomeEditorialContent;
  exhibition: HomeExhibitionContent;
  studio: HomeStudioContent;
}

export interface AboutHeroContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
}

export interface AboutManifestoContent {
  eyebrow: string;
  quotePrefix: string;
  quoteAccent: string;
  quoteSuffix: string;
  footerLabel: string;
}

export interface AboutTeamMember {
  name: string;
  role: string;
  portrait?: SanityImage | null;
}

export interface AboutTeamContent {
  eyebrow: string;
  title: string;
  description: string;
  members: AboutTeamMember[];
}

export interface AboutProcessCard {
  title: string;
  description: string;
}

export interface AboutProcessContent {
  eyebrow: string;
  title: string;
  description: string;
  cards: AboutProcessCard[];
  image: SanityImage;
}

export interface AboutCtaContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  cta: LinkField;
}

export interface AboutPageContent {
  _id: string;
  hero: AboutHeroContent;
  manifesto: AboutManifestoContent;
  team: AboutTeamContent;
  process: AboutProcessContent;
  cta: AboutCtaContent;
}

export interface ProcessStepContent {
  id: string;
  title: string;
  description: string;
  align: "left" | "right";
  layout: "single" | "bordered" | "ultrawide" | "grid";
  meta?: string;
  metaList?: string[];
  images: SanityImage[];
  action?: LinkField;
}

export interface ProcessHeroContent {
  titleLine1: string;
  titleLine2: string;
  image: SanityImage;
}

export interface ProcessIntroContent {
  title: string;
  description: string;
}

export interface ProcessContactCtaContent {
  heading: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface ProcessPageContent {
  _id: string;
  hero: ProcessHeroContent;
  intro: ProcessIntroContent;
  steps: ProcessStepContent[];
  contactCta: ProcessContactCtaContent;
}

export interface ContactPageContent {
  _id: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
}
