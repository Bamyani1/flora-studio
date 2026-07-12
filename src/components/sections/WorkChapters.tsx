"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { chapterReveal, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { CATEGORY_META } from "@/lib/categories";
import { resolveImageUrl } from "@/lib/image-url";
import { SiteMedia } from "@/components/ui/SiteMedia";
import type { AlbumMeta } from "@/types/project";

interface WorkChaptersProps {
  albums: AlbumMeta[];
  heroBlurDataURL?: string;
}

function padIndex(n: number): string {
  return String(n).padStart(2, "0");
}

function metaLine(album: AlbumMeta): string {
  const categoryLabel = CATEGORY_META[album.category]?.label ?? album.category;
  return [
    categoryLabel,
    album.year,
    album.imageCount
      ? `${album.imageCount} photograph${album.imageCount === 1 ? "" : "s"}`
      : undefined,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function WorkChapters({ albums, heroBlurDataURL }: WorkChaptersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const total = albums.length;

  const scrollToChapter = (i: number) => {
    const panel = containerRef.current?.querySelectorAll<HTMLElement>("[data-chapter]")[i];
    panel?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;

      const panels = root.querySelectorAll<HTMLElement>("[data-chapter]");

      panels.forEach((panel, i) => {
        // Rail active state — wayfinding, so it runs under reduced motion too
        ScrollTrigger.create({
          trigger: panel,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });

        const texts = panel.querySelectorAll("[data-chapter-text]");
        const cover = panel.querySelector(".chapter-cover");

        if (reduced) {
          gsap.set(texts, { autoAlpha: 1, y: 0 });
          if (cover) gsap.set(cover, { scale: 1 });
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: { trigger: panel, ...chapterReveal.scrollTrigger },
          ...withWillChange(),
        });
        if (cover) tl.fromTo(cover, chapterReveal.cover.from, chapterReveal.cover.to, 0);
        if (texts.length > 0) {
          tl.fromTo(texts, chapterReveal.text.from, { ...chapterReveal.text.to }, 0.2);
        }
      });

      // Rail visibility follows the chapters container
      const rail = railRef.current;
      if (rail) {
        gsap.set(rail, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: root,
          start: "top 60%",
          end: "bottom 85%",
          onToggle: (self) => {
            if (reduced) {
              gsap.set(rail, { autoAlpha: self.isActive ? 1 : 0 });
            } else {
              gsap.to(rail, {
                autoAlpha: self.isActive ? 1 : 0,
                duration: 0.4,
                overwrite: "auto",
              });
            }
          },
        });
      }
    },
    { scope: containerRef, dependencies: [reduced] },
  );

  return (
    <>
      <div ref={containerRef} className="flex flex-col gap-2 bg-background">
        {albums.map((album, i) => {
          const alignRight = i % 2 === 1;
          // Glue the arrow to the title's last word so it never wraps alone
          const titleWords = album.title.split(" ");
          const titleTail = titleWords.pop();
          const titleHead = titleWords.join(" ");
          return (
            <article
              key={album._id}
              data-chapter
              className={`relative overflow-hidden ${i === 0 ? "h-svh" : "h-[78svh] md:h-[92vh]"}`}
              style={
                i > 1
                  ? { contentVisibility: "auto", containIntrinsicSize: "auto 78vh" }
                  : undefined
              }
            >
              <TransitionLink
                href={`/work/${album.slug.current}`}
                className="group absolute inset-0 block"
              >
                <div className="chapter-cover absolute inset-0">
                  <SiteMedia
                    src={resolveImageUrl(album.coverImage)}
                    alt={album.coverImage.alt || `${album.title} cover`}
                    fill
                    priority={i === 0}
                    quality={85}
                    blurDataURL={i === 0 ? heroBlurDataURL : undefined}
                    className="object-cover transition-transform duration-[1200ms] ease-out can-hover:group-hover:scale-[1.03]"
                    sizes="100vw"
                  />
                </div>

                <div
                  className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
                  aria-hidden="true"
                />

                <div
                  className={`absolute inset-x-0 bottom-0 flex flex-col p-6 pb-10 md:p-16 ${
                    alignRight ? "items-end text-right" : "items-start"
                  }`}
                >
                  <span
                    data-chapter-text
                    className="font-label text-[10px] uppercase tracking-[0.2em] text-primary"
                  >
                    {padIndex(i + 1)} / {padIndex(total)}
                  </span>
                  <h2
                    data-chapter-text
                    className="mt-3 font-headline text-4xl italic leading-none text-text-heading transition-colors duration-500 md:text-6xl can-hover:group-hover:text-primary"
                  >
                    {titleHead && `${titleHead} `}
                    <span className="whitespace-nowrap">
                      {titleTail}{" "}
                      <span
                        aria-hidden="true"
                        className="inline-block align-middle text-[0.45em] not-italic text-primary transition-transform duration-300 can-hover:group-hover:translate-x-1"
                      >
                        &rarr;
                      </span>
                    </span>
                  </h2>
                  <p
                    data-chapter-text
                    className="mt-4 font-label text-[10px] uppercase tracking-[0.2em] text-muted"
                  >
                    {metaLine(album)}
                  </p>
                </div>
              </TransitionLink>
            </article>
          );
        })}
      </div>

      {/* Chapter rail — desktop wayfinding + jump navigation */}
      <nav
        ref={railRef}
        aria-label="Album chapters"
        className="invisible fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 opacity-0 lg:flex"
      >
        {albums.map((album, i) => (
          <button
            key={album._id}
            type="button"
            onClick={() => scrollToChapter(i)}
            aria-label={`Chapter ${i + 1}: ${album.title}`}
            aria-current={active === i ? "true" : undefined}
            className="group/tick flex h-4 items-center justify-end gap-2"
          >
            <span
              className={`font-label text-[9px] tracking-[0.2em] text-primary transition-opacity duration-300 ${
                active === i ? "opacity-100" : "opacity-0"
              }`}
            >
              {padIndex(i + 1)}
            </span>
            <span
              className={`h-px transition-all duration-300 group-hover/tick:bg-primary ${
                active === i ? "w-8 bg-primary" : "w-4 bg-text/30"
              }`}
            />
          </button>
        ))}
      </nav>
    </>
  );
}
