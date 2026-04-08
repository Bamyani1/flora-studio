import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAlbumBySlug, getAlbumSlugs, getAlbumWithNavigation } from "@/lib/albums";
import { breadcrumbJsonLd, imageGalleryJsonLd } from "@/lib/metadata";
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
    description: description ?? `${title}. Photography by Studio Bahar, Dayton, Ohio.`,
  };
}

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { album, previous, next } = await getAlbumWithNavigation(slug);

  if (!album) notFound();

  const heroUrl = resolveImageUrl(album.heroImage);
  const heroBlurDataURL = heroUrl?.startsWith("https://cdn.sanity.io")
    ? await generateLqipDataUrl(heroUrl)
    : await generateLocalLqipDataUrl(heroUrl);

  const SITE_URL = publicEnv.siteUrl;
  const jsonLd = imageGalleryJsonLd({
    title: album.title,
    description: album.description,
    slug,
    imageCount: album.images?.length ?? 0,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <AlbumHero
        title={album.title}
        category={album.category}
        year={album.year}
        location={album.location}
        heroImage={album.heroImage}
        blurDataURL={heroBlurDataURL}
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

      {album.images?.length > 0 &&
        (() => {
          const seen = new Set<string>();
          const galleryImages = [...album.images, album.heroImage].filter((img) => {
            const key = img.url ?? img.asset._ref;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          return (
            <FolioGallery images={galleryImages} title={album.title} videoUrl={album.videoUrl} />
          );
        })()}

      <AlbumNav previous={previous ?? undefined} next={next ?? undefined} />
    </main>
  );
}
