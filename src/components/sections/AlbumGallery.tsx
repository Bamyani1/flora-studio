"use client";

import { Fragment, useCallback, useState } from "react";
import { SiteMedia } from "@/components/ui/SiteMedia";
import { AlbumFilm } from "@/components/sections/AlbumFilm";
import { AlbumLightbox } from "@/components/sections/AlbumLightbox";
import { justifyRows, type JustifiedRow, type JustifyOptions } from "@/lib/album-layout";
import { imageAspectRatio, resolveImageUrl } from "@/lib/image-url";
import type { SanityImage } from "@/types/project";

export type GalleryImage = SanityImage & { blurDataURL?: string };

interface AlbumGalleryProps {
  title: string;
  images: GalleryImage[];
  videoUrl?: string;
  videoPosterUrl?: string;
}

// Row heights in widths of the row: three portraits across on desktop, two on phones
const DESKTOP: JustifyOptions = { targetHeight: 0.48, maxHeight: 0.55, maxPerRow: 4 };
const PHONE: JustifyOptions = { targetHeight: 0.72, maxHeight: 1.25, maxPerRow: 3 };

// The film breaks the mosaic a little past the middle
const FILM_POSITION = 0.6;

export function AlbumGallery({ title, images, videoUrl, videoPosterUrl }: AlbumGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

  const filmAt = videoUrl ? Math.round(images.length * FILM_POSITION) : images.length;
  const groups = [
    { offset: 0, images: images.slice(0, filmAt) },
    { offset: filmAt, images: images.slice(filmAt) },
  ];

  return (
    <section
      aria-label={`${title} photographs`}
      className="px-[var(--container-padding-x)] pb-[var(--space-16)]"
    >
      <div className="mx-auto max-w-[max(48rem,170svh)]">
        <MosaicGroup {...groups[0]} total={images.length} title={title} onOpen={setOpenIndex} />
        {videoUrl && <AlbumFilm src={videoUrl} poster={videoPosterUrl} title={title} />}
        <MosaicGroup {...groups[1]} total={images.length} title={title} onOpen={setOpenIndex} />
      </div>

      {openIndex !== null && images.length > 0 && (
        <AlbumLightbox
          images={images}
          index={openIndex}
          title={title}
          onNavigate={setOpenIndex}
          onClose={close}
        />
      )}
    </section>
  );
}

interface MosaicGroupProps {
  images: GalleryImage[];
  /** Index of this group's first photo within the album */
  offset: number;
  total: number;
  title: string;
  onOpen: (index: number) => void;
}

/** Row lookup: which row each photo sits in and where rows begin and end */
function indexRows(rows: JustifiedRow[]) {
  const rowOf: JustifiedRow[] = [];
  rows.forEach((row) => {
    for (let i = row.start; i < row.end; i++) rowOf[i] = row;
  });
  return rowOf;
}

// Each photo is a flex item growing in proportion to its aspect ratio, so every
// row fills the width at one shared height. Line breaks and centering spacers
// come from justifyRows, once per breakpoint; everything renders on the server.
function MosaicGroup({ images, offset, total, title, onOpen }: MosaicGroupProps) {
  if (images.length === 0) return null;

  const ratios = images.map((img) => imageAspectRatio(img));
  const desktopRow = indexRows(justifyRows(ratios, DESKTOP));
  const phoneRow = indexRows(justifyRows(ratios, PHONE));
  const rowSum = (row: JustifiedRow) =>
    ratios.slice(row.start, row.end).reduce((a, b) => a + b, 0) + row.spacer * 2;

  return (
    <div className="flex flex-wrap gap-x-2">
      {images.map((img, i) => {
        const desk = desktopRow[i];
        const phone = phoneRow[i];
        const breakDesk = i > 0 && desk.start === i;
        const breakPhone = i > 0 && phone.start === i;
        const ratio = ratios[i];
        const position = offset + i + 1;
        const sizes = `(min-width: 768px) ${Math.ceil((100 * ratio) / rowSum(desk))}vw, ${Math.ceil((100 * ratio) / rowSum(phone))}vw`;

        return (
          <Fragment key={`${resolveImageUrl(img) ?? "img"}-${i}`}>
            {i > 0 && desktopRow[i - 1].end === i && (
              <Spacer grow={desktopRow[i - 1].spacer} className="hidden md:block" />
            )}
            {i > 0 && phoneRow[i - 1].end === i && (
              <Spacer grow={phoneRow[i - 1].spacer} className="md:hidden" />
            )}
            {(breakDesk || breakPhone) && (
              <div
                aria-hidden="true"
                className={
                  breakDesk && breakPhone
                    ? "basis-full"
                    : breakDesk
                      ? "hidden basis-full md:block"
                      : "basis-full md:hidden"
                }
              />
            )}
            {desk.start === i && <Spacer grow={desk.spacer} className="hidden md:block" />}
            {phone.start === i && <Spacer grow={phone.spacer} className="md:hidden" />}

            <button
              type="button"
              onClick={() => onOpen(offset + i)}
              aria-label={
                img.alt
                  ? `${img.alt}, photo ${position} of ${total}. View full screen`
                  : `${title}, photo ${position} of ${total}. View full screen`
              }
              className="group relative mb-2 block min-w-0 cursor-zoom-in overflow-hidden bg-surface-lowest"
              style={{ flex: `${ratio} 1 0%`, aspectRatio: ratio }}
            >
              <SiteMedia
                src={resolveImageUrl(img)}
                alt=""
                fill
                sizes={sizes}
                quality={85}
                blurDataURL={img.blurDataURL}
                className="object-cover transition-transform duration-700 ease-out can-hover:group-hover:scale-[1.02]"
              />
            </button>

            {i === images.length - 1 && (
              <>
                <Spacer grow={desk.spacer} className="hidden md:block" />
                <Spacer grow={phone.spacer} className="md:hidden" />
              </>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

function Spacer({ grow, className }: { grow: number; className: string }) {
  if (grow <= 0) return null;
  return <div aria-hidden="true" className={className} style={{ flex: `${grow} 1 0%` }} />;
}
