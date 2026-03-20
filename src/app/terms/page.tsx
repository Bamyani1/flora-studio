import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Interim terms for Silk Studio while the full legal language is being finalized.",
};

const TERMS = [
  {
    title: "Portfolio Use",
    body:
      "This site and its photography are presented for portfolio and inquiry purposes. Unless otherwise stated, all imagery, text, and branding remain the property of Silk Studio and may not be reused without written permission.",
  },
  {
    title: "Inquiry Expectations",
    body:
      "Submitting an inquiry does not create a booking or contractual relationship on its own. Project scope, availability, fees, and deliverables are confirmed only after direct communication and written agreement.",
  },
  {
    title: "Site Availability",
    body:
      "Silk Studio may update, revise, or temporarily remove pages, galleries, and contact details without notice while the portfolio evolves toward launch.",
  },
  {
    title: "Interim Status",
    body:
      "These terms are a placeholder for launch readiness. Full contract language, licensing details, and jurisdiction-specific provisions will replace this page before broader release.",
  },
] as const;

export default function TermsPage() {
  return (
    <main id="main-content">
      <section className="px-[var(--container-padding-x)] pt-[var(--header-height)] pb-[var(--section-padding-y)]">
        <div className="mx-auto max-w-[var(--max-width-content)] pt-[var(--space-16)]">
          <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">
            Interim Terms
          </p>
          <h1 className="mt-6 font-display text-5xl font-light text-text-heading md:text-6xl">
            Terms
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            These interim terms keep the public legal routes live while the full launch copy is
            being finalized.
          </p>
          <p className="mt-4 font-label text-xs uppercase tracking-[0.2em] text-muted">
            Last updated March 20, 2026
          </p>
        </div>
      </section>

      <section className="px-[var(--container-padding-x)] pb-[var(--section-padding-y)]">
        <div className="mx-auto grid max-w-[var(--max-width-content)] gap-[var(--grid-gap)] md:grid-cols-2">
          {TERMS.map((section) => (
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
