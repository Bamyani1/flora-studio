"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { editorialLightRay, fadeUp, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { Button } from "@/components/ui/Button";
import { CinematicImageReveal } from "./CinematicImageReveal";
import { RevealText } from "./RevealText";
import { getImageDimensions, resolveImageUrl } from "@/lib/image-url";
import type { HomeEditorialContent } from "@/types/content";

interface LandingEditorialProps {
  content: HomeEditorialContent;
}

export function LandingEditorial({ content }: LandingEditorialProps) {
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const rayRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const dims = getImageDimensions(content.image);

  useGSAP(() => {
    if (!descRef.current || !ctaRef.current) return;

    if (reducedMotion) {
      // The ray is ambient light, not motion — statically present, never hidden
      gsap.set([descRef.current, ctaRef.current, rayRef.current], { autoAlpha: 1 });
      return;
    }

    gsap.fromTo(descRef.current, fadeUp.from, {
      ...fadeUp.to,
      ...withWillChange(),
      scrollTrigger: {
        trigger: descRef.current,
        ...fadeUp.scrollTrigger,
      },
    });

    gsap.fromTo(ctaRef.current, fadeUp.from, {
      ...fadeUp.to,
      ...withWillChange(),
      scrollTrigger: {
        trigger: ctaRef.current,
        ...fadeUp.scrollTrigger,
      },
    });

    if (rayRef.current && headlineRef.current) {
      gsap.fromTo(rayRef.current, editorialLightRay.from, {
        ...editorialLightRay.to,
        ...withWillChange(),
        scrollTrigger: {
          trigger: headlineRef.current,
          ...editorialLightRay.scrollTrigger,
        },
      });
    }
  }, [reducedMotion]);

  // overflow-x-clip (not hidden): keeps the rotated ray from widening the
  // page without creating a scroll container
  return (
    <section className="relative overflow-x-clip py-20 md:py-36 px-6 md:px-24">
      <div className="grain-medium absolute inset-0 z-grain" aria-hidden="true" />
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Height-capped so a portrait frame can't stretch to two viewports of scroll */}
        <CinematicImageReveal
          src={resolveImageUrl(content.image)}
          alt={content.image.alt ?? ""}
          className="w-full max-h-[85vh] mb-16 md:mb-24"
          overlay={true}
          sizes="(min-width: 1280px) 1280px, 100vw"
          width={dims?.width ?? 2133}
          height={dims?.height ?? 3200}
        />

        <div className="relative max-w-4xl text-center flex flex-col items-center">
          {/* One shaft of light aimed at "light." — static rotation lives on this
              wrapper so GSAP owns the inner transform; -z paints it above the
              ancestor's bg-surface-deep but under the text and the photo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -z-[1] left-[58%] md:left-[64%] -top-28 md:-top-40 h-[24rem] md:h-[32rem] w-24 md:w-56 -translate-x-1/2 rotate-[16deg]"
          >
            <div ref={rayRef} data-animate className="light-ray h-full w-full" />
          </div>

          {/* Tight delays — long staggers left a half-rendered headline at normal scroll speed */}
          <h2
            ref={headlineRef}
            className="font-headline text-4xl md:text-6xl text-white leading-tight mb-10"
          >
            <RevealText text={content.titleLine1} />
            <br />
            <RevealText text={content.titleLine2Lead} delay={0.08} />{" "}
            <span className="italic text-white/70">
              <RevealText text={content.titleLine2Muted} delay={0.14} />
            </span>{" "}
            <span className="text-primary">
              <RevealText text={content.titleLine2Accent} delay={0.2} />
            </span>
          </h2>

          <p
            ref={descRef}
            className="font-body text-white/75 text-lg md:text-xl leading-relaxed mb-16 max-w-2xl text-left md:text-center"
          >
            {content.description}
          </p>

          <div ref={ctaRef}>
            <Button
              as={TransitionLink}
              href={content.cta.href}
              variant="outline-subtle"
              size="xs"
              className="group relative overflow-hidden"
            >
              <span className="relative z-10">{content.cta.label}</span>
              <div className="absolute inset-0 bg-white/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
