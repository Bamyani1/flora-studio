import { localBusinessJsonLd } from "@/lib/metadata";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingEditorial } from "@/components/landing/LandingEditorial";
import { LandingExhibition } from "@/components/landing/LandingExhibition";
import { LandingStudio } from "@/components/landing/LandingStudio";

import { LandingFooter } from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <div className="bg-surface-deep text-text font-body selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />
      <main id="main-content">
        <LandingHero />
        <div className="flex flex-col bg-surface-deep relative z-20" id="editorial-start">
          <LandingEditorial />
          <LandingExhibition />
          <LandingStudio />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
