"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { fadeLeft, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { Button } from "@/components/ui/Button";
import { CinematicImageReveal } from "./CinematicImageReveal";
import { getLocalBlur, getLocalDimensions } from "@/lib/image-manifest";

const exhibitionDims = getLocalDimensions("/images/exhibition-hero.jpg");

export function LandingExhibition() {
  const textColRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (!textColRef.current) return;

    if (reducedMotion) {
      gsap.set(textColRef.current, { autoAlpha: 1 });
      return;
    }

    gsap.fromTo(textColRef.current, fadeLeft.from, {
      ...fadeLeft.to,
      duration: 1.5,
      ...withWillChange(),
      scrollTrigger: {
        trigger: textColRef.current,
        start: "top 75%",
      },
    });
  }, [reducedMotion]);

  return (
    <section className="py-32 md:py-40 relative">
      <div className="grain-medium absolute inset-0 z-[2]" aria-hidden="true" />
      <div className="absolute inset-0 bg-background transform -skew-y-3 origin-top-left z-0"></div>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center">
          <div ref={textColRef} className="order-2 md:order-1 w-full md:w-1/2">
            <span className="text-primary font-label text-[10px] tracking-[0.5em] mb-6 block">
              EXHIBITION 01
            </span>
            <h3 className="font-headline text-5xl md:text-7xl italic text-white mb-8 leading-tight">
              Before
              <br />
              the Game
            </h3>
            <p className="font-body text-white/60 text-lg leading-relaxed mb-12 max-w-md">
              An empty arena holds every game it&apos;s ever seen. The silence before tip-off, the
              geometry of the court, and the weight of what&apos;s about to happen.
            </p>
            <Button
              as={TransitionLink}
              href="/work"
              variant="outline-subtle"
              size="xs"
              className="gap-2"
            >
              Explore Exhibition <span aria-hidden="true">&rarr;</span>
            </Button>
          </div>

          <div className="order-1 md:order-2 w-full md:w-1/2">
            <CinematicImageReveal
              src="/images/exhibition-hero.jpg"
              alt="Empty basketball arena viewed from above"
              className="w-full"
              sizes="(min-width: 768px) 50vw, 100vw"
              blurDataURL={getLocalBlur("/images/exhibition-hero.jpg")}
              width={exhibitionDims?.width}
              height={exhibitionDims?.height}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
