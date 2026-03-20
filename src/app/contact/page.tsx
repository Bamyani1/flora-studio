import type { Metadata } from "next";
import Image from "next/image";
import { Instagram, Linkedin } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/navigation";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { InlineContactForm } from "@/components/ui/InlineContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Silk Studio. Available for landscape, night sky, sports, portrait, and travel photography projects.",
};

function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "instagram":
      return <Instagram className="w-4 h-4" />;
    case "linkedin":
      return <Linkedin className="w-4 h-4" />;
    case "behance":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ContactPage() {
  return (
    <main id="main-content">
      {/* Hero */}
      <section className="px-[var(--container-padding-x)] pt-[var(--header-height)]">
        <div className="mx-auto max-w-[var(--max-width-content)] flex flex-col md:flex-row md:items-end md:justify-between gap-6 pt-[var(--space-16)] pb-24">
          <TextReveal
            variant="lines"
            as="h1"
            className="font-display text-5xl md:text-8xl leading-none tracking-tighter text-text-heading"
          >
            <span className="italic text-text font-[var(--font-thin)]">
              Connect.
            </span>
            <br />
            <span className="font-bold">Collaborate.</span>
          </TextReveal>
          <FadeIn delay={0.3}>
            <p className="max-w-xs text-sm text-muted leading-relaxed tracking-wide">
              Capturing the human form through the lens of creativity, light and emotion. We are
              currently accepting commissions for Q3 and Q4.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 3-Column Grid */}
      <section className="border-y border-border/10">
        <div className="mx-auto max-w-[var(--max-width-content)] grid grid-cols-1 md:grid-cols-[1.2fr_1.5fr_1fr]">
          {/* Col 1: Portrait */}
          <div className="order-3 md:order-1 py-12 md:pr-12 min-h-[500px] md:min-h-[800px]">
            <FadeIn>
              <div className="sticky top-40 overflow-hidden group h-[500px] md:h-[700px] bg-surface">
                <div className="relative h-full w-full">
                  <Image
                    src="/images/portrait.jpg"
                    alt="Portrait photograph"
                    fill
                    className="object-cover grayscale brightness-75 transition-transform duration-1000 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 30vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-1000 pointer-events-none" />
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Col 2: Form */}
          <div className="order-1 md:order-2 py-12 px-12 md:border-x border-border/20">
            <div className="max-w-xl mx-auto">
              <FadeIn>
                <span className="block font-label text-[10px] uppercase tracking-[0.4em] text-primary mb-8">
                  Inquiry Form
                </span>
                <h2 className="font-display text-4xl text-text-heading mb-16 tracking-tight">
                  Start Your Story
                </h2>
              </FadeIn>
              <InlineContactForm />
            </div>
          </div>

          {/* Col 3: Studio Details */}
          <div className="order-4 md:order-3 py-12 pl-12 space-y-20">
            {/* Location */}
            <FadeIn>
              <div>
                <span className="block font-label text-[10px] uppercase tracking-[0.4em] text-primary mb-8">
                  Location
                </span>
                <h3 className="font-display text-2xl text-text mb-3">Silk Studio</h3>
                <p className="text-sm text-muted leading-relaxed tracking-wide">
                  Dayton, Ohio
                  <br />
                  United States
                </p>
              </div>
            </FadeIn>

            {/* Direct Contact */}
            <FadeIn delay={0.1}>
              <div>
                <span className="block font-label text-[10px] uppercase tracking-[0.4em] text-primary mb-8">
                  Direct Contact
                </span>
                <a
                  href="tel:+93700000000"
                  className="block text-sm text-text-heading transition-colors duration-300 hover:text-primary mb-2"
                >
                  +93 70 000 0000
                </a>
                <a
                  href="mailto:hello@silkstudio.com"
                  className="block text-sm text-text-heading transition-colors duration-300 hover:text-primary mb-4"
                >
                  hello@silkstudio.com
                </a>
                <div className="mt-12 flex space-x-6">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="text-muted transition-colors duration-300 hover:text-primary"
                    >
                      <SocialIcon icon={link.icon} />
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  );
}
