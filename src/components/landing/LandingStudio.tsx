import { getFeaturedAlbum } from "@/lib/albums";
import { CinematicImageReveal } from "./CinematicImageReveal";
import { LandingStudioCards } from "./LandingStudioCards";
import { getLocalBlur, getLocalDimensions } from "@/lib/image-manifest";

const studioDims = getLocalDimensions("/images/studio-hero.jpg");

export async function LandingStudio() {
  const album = await getFeaturedAlbum();

  return (
    <section className="relative py-32 md:py-52">
      <div className="grain-medium absolute inset-0 z-[2]" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        <CinematicImageReveal
          src="/images/studio-hero.jpg"
          alt="Autumn canopy looking upward through golden foliage"
          className="w-full mb-20 md:mb-32"
          blurDataURL={getLocalBlur("/images/studio-hero.jpg")}
          width={studioDims?.width}
          height={studioDims?.height}
        />

        <LandingStudioCards featuredAlbum={album} />
      </div>
    </section>
  );
}
