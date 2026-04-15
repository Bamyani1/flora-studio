import { jsonLdString, localBusinessJsonLd } from "@/lib/metadata";
import { getHomePageContent, getSiteSettings } from "@/lib/site-content";
import { resolveImageUrl } from "@/lib/image-url";
import { generateLqipDataUrl, generateLocalLqipDataUrl } from "@/lib/lqip";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingEditorial } from "@/components/landing/LandingEditorial";
import { LandingExhibition } from "@/components/landing/LandingExhibition";
import { LandingStudio } from "@/components/landing/LandingStudio";
import { Footer } from "@/components/layout/Footer";

async function getHeroBlurDataUrl(homePage: Awaited<ReturnType<typeof getHomePageContent>>) {
  const firstImage = homePage.hero.mediaCycle[0];
  if (!firstImage) return undefined;
  const url = resolveImageUrl(firstImage);
  if (!url) return undefined;
  if (url.startsWith("https://cdn.sanity.io")) return generateLqipDataUrl(url);
  if (url.startsWith("/")) return generateLocalLqipDataUrl(url);
  return undefined;
}

export default async function HomePage() {
  const [homePage, siteSettings] = await Promise.all([getHomePageContent(), getSiteSettings()]);
  const heroBlurDataURL = await getHeroBlurDataUrl(homePage);

  return (
    <div className="bg-surface-deep text-text font-body selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(localBusinessJsonLd(siteSettings.sameAs)),
        }}
      />
      <main id="main-content">
        <LandingHero content={homePage.hero} blurDataURL={heroBlurDataURL} />
        <div className="flex flex-col bg-surface-deep relative z-20" id="editorial-start">
          <LandingEditorial content={homePage.editorial} />
          <LandingExhibition content={homePage.exhibition} />
          <LandingStudio content={homePage.studio} />
        </div>
      </main>
      <Footer socialLinks={siteSettings.socialLinks} />
    </div>
  );
}
