import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Interim privacy details for Saffron Studios while the full policy is being finalized.",
};

const SECTIONS = [
  {
    title: "What We Collect",
    body: "Saffron Studios currently collects only the information you choose to send through inquiry forms or direct email. This typically includes your name, email address, project details, and any scheduling or location notes you provide.",
  },
  {
    title: "How It Is Used",
    body: "Submitted information is used only to respond to inquiries, discuss projects, and prepare photography engagements. It is not sold, rented, or shared for advertising purposes.",
  },
  {
    title: "External Services",
    body: "This site may load media, forms, and third-party links such as Instagram, Behance, LinkedIn, or email providers. Those services operate under their own privacy terms once you leave this site or submit information through them.",
  },
  {
    title: "Interim Status",
    body: "This page is a placeholder policy for launch. Full legal copy, retention details, and any future analytics or platform-specific disclosures will be published here before broader promotion.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <section className="px-[var(--container-padding-x)] pt-[var(--header-height)] pb-[var(--section-padding-y)]">
        <div className="mx-auto max-w-[var(--max-width-content)] pt-[var(--space-16)]">
          <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">
            Interim Policy
          </p>
          <h1 className="mt-6 font-display text-5xl font-light text-text-heading md:text-6xl">
            Privacy
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            This interim privacy page keeps the public site routes intact while full legal copy is
            being finalized.
          </p>
          <p className="mt-4 font-label text-xs uppercase tracking-[0.2em] text-muted">
            Last updated March 20, 2026
          </p>
        </div>
      </section>

      <section className="px-[var(--container-padding-x)] pb-[var(--section-padding-y)]">
        <div className="mx-auto grid max-w-[var(--max-width-content)] gap-[var(--grid-gap)] md:grid-cols-2">
          {SECTIONS.map((section) => (
            <article key={section.title} className="border border-border p-8">
              <h2 className="font-display text-2xl text-text-heading">{section.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
