import type { LegalSection } from "@/lib/legal-content";

export function LegalDocument({ sections }: { sections: LegalSection[] }) {
  return (
    <section className="px-[var(--container-padding-x)] pb-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[var(--max-width-content)]">
        <nav
          aria-label="Table of contents"
          className="mx-auto max-w-[var(--max-width-narrow)] border-t border-border pt-8"
        >
          <p className="font-label text-xs uppercase tracking-[0.2em] text-primary">
            Table of contents
          </p>
          <ol className="mt-6 space-y-3">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="font-label text-xs uppercase tracking-[0.15em] text-muted transition-colors duration-300 hover:text-primary"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mx-auto mt-16 max-w-[var(--max-width-narrow)] space-y-16">
          {sections.map((section, index) => (
            <article
              key={section.id}
              id={section.id}
              className="scroll-mt-[calc(var(--header-height)+var(--space-8))]"
            >
              <h2 className="font-display text-2xl font-light text-text-heading md:text-3xl">
                {section.title}
              </h2>
              <div className="mt-6 space-y-5">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-muted md:text-base">
                    {paragraph}
                  </p>
                ))}
                {section.bullets?.length ? (
                  <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed text-muted md:text-base">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              {index < sections.length - 1 ? (
                <div className="mt-16 border-t border-border" aria-hidden="true" />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
