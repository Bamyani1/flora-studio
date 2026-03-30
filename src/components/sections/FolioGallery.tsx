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
  | "panoramic"
  | "editorial-left"
  | "editorial-right"
  | "staggered-pair"
  | "trio-mosaic"
  | "full-bleed"
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
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen",
  "Nineteen", "Twenty",
];

function imageCountLabel(count: number): string {
  const word = count <= 20 ? NUMBER_WORDS[count] : String(count);
  return `[ ${word.toUpperCase()} PHOTOGRAPH${count !== 1 ? "S" : ""} ]`;
}

function padIndex(n: number): string {
  return String(n).padStart(2, "0");
}

type Orientation = "landscape" | "portrait";

function getDims(img: ImageType): { w: number; h: number } {
  const m = img.asset._ref.match(/(\d+)x(\d+)/);
  return m ? { w: +m[1], h: +m[2] } : { w: 3, h: 2 };
}

function getOrientation(img: ImageType): Orientation {
  const { w, h } = getDims(img);
  return w >= h ? "landscape" : "portrait";
}

/* ──────────────────────────────────────────────
   Layout algorithm — orientation-aware editorial sequencing
   ────────────────────────────────────────────── */

function buildFolioPages(images: ImageType[], videoUrl?: string): FolioPage[] {
  const pages: FolioPage[] = [];
  let pageNum = 1;
  let idx = 0;
  let lastLayout: PageLayout = "title";
  let editorialSide: "left" | "right" = "left";
  let videoInserted = false;

  // Rotation cycles for uniform-orientation albums
  const landscapeCycle: PageLayout[] = ["diptych", "panoramic", "full-bleed", "diptych", "editorial-left", "panoramic"];
  const portraitCycle: PageLayout[] = ["diptych", "full-bleed", "editorial-left", "diptych", "editorial-right", "full-bleed"];
  let cycleIdx = 0;

  pages.push({ layout: "title", images: [], imageIndex: 0, pageNumber: pageNum++ });

  function pushPage(layout: PageLayout, imgs: ImageType[], imgIdx: number) {
    pages.push({ layout, images: imgs, imageIndex: imgIdx, pageNumber: pageNum++ });
  }

  if (images.length <= 2) {
    while (idx < images.length) {
      pushPage("full-bleed", [images[idx]], idx + 1);
      idx++;
    }
  } else {
    while (idx < images.length) {
      const remaining = images.length - idx;
      const ori = getOrientation(images[idx]);
      const nextOri = remaining > 1 ? getOrientation(images[idx + 1]) : null;
      const thirdOri = remaining > 2 ? getOrientation(images[idx + 2]) : null;
      const allSameOri = nextOri === null || ori === nextOri;

      let chosen: PageLayout;

      // ── Mixed orientations: use specialized multi-image layouts ──

      if (
        remaining >= 3 &&
        ori === "landscape" &&
        nextOri === "portrait" &&
        thirdOri === "portrait" &&
        lastLayout !== "trio-mosaic"
      ) {
        chosen = "trio-mosaic";
        pushPage(chosen, [images[idx], images[idx + 1], images[idx + 2]], idx + 1);
        idx += 3;

      } else if (
        remaining >= 2 &&
        ori !== nextOri &&
        lastLayout !== "staggered-pair"
      ) {
        chosen = "staggered-pair";
        pushPage(chosen, [images[idx], images[idx + 1]], idx + 1);
        idx += 2;

      // ── Uniform orientation: use rotation cycle for variety ──

      } else if (allSameOri) {
        const cycle = ori === "landscape" ? landscapeCycle : portraitCycle;
        chosen = cycle[cycleIdx % cycle.length];
        cycleIdx++;

        // Pair layouts need 2+ images
        if ((chosen === "diptych" || chosen === "staggered-pair") && remaining >= 2) {
          pushPage(chosen, [images[idx], images[idx + 1]], idx + 1);
          idx += 2;
        } else {
          // Single-image layout
          if (chosen === "diptych" || chosen === "staggered-pair") {
            chosen = ori === "landscape" ? "panoramic" : "full-bleed";
          }
          if (chosen === "editorial-left" || chosen === "editorial-right") {
            chosen = editorialSide === "left" ? "editorial-left" : "editorial-right";
            editorialSide = editorialSide === "left" ? "right" : "left";
          }
          pushPage(chosen, [images[idx]], idx + 1);
          idx++;
        }

      // ── Fallback ──
      } else {
        chosen = "full-bleed";
        pushPage(chosen, [images[idx]], idx + 1);
        idx++;
      }

      lastLayout = chosen;

      // Insert video around 60% through
      if (videoUrl && !videoInserted && idx >= images.length * 0.6) {
        pushPage("video", [], 0);
        pages[pages.length - 1].videoUrl = videoUrl;
        videoInserted = true;
        lastLayout = "video";
      }
    }
  }

  if (videoUrl && !videoInserted) {
    pushPage("video", [], 0);
    pages[pages.length - 1].videoUrl = videoUrl;
  }

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
      <div className="folio-reveal-label mt-6 h-px bg-primary" style={{ width: 60 }} />
      <span className="folio-reveal-label mt-4 font-label text-[10px] uppercase tracking-[0.2em] text-muted">
        Bahar Studio
      </span>
      <span className="folio-reveal-label mt-2 font-label text-[10px] uppercase tracking-[0.2em] text-muted/60">
        {imageCountLabel(count)}
      </span>
    </div>
  );
}

/* ── Panoramic: edge-to-edge landscape ── */

function PanoramicContent({
  image,
  index,
  pageNumber,
}: {
  image: ImageType;
  index: number;
  pageNumber: number;
}) {
  const { w, h } = getDims(image);
  return (
    <div className="py-[2vh]">
      <SiteMedia
        src={image.url}
        alt={image.alt || `Photograph ${padIndex(index)}`}
        width={w}
        height={h}
        className="folio-reveal h-auto w-full"
        sizes="100vw"
        loading={pageNumber <= 2 ? "eager" : "lazy"}
      />
    </div>
  );
}

/* ── Full bleed: single image, centered ── */

function FullBleedContent({
  image,
  index,
  pageNumber,
}: {
  image: ImageType;
  index: number;
  pageNumber: number;
}) {
  const { w, h } = getDims(image);
  return (
    <div className="flex flex-col items-center py-[2vh]">
      <SiteMedia
        src={image.url}
        alt={image.alt || `Photograph ${padIndex(index)}`}
        width={w}
        height={h}
        className="folio-reveal h-auto max-h-[85vh] w-[92%] md:w-[78%]"
        sizes="(min-width: 768px) 78vw, 92vw"
        loading={pageNumber <= 2 ? "eager" : "lazy"}
      />
    </div>
  );
}

/* ── Editorial single: off-center with negative space ── */

function EditorialContent({
  image,
  index,
  side,
}: {
  image: ImageType;
  index: number;
  side: "left" | "right";
}) {
  const { w, h } = getDims(image);
  return (
    <div
      className={`flex py-[2vh] px-[4vw] md:px-[6vw] ${
        side === "left" ? "justify-start" : "justify-end"
      }`}
    >
      <SiteMedia
        src={image.url}
        alt={image.alt || `Photograph ${padIndex(index)}`}
        width={w}
        height={h}
        className="folio-reveal h-auto max-h-[80vh] w-[80vw] md:w-[50vw] lg:w-[42vw]"
        sizes="(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 80vw"
        loading="lazy"
      />
    </div>
  );
}

/* ── Staggered pair: equal-height row via flex ── */

function StaggeredPairContent({
  images,
  startIndex,
}: {
  images: ImageType[];
  startIndex: number;
}) {
  const d0 = getDims(images[0]);
  const d1 = getDims(images[1]);
  const ar0 = d0.w / d0.h;
  const ar1 = d1.w / d1.h;

  return (
    <div className="flex flex-col gap-3 py-[2vh] px-[4vw] md:flex-row md:items-start md:gap-[1.5vw] md:px-[5vw]">
      <SiteMedia
        src={images[0]?.url}
        alt={images[0]?.alt || `Photograph ${padIndex(startIndex)}`}
        width={d0.w}
        height={d0.h}
        className="folio-reveal h-auto w-full"
        style={{ flex: ar0 }}
        sizes="(min-width: 768px) 46vw, 92vw"
        loading="lazy"
      />
      <SiteMedia
        src={images[1]?.url}
        alt={images[1]?.alt || `Photograph ${padIndex(startIndex + 1)}`}
        width={d1.w}
        height={d1.h}
        className="folio-reveal h-auto w-full"
        style={{ flex: ar1 }}
        sizes="(min-width: 768px) 46vw, 92vw"
        loading="lazy"
      />
    </div>
  );
}

/* ── Trio mosaic: large image + stacked column, flex-packed ── */

function TrioMosaicContent({
  images,
  startIndex,
}: {
  images: ImageType[];
  startIndex: number;
}) {
  const d0 = getDims(images[0]);
  const d1 = getDims(images[1]);
  const d2 = getDims(images[2]);
  const r0 = d0.w / d0.h;
  const r1 = d1.w / d1.h;
  const r2 = d2.w / d2.h;
  // Harmonic mean gives the effective column aspect ratio so heights match
  const stackFlex = (r1 * r2) / (r1 + r2);

  return (
    <div className="flex flex-col gap-3 py-[2vh] px-[4vw] md:flex-row md:items-start md:gap-[1.5vw] md:px-[5vw]">
      {/* Large image */}
      <SiteMedia
        src={images[0]?.url}
        alt={images[0]?.alt || `Photograph ${padIndex(startIndex)}`}
        width={d0.w}
        height={d0.h}
        className="folio-reveal h-auto w-full"
        style={{ flex: r0 }}
        sizes="(min-width: 768px) 55vw, 92vw"
        loading="lazy"
      />
      {/* Stacked column */}
      <div
        className="flex flex-row gap-3 md:flex-col md:gap-[1.5vw]"
        style={{ flex: stackFlex }}
      >
        <SiteMedia
          src={images[1]?.url}
          alt={images[1]?.alt || `Photograph ${padIndex(startIndex + 1)}`}
          width={d1.w}
          height={d1.h}
          className="folio-reveal h-auto w-full"
          sizes="(min-width: 768px) 36vw, 44vw"
          loading="lazy"
        />
        <SiteMedia
          src={images[2]?.url}
          alt={images[2]?.alt || `Photograph ${padIndex(startIndex + 2)}`}
          width={d2.w}
          height={d2.h}
          className="folio-reveal h-auto w-full"
          sizes="(min-width: 768px) 36vw, 44vw"
          loading="lazy"
        />
      </div>
    </div>
  );
}

/* ── Diptych: equal-height row via flex ── */

function DiptychContent({
  images,
  startIndex,
}: {
  images: ImageType[];
  startIndex: number;
}) {
  const d0 = getDims(images[0]);
  const d1 = getDims(images[1]);
  const ar0 = d0.w / d0.h;
  const ar1 = d1.w / d1.h;

  return (
    <div className="flex flex-col gap-3 py-[2vh] px-[4vw] md:flex-row md:items-start md:gap-[1.5vw] md:px-[5vw]">
      <SiteMedia
        src={images[0]?.url}
        alt={images[0]?.alt || `Photograph ${padIndex(startIndex)}`}
        width={d0.w}
        height={d0.h}
        className="folio-reveal h-auto w-full"
        style={{ flex: ar0 }}
        sizes="(min-width: 768px) 45vw, 92vw"
        loading="lazy"
      />
      <SiteMedia
        src={images[1]?.url}
        alt={images[1]?.alt || `Photograph ${padIndex(startIndex + 1)}`}
        width={d1.w}
        height={d1.h}
        className="folio-reveal h-auto w-full"
        style={{ flex: ar1 }}
        sizes="(min-width: 768px) 45vw, 92vw"
        loading="lazy"
      />
    </div>
  );
}

/* ── Detail crop: single image with optional caption ── */

function DetailCropContent({
  image,
  index,
}: {
  image: ImageType;
  index: number;
}) {
  const { w, h } = getDims(image);
  const caption = image.caption;

  return (
    <div className={`flex flex-col items-center justify-center gap-6 py-[2vh] px-[8%] ${caption ? "md:flex-row md:items-center md:justify-between md:gap-0 md:px-[10%]" : ""}`}>
      {caption && (
        <div className="folio-reveal order-1 max-w-[300px] text-center md:order-none md:text-left">
          <p className="folio-reveal-label font-display text-2xl font-light italic leading-[1.35] text-text md:text-4xl">
            {caption}
          </p>
        </div>
      )}
      <div className={`flex justify-center ${caption ? "order-2 md:order-none md:justify-end" : ""}`}>
        <SiteMedia
          src={image.url}
          alt={image.alt || `Photograph ${padIndex(index)}`}
          width={w}
          height={h}
          className={`folio-reveal h-auto ${caption ? "max-h-[50vh] w-[75vw] md:max-h-[75vh] md:w-[35vw]" : "max-h-[85vh] w-[92%] md:w-[78%]"}`}
          sizes={caption ? "(min-width: 768px) 35vw, 75vw" : "(min-width: 768px) 78vw, 92vw"}
          loading="lazy"
        />
      </div>
    </div>
  );
}

/* ── Video ── */

function VideoContent({ videoUrl }: { videoUrl: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-[2vh]">
      <video
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        className="folio-reveal h-auto max-h-[85vh] w-[92%] md:w-[78%]"
      />
      <span className="folio-reveal-label mt-4 font-label text-[11px] uppercase tracking-[0.16em] text-muted">
        [ FILM ]
      </span>
    </div>
  );
}

/* ── Colophon ── */

function ColophonContent() {
  return (
    <div className="flex flex-col items-center justify-center py-[10vh]">
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

        if (reveals.length) gsap.set(reveals, { autoAlpha: 0 });
        if (labels.length) gsap.set(labels, { autoAlpha: 0 });
        if (titleText) gsap.set(titleText, { clipPath: "inset(0 100% 0 0)" });

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
          tl.fromTo(reveals, folioReveal.image.from, { ...folioReveal.image.to, stagger: 0.12 }, 0);
        }
        if (labels.length > 0) {
          tl.fromTo(labels, folioReveal.label.from, folioReveal.label.to, folioReveal.label.delay);
        }

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
      {/* Sticky overlays */}
      <div className="sticky top-0 z-50 h-0 overflow-visible pointer-events-none">
        <div className="h-screen w-full">
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.03]"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <filter id="folio-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={3} stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#folio-grain)" />
          </svg>

          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, color-mix(in srgb, var(--color-background) 30%, transparent) 70%, color-mix(in srgb, var(--color-background) 70%, transparent) 100%)",
            }}
          />

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
            minHeight: page.layout === "title" ? "100vh" : undefined,
            borderTop:
              i > 0
                ? "1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)"
                : undefined,
            ...(i > 1 ? { contentVisibility: "auto", containIntrinsicSize: "auto 80vh" } : {}),
          }}
        >
          {page.layout === "title" && <TitleContent title={title} count={images.length} />}
          {page.layout === "panoramic" && (
            <PanoramicContent image={page.images[0]} index={page.imageIndex} pageNumber={page.pageNumber} />
          )}
          {page.layout === "full-bleed" && (
            <FullBleedContent image={page.images[0]} index={page.imageIndex} pageNumber={page.pageNumber} />
          )}
          {(page.layout === "editorial-left" || page.layout === "editorial-right") && (
            <EditorialContent
              image={page.images[0]}
              index={page.imageIndex}
              side={page.layout === "editorial-left" ? "left" : "right"}
            />
          )}
          {page.layout === "staggered-pair" && (
            <StaggeredPairContent images={page.images} startIndex={page.imageIndex} />
          )}
          {page.layout === "trio-mosaic" && (
            <TrioMosaicContent images={page.images} startIndex={page.imageIndex} />
          )}
          {page.layout === "diptych" && (
            <DiptychContent images={page.images} startIndex={page.imageIndex} />
          )}
          {page.layout === "detail-crop" && (
            <DetailCropContent image={page.images[0]} index={page.imageIndex} />
          )}
          {page.layout === "video" && page.videoUrl && (
            <VideoContent videoUrl={page.videoUrl} />
          )}
          {page.layout === "colophon" && <ColophonContent />}
        </div>
      ))}
    </section>
  );
}
