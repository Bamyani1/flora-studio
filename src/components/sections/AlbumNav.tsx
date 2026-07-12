import { TransitionLink } from "@/components/layout/TransitionLink";

interface AlbumNavProps {
  previous?: { title: string; slug: string };
  next?: { title: string; slug: string };
}

// No scroll-gated reveal here: this nav sits below the folio, whose deferred
// rendering reflows the document — a play-once trigger can cache a stale
// position and leave the album hand-off permanently invisible.
export function AlbumNav({ previous, next }: AlbumNavProps) {
  if (!previous && !next) return null;

  return (
    <nav
      className="grid grid-cols-2 gap-[var(--grid-gap)] px-[var(--container-padding-x)] py-[var(--section-padding-y)]"
      aria-label="Album navigation"
    >
      {previous ? (
        <div>
          <TransitionLink href={`/work/${previous.slug}`} className="group block">
            <span className="font-label text-xs uppercase tracking-wider text-muted">
              Previous
            </span>
            <span className="mt-[var(--space-2)] block font-display text-lg text-text-heading transition-colors group-hover:text-primary group-hover:underline underline-offset-4 decoration-primary/40 md:text-xl">
              <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1 mr-2">&larr;</span>
              {previous.title}
            </span>
          </TransitionLink>
        </div>
      ) : (
        <div />
      )}

      {next ? (
        <div className="text-right">
          <TransitionLink href={`/work/${next.slug}`} className="group block">
            <span className="font-label text-xs uppercase tracking-wider text-muted">
              Next
            </span>
            <span className="mt-[var(--space-2)] block font-display text-lg text-text-heading transition-colors group-hover:text-primary group-hover:underline underline-offset-4 decoration-primary/40 md:text-xl">
              {next.title}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-2">&rarr;</span>
            </span>
          </TransitionLink>
        </div>
      ) : (
        <div />
      )}
    </nav>
  );
}
