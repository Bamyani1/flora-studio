import type { Metadata } from "next";
import { ProcessExperience } from "@/components/process-reference/ProcessExperience";
import { resolveImageUrl } from "@/lib/image-url";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { publicEnv } from "@/lib/public-env";
import { getProcessPageContent, getSiteSettings } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Process",
  description:
    "From conversation to delivery — how we work at Bahar Studio. Four phases, one standard: nothing leaves until it's worth keeping.",
};

export default async function ProcessPage() {
  const [processPage, siteSettings] = await Promise.all([
    getProcessPageContent(),
    getSiteSettings(),
  ]);

  const SITE_URL = publicEnv.siteUrl;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Process", url: `${SITE_URL}/process` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <ProcessExperience
      heroImage={{
        src: resolveImageUrl(processPage.hero.image) ?? "",
        alt: processPage.hero.image.alt ?? "Bahar Studio process hero",
      }}
      heroTitleLine1={processPage.hero.titleLine1}
      heroTitleLine2={processPage.hero.titleLine2}
      introTitle={processPage.intro.title}
      introDescription={processPage.intro.description}
      steps={processPage.steps.map((step) => ({
        ...step,
        images: step.images.map((image) => ({
          src: resolveImageUrl(image) ?? "",
          alt: image.alt ?? `${step.title} image`,
        })),
      }))}
      contactHeading={processPage.contactCta.heading}
      contactButtonLabel={processPage.contactCta.buttonLabel}
      contactButtonHref={processPage.contactCta.buttonHref}
      socialLinks={siteSettings.socialLinks}
    />
    </>
  );
}
