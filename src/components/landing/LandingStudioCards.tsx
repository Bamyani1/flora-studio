"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { fadeUp, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { CATEGORY_META } from "@/lib/categories";
import type { AlbumMeta } from "@/types/project";

interface LandingStudioCardsProps {
  featuredAlbum: Pick<AlbumMeta, "title" | "slug" | "category" | "description"> | null;
  ctaEyebrow: string;
  ctaLabel: string;
  ctaHref: string;
}

export function LandingStudioCards({
  featuredAlbum,
  ctaEyebrow,
  ctaLabel,
  ctaHref,
}: LandingStudioCardsProps) {
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    const cards = [card1Ref.current, card2Ref.current].filter(Boolean);

    if (cards.length === 0) return;

    if (reducedMotion) {
      gsap.set(cards, { autoAlpha: 1 });
      return;
    }

    if (card1Ref.current) {
      gsap.fromTo(card1Ref.current, fadeUp.from, {
        ...fadeUp.to,
        duration: 1.2,
        ...withWillChange(),
        scrollTrigger: {
          trigger: card1Ref.current,
          ...fadeUp.scrollTrigger,
        },
      });
    }

    if (!card2Ref.current) {
      return;
    }

    gsap.fromTo(card2Ref.current, fadeUp.from, {
      ...fadeUp.to,
      duration: 1.2,
      delay: card1Ref.current ? 0.2 : 0,
      ...withWillChange(),
      scrollTrigger: {
        trigger: card2Ref.current,
        ...fadeUp.scrollTrigger,
      },
    });
  }, [reducedMotion]);

  return (
    <div
      className={`grid gap-8 md:gap-20 w-full items-stretch ${featuredAlbum ? "md:grid-cols-2" : "md:grid-cols-1"}`}
    >
      {featuredAlbum && (
        <TransitionLink href={`/work/${featuredAlbum.slug.current}`} className="block group">
          <div
            ref={card1Ref}
            className="p-10 md:p-16 border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/20 transition-all duration-700 h-full"
          >
            <p className="font-label text-[10px] uppercase tracking-[0.3em] mb-10 text-primary">
              {CATEGORY_META[featuredAlbum.category]?.label ?? featuredAlbum.category}
            </p>
            <h4 className="font-headline text-3xl md:text-4xl mb-6 italic text-white">
              {featuredAlbum.title}
            </h4>
            {featuredAlbum.description && (
              <p className="font-body text-base text-white/60 leading-relaxed">
                {featuredAlbum.description}
              </p>
            )}
            <span className="inline-flex items-center gap-2 mt-8 font-label text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-primary transition-colors duration-500">
              View album
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transform transition-transform duration-300 group-hover:translate-x-1">
                <path d="M1 5H9M9 5L5 1M9 5L5 9" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </span>
          </div>
        </TransitionLink>
      )}

      <div
        ref={card2Ref}
        className="bg-primary p-10 md:p-16 flex flex-col justify-center items-center text-surface-deep group cursor-pointer relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
        <TransitionLink href={ctaHref} className="relative z-10 flex flex-col items-center">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
            {ctaEyebrow}
          </p>
          <span className="font-label text-xs uppercase tracking-[0.2em] font-semibold border border-surface-deep/35 px-8 py-3 group-hover:border-surface-deep transition-colors duration-500">
            {ctaLabel}
          </span>
        </TransitionLink>
      </div>
    </div>
  );
}
