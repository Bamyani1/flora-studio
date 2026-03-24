import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/navigation";
import { FadeIn } from "@/components/animations/FadeIn";
import { CinematicContactForm } from "@/components/ui/CinematicContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Silk Road Studio. Available for graduation, event, sports, and personal photography projects.",
};

function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "instagram":
      return <Instagram className="h-4 w-4" />;
    case "linkedin":
      return <Linkedin className="h-4 w-4" />;
    case "behance":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ContactPage() {
  return (
    <main id="main-content" className="relative h-screen overflow-hidden">
      {/* Fixed background — cinematic portrait */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/contact-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover grayscale brightness-[0.4] scale-105 blur-[40px]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/80" />
        <div className="grain-overlay absolute inset-0" />
      </div>

      {/* Content layer — split screen */}
      <div className="relative z-10 flex h-screen w-full flex-col overflow-hidden md:flex-row">
        {/* Left: Form (65%) */}
        <section
          id="inquiry"
          data-lenis-prevent
          className="flex h-full w-full flex-col justify-center overflow-y-auto px-8 pt-24 pb-12 md:w-[65%] md:px-20"
        >
          <div className="max-w-xl">
            <CinematicContactForm />
          </div>
        </section>

        {/* Right: Glass sidebar (35%) */}
        <aside className="glass-card hidden h-full w-[35%] flex-col border-y-0 border-r-0 md:flex">
          <div className="flex h-full flex-col justify-between overflow-y-auto px-8 py-32 md:px-16">
            <div>
              {/* Location */}
              <FadeIn className="mb-20">
                <span className="mb-6 block font-label text-[10px] uppercase tracking-[0.5em] text-primary/80">
                  The Studio
                </span>
                <h3 className="mb-6 font-display text-3xl font-light text-text-heading">
                  Dayton
                </h3>
                <p className="text-sm uppercase leading-relaxed tracking-widest text-muted">
                  Dayton, Ohio
                </p>
              </FadeIn>

              {/* Contact */}
              <FadeIn delay={0.15} className="mb-20">
                <span className="mb-6 block font-label text-[10px] uppercase tracking-[0.5em] text-primary/80">
                  Contact
                </span>
                <div className="space-y-4">
                  <a
                    href="tel:+19377977381"
                    className="block text-sm tracking-widest text-muted transition-colors hover:text-primary"
                  >
                    (937) 797-7381
                  </a>
                  <a
                    href="mailto:silkrdstudio@gmail.com"
                    className="block text-sm uppercase tracking-widest text-muted transition-colors hover:text-primary"
                  >
                    silkrdstudio@gmail.com
                  </a>
                </div>
              </FadeIn>

              {/* Social */}
              <FadeIn delay={0.3}>
                <div className="flex space-x-8 opacity-60">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="text-text transition-colors hover:text-primary"
                    >
                      <SocialIcon icon={link.icon} />
                    </a>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Footer */}
            <footer className="mt-32 border-t border-border/10 pt-12 opacity-30">
              <div className="mb-4 font-label text-[8px] uppercase tracking-[0.3em] text-text">
                &copy; {new Date().getFullYear()} Silk Road Studio
              </div>
              <div className="flex space-x-6">
                <Link
                  href="/privacy"
                  className="text-[8px] uppercase tracking-[0.3em] text-text"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="text-[8px] uppercase tracking-[0.3em] text-text"
                >
                  Terms
                </Link>
              </div>
            </footer>
          </div>
        </aside>
      </div>

      {/* Mobile: compact contact info below form (visible only on small screens) */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border/10 bg-background/80 px-8 py-6 backdrop-blur-sm md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <a
              href="tel:+19377977381"
              className="block text-xs tracking-widest text-muted transition-colors hover:text-primary"
            >
              (937) 797-7381
            </a>
            <a
              href="mailto:silkrdstudio@gmail.com"
              className="block text-xs uppercase tracking-widest text-muted transition-colors hover:text-primary"
            >
              silkrdstudio@gmail.com
            </a>
          </div>
          <div className="flex space-x-4 opacity-60">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-text transition-colors hover:text-primary"
              >
                <SocialIcon icon={link.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
