import type { Metadata } from "next";
import { Instagram } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { CinematicContactForm } from "@/components/ui/CinematicContactForm";
import { breadcrumbJsonLd, jsonLdString } from "@/lib/metadata";
import { publicEnv } from "@/lib/public-env";
import { getContactPageContent, getSiteSettings } from "@/lib/site-content";
import type { SiteSettings, SocialLink } from "@/types/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Flora Studio in Dayton, Ohio. Available for weddings and graduations, events, sports, portraits, and commercial photography.",
};

function SocialIcon({ icon }: Pick<SocialLink, "icon">) {
  switch (icon) {
    case "instagram":
      return <Instagram className="h-5 w-5" />;
    default:
      return null;
  }
}

function StudioInfo({ siteSettings }: { siteSettings: SiteSettings }) {
  const phoneHref = `tel:+1${siteSettings.phone.replace(/\D/g, "")}`;

  return (
    // Mount reveal: the studio's contact details must never wait on a scroll trigger
    <FadeIn delay={0.2} immediate>
      <p className="mb-1 font-body text-base text-text-heading">{siteSettings.location}</p>
      <p className="mt-3 font-body text-sm text-muted">
        <a
          href={`mailto:${siteSettings.email}`}
          className="inline-block py-1 transition-colors can-hover:hover:text-primary"
        >
          {siteSettings.email}
        </a>
      </p>
      <p className="font-body text-sm text-muted">
        <a
          href={phoneHref}
          className="inline-block py-1 transition-colors can-hover:hover:text-primary"
        >
          {siteSettings.phone}
        </a>
      </p>

      <div className="mt-8 flex space-x-6">
        {siteSettings.socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="inline-block p-2 -m-2 text-muted transition-colors can-hover:hover:text-primary"
          >
            <SocialIcon icon={link.icon} />
          </a>
        ))}
      </div>
    </FadeIn>
  );
}

export default async function ContactPage() {
  const [contactPage, siteSettings] = await Promise.all([
    getContactPageContent(),
    getSiteSettings(),
  ]);

  const SITE_URL = publicEnv.siteUrl;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Contact", url: `${SITE_URL}/contact` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
      />
      {/* The page scrolls normally on desktop: a viewport-locked panel with its
          own scrollbar can clip fields and hide validation errors entirely */}
      <main
        id="main-content"
        className="relative flex min-h-screen flex-col overflow-hidden bg-background px-[var(--container-padding-x)] pt-24 pb-10 md:px-[var(--container-padding-x-wide)] md:pt-[140px] md:pb-20"
      >
        {/* Grain overlay */}
        <div className="grain-medium absolute inset-0 z-grain" aria-hidden="true" />

        {/* Floating two-panel card */}
        <div className="relative flex flex-1 flex-col overflow-hidden lg:flex-row">
          {/* Left Panel — Branding */}
          <div className="relative flex w-full flex-col gap-8 bg-surface-deep px-8 py-10 lg:w-[39.5%] lg:justify-between lg:gap-0 lg:px-14 lg:py-14">
            {/* Subtle top glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-text) 4%, transparent) 0%, transparent 60%)",
              }}
            />

            {/* Top content */}
            <div className="relative z-10">
              <FadeIn>
                <h1 className="mb-6 font-display text-4xl font-light uppercase leading-[0.9] text-text-heading md:text-5xl">
                  <span className="italic">{contactPage.titleLine1}</span>
                  <br />
                  <span className="font-bold not-italic">{contactPage.titleLine2}</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.1}>
                <p className="max-w-[340px] font-body text-base leading-relaxed text-muted">
                  {contactPage.description}
                </p>
              </FadeIn>
            </div>

            {/* Bottom content — desktop only; on phones it moves below the form */}
            <div className="relative z-10 hidden lg:block">
              <StudioInfo siteSettings={siteSettings} />
            </div>
          </div>

          {/* Right Panel — Form */}
          <div className="relative flex w-full flex-col border-l border-border/10 bg-surface-lowest lg:w-[60.5%]">
            <div className="flex flex-1 flex-col px-8 pt-10 pb-6 lg:px-14 lg:pt-14 lg:pb-8">
              <CinematicContactForm />
            </div>
          </div>

          {/* Studio info — mobile only, after the form */}
          <div className="relative border-t border-border/10 bg-surface-deep px-8 py-10 lg:hidden">
            <StudioInfo siteSettings={siteSettings} />
          </div>
        </div>
      </main>
    </>
  );
}
