import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { ABOUT_QUERY } from "@/sanity/queries";
import { PLACEHOLDER_ABOUT } from "@/lib/placeholder-data";
import { personJsonLd } from "@/lib/metadata";
import { SOCIAL_LINKS } from "@/lib/navigation";
import { TextReveal } from "@/components/animations/TextReveal";
import { ImageReveal } from "@/components/animations/ImageReveal";
import { FadeIn } from "@/components/animations/FadeIn";

export const metadata: Metadata = {
  title: "About",
  description: "Photographer & visual storyteller based in Bamyan, Afghanistan. Learn about the vision and services behind Bamyan Storyworks.",
};

async function getAbout() {
  try {
    return await client.fetch(ABOUT_QUERY);
  } catch {
    return PLACEHOLDER_ABOUT;
  }
}

export default async function AboutPage() {
  const about = await getAbout();
  const bio = about?.bio ?? PLACEHOLDER_ABOUT.bio;
  const approach = about?.approach ?? PLACEHOLDER_ABOUT.approach;
  const services = about?.services ?? PLACEHOLDER_ABOUT.services;

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      {/* Hero */}
      <section className="px-[--container-padding-x] pt-[--header-height]">
        <div className="mx-auto grid max-w-[--max-width-content] grid-cols-1 items-center gap-[--grid-gap] py-[--section-padding-y] md:grid-cols-5">
          <div className="md:col-span-3">
            <ImageReveal className="aspect-[3/4] w-full">
              <div className="h-full w-full bg-gradient-to-br from-primary/20 to-surface" />
            </ImageReveal>
          </div>
          <div className="md:col-span-2">
            <TextReveal variant="lines" as="h1" className="font-display text-5xl tracking-tight text-text-heading md:text-6xl">
              Bamyan Storyworks
            </TextReveal>
            <FadeIn delay={0.3}>
              <p className="mt-4 font-mono text-sm uppercase tracking-wider text-muted">
                Photographer &amp; Visual Storyteller
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="px-[--container-padding-x] py-[--section-padding-y]">
        <div className="mx-auto max-w-[--max-width-narrow]">
          <TextReveal variant="lines" className="text-xl leading-relaxed text-text md:text-2xl">
            {bio}
          </TextReveal>
        </div>
      </section>

      {/* Approach */}
      <section className="px-[--container-padding-x] py-[--section-padding-y]">
        <div className="mx-auto max-w-[--max-width-content]">
          <TextReveal variant="words" scrub className="font-display text-3xl leading-snug text-text-heading md:text-4xl">
            {approach}
          </TextReveal>
        </div>
      </section>

      {/* Services */}
      <section className="px-[--container-padding-x] py-[--section-padding-y]">
        <div className="mx-auto max-w-[--max-width-content]">
          <FadeIn>
            <h2 className="mb-12 font-mono text-sm uppercase tracking-widest text-muted">
              Services
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 gap-[--grid-gap] md:grid-cols-2">
            {services.map((service: { title: string; description: string }, i: number) => (
              <FadeIn key={service.title} delay={i * 0.1}>
                <div className="border-t border-border pt-6">
                  <h3 className="font-display text-2xl text-text-heading">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-muted leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="px-[--container-padding-x] py-[--section-padding-y]">
        <div className="mx-auto max-w-[--max-width-content]">
          <FadeIn>
            <h2 className="mb-12 font-mono text-sm uppercase tracking-widest text-muted">
              Connect
            </h2>
          </FadeIn>
          <div className="flex flex-col gap-6">
            {SOCIAL_LINKS.map((link, i) => (
              <FadeIn key={link.label} delay={i * 0.1}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-2xl text-text-heading transition-colors duration-normal hover:text-primary md:text-3xl"
                >
                  {link.label}
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
