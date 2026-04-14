import type { Metadata } from "next";
import { Instagram } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { CinematicContactForm } from "@/components/ui/CinematicContactForm";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { publicEnv } from "@/lib/public-env";
import { getContactPageContent, getSiteSettings } from "@/lib/site-content";
import type { SocialLink } from "@/types/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Flora Studio in Dayton, Ohio. Available for milestones, gatherings, motion, portraits, and professional photography.",
};

function SocialIcon({ icon }: Pick<SocialLink, "icon">) {
  switch (icon) {
    case "instagram":
      return <Instagram className="h-5 w-5" />;
    default:
      return null;
  }
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <main
        id="main-content"
        className="relative flex min-h-screen flex-col overflow-hidden bg-background px-4 pt-24 pb-10 sm:px-[5%] md:h-screen md:min-h-0 md:px-[10%] md:pt-[140px] md:pb-20"
      >
        {/* Grain overlay */}
        <div className="grain-medium absolute inset-0 z-grain" aria-hidden="true" />

        {/* Floating two-panel card */}
        <div className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
          {/* Left Panel — Branding */}
          <div className="relative flex w-full flex-col gap-8 bg-surface-deep px-8 py-10 md:w-[45%] md:justify-between md:gap-0 md:px-14 md:py-14">
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
                <span className="mb-8 block font-label text-xs uppercase tracking-wider text-primary">
                  {siteSettings.studioName}
                </span>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="mb-6 font-display text-4xl font-light uppercase leading-[0.9] text-text-heading md:text-[48px]">
                  <span className="italic">{contactPage.titleLine1}</span>
                  <br />
                  <span className="font-bold not-italic">{contactPage.titleLine2}</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="max-w-[340px] font-body text-base leading-relaxed text-muted">
                  {contactPage.description}
                </p>
              </FadeIn>
            </div>

            {/* Bottom content */}
            <div className="relative z-10">
              <FadeIn delay={0.3}>
                <span className="mb-4 block font-label text-xs uppercase tracking-wider text-primary">
                  {siteSettings.studioName}
                </span>
                <p className="mb-1 font-body text-base text-text-heading">
                  {siteSettings.location}
                </p>
                <p className="mt-3 font-body text-sm text-muted">{siteSettings.email}</p>
                <p className="font-body text-sm text-muted">{siteSettings.phone}</p>

                <div className="mt-8 flex space-x-6">
                  {siteSettings.socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="text-muted/60 transition-colors hover:text-primary"
                    >
                      <SocialIcon icon={link.icon} />
                    </a>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Right Panel — Form */}
          <div
            className="relative flex min-h-0 w-full flex-col overflow-y-auto border-l border-border/10 bg-surface-lowest md:w-[55%]"
            data-lenis-prevent
          >
            <div className="flex flex-1 flex-col px-8 pt-10 pb-6 md:px-14 md:pt-14 md:pb-8">
              <CinematicContactForm />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
