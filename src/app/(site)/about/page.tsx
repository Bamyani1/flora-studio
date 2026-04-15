import { breadcrumbJsonLd, jsonLdString, personJsonLd } from "@/lib/metadata";
import { publicEnv } from "@/lib/public-env";
import { getAboutPageContent, getSiteSettings } from "@/lib/site-content";
import { AboutPageClient } from "@/components/about/AboutPageClient";

export default async function AboutPage() {
  const [aboutPage, siteSettings] = await Promise.all([getAboutPageContent(), getSiteSettings()]);
  const primaryMember = aboutPage.team.members[0];
  const SITE_URL = publicEnv.siteUrl;
  const jsonLd = personJsonLd({
    name: primaryMember?.name,
    jobTitle: primaryMember?.role,
    sameAs: siteSettings.sameAs,
  });
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "About", url: `${SITE_URL}/about` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
      />
      <AboutPageClient content={aboutPage} />
    </>
  );
}
