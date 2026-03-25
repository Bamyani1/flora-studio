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
  featuredAlbum: Pick<AlbumMeta, "title" | "slug" | "category" | "description">;
}

export function LandingStudioCards({ featuredAlbum }: LandingStudioCardsProps) {
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (!card1Ref.current || !card2Ref.current) return;

    if (reducedMotion) {
      gsap.set([card1Ref.current, card2Ref.current], { autoAlpha: 1 });
      return;
    }

    gsap.fromTo(card1Ref.current, fadeUp.from, {
      ...fadeUp.to,
      duration: 1.2,
      ...withWillChange(),
      scrollTrigger: {
        trigger: card1Ref.current,
        ...fadeUp.scrollTrigger,
      },
    });

    gsap.fromTo(card2Ref.current, fadeUp.from, {
      ...fadeUp.to,
      duration: 1.2,
      delay: 0.2,
      ...withWillChange(),
      scrollTrigger: {
        trigger: card2Ref.current,
        ...fadeUp.scrollTrigger,
      },
    });
  }, [reducedMotion]);

  const categoryLabel = CATEGORY_META[featuredAlbum.category]?.label ?? featuredAlbum.category;

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-20 w-full items-stretch">
      <TransitionLink href={`/work/${featuredAlbum.slug.current}`} className="block">
        <div
          ref={card1Ref}
          className="p-10 md:p-16 border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-colors duration-700 h-full"
        >
          <p className="font-label text-[10px] uppercase tracking-[0.3em] mb-10 text-primary">
            {categoryLabel}
          </p>
          <h4 className="font-headline text-3xl md:text-4xl mb-6 italic text-white">
            {featuredAlbum.title}
          </h4>
          {featuredAlbum.description && (
            <p className="font-body text-base text-white/60 leading-relaxed">
              {featuredAlbum.description}
            </p>
          )}
        </div>
      </TransitionLink>

      <div
        ref={card2Ref}
        className="bg-primary p-10 md:p-16 flex flex-col justify-center items-center text-surface-deep group cursor-pointer relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
        <TransitionLink href="/contact" className="relative z-10 flex flex-col items-center">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
            Join the Studio
          </p>
          <span className="font-headline text-4xl md:text-5xl border-b border-surface-deep/30 pb-2 group-hover:border-surface-deep transition-colors duration-500">
            Access
          </span>
        </TransitionLink>
      </div>
    </div>
  );
}
