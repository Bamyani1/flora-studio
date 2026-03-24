"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { fadeUp, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { CinematicImageReveal } from "./CinematicImageReveal";
import { getLocalBlur } from "@/lib/image-manifest";
import { Sparkles } from "lucide-react";

export function LandingStudio() {
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (!card1Ref.current || !card2Ref.current) return;

    if (reducedMotion) {
      gsap.set([card1Ref.current, card2Ref.current], { autoAlpha: 1 });
      return;
    }

    gsap.fromTo(
      card1Ref.current,
      fadeUp.from,
      {
        ...fadeUp.to,
        duration: 1.2,
        ...withWillChange(),
        scrollTrigger: {
          trigger: card1Ref.current,
          ...fadeUp.scrollTrigger,
        },
      },
    );

    gsap.fromTo(
      card2Ref.current,
      fadeUp.from,
      {
        ...fadeUp.to,
        duration: 1.2,
        delay: 0.2,
        ...withWillChange(),
        scrollTrigger: {
          trigger: card2Ref.current,
          ...fadeUp.scrollTrigger,
        },
      },
    );
  }, [reducedMotion]);

  return (
    <section className="py-32 md:py-52">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        <CinematicImageReveal
          src="/images/wanderlust/hero.jpg"
          alt="Wanderlust landscape"
          className="w-full h-[60vh] md:h-[700px] mb-20 md:mb-32"
          blurDataURL={getLocalBlur("/images/wanderlust/hero.jpg")}
        />

        <div className="grid md:grid-cols-2 gap-8 md:gap-20 w-full items-stretch">
          <div
            ref={card1Ref}
            className="p-10 md:p-16 border border-white/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-colors duration-700"
          >
            <Sparkles
              className="text-primary w-8 h-8 md:w-10 md:h-10 mb-10"
              strokeWidth={1}
            />
            <h4 className="font-headline text-3xl md:text-4xl mb-6 italic text-white">
              Light Theory
            </h4>
            <p className="font-body text-base text-white/60 leading-relaxed">
              Understanding the physics of the golden hour in digital
              reproduction and the subtle nuances of natural illumination.
            </p>
          </div>

          <div
            ref={card2Ref}
            className="bg-primary p-10 md:p-16 flex flex-col justify-center items-center text-surface-deep group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
            <TransitionLink
              href="/contact"
              className="relative z-10 flex flex-col items-center"
            >
              <p className="font-label text-[10px] uppercase tracking-[0.3em] mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
                Join the Studio
              </p>
              <span className="font-headline text-4xl md:text-5xl border-b border-surface-deep/30 pb-2 group-hover:border-surface-deep transition-colors duration-500">
                Access
              </span>
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
