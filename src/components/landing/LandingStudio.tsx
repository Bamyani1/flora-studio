import { client } from "@/sanity/client";
import { FEATURED_ALBUMS_QUERY } from "@/sanity/queries";
import { PLACEHOLDER_FEATURED_ALBUMS } from "@/lib/placeholder-data";
import { CinematicImageReveal } from "./CinematicImageReveal";
import { LandingStudioCards } from "./LandingStudioCards";
import { getLocalBlur } from "@/lib/image-manifest";
import type { AlbumMeta } from "@/types/project";

async function getFeaturedAlbum(): Promise<AlbumMeta> {
  try {
    const albums = await client.fetch(FEATURED_ALBUMS_QUERY);
    return albums[0] ?? PLACEHOLDER_FEATURED_ALBUMS[0];
  } catch {
    return PLACEHOLDER_FEATURED_ALBUMS[0];
  }
}

export async function LandingStudio() {
  const album = await getFeaturedAlbum();

  return (
    <section className="relative py-32 md:py-52">
      <div className="grain-medium absolute inset-0 z-[2]" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        <CinematicImageReveal
          src="/images/wanderlust/hero.jpg"
          alt="Wanderlust landscape"
          className="w-full h-[60vh] md:h-[700px] mb-20 md:mb-32"
          blurDataURL={getLocalBlur("/images/wanderlust/hero.jpg")}
        />

        <LandingStudioCards featuredAlbum={album} />
      </div>
    </section>
  );
}
