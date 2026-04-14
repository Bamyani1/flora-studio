import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LEGAL_LAST_UPDATED, TERMS_SECTIONS } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Flora Studio covering ownership of site content, permitted use, inquiries, liability limitations, and governing law.",
};

export default function TermsPage() {
  return (
    <main id="main-content">
      <section className="px-[var(--container-padding-x)] pt-[var(--header-height)] pb-[var(--section-padding-y)]">
        <div className="mx-auto max-w-[var(--max-width-content)] pt-[var(--space-16)]">
          <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">
            Terms of Service
          </p>
          <h1 className="mt-6 font-display text-3xl font-light text-text-heading md:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            These terms govern use of the Flora Studio website itself. They do not replace any
            separate written agreement that may apply to a booked photography project or other
            client engagement.
          </p>
          <p className="mt-4 font-label text-xs uppercase tracking-[0.2em] text-muted">
            Last updated {LEGAL_LAST_UPDATED}
          </p>
        </div>
      </section>

      <LegalDocument sections={TERMS_SECTIONS} />
    </main>
  );
}
