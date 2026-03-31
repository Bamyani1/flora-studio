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
        duration: 0.8,
        ...withWillChange(),
        scrollTrigger: {
          trigger: card1Ref.current,
          start: "top 95%",
          end: "top 20%",
          toggleActions: "play none none none",
        },
      });
    }

    if (!card2Ref.current) {
      return;
    }

    gsap.fromTo(card2Ref.current, fadeUp.from, {
      ...fadeUp.to,
      duration: 0.8,
      delay: card1Ref.current ? 0.15 : 0,
      ...withWillChange(),
      scrollTrigger: {
        trigger: card2Ref.current,
        start: "top 95%",
        end: "top 20%",
        toggleActions: "play none none none",
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
            className="p-8 md:p-12 border border-white/10 bg-white/[0.02] hover:bg-white hover:border-white transition-all duration-700 h-full cursor-pointer"
          >
            <h4 className="font-headline text-3xl md:text-4xl mb-6 italic text-white group-hover:text-surface-deep">
              {featuredAlbum.title}
            </h4>
            {featuredAlbum.description && (
              <p className="font-body text-base text-white/60 group-hover:text-surface-deep/60 leading-relaxed transition-colors duration-700">
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
        className="p-8 md:p-12 flex flex-col justify-center items-center border border-white/10 bg-white/[0.02] hover:bg-primary hover:border-primary transition-all duration-700 group cursor-pointer relative overflow-hidden"
      >
        <TransitionLink href={ctaHref} className="relative z-10 flex flex-col items-center">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] mb-6 text-primary group-hover:text-surface-deep/70 transition-colors duration-700">
            {ctaEyebrow}
          </p>
          <span className="font-label text-xs uppercase tracking-[0.2em] font-semibold text-on-surface border border-primary/35 px-8 py-3 group-hover:text-surface-deep group-hover:border-surface-deep/35 transition-colors duration-500">
            {ctaLabel}
          </span>
        </TransitionLink>
      </div>
    </div>
  );
}
