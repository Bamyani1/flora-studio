import type { Metadata } from "next";
import { client } from "@/sanity/client";
import {
  ALBUM_BY_SLUG_QUERY,
  ALBUM_SLUGS_QUERY,
  ALBUMS_QUERY,
} from "@/sanity/queries";
import {
  PLACEHOLDER_ALL_ALBUMS,
  PLACEHOLDER_ALBUM_MAP,
} from "@/lib/placeholder-data";
import { AlbumHero } from "@/components/sections/AlbumHero";
import { AlbumNav } from "@/components/sections/AlbumNav";
import { HorizontalScrollGallery } from "@/components/sections/HorizontalScrollGallery";
import { TextReveal } from "@/components/animations/TextReveal";
import type { Album, AlbumMeta } from "@/types/project";

async function getAlbumWithNav(slug: string) {
  let album: Album | null = null;
  let allAlbums: AlbumMeta[] = [];

  try {
    [album, allAlbums] = await Promise.all([
      client.fetch(ALBUM_BY_SLUG_QUERY, { slug }),
      client.fetch(ALBUMS_QUERY),
    ]);
  } catch {
    album = PLACEHOLDER_ALBUM_MAP[slug] ?? null;
    allAlbums = PLACEHOLDER_ALL_ALBUMS;
  }

  if (!album) {
    return { album: null, previous: null, next: null };
  }

  // Find prev/next with wrap-around
  const currentIndex = allAlbums.findIndex(
    (a) => a.slug.current === slug,
  );
  const prevIndex =
    currentIndex <= 0 ? allAlbums.length - 1 : currentIndex - 1;
  const nextIndex =
    currentIndex >= allAlbums.length - 1 ? 0 : currentIndex + 1;

  const previous =
    allAlbums.length > 1
      ? { title: allAlbums[prevIndex].title, slug: allAlbums[prevIndex].slug.current }
      : null;
  const next =
    allAlbums.length > 1
      ? { title: allAlbums[nextIndex].title, slug: allAlbums[nextIndex].slug.current }
      : null;

  return { album, previous, next };
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(ALBUM_SLUGS_QUERY);
    return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
  } catch {
    return PLACEHOLDER_ALL_ALBUMS.map((a) => ({ slug: a.slug.current }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let title = "Album";
  try {
    const album = await client.fetch(ALBUM_BY_SLUG_QUERY, { slug });
    if (album?.title) title = album.title;
  } catch {
    const placeholder = PLACEHOLDER_ALBUM_MAP[slug];
    if (placeholder) title = placeholder.title;
  }

  return {
    title: `${title} — Bamyan Storyworks`,
  };
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { album, previous, next } = await getAlbumWithNav(slug);

  if (!album) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Album not found.</p>
      </main>
    );
  }

  const heroUrl = album.heroImage?.asset?._ref ? undefined : null;

  return (
    <main>
      <AlbumHero
        title={album.title}
        category={album.category}
        year={album.year}
        location={album.location}
        heroUrl={heroUrl}
        heroBlur={album.heroBlur}
      />

      {album.narrative && (
        <section className="px-[--container-padding-x] py-[--section-padding-y]">
          <div className="mx-auto max-w-[--max-width-narrow]">
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

      {album.images?.length > 0 && (
        <HorizontalScrollGallery images={album.images} />
      )}

      <AlbumNav previous={previous ?? undefined} next={next ?? undefined} />
    </main>
  );
}
