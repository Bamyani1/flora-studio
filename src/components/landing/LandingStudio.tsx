import { getFeaturedAlbum } from "@/lib/albums";
import { CinematicImageReveal } from "./CinematicImageReveal";
import { LandingStudioCards } from "./LandingStudioCards";
import { LANDING_MEDIA } from "@/lib/site-media";

export async function LandingStudio() {
  const album = await getFeaturedAlbum();

  return (
    <section className="relative py-32 md:py-52">
      <div className="grain-medium absolute inset-0 z-[2]" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        <CinematicImageReveal
          src={LANDING_MEDIA.studio.src}
          alt={LANDING_MEDIA.studio.alt}
          className="w-full mb-20 md:mb-32"
          width={LANDING_MEDIA.studio.width}
          height={LANDING_MEDIA.studio.height}
        />

        <LandingStudioCards featuredAlbum={album} />
      </div>
    </section>
  );
}
