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
            <span className="mt-[var(--space-2)] block font-display text-lg text-text-heading transition-colors group-hover:text-primary md:text-xl">
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
            <span className="mt-[var(--space-2)] block font-display text-lg text-text-heading transition-colors group-hover:text-primary md:text-xl">
              {next.title}
            </span>
          </TransitionLink>
        </FadeIn>
      ) : (
        <div />
      )}
    </nav>
  );
}
