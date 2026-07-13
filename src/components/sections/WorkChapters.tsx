"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { chapterReveal, scrollIndicatorPulse, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { Button } from "@/components/ui/Button";
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
  return [categoryLabel, album.year].filter(Boolean).join(" · ");
}

function countLabel(album: AlbumMeta): string | undefined {
  return album.imageCount
    ? `${album.imageCount} photograph${album.imageCount === 1 ? "" : "s"}`
    : undefined;
}

export function WorkChapters({ albums, heroBlurDataURL }: WorkChaptersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const mobileTagRef = useRef<HTMLDivElement>(null);
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

      // The first chapter's scroll cue breathes like the landing hero's
      const cueLine = root.querySelector<HTMLElement>(".work-cue-line");
      if (cueLine && !reduced) {
        gsap.fromTo(cueLine, scrollIndicatorPulse.line.from, { ...scrollIndicatorPulse.line.to });
      }

      // Rail + mobile position tag visibility follows the chapters container
      const wayfinders = [railRef.current, mobileTagRef.current].filter(
        Boolean,
      ) as HTMLElement[];
      if (wayfinders.length) {
        gsap.set(wayfinders, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: root,
          start: "top 60%",
          end: "bottom 85%",
          onToggle: (self) => {
            if (reduced) {
              gsap.set(wayfinders, { autoAlpha: self.isActive ? 1 : 0 });
            } else {
              gsap.to(wayfinders, {
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
          // Syncopate the panel heights so eleven chapters don't tick by like a
          // metronome — every third non-hero panel drops to a shorter beat
          const panelHeight =
            i === 0 ? "h-svh" : i % 3 === 2 ? "h-[78svh] md:h-[76vh]" : "h-[78svh] md:h-[92vh]";
          return (
            <article
              key={album._id}
              data-chapter
              className={`relative overflow-hidden scroll-mt-[var(--header-height)] ${panelHeight}${
                i > 1 ? " chapter-panel-deferred" : ""
              }`}
            >
              <TransitionLink
                href={`/work/${album.slug.current}`}
                className="group absolute inset-0 block"
              >
                <div className="chapter-cover absolute inset-0">
                  <SiteMedia
                    src={resolveImageUrl(album.coverImage)}
                    alt={album.coverImage.alt || album.title}
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

                {/* Directional scrim biased toward the text corner — the global
                    gradient alone can't guarantee legibility over bright covers */}
                <div
                  className="absolute inset-0"
                  aria-hidden="true"
                  style={{
                    background: `radial-gradient(ellipse 62% 46% at ${
                      alignRight ? "82%" : "18%"
                    } 96%, color-mix(in srgb, var(--color-background) 82%, transparent), transparent 72%)`,
                  }}
                />

                <div
                  className={`absolute inset-x-0 bottom-0 flex flex-col px-7 pt-6 pb-10 md:p-16 ${
                    alignRight ? "items-end text-right" : "items-start"
                  }`}
                >
                  {/* Phones already carry the counter in the fixed position tag —
                      showing it per-card too read as noise */}
                  <span
                    data-chapter-text
                    className="hidden eyebrow text-primary md:inline"
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
                  {/* On phones the meta leads as the eyebrow (order-first) so the
                      card ends on the title + arrow — the actionable element;
                      the photograph count stays a desktop detail */}
                  <p
                    data-chapter-text
                    className="order-first eyebrow text-text/80 md:order-none md:mt-4"
                  >
                    {metaLine(album)}
                    {countLabel(album) && (
                      <span className="hidden md:inline"> &middot; {countLabel(album)}</span>
                    )}
                  </p>
                </div>
              </TransitionLink>

              {/* Entry masthead — announces the page as the index, not an album */}
              {i === 0 && (
                <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--header-height)+1.5rem)] z-10 flex justify-center">
                  <p className="eyebrow text-text/80">
                    Selected work &mdash; {total} collections
                  </p>
                </div>
              )}

              {/* Scroll cue — same grammar as the landing hero, so the first
                  panel reads as the opening of a sequence, not a lone album */}
              {i === 0 && (
                <div
                  className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
                  aria-hidden="true"
                >
                  <span className="font-label text-[9px] uppercase tracking-[0.4em] text-white/40">
                    Scroll
                  </span>
                  <div className="work-cue-line h-8 w-px origin-top bg-white/25" />
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Chapter rail — wayfinding + jump navigation from tablet up. The cap
          label names the column; hovering a tick reveals which album it jumps to. */}
      <nav
        ref={railRef}
        aria-label="Album chapters"
        className="invisible fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-1.5 opacity-0 md:flex"
      >
        <span className="mb-2 eyebrow text-primary" aria-hidden="true">
          {padIndex(active + 1)} / {padIndex(total)}
        </span>
        {albums.map((album, i) => (
          <button
            key={album._id}
            type="button"
            onClick={() => scrollToChapter(i)}
            aria-label={`Chapter ${i + 1}: ${album.title}`}
            aria-current={active === i ? "true" : undefined}
            className="group/tick flex h-6 items-center justify-end gap-2"
          >
            <span className="eyebrow whitespace-nowrap text-text opacity-0 transition-opacity duration-300 can-hover:group-hover/tick:opacity-100">
              {album.title}
            </span>
            <span
              className={`h-px transition-all duration-300 group-hover/tick:bg-primary ${
                active === i ? "w-8 bg-primary" : "w-4 bg-text/50"
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Mobile position tag — the rail's phone-sized counterpart */}
      <div
        ref={mobileTagRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed bottom-4 left-4 z-30 opacity-0 md:hidden"
        style={{
          marginBottom: "env(safe-area-inset-bottom)",
          textShadow: "0 1px 6px rgba(16, 19, 12, 0.9)",
        }}
      >
        <span className="eyebrow text-text">
          {padIndex(active + 1)}
          <span className="text-muted"> / {padIndex(total)}</span>
        </span>
      </div>

      {/* Outro — close the sequence with a next step instead of dropping
          straight from the last cover into the site footer */}
      <section className="flex flex-col items-center bg-background px-6 py-[var(--section-padding-y)] text-center">
        <p className="eyebrow text-primary">The archive, in person</p>
        <h2 className="mt-6 font-headline text-3xl italic text-text-heading md:text-5xl">
          Every collection starts with a conversation.
        </h2>
        <Button
          as={TransitionLink}
          href="/contact"
          size="xs"
          className="mt-10"
        >
          Start a project
        </Button>
      </section>
    </>
  );
}
