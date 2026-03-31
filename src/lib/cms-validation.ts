import { z } from "zod";

const optionalString = z.string().optional().nullable().transform((value) => value ?? undefined);
const optionalNumber = z.number().optional().nullable().transform((value) => value ?? undefined);

export class SanityContentError extends Error {
  constructor(label: string, detail: string) {
    super(`Invalid published Sanity content for ${label}: ${detail}`);
    this.name = "SanityContentError";
  }
}

export const sanityImageSchema = z
  .object({
    _type: z.literal("image"),
    asset: z
      .object({
        _type: z.literal("reference"),
        _ref: z.string().min(1),
        url: optionalString,
      })
      .passthrough(),
    alt: optionalString,
    caption: optionalString,
    url: optionalString,
  })
  .passthrough();

export const ctaLinkSchema = z
  .object({
    label: z.string().min(1),
    href: z.string().min(1),
  })
  .passthrough();

export const socialLinkSchema = z
  .object({
    label: z.string().min(1),
    platform: z.string().min(1),
    url: z.string().min(1),
    icon: z.enum(["instagram", "behance", "linkedin"]),
  })
  .passthrough();

export const siteSettingsDocumentSchema = z
  .object({
    _id: z.string().min(1),
    studioName: z.string().min(1),
    location: z.string().min(1),
    email: z.string().min(1),
    phone: z.string().min(1),
    socialLinks: z.array(socialLinkSchema).min(1),
    sameAs: z.array(z.string().min(1)).optional().default([]),
  })
  .passthrough();

export const homePageDocumentSchema = z
  .object({
    _id: z.string().min(1),
    heroEyebrow: z.string().min(1),
    heroTitleLine1: z.string().min(1),
    heroTitleLine2: z.string().min(1),
    heroDescription: z.string().min(1),
    heroMediaCycle: z.array(sanityImageSchema).min(1),
    editorialImage: sanityImageSchema,
    editorialTitleLine1: z.string().min(1),
    editorialTitleLine2Lead: z.string().min(1),
    editorialTitleLine2Muted: z.string().min(1),
    editorialTitleLine2Accent: z.string().min(1),
    editorialDescription: z.string().min(1),
    editorialCta: ctaLinkSchema,
    exhibitionEyebrow: z.string().min(1),
    exhibitionTitleLine1: z.string().min(1),
    exhibitionTitleLine2: z.string().min(1),
    exhibitionDescription: z.string().min(1),
    exhibitionImage: sanityImageSchema,
    exhibitionCta: ctaLinkSchema,
    studioImage: sanityImageSchema,
    studioCtaEyebrow: z.string().min(1),
    studioCtaLabel: z.string().min(1),
    studioCta: ctaLinkSchema,
  })
  .passthrough();

export const aboutPageDocumentSchema = z
  .object({
    _id: z.string().min(1),
    heroEyebrow: z.string().min(1),
    heroTitleLine1: z.string().min(1),
    heroTitleLine2: z.string().min(1),
    heroDescription: z.string().min(1),
    manifestoEyebrow: z.string().min(1),
    manifestoQuotePrefix: z.string().min(1),
    manifestoQuoteAccent: z.string().min(1),
    manifestoQuoteSuffix: z.string().min(1),
    manifestoFooterLabel: z.string().min(1),
    teamEyebrow: z.string().min(1),
    teamTitle: z.string().min(1),
    teamDescription: z.string().min(1),
    teamMembers: z
      .array(
        z
          .object({
            name: z.string().min(1),
            role: z.string().min(1),
            portrait: sanityImageSchema.optional().nullable(),
          })
          .passthrough(),
      )
      .min(1),
    processEyebrow: z.string().min(1),
    processTitle: z.string().min(1),
    processDescription: z.string().min(1),
    processCards: z
      .array(
        z
          .object({
            title: z.string().min(1),
            description: z.string().min(1),
          })
          .passthrough(),
      )
      .length(2),
    processImage: sanityImageSchema,
    ctaEyebrow: z.string().min(1),
    ctaTitleLine1: z.string().min(1),
    ctaTitleLine2: z.string().min(1),
    cta: ctaLinkSchema,
  })
  .passthrough();

export const processPageDocumentSchema = z
  .object({
    _id: z.string().min(1),
    heroTitleLine1: z.string().min(1),
    heroTitleLine2: z.string().min(1),
    heroImage: sanityImageSchema,
    introTitle: z.string().min(1),
    introDescription: z.string().min(1),
    steps: z
      .array(
        z
          .object({
            id: z.string().min(1),
            title: z.string().min(1),
            description: z.string().min(1),
            align: z.enum(["left", "right"]),
            layout: z.enum(["single", "bordered", "ultrawide", "grid"]),
            meta: optionalString,
            metaList: z
              .array(z.string().min(1))
              .optional()
              .nullable()
              .transform((value) => value ?? undefined),
            images: z.array(sanityImageSchema).min(1),
            action: ctaLinkSchema.optional().nullable().transform((value) => value ?? undefined),
          })
          .passthrough(),
      )
      .min(1),
    contactHeading: z.string().min(1),
    contactButtonLabel: z.string().min(1),
    contactButtonHref: z.string().min(1),
  })
  .passthrough();

export const contactPageDocumentSchema = z
  .object({
    _id: z.string().min(1),
    titleLine1: z.string().min(1),
    titleLine2: z.string().min(1),
    description: z.string().min(1),
  })
  .passthrough();

export const albumMetaSchema = z
  .object({
    _id: z.string().min(1),
    title: z.string().min(1),
    slug: z.object({ current: z.string().min(1) }).passthrough(),
    category: z.enum([
      "milestones",
      "gatherings",
      "motion",
      "portraits",
      "professional",
      "landscape",
    ]),
    description: optionalString,
    year: optionalNumber,
    location: optionalString,
    coverImage: sanityImageSchema,
    order: optionalNumber,
  })
  .passthrough();

export const albumSchema = albumMetaSchema
  .extend({
    heroImage: sanityImageSchema,
    images: z.array(sanityImageSchema),
    narrative: optionalString,
    featured: z.boolean().optional().transform((value) => value ?? false),
    videoUrl: optionalString,
  })
  .passthrough();

export const albumSlugSchema = z.object({ slug: z.string().min(1) }).passthrough();

export const albumMetaArraySchema = z.array(albumMetaSchema);
export const albumSlugArraySchema = z.array(albumSlugSchema);

export type SiteSettingsDocument = z.output<typeof siteSettingsDocumentSchema>;
export type HomePageDocument = z.output<typeof homePageDocumentSchema>;
export type AboutPageDocument = z.output<typeof aboutPageDocumentSchema>;
export type ProcessPageDocument = z.output<typeof processPageDocumentSchema>;
export type ContactPageDocument = z.output<typeof contactPageDocumentSchema>;
export type AlbumMetaDocument = z.output<typeof albumMetaSchema>;
export type AlbumDocument = z.output<typeof albumSchema>;

function summarizeIssues(error: z.ZodError) {
  return error.issues
    .slice(0, 3)
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "root";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}

export function parseSanityContent<TSchema extends z.ZodTypeAny>(
  label: string,
  schema: TSchema,
  data: unknown,
): z.output<TSchema> {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new SanityContentError(label, summarizeIssues(parsed.error));
  }

  return parsed.data;
}
