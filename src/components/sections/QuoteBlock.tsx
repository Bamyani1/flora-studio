import { FadeIn } from "@/components/animations/FadeIn";

export function QuoteBlock() {
  return (
    <section className="bg-[var(--color-surface-lowest)] px-[var(--container-padding-x)] py-[var(--section-padding-y)]">
      <div className="mx-auto flex max-w-[var(--max-width-content)] flex-col items-center text-center">
        {/* Quote icon */}
        <FadeIn>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="var(--color-accent)"
            aria-hidden="true"
            className="mb-8"
          >
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
          </svg>
        </FadeIn>

        {/* Quote text */}
        <FadeIn delay={0.2}>
          <blockquote className="font-display text-4xl font-light uppercase leading-tight text-text-heading md:text-6xl">
            One frame. The whole story.
          </blockquote>
        </FadeIn>

        {/* Attribution */}
        <FadeIn delay={0.4}>
          <cite className="mt-8 block font-label text-sm not-italic tracking-wider text-muted">
            — SAFFRON STUDIOS
          </cite>
        </FadeIn>
      </div>
    </section>
  );
}
