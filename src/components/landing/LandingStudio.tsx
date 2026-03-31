import { getFeaturedAlbum } from "@/lib/albums";
import { CinematicImageReveal } from "./CinematicImageReveal";
import { LandingStudioCards } from "./LandingStudioCards";
import { getImageDimensions, resolveImageUrl } from "@/lib/image-url";
import type { HomeStudioContent } from "@/types/content";

interface LandingStudioProps {
  content: HomeStudioContent;
}

export async function LandingStudio({ content }: LandingStudioProps) {
  const album = await getFeaturedAlbum();
  const dims = getImageDimensions(content.image);

  return (
    <section className="relative py-32 md:py-52">
      <div className="grain-medium absolute inset-0 z-grain" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        <CinematicImageReveal
          src={resolveImageUrl(content.image)}
          alt={content.image.alt ?? ""}
          className="w-full mb-20 md:mb-32"
          width={dims?.width ?? 2041}
          height={dims?.height ?? 3200}
        />

        <LandingStudioCards
          featuredAlbum={album}
          ctaEyebrow={content.ctaEyebrow}
          ctaLabel={content.ctaLabel}
          ctaHref={content.cta.href}
        />
      </div>
    </section>
  );
}
