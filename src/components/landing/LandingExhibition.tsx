"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { fadeLeft, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { Button } from "@/components/ui/Button";
import { CinematicImageReveal } from "./CinematicImageReveal";
import { getImageDimensions, resolveImageUrl } from "@/lib/image-url";
import type { HomeExhibitionContent } from "@/types/content";

interface LandingExhibitionProps {
  content: HomeExhibitionContent;
}

export function LandingExhibition({ content }: LandingExhibitionProps) {
  const textColRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const dims = getImageDimensions(content.image);

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
    <section className="py-24 md:py-36 relative overflow-hidden">
      <div className="grain-medium absolute inset-0 z-grain" aria-hidden="true" />
      <div className="absolute inset-0 bg-background transform -skew-y-3 origin-top-left z-0"></div>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center">
          <div ref={textColRef} className="w-full md:w-1/2">
            <h3 className="font-headline text-5xl md:text-7xl italic text-white mb-8 leading-tight">
              {content.titleLine1}
              <br />
              {content.titleLine2}
            </h3>
            <p className="font-body text-white/60 text-lg leading-relaxed mb-12 max-w-md">
              {content.description}
            </p>
            <Button
              as={TransitionLink}
              href={content.cta.href}
              variant="outline-subtle"
              size="xs"
              className="gap-2"
            >
              {content.cta.label} <span aria-hidden="true">&rarr;</span>
            </Button>
          </div>

          <div className="w-full md:w-1/2">
            <CinematicImageReveal
              src={resolveImageUrl(content.image)}
              alt={content.image.alt ?? ""}
              className="w-full"
              sizes="(min-width: 768px) 50vw, 100vw"
              width={dims?.width ?? 2133}
              height={dims?.height ?? 3200}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
