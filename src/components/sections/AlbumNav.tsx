import { TransitionLink } from "@/components/layout/TransitionLink";
import { SiteMedia } from "@/components/ui/SiteMedia";
import { resolveImageUrl } from "@/lib/image-url";
import type { AlbumNavigationItem } from "@/lib/albums";

interface AlbumNavProps {
  previous?: AlbumNavigationItem;
  next?: AlbumNavigationItem;
}

function padIndex(n: number): string {
  return String(n).padStart(2, "0");
}

// The hand-off cells echo the /work chapter language at footer scale: a small
// cover, the shared "NN / NN" position tag, and an explicit way back up to the
// index. Wrap-arounds are labelled instead of silently looping the archive.
// No scroll-gated reveal here — this nav sits below the folio's deferred pages
// and must never depend on a trigger that can go stale.
export function AlbumNav({ previous, next }: AlbumNavProps) {
  if (!previous && !next) return null;

  return (
    <nav
      className="grid grid-cols-2 items-center gap-x-[var(--grid-gap)] gap-y-10 px-[var(--container-padding-x)] py-[var(--section-padding-y)] md:grid-cols-[1fr_auto_1fr]"
      aria-label="Album navigation"
    >
      {previous ? (
        <TransitionLink href={`/work/${previous.slug}`} className="group block">
          <div className="flex items-center gap-5">
            <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden md:block">
              <SiteMedia
                src={resolveImageUrl(previous.coverImage)}
                alt={previous.coverImage?.alt || previous.title}
                fill
                sizes="112px"
                quality={70}
                className="object-cover transition-transform duration-700 can-hover:group-hover:scale-105"
              />
            </div>
            <div>
              <span className="eyebrow text-muted">
                {previous.wraps ? "From the end" : "Previous"} &middot;{" "}
                {padIndex(previous.position)} / {padIndex(previous.total)}
              </span>
              <span className="mt-2 block font-display text-lg italic text-text-heading transition-colors can-hover:group-hover:text-primary md:text-xl">
                <span className="mr-2 inline-block not-italic transition-transform duration-300 can-hover:group-hover:-translate-x-1">
                  &larr;
                </span>
                {previous.title}
              </span>
            </div>
          </div>
        </TransitionLink>
      ) : (
        <div />
      )}

      {/* The chapter model needs an "up", not just sideways */}
      <TransitionLink
        href="/work"
        className="order-last col-span-2 justify-self-center eyebrow text-primary transition-colors can-hover:hover:text-text md:order-none md:col-span-1 md:px-8"
      >
        All work
      </TransitionLink>

      {next ? (
        <TransitionLink href={`/work/${next.slug}`} className="group block text-right">
          <div className="flex flex-row-reverse items-center gap-5">
            <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden md:block">
              <SiteMedia
                src={resolveImageUrl(next.coverImage)}
                alt={next.coverImage?.alt || next.title}
                fill
                sizes="112px"
                quality={70}
                className="object-cover transition-transform duration-700 can-hover:group-hover:scale-105"
              />
            </div>
            <div>
              <span className="eyebrow text-muted">
                {next.wraps ? "Back to the start" : "Next"} &middot; {padIndex(next.position)} /{" "}
                {padIndex(next.total)}
              </span>
              <span className="mt-2 block font-display text-lg italic text-text-heading transition-colors can-hover:group-hover:text-primary md:text-xl">
                {next.title}
                <span className="ml-2 inline-block not-italic transition-transform duration-300 can-hover:group-hover:translate-x-1">
                  &rarr;
                </span>
              </span>
            </div>
          </div>
        </TransitionLink>
      ) : (
        <div />
      )}
    </nav>
  );
}
