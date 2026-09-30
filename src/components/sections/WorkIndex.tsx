import { TransitionLink } from "@/components/layout/TransitionLink";
import { SiteMedia } from "@/components/ui/SiteMedia";
import { balanceColumns } from "@/lib/album-layout";
import { CATEGORY_META } from "@/lib/categories";
import {
  IMAGE_POSITION_CLASS,
  imageAspectRatio,
  imagePositionStyle,
  resolveImageUrl,
} from "@/lib/image-url";
import { pluralize } from "@/lib/utils";
import type { AlbumMeta } from "@/types/project";

export type WorkIndexAlbum = AlbumMeta & { blurDataURL?: string };

// Portraits are trimmed to 4:5 so one cover never outgrows the screen
const MIN_COVER_RATIO = 4 / 5;
// Title, meta and the gap below each card, in column widths (for balancing only)
const CARD_TEXT_HEIGHT = 0.3;
// The second column starts this far down (~14vw), in column widths
const SECOND_COLUMN_OFFSET = 0.3;

const coverRatio = (album: AlbumMeta) =>
  Math.max(imageAspectRatio(album.coverImage), MIN_COVER_RATIO);

function yearRange(albums: AlbumMeta[]): string | undefined {
  const years = albums.map((a) => a.year).filter((y): y is number => typeof y === "number");
  if (years.length === 0) return undefined;
  const first = Math.min(...years);
  const last = Math.max(...years);
  return first === last ? String(first) : `${first}–${last}`;
}

// Two staggered columns filled column-first, so the reading, tab and phone
// order all stay the archive order while the layout reads as a magazine spread.
export function WorkIndex({ albums }: { albums: WorkIndexAlbum[] }) {
  const split = balanceColumns(
    albums.map((album) => 1 / coverRatio(album) + CARD_TEXT_HEIGHT),
    SECOND_COLUMN_OFFSET,
  );
  const columns = [albums.slice(0, split), albums.slice(split)];
  const years = yearRange(albums);

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 px-[var(--container-padding-x)] pb-[var(--space-8)] pt-[calc(var(--header-height)+var(--space-12))] md:pb-[var(--space-12)] md:pt-[calc(var(--header-height)+var(--space-16))]">
        <h1 className="font-display text-[length:var(--text-6xl)] font-light leading-none text-text-heading md:text-[length:var(--text-8xl)]">
          Work
        </h1>
        <p className="eyebrow text-muted md:pb-3">
          {pluralize(albums.length, "collection")}
          {years && ` · ${years}`}
        </p>
      </header>

      <div className="grid gap-x-[var(--space-8)] px-[var(--container-padding-x)] pb-[var(--section-padding-y)] md:grid-cols-2">
        {columns.map((column, c) =>
          column.length === 0 ? null : (
            <div
              key={c}
              className={
                c === 0
                  ? "flex flex-col gap-[var(--space-16)] md:gap-[var(--space-24)]"
                  : "mt-[var(--space-16)] flex flex-col gap-[var(--space-16)] md:mt-0 md:gap-[var(--space-24)] md:pt-[14vw]"
              }
            >
              {column.map((album, i) => (
                <WorkCard
                  key={album._id}
                  album={album}
                  // First cover of each column sits above the fold on desktop
                  eager={i === 0}
                  preload={c === 0 && i === 0}
                />
              ))}
            </div>
          ),
        )}
      </div>
    </>
  );
}

function WorkCard({
  album,
  eager,
  preload,
}: {
  album: WorkIndexAlbum;
  eager: boolean;
  preload: boolean;
}) {
  const category = CATEGORY_META[album.category]?.label ?? album.category;
  const meta = [
    category,
    typeof album.imageCount === "number" && album.imageCount > 0
      ? pluralize(album.imageCount, "photograph")
      : undefined,
  ].filter(Boolean);

  return (
    <TransitionLink href={`/work/${album.slug.current}`} className="group block">
      <div
        className="relative overflow-hidden bg-surface-lowest"
        style={{ aspectRatio: coverRatio(album) }}
      >
        <SiteMedia
          src={resolveImageUrl(album.coverImage)}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          quality={85}
          preload={preload}
          loading={eager && !preload ? "eager" : undefined}
          fetchPriority={preload ? "high" : undefined}
          blurDataURL={album.blurDataURL}
          className={`object-cover ${IMAGE_POSITION_CLASS} transition-transform duration-[1400ms] ease-out can-hover:group-hover:scale-[1.03]`}
          style={imagePositionStyle(album.coverImage)}
        />
      </div>
      <h2 className="mt-[var(--space-6)] font-display text-[length:var(--text-3xl)] font-light leading-tight text-text-heading transition-colors can-hover:group-hover:text-primary md:text-[length:var(--text-4xl)]">
        {album.title}
      </h2>
      {meta.length > 0 && <p className="mt-2 eyebrow text-muted">{meta.join(" · ")}</p>}
    </TransitionLink>
  );
}
