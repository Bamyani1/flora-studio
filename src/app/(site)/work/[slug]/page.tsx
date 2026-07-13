import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAlbumBySlug, getAlbumSlugs, getAlbumWithNavigation } from "@/lib/albums";
import { breadcrumbJsonLd, imageGalleryJsonLd, jsonLdString } from "@/lib/metadata";
import { publicEnv } from "@/lib/public-env";
import { generateLqipDataUrl, generateLocalLqipDataUrl } from "@/lib/lqip";
import { resolveImageUrl } from "@/lib/image-url";
import { AlbumHero } from "@/components/sections/AlbumHero";
import { AlbumNav } from "@/components/sections/AlbumNav";
import { FolioGallery } from "@/components/sections/FolioGallery";
import { TextReveal } from "@/components/animations/TextReveal";
export async function generateStaticParams() {
  const slugs = await getAlbumSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let title = "Album";
  let description: string | undefined;
  const album = await getAlbumBySlug(slug);
  if (album?.title) {
    title = album.title;
  }
  if (album?.description) {
    description = album.description;
  }

  return {
    title,
    description: description ?? `${title}. Photography by Flora Studio, Dayton, Ohio.`,
  };
}

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { album, previous, next, series } = await getAlbumWithNavigation(slug);

  if (!album) notFound();

  const heroUrl = resolveImageUrl(album.heroImage);
  const heroBlurDataURL = heroUrl?.startsWith("https://cdn.sanity.io")
    ? await generateLqipDataUrl(heroUrl)
    : await generateLocalLqipDataUrl(heroUrl);

  // The hero has pride of place at the top of the page — keep it out of the folio
  const imageKey = (img: { url?: string; asset?: { _ref: string } }) =>
    img.url ?? img.asset?._ref;
  const heroKey = album.heroImage ? imageKey(album.heroImage) : undefined;
  const seen = new Set<string>();
  const galleryImages = (album.images ?? []).filter((img) => {
    const key = imageKey(img);
    if (!key || key === heroKey) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Per-plate LQIP so slow connections see a blur-up instead of empty panels
  const galleryWithBlur = await Promise.all(
    galleryImages.map(async (img) => {
      const url = resolveImageUrl(img);
      const blurDataURL = url?.startsWith("https://cdn.sanity.io")
        ? await generateLqipDataUrl(url)
        : url?.startsWith("/")
          ? await generateLocalLqipDataUrl(url)
          : undefined;
      return blurDataURL ? { ...img, blurDataURL } : img;
    }),
  );

  const SITE_URL = publicEnv.siteUrl;
  const jsonLd = imageGalleryJsonLd({
    title: album.title,
    description: album.description,
    slug,
    // numberOfItems matches the folio plate count shown on the page
    imageCount: galleryImages.length,
    images: galleryImages
      .map((img) => ({ url: resolveImageUrl(img) ?? "", caption: img.alt }))
      .filter((img) => img.url),
  });
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Work", url: `${SITE_URL}/work` },
    { name: album.title, url: `${SITE_URL}/work/${slug}` },
  ]);

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
      />
      <AlbumHero
        title={album.title}
        category={album.category}
        year={album.year}
        location={album.location}
        heroImage={album.heroImage}
        blurDataURL={heroBlurDataURL}
        series={series ?? undefined}
      />

      {album.narrative && (
        <section className="px-[var(--container-padding-x)] py-[var(--section-padding-y)]">
          <div className="mx-auto max-w-[var(--max-width-narrow)]">
            <TextReveal
              variant="words"
              scrub
              className="font-body text-xl leading-relaxed text-text md:text-2xl"
            >
              {album.narrative}
            </TextReveal>
          </div>
        </section>
      )}

      {galleryWithBlur.length > 0 && (
        <FolioGallery
          images={galleryWithBlur}
          title={album.title}
          videoUrl={album.videoUrl}
          videoPosterUrl={album.videoPosterUrl}
        />
      )}

      <AlbumNav previous={previous ?? undefined} next={next ?? undefined} />
    </main>
  );
}
