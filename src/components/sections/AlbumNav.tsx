import { TransitionLink } from "@/components/layout/TransitionLink";
import { SiteMedia } from "@/components/ui/SiteMedia";
import { IMAGE_POSITION_CLASS, imagePositionStyle, resolveImageUrl } from "@/lib/image-url";
import { cn } from "@/lib/utils";
import type { AlbumNavigationItem } from "@/lib/albums";

interface AlbumNavProps {
  previous?: AlbumNavigationItem;
  next?: AlbumNavigationItem;
}

function padIndex(n: number): string {
  return String(n).padStart(2, "0");
}

// Two large cover cards hand the reader on to the neighbouring albums, with an
// explicit way back up to the index between them. Wrap-arounds are labelled
// instead of silently looping the archive.
export function AlbumNav({ previous, next }: AlbumNavProps) {
  return (
    <nav
      aria-label="Album navigation"
      className="px-[var(--container-padding-x)] pb-[var(--section-padding-y)] pt-[var(--space-8)]"
    >
      <div className="mx-auto grid max-w-[max(48rem,170svh)] gap-2 md:grid-cols-[1fr_auto_1fr] md:items-center">
        {previous ? (
          <NavCard item={previous} direction="previous" />
        ) : (
          <div className="hidden md:block" />
        )}

        <TransitionLink
          href="/work"
          className="order-last justify-self-center px-6 py-6 eyebrow text-primary transition-colors can-hover:hover:text-text md:order-none md:px-10"
        >
          All work
        </TransitionLink>

        {next ? <NavCard item={next} direction="next" /> : <div className="hidden md:block" />}
      </div>
    </nav>
  );
}

function NavCard({
  item,
  direction,
}: {
  item: AlbumNavigationItem;
  direction: "previous" | "next";
}) {
  const isNext = direction === "next";
  const label = isNext
    ? item.wraps
      ? "Back to the start"
      : "Next"
    : item.wraps
      ? "From the end"
      : "Previous";

  return (
    <TransitionLink
      href={`/work/${item.slug}`}
      className="group relative block aspect-[4/3] overflow-hidden bg-surface-lowest md:aspect-[3/2]"
    >
      <SiteMedia
        src={resolveImageUrl(item.coverImage)}
        alt=""
        fill
        sizes="(min-width: 768px) 45vw, 100vw"
        quality={75}
        className={`object-cover ${IMAGE_POSITION_CLASS} transition-transform duration-[1400ms] ease-out can-hover:group-hover:scale-[1.03]`}
        style={imagePositionStyle(item.coverImage)}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/25 to-transparent"
      />
      <div className={cn("absolute inset-x-0 bottom-0 p-6 md:p-10", isNext && "text-right")}>
        <span className="eyebrow text-text/80">
          {label} &middot; {padIndex(item.position)} / {padIndex(item.total)}
        </span>
        <span className="mt-3 block font-display text-[length:var(--text-4xl)] font-light leading-tight text-text-heading transition-colors can-hover:group-hover:text-primary md:text-[length:var(--text-5xl)]">
          {!isNext && (
            <span
              aria-hidden="true"
              className="mr-3 inline-block transition-transform duration-300 can-hover:group-hover:-translate-x-1"
            >
              &larr;
            </span>
          )}
          {item.title}
          {isNext && (
            <span
              aria-hidden="true"
              className="ml-3 inline-block transition-transform duration-300 can-hover:group-hover:translate-x-1"
            >
              &rarr;
            </span>
          )}
        </span>
      </div>
    </TransitionLink>
  );
}
