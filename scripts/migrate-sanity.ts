import fs from "node:fs";
import path from "node:path";
import { createClient, type SanityClient } from "@sanity/client";
import { PLACEHOLDER_ALL_ALBUMS } from "@/lib/placeholder-data";
import {
  PLACEHOLDER_ABOUT_PAGE,
  PLACEHOLDER_CONTACT_PAGE,
  PLACEHOLDER_HOME_PAGE,
  PLACEHOLDER_PROCESS_PAGE,
  PLACEHOLDER_SITE_SETTINGS,
} from "@/lib/placeholder-site-content";
import type {
  AboutPageContent,
  ContactPageContent,
  HomePageContent,
  ProcessPageContent,
  SiteSettings,
} from "@/types/content";
import type { Album, SanityImage } from "@/types/project";

type SanityImageField = {
  _key?: string;
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
  alt?: string;
  caption?: string;
};

type MigrationDocument = Record<string, unknown> & {
  _id: string;
  _type: string;
};

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-07-11";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
}

if (!token) {
  throw new Error("Missing SANITY_API_TOKEN");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

class Semaphore {
  #active = 0;
  #queue: Array<() => void> = [];

  constructor(private readonly limit: number) {}

  async run<T>(task: () => Promise<T>): Promise<T> {
    await this.acquire();

    try {
      return await task();
    } finally {
      this.release();
    }
  }

  private acquire() {
    if (this.#active < this.limit) {
      this.#active += 1;
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.#queue.push(() => {
        this.#active += 1;
        resolve();
      });
    });
  }

  private release() {
    this.#active -= 1;
    const next = this.#queue.shift();
    next?.();
  }
}

const uploadSemaphore = new Semaphore(3);
const uploadCache = new Map<string, Promise<SanityImageField | undefined>>();
let uploadedAssetCount = 0;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as {
    statusCode?: number;
    response?: { statusCode?: number; status?: number };
  };

  const status =
    candidate.statusCode ?? candidate.response?.statusCode ?? candidate.response?.status;

  return status === 429 || (typeof status === "number" && status >= 500);
}

async function withRetry<T>(label: string, task: () => Promise<T>, attempt = 0): Promise<T> {
  try {
    return await task();
  } catch (error) {
    if (attempt >= 5 || !isRetryableError(error)) {
      throw error;
    }

    const delay = 500 * 2 ** attempt + Math.round(Math.random() * 200);
    console.log(`[retry] ${label} failed, retrying in ${delay}ms`);
    await sleep(delay);
    return withRetry(label, task, attempt + 1);
  }
}

function keyFor(...parts: Array<string | number | undefined>) {
  const value = parts
    .filter((part): part is string | number => part !== undefined && part !== "")
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return value.slice(0, 96) || "item";
}

function publicPathToAbsolute(publicPath: string) {
  return path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
}

function getUploadSource(image?: SanityImage | null) {
  const publicPath = image?.url;

  if (!publicPath || !publicPath.startsWith("/images/")) {
    return null;
  }

  const absolutePath = publicPathToAbsolute(publicPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing local asset: ${publicPath}`);
  }

  return { publicPath, absolutePath };
}

async function uploadImage(
  image: SanityImage | null | undefined,
  label: string,
  key?: string,
): Promise<SanityImageField | undefined> {
  if (!image) {
    return undefined;
  }

  const source = getUploadSource(image);

  if (!source) {
    return undefined;
  }

  if (!uploadCache.has(source.publicPath)) {
    uploadCache.set(
      source.publicPath,
      uploadSemaphore.run(async () => {
        const filename = path.basename(source.absolutePath);

        console.log(`[asset] uploading ${source.publicPath} for ${label}`);

        const asset = await withRetry(`upload ${source.publicPath}`, () =>
          client.assets.upload("image", fs.createReadStream(source.absolutePath), {
            filename,
            title: image.alt ?? filename,
          }),
        );

        uploadedAssetCount += 1;
        console.log(`[asset] uploaded ${source.publicPath} -> ${asset._id}`);

        return {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
          alt: image.alt,
          caption: image.caption,
        };
      }),
    );
  }

  const uploadedImage = await uploadCache.get(source.publicPath);

  if (!uploadedImage) {
    return undefined;
  }

  return key ? { ...uploadedImage, _key: key } : uploadedImage;
}

async function requireImage(
  image: SanityImage | null | undefined,
  label: string,
  key?: string,
): Promise<SanityImageField> {
  const uploadedImage = await uploadImage(image, label, key);

  if (!uploadedImage) {
    throw new Error(`Expected local image for ${label}`);
  }

  return uploadedImage;
}

function linkField(link: { label: string; href: string }) {
  return {
    _type: "ctaLink" as const,
    label: link.label,
    href: link.href,
  };
}

function socialLinksField(socialLinks: SiteSettings["socialLinks"]) {
  return socialLinks.map((link, index) => ({
    _key: keyFor("social", link.platform, index),
    _type: "socialLink" as const,
    label: link.label,
    platform: link.platform,
    url: link.url,
    icon: link.icon,
  }));
}

async function buildSiteSettingsDoc(content: SiteSettings): Promise<MigrationDocument> {
  return {
    _id: "siteSettings",
    _type: "siteSettings",
    studioName: content.studioName,
    location: content.location,
    email: content.email,
    phone: content.phone,
    socialLinks: socialLinksField(content.socialLinks),
    sameAs: content.sameAs,
  };
}

async function buildHomePageDoc(content: HomePageContent): Promise<MigrationDocument> {
  return {
    _id: "homePage",
    _type: "homePage",
    heroEyebrow: content.hero.eyebrow,
    heroTitleLine1: content.hero.titleLine1,
    heroTitleLine2: content.hero.titleLine2,
    heroDescription: content.hero.description,
    heroMediaCycle: await Promise.all(
      content.hero.mediaCycle.map(async (image, index) => {
        const uploaded = await requireImage(
          image,
          `home.heroMediaCycle[${index}]`,
          keyFor("hero-media", index + 1),
        );
        return image.objectPosition
          ? { ...uploaded, objectPosition: image.objectPosition }
          : uploaded;
      }),
    ),
    editorialImage: await requireImage(content.editorial.image, "home.editorialImage"),
    editorialTitleLine1: content.editorial.titleLine1,
    editorialTitleLine2Lead: content.editorial.titleLine2Lead,
    editorialTitleLine2Muted: content.editorial.titleLine2Muted,
    editorialTitleLine2Accent: content.editorial.titleLine2Accent,
    editorialDescription: content.editorial.description,
    editorialCta: linkField(content.editorial.cta),
    exhibitionEyebrow: content.exhibition.eyebrow,
    exhibitionTitleLine1: content.exhibition.titleLine1,
    exhibitionTitleLine2: content.exhibition.titleLine2,
    exhibitionDescription: content.exhibition.description,
    exhibitionImage: await requireImage(content.exhibition.image, "home.exhibitionImage"),
    exhibitionCta: linkField(content.exhibition.cta),
    studioImage: await requireImage(content.studio.image, "home.studioImage"),
    studioCtaEyebrow: "Work With Us",
    studioCtaLabel: content.studio.ctaLabel,
    studioCta: linkField(content.studio.cta),
  };
}

async function buildAboutPageDoc(content: AboutPageContent): Promise<MigrationDocument> {
  return {
    _id: "aboutPage",
    _type: "aboutPage",
    heroEyebrow: content.hero.eyebrow,
    heroTitleLine1: content.hero.titleLine1,
    heroTitleLine2: content.hero.titleLine2,
    heroDescription: content.hero.description,
    manifestoEyebrow: content.manifesto.eyebrow,
    manifestoQuotePrefix: content.manifesto.quotePrefix,
    manifestoQuoteAccent: content.manifesto.quoteAccent,
    manifestoQuoteSuffix: content.manifesto.quoteSuffix,
    manifestoFooterLabel: content.manifesto.footerLabel,
    teamEyebrow: content.team.eyebrow,
    teamTitle: content.team.title,
    teamDescription: content.team.description,
    teamMembers: await Promise.all(
      content.team.members.map(async (member, index) => {
        const portrait = await uploadImage(
          member.portrait ?? undefined,
          `about.teamMembers[${member.name}]`,
        );

        return {
          _key: keyFor("team", member.name, index),
          _type: "teamMember" as const,
          name: member.name,
          role: member.role,
          ...(portrait ? { portrait } : {}),
        };
      }),
    ),
    processEyebrow: content.process.eyebrow,
    processTitle: content.process.title,
    processDescription: content.process.description,
    processCards: content.process.cards.map((card, index) => ({
      _key: keyFor("process-card", card.title, index),
      _type: "aboutProcessCard" as const,
      title: card.title,
      description: card.description,
    })),
    processImage: await requireImage(content.process.image, "about.processImage"),
    ctaEyebrow: content.cta.eyebrow,
    ctaTitleLine1: content.cta.titleLine1,
    ctaTitleLine2: content.cta.titleLine2,
    cta: linkField(content.cta.cta),
  };
}

async function buildProcessPageDoc(content: ProcessPageContent): Promise<MigrationDocument> {
  return {
    _id: "processPage",
    _type: "processPage",
    heroTitleLine1: content.hero.titleLine1,
    heroTitleLine2: content.hero.titleLine2,
    heroImage: await requireImage(content.hero.image, "process.heroImage"),
    introTitle: content.intro.title,
    introDescription: content.intro.description,
    steps: await Promise.all(
      content.steps.map(async (step, index) => ({
        _key: keyFor("process-step", step.id, index),
        _type: "processStep" as const,
        id: step.id,
        title: step.title,
        description: step.description,
        align: step.align,
        layout: step.layout,
        ...(step.meta ? { meta: step.meta } : {}),
        ...(step.metaList ? { metaList: step.metaList } : {}),
        images: await Promise.all(
          step.images.map((image, imageIndex) =>
            requireImage(
              image,
              `process.steps[${step.id}].images[${imageIndex}]`,
              keyFor("process-step-image", step.id, imageIndex + 1),
            ),
          ),
        ),
        ...(step.action ? { action: linkField(step.action) } : {}),
      })),
    ),
    contactHeading: content.contactCta.heading,
    contactButtonLabel: content.contactCta.buttonLabel,
    contactButtonHref: content.contactCta.buttonHref,
  };
}

async function buildContactPageDoc(content: ContactPageContent): Promise<MigrationDocument> {
  return {
    _id: "contactPage",
    _type: "contactPage",
    titleLine1: content.titleLine1,
    titleLine2: content.titleLine2,
    description: content.description,
  };
}

async function buildAlbumDoc(album: Album): Promise<MigrationDocument> {
  return {
    _id: `album.${album.slug.current}`,
    _type: "album",
    title: album.title,
    slug: {
      _type: "slug",
      current: album.slug.current,
    },
    category: album.category,
    year: album.year,
    location: album.location,
    description: album.description,
    coverImage: await requireImage(album.coverImage, `${album.slug.current}.coverImage`),
    heroImage: await requireImage(album.heroImage, `${album.slug.current}.heroImage`),
    images: await Promise.all(
      album.images.map((image, index) =>
        requireImage(
          image,
          `${album.slug.current}.images[${index}]`,
          keyFor(album.slug.current, "image", index + 1),
        ),
      ),
    ),
    narrative: album.narrative,
    featured: album.featured ?? false,
    order: album.order,
    ...(album.videoUrl ? { videoUrl: album.videoUrl } : {}),
  };
}

async function documentExists(currentClient: SanityClient, id: string) {
  return withRetry(`get ${id}`, () => currentClient.getDocument(id));
}

async function createOrReplaceDocument(doc: MigrationDocument) {
  return withRetry(`mutate ${doc._id}`, () =>
    force ? client.createOrReplace(doc) : client.create(doc),
  );
}

async function run() {
  const documents = [
    {
      id: "siteSettings",
      build: () => buildSiteSettingsDoc(PLACEHOLDER_SITE_SETTINGS),
    },
    {
      id: "homePage",
      build: () => buildHomePageDoc(PLACEHOLDER_HOME_PAGE),
    },
    {
      id: "aboutPage",
      build: () => buildAboutPageDoc(PLACEHOLDER_ABOUT_PAGE),
    },
    {
      id: "processPage",
      build: () => buildProcessPageDoc(PLACEHOLDER_PROCESS_PAGE),
    },
    {
      id: "contactPage",
      build: () => buildContactPageDoc(PLACEHOLDER_CONTACT_PAGE),
    },
    ...PLACEHOLDER_ALL_ALBUMS.map((album) => ({
      id: `album.${album.slug.current}`,
      build: () => buildAlbumDoc(album),
    })),
  ];

  let createdOrUpdated = 0;
  let skipped = 0;

  console.log(
    `[migration] starting Sanity import for ${documents.length} documents into ${projectId}/${dataset} ${force ? "(force mode)" : "(skip-existing mode)"}`,
  );

  for (let index = 0; index < documents.length; index += 1) {
    const docJob = documents[index];
    console.log(`[doc ${index + 1}/${documents.length}] checking ${docJob.id}`);

    const existing = await documentExists(client, docJob.id);

    if (existing && !force) {
      skipped += 1;
      console.log(`[doc ${index + 1}/${documents.length}] skipped ${docJob.id}`);
      continue;
    }

    const doc = await docJob.build();
    await createOrReplaceDocument(doc);

    createdOrUpdated += 1;
    console.log(
      `[doc ${index + 1}/${documents.length}] ${force ? "upserted" : "created"} ${docJob.id}`,
    );
  }

  console.log(
    `[migration] complete: ${createdOrUpdated} ${force ? "upserted" : "created"}, ${skipped} skipped, ${uploadedAssetCount} assets uploaded`,
  );
}

run().catch((error) => {
  console.error("[migration] failed");
  console.error(error);
  process.exitCode = 1;
});
