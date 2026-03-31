import { localBusinessJsonLd } from "@/lib/metadata";
import { getHomePageContent, getSiteSettings } from "@/lib/site-content";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingEditorial } from "@/components/landing/LandingEditorial";
import { LandingExhibition } from "@/components/landing/LandingExhibition";
import { LandingStudio } from "@/components/landing/LandingStudio";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default async function HomePage() {
  const [homePage, siteSettings] = await Promise.all([getHomePageContent(), getSiteSettings()]);

  return (
    <div className="bg-surface-deep text-text font-body selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd(siteSettings.sameAs)),
        }}
      />
      <main id="main-content">
        <LandingHero content={homePage.hero} />
        <div className="flex flex-col bg-surface-deep relative z-20" id="editorial-start">
          <LandingEditorial content={homePage.editorial} />
          <LandingExhibition content={homePage.exhibition} />
          <LandingStudio content={homePage.studio} />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
