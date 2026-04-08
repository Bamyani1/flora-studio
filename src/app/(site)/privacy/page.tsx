import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LEGAL_LAST_UPDATED, PRIVACY_SECTIONS } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Studio Bahar covering website inquiries, manual business records, client work records, and future cookie or tracking disclosures.",
};

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <section className="px-[var(--container-padding-x)] pt-[var(--header-height)] pb-[var(--section-padding-y)]">
        <div className="mx-auto max-w-[var(--max-width-content)] pt-[var(--space-16)]">
          <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">
            Privacy Policy
          </p>
          <h1 className="mt-6 font-display text-3xl font-light text-text-heading md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            This Privacy Policy explains how Studio Bahar handles information connected to the
            website, inquiries, and manual studio operations. It is written to reflect the current
            workflow of the business and will be updated if site technologies or business practices
            materially change.
          </p>
          <p className="mt-4 font-label text-xs uppercase tracking-[0.2em] text-muted">
            Last updated {LEGAL_LAST_UPDATED}
          </p>
        </div>
      </section>

      <LegalDocument sections={PRIVACY_SECTIONS} />
    </main>
  );
}
