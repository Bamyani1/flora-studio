import type { Metadata } from "next";
import { Instagram, Linkedin } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { CinematicContactForm } from "@/components/ui/CinematicContactForm";
import { getContactPageContent, getSiteSettings } from "@/lib/site-content";
import type { SocialLink } from "@/types/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Bahar Studio in Dayton, Ohio. Available for milestones, gatherings, motion, portraits, and professional photography.",
};

function SocialIcon({ icon }: Pick<SocialLink, "icon">) {
  switch (icon) {
    case "instagram":
      return <Instagram className="h-5 w-5" />;
    case "linkedin":
      return <Linkedin className="h-5 w-5" />;
    case "behance":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
        </svg>
      );
    default:
      return null;
  }
}

export default async function ContactPage() {
  const [contactPage, siteSettings] = await Promise.all([
    getContactPageContent(),
    getSiteSettings(),
  ]);

  return (
    <main
      id="main-content"
      className="relative flex h-screen flex-col overflow-hidden bg-background px-[10%] pt-[100px] pb-20"
    >
      {/* Grain overlay */}
      <div className="grain-medium absolute inset-0 z-grain" aria-hidden="true" />

      {/* Floating two-panel card */}
      <div className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Left Panel — Branding */}
        <div className="relative flex w-full flex-col justify-between bg-surface-deep px-8 py-10 md:w-[45%] md:px-14 md:py-14">
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
              <p className="mb-1 font-body text-base text-text-heading">{siteSettings.location}</p>
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
          className="relative flex w-full flex-col overflow-y-auto border-l border-border/10 bg-surface-lowest md:w-[55%]"
          data-lenis-prevent
        >
          <div className="flex flex-1 flex-col px-8 pt-10 pb-6 md:px-14 md:pt-14 md:pb-8">
            <CinematicContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
