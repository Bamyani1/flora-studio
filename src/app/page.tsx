import { client } from "@/sanity/client";
import { FEATURED_ALBUMS_QUERY } from "@/sanity/queries";
import { PLACEHOLDER_FEATURED_ALBUMS } from "@/lib/placeholder-data";
import { getLocalBlur } from "@/lib/image-manifest";
import { localBusinessJsonLd } from "@/lib/metadata";
import type { AlbumMeta } from "@/types/project";
import { Hero } from "@/components/sections/Hero";
import { CuratedCollections } from "@/components/sections/CuratedCollections";
import { QuoteBlock } from "@/components/sections/QuoteBlock";
import { ExhibitionFeature } from "@/components/sections/ExhibitionFeature";
import { StartAStory } from "@/components/sections/StartAStory";

async function getFeaturedAlbums(): Promise<AlbumMeta[]> {
  try {
    return await client.fetch(FEATURED_ALBUMS_QUERY);
  } catch {
    return PLACEHOLDER_FEATURED_ALBUMS;
  }
}

export default async function HomePage() {
  const albums = await getFeaturedAlbums();

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />
      <Hero imageUrl="/images/hero.jpg" blurDataURL={getLocalBlur("/images/hero.jpg")} />
      <CuratedCollections albums={albums} />
      <QuoteBlock />
      <ExhibitionFeature blurDataURL={getLocalBlur("/images/high-country/hero.jpg")} />
      <StartAStory />
    </main>
  );
}
