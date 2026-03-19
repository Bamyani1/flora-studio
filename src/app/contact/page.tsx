import type { Metadata } from "next";
import { SOCIAL_LINKS } from "@/lib/navigation";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { ContactForm } from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Bamyan Storyworks. Available for personal, event, sports, and solo photography projects.",
};

export default function ContactPage() {
  return (
    <main id="main-content">
      {/* Heading */}
      <section className="px-[--container-padding-x] pt-[--header-height]">
        <div className="mx-auto max-w-[--max-width-content] py-[--section-padding-y]">
          <TextReveal variant="lines" as="h1" className="font-display text-5xl tracking-tight text-text-heading md:text-6xl">
            Let&apos;s create something
          </TextReveal>
          <FadeIn delay={0.3}>
            <p className="mt-6 max-w-[--max-width-narrow] text-lg text-muted leading-relaxed">
              Have a project in mind? I&apos;d love to hear about it. Fill out the form below or reach out directly.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Form + Info */}
      <section className="px-[--container-padding-x] pb-[--section-padding-y]">
        <div className="mx-auto grid max-w-[--max-width-content] grid-cols-1 gap-16 md:grid-cols-2">
          {/* Left: Form */}
          <div>
            <ContactForm />
          </div>

          {/* Right: Info */}
          <div className="flex flex-col gap-12">
            <FadeIn delay={0.1}>
              <div>
                <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
                  Email
                </h3>
                <a
                  href="mailto:hello@bamyanstoryworks.com"
                  className="font-display text-xl text-text-heading transition-colors duration-normal hover:text-primary"
                >
                  hello@bamyanstoryworks.com
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div>
                <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
                  Location
                </h3>
                <p className="font-display text-xl text-text-heading">
                  Bamyan, Afghanistan
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div>
                <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
                  Social
                </h3>
                <div className="flex flex-col gap-3">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-xl text-text-heading transition-colors duration-normal hover:text-primary"
                    >
                      {link.label}
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
