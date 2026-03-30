import { personJsonLd } from "@/lib/metadata";
import { getAboutPageContent, getSiteSettings } from "@/lib/site-content";
import { AboutPageClient } from "@/components/about/AboutPageClient";

export default async function AboutPage() {
  const [aboutPage, siteSettings] = await Promise.all([getAboutPageContent(), getSiteSettings()]);
  const primaryMember = aboutPage.team.members[0];
  const jsonLd = personJsonLd({
    name: primaryMember?.name,
    jobTitle: primaryMember?.role,
    sameAs: siteSettings.sameAs,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutPageClient content={aboutPage} />
    </>
  );
}
