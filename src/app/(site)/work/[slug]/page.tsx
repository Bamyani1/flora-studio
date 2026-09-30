import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAlbumBySlug,
  getAlbumHeroImage,
  getAlbumSlugs,
  getAlbumWithNavigation,
  getFolioImages,
} from "@/lib/albums";
import { breadcrumbJsonLd, imageGalleryJsonLd, jsonLdString } from "@/lib/metadata";
import { publicEnv } from "@/lib/public-env";
import { generateBlurDataUrl } from "@/lib/lqip";
import { resolveImageUrl } from "@/lib/image-url";
import { CATEGORY_META } from "@/lib/categories";
import { AlbumHero } from "@/components/sections/AlbumHero";
import { AlbumStory, type AlbumDetail } from "@/components/sections/AlbumStory";
import { AlbumGallery } from "@/components/sections/AlbumGallery";
import { AlbumNav } from "@/components/sections/AlbumNav";
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

  const heroImage = getAlbumHeroImage(album);
  const heroBlurDataURL = await generateBlurDataUrl(resolveImageUrl(heroImage));

  // The opening frame has pride of place at the top of the page — keep it out of the gallery
  const galleryImages = getFolioImages(album);

  // Per-photo LQIP so slow connections see a blur-up instead of empty tiles
  const galleryWithBlur = await Promise.all(
    galleryImages.map(async (img) => {
      const blurDataURL = await generateBlurDataUrl(resolveImageUrl(img));
      return blurDataURL ? { ...img, blurDataURL } : img;
    }),
  );

  const details: AlbumDetail[] = [
    album.category && {
      label: "Category",
      value: CATEGORY_META[album.category]?.label ?? album.category,
    },
    album.year && { label: "Year", value: String(album.year) },
    album.location && { label: "Location", value: album.location },
    galleryImages.length > 0 && { label: "Photographs", value: String(galleryImages.length) },
    album.videoUrl && { label: "Film", value: "1" },
  ].filter((detail): detail is AlbumDetail => Boolean(detail));

  const SITE_URL = publicEnv.siteUrl;
  const jsonLd = imageGalleryJsonLd({
    title: album.title,
    description: album.description,
    slug,
    // numberOfItems matches the photo count shown on the page
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
        image={heroImage}
        blurDataURL={heroBlurDataURL}
        series={series ?? undefined}
      />

      <AlbumStory text={album.narrative || album.description} details={details} />

      {/* A film-only album still gets its film */}
      {(galleryWithBlur.length > 0 || album.videoUrl) && (
        <AlbumGallery
          title={album.title}
          images={galleryWithBlur}
          videoUrl={album.videoUrl}
          videoPosterUrl={album.videoPosterUrl}
        />
      )}

      <AlbumNav previous={previous ?? undefined} next={next ?? undefined} />
    </main>
  );
}
