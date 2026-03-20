import { FadeIn } from "@/components/animations/FadeIn";
import { TransitionLink } from "@/components/layout/TransitionLink";

export function StartAStory() {
  return (
    <section className="flex flex-col items-center px-[var(--container-padding-x)] py-[var(--section-padding-y)] text-center">
      <FadeIn>
        <h2 className="font-display text-4xl font-light text-text-heading md:text-6xl lg:text-7xl">
          Start a Story.
        </h2>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <TransitionLink
            href="/contact"
            className="inline-flex items-center justify-center border-2 border-text-heading px-8 py-3 font-label text-sm uppercase tracking-wider text-text-heading transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-background"
          >
            Inquire
          </TransitionLink>
          <TransitionLink
            href="/work"
            className="inline-flex items-center font-label text-sm uppercase tracking-wider text-muted transition-colors duration-300 hover:text-text"
          >
            View Work &rarr;
          </TransitionLink>
        </div>
      </FadeIn>
    </section>
  );
}
