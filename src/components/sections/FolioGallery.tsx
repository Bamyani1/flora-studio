"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { folioReveal, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { SanityImage } from "@/types/project";
import { SiteMedia } from "@/components/ui/SiteMedia";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

type ImageType = SanityImage;

type PageLayout =
  | "title"
  | "full-bleed"
  | "centered-plate"
  | "diptych"
  | "detail-crop"
  | "video"
  | "colophon";

interface FolioPage {
  layout: PageLayout;
  images: ImageType[];
  imageIndex: number;
  pageNumber: number;
  videoUrl?: string;
}

interface FolioGalleryProps {
  images: ImageType[];
  title: string;
  videoUrl?: string;
}

/* ──────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────── */

function toRoman(n: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) {
      result += syms[i];
      n -= vals[i];
    }
  }
  return result;
}

const NUMBER_WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
  "Twenty",
];

function imageCountLabel(count: number): string {
  const word = count <= 20 ? NUMBER_WORDS[count] : String(count);
  return `[ ${word.toUpperCase()} PHOTOGRAPH${count !== 1 ? "S" : ""} ]`;
}

function padIndex(n: number): string {
  return String(n).padStart(2, "0");
}

/* ──────────────────────────────────────────────
   Layout algorithm — maps N images to page types
   ────────────────────────────────────────────── */

function buildFolioPages(images: ImageType[], videoUrl?: string): FolioPage[] {
  const pages: FolioPage[] = [];
  let pageNum = 1;
  let idx = 0;

  // Title page
  pages.push({ layout: "title", images: [], imageIndex: 0, pageNumber: pageNum++ });

  if (images.length <= 2) {
    // Small albums: all centered plates
    while (idx < images.length) {
      pages.push({
        layout: "centered-plate",
        images: [images[idx]],
        imageIndex: idx + 1,
        pageNumber: pageNum++,
      });
      idx++;
    }
  } else {
    while (idx < images.length) {
      const remaining = images.length - idx;

      if (remaining >= 6) {
        // Full cycle: FB, CP, FB, DIP(2), DC
        pages.push({
          layout: "full-bleed",
          images: [images[idx]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx++;
        pages.push({
          layout: "centered-plate",
          images: [images[idx]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx++;
        pages.push({
          layout: "full-bleed",
          images: [images[idx]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx++;
        pages.push({
          layout: "diptych",
          images: [images[idx], images[idx + 1]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx += 2;
        pages.push({
          layout: "detail-crop",
          images: [images[idx]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx++;
      } else if (remaining === 5) {
        pages.push({
          layout: "full-bleed",
          images: [images[idx]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx++;
        pages.push({
          layout: "centered-plate",
          images: [images[idx]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx++;
        pages.push({
          layout: "diptych",
          images: [images[idx], images[idx + 1]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx += 2;
        pages.push({
          layout: "centered-plate",
          images: [images[idx]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx++;
      } else if (remaining === 4) {
        pages.push({
          layout: "full-bleed",
          images: [images[idx]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx++;
        pages.push({
          layout: "centered-plate",
          images: [images[idx]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx++;
        pages.push({
          layout: "diptych",
          images: [images[idx], images[idx + 1]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx += 2;
      } else if (remaining === 3) {
        pages.push({
          layout: "full-bleed",
          images: [images[idx]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx++;
        pages.push({
          layout: "centered-plate",
          images: [images[idx]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx++;
        pages.push({
          layout: "full-bleed",
          images: [images[idx]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx++;
      } else if (remaining === 2) {
        pages.push({
          layout: "full-bleed",
          images: [images[idx]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx++;
        pages.push({
          layout: "centered-plate",
          images: [images[idx]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx++;
      } else {
        pages.push({
          layout: "centered-plate",
          images: [images[idx]],
          imageIndex: idx + 1,
          pageNumber: pageNum++,
        });
        idx++;
      }
    }
  }

  // Video page (if provided) — inserted before colophon
  if (videoUrl) {
    pages.push({
      layout: "video",
      images: [],
      imageIndex: 0,
      pageNumber: pageNum++,
      videoUrl,
    });
  }

  // Colophon
  pages.push({ layout: "colophon", images: [], imageIndex: 0, pageNumber: pageNum });

  return pages;
}

/* ──────────────────────────────────────────────
   Page content components
   ────────────────────────────────────────────── */

function TitleContent({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center">
      <h2
        className="folio-title-text text-center font-display font-light uppercase leading-[0.95]"
        style={{
          fontSize: "clamp(4rem, 10vw, 8rem)",
          WebkitTextStroke: "1.5px color-mix(in srgb, var(--color-text) 40%, transparent)",
          color: "transparent",
        }}
      >
        {title}
      </h2>
      <div className="folio-reveal-label mt-10 h-px bg-primary" style={{ width: 80 }} />
      <span className="folio-reveal-label mt-7 font-label text-[11px] uppercase tracking-[0.16em] text-muted">
        Bahar Studio
      </span>
      <span className="folio-reveal-label mt-3 font-label text-[11px] uppercase tracking-[0.16em] text-muted">
        {imageCountLabel(count)}
      </span>
    </div>
  );
}

function FullBleedContent({
  image,
  index,
  pageNumber,
}: {
  image: ImageType;
  index: number;
  pageNumber: number;
}) {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center">
      <SiteMedia
        src={image.url}
        alt={image.alt || `Photograph ${padIndex(index)}`}
        width={1600}
        height={1067}
        className="folio-reveal max-h-[80vh] w-[90%] object-contain md:w-3/4"
        sizes="(min-width: 768px) 75vw, 90vw"
        loading={pageNumber <= 2 ? "eager" : "lazy"}
      />
    </div>
  );
}

function CenteredPlateContent({
  image,
  index,
  pageNumber,
}: {
  image: ImageType;
  index: number;
  pageNumber: number;
}) {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center">
      <SiteMedia
        src={image.url}
        alt={image.alt || `Photograph ${padIndex(index)}`}
        width={1200}
        height={800}
        className="folio-reveal max-h-[70vh] w-[85%] object-contain md:w-1/2"
        sizes="(min-width: 768px) 50vw, 85vw"
        loading="lazy"
      />
    </div>
  );
}

function DiptychContent({
  images,
  startIndex,
  pageNumber,
}: {
  images: ImageType[];
  startIndex: number;
  pageNumber: number;
}) {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center">
      <div className="folio-reveal relative flex w-full flex-col items-center justify-center gap-6 md:flex-row md:gap-[2vw]">
        {/* Image 1 */}
        <SiteMedia
          src={images[0]?.url}
          alt={images[0]?.alt || `Photograph ${padIndex(startIndex)}`}
          width={900}
          height={600}
          className="max-h-[35vh] w-[85vw] object-contain md:max-h-[65vh] md:w-[43vw]"
          sizes="(min-width: 768px) 43vw, 85vw"
          loading="lazy"
        />

        {/* Image 2 */}
        <SiteMedia
          src={images[1]?.url}
          alt={images[1]?.alt || `Photograph ${padIndex(startIndex + 1)}`}
          width={900}
          height={600}
          className="max-h-[35vh] w-[85vw] object-contain md:max-h-[65vh] md:w-[43vw]"
          sizes="(min-width: 768px) 43vw, 85vw"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function DetailCropContent({
  image,
  index,
  pageNumber,
}: {
  image: ImageType;
  index: number;
  pageNumber: number;
}) {
  const caption = image.caption;

  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center gap-8 px-[8%] md:flex-row md:items-center md:justify-between md:gap-0 md:px-[10%]">
      {/* Text side */}
      {caption && (
        <div className="folio-reveal order-1 max-w-[300px] text-center md:order-none md:text-left">
          <p className="folio-reveal-label font-display text-2xl font-light italic leading-[1.35] text-text md:text-4xl">
            {caption}
          </p>
        </div>
      )}

      {/* Image side */}
      <div className="order-2 flex justify-center md:order-none md:justify-end">
        <SiteMedia
          src={image.url}
          alt={image.alt || `Photograph ${padIndex(index)}`}
          width={800}
          height={1000}
          className="folio-reveal max-h-[50vh] w-[75vw] object-contain md:max-h-[72vh] md:w-[32vw]"
          sizes="(min-width: 768px) 32vw, 75vw"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function VideoContent({ videoUrl, pageNumber }: { videoUrl: string; pageNumber: number }) {
  return (
    <div className="relative h-full min-h-screen">
      <SiteMedia
        src={videoUrl}
        alt="Film placeholder"
        fill
        className="folio-reveal absolute inset-0 h-full w-full object-cover"
      />
      {/* Bottom gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--color-background) 80%, transparent) 0%, transparent 40%)",
        }}
      />
      <span className="folio-reveal-label absolute bottom-10 left-10 font-label text-[11px] uppercase tracking-[0.16em] text-muted">
        [ FILM ]
      </span>
    </div>
  );
}

function ColophonContent() {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center">
      <span className="folio-reveal text-sm text-primary">&#9670;</span>
      <span className="folio-reveal-label mt-8 font-label text-[11px] uppercase tracking-[0.16em] text-muted">
        Published by
      </span>
      <span className="folio-reveal-label mt-3 font-display text-2xl font-light italic text-text">
        Bahar Studio
      </span>
      <div className="folio-reveal-label mt-8 h-px w-[60px] bg-primary" />
      <span className="folio-reveal-label mt-5 font-label text-[11px] uppercase tracking-[0.16em] text-muted">
        MMXXVI
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main component
   ────────────────────────────────────────────── */

export function FolioGallery({ images, title, videoUrl }: FolioGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const pages = buildFolioPages(images, videoUrl);
  const totalNumeral = toRoman(pages.length);

  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const pageEls = el.querySelectorAll<HTMLElement>(".folio-page");

      pageEls.forEach((pageEl, i) => {
        const reveals = pageEl.querySelectorAll<HTMLElement>(".folio-reveal");
        const labels = pageEl.querySelectorAll<HTMLElement>(".folio-reveal-label");
        const titleText = pageEl.querySelector<HTMLElement>(".folio-title-text");

        if (reduced) {
          if (reveals.length) gsap.set(reveals, { autoAlpha: 1 });
          if (labels.length) gsap.set(labels, { autoAlpha: 1 });
          if (titleText) gsap.set(titleText, { clipPath: "inset(0 0 0 0)" });
          return;
        }

        // Initial hidden states
        if (reveals.length) gsap.set(reveals, { autoAlpha: 0 });
        if (labels.length) gsap.set(labels, { autoAlpha: 0 });
        if (titleText) gsap.set(titleText, { clipPath: "inset(0 100% 0 0)" });

        // Entrance timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pageEl,
            start: folioReveal.scrollTrigger.start,
            toggleActions: folioReveal.scrollTrigger.toggleActions,
            onEnter: () => updateIndicator(i),
            onEnterBack: () => updateIndicator(i),
          },
          ...withWillChange(),
        });

        if (reveals.length > 0) {
          tl.fromTo(reveals, folioReveal.image.from, folioReveal.image.to, 0);
        }
        if (labels.length > 0) {
          tl.fromTo(labels, folioReveal.label.from, folioReveal.label.to, folioReveal.label.delay);
        }

        // Title clip-path reveal
        if (titleText) {
          gsap.fromTo(titleText, folioReveal.titleClip.from, {
            ...folioReveal.titleClip.to,
            scrollTrigger: {
              trigger: pageEl,
              start: folioReveal.scrollTrigger.start,
              toggleActions: folioReveal.scrollTrigger.toggleActions,
            },
          });
        }
      });

      // Page indicator entrance
      if (indicatorRef.current && !reduced) {
        gsap.fromTo(
          indicatorRef.current,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.4,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      function updateIndicator(pageIndex: number) {
        if (!indicatorRef.current) return;
        indicatorRef.current.textContent = `${toRoman(pageIndex + 1)} / ${totalNumeral}`;
      }
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section ref={sectionRef} className="relative bg-background" aria-label="Photo gallery">
      {/* Sticky overlays — persist while scrolling through gallery */}
      <div className="sticky top-0 z-50 h-0 overflow-visible pointer-events-none">
        <div className="h-screen w-full">
          {/* Film grain */}
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.03]"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <filter id="folio-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves={3}
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#folio-grain)" />
          </svg>

          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, color-mix(in srgb, var(--color-background) 30%, transparent) 70%, color-mix(in srgb, var(--color-background) 70%, transparent) 100%)",
            }}
          />

          {/* Page indicator */}
          <div
            ref={indicatorRef}
            className="absolute top-5 right-5 font-label text-[10px] uppercase tracking-[0.16em] text-muted pointer-events-auto md:top-8 md:right-8 md:text-[11px]"
          >
            I / {totalNumeral}
          </div>
        </div>
      </div>

      {/* Gallery pages */}
      {pages.map((page, i) => (
        <div
          key={i}
          className="folio-page relative overflow-hidden"
          style={{
            minHeight: "100vh",
            borderTop:
              i > 0
                ? "1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)"
                : undefined,
            ...(i > 1 ? { contentVisibility: "auto", containIntrinsicSize: "auto 100vh" } : {}),
          }}
        >
          {page.layout === "title" && <TitleContent title={title} count={images.length} />}
          {page.layout === "full-bleed" && (
            <FullBleedContent
              image={page.images[0]}
              index={page.imageIndex}
              pageNumber={page.pageNumber}
            />
          )}
          {page.layout === "centered-plate" && (
            <CenteredPlateContent
              image={page.images[0]}
              index={page.imageIndex}
              pageNumber={page.pageNumber}
            />
          )}
          {page.layout === "diptych" && (
            <DiptychContent
              images={page.images}
              startIndex={page.imageIndex}
              pageNumber={page.pageNumber}
            />
          )}
          {page.layout === "detail-crop" && (
            <DetailCropContent
              image={page.images[0]}
              index={page.imageIndex}
              pageNumber={page.pageNumber}
            />
          )}
          {page.layout === "video" && page.videoUrl && (
            <VideoContent videoUrl={page.videoUrl} pageNumber={page.pageNumber} />
          )}
          {page.layout === "colophon" && <ColophonContent />}
        </div>
      ))}
    </section>
  );
}
