import { FadeIn } from "@/components/animations/FadeIn";
import { TransitionLink } from "@/components/layout/TransitionLink";

interface AlbumNavProps {
  previous?: { title: string; slug: string };
  next?: { title: string; slug: string };
}

export function AlbumNav({ previous, next }: AlbumNavProps) {
  if (!previous && !next) return null;

  return (
    <nav
      className="grid grid-cols-2 gap-[var(--grid-gap)] px-[var(--container-padding-x)] py-[var(--section-padding-y)]"
      aria-label="Album navigation"
    >
      {previous ? (
        <FadeIn>
          <TransitionLink

            href={`/work/${previous.slug}`}
            className="group block"
          >
            <span className="font-label text-xs uppercase tracking-wider text-muted">
              Previous
            </span>
            <span className="mt-[var(--space-2)] block font-display text-lg text-text-heading transition-colors group-hover:text-primary group-hover:underline underline-offset-4 decoration-primary/40 md:text-xl">
              <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1 mr-2">&larr;</span>
              {previous.title}
            </span>
          </TransitionLink>
        </FadeIn>
      ) : (
        <div />
      )}

      {next ? (
        <FadeIn className="text-right">
          <TransitionLink

            href={`/work/${next.slug}`}
            className="group block"
          >
            <span className="font-label text-xs uppercase tracking-wider text-muted">
              Next
            </span>
            <span className="mt-[var(--space-2)] block font-display text-lg text-text-heading transition-colors group-hover:text-primary group-hover:underline underline-offset-4 decoration-primary/40 md:text-xl">
              {next.title}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-2">&rarr;</span>
            </span>
          </TransitionLink>
        </FadeIn>
      ) : (
        <div />
      )}
    </nav>
  );
}
