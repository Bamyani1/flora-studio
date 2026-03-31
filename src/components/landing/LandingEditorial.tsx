"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { fadeUp, withWillChange } from "@/lib/animations";
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
  const reducedMotion = useReducedMotion();
  const dims = getImageDimensions(content.image);

  useGSAP(() => {
    if (!descRef.current || !ctaRef.current) return;

    if (reducedMotion) {
      gsap.set([descRef.current, ctaRef.current], { autoAlpha: 1 });
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
  }, [reducedMotion]);

  return (
    <section className="relative py-32 md:py-52 px-6 md:px-24">
      <div className="grain-medium absolute inset-0 z-grain" aria-hidden="true" />
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <CinematicImageReveal
          src={resolveImageUrl(content.image)}
          alt={content.image.alt ?? ""}
          className="w-full mb-24 md:mb-32"
          overlay={true}
          sizes="(min-width: 1280px) 1280px, 100vw"
          width={dims?.width ?? 2133}
          height={dims?.height ?? 3200}
        />

        <div className="max-w-4xl text-center flex flex-col items-center">
          <h2 className="font-headline text-4xl md:text-6xl text-white leading-tight mb-10">
            <RevealText text={content.titleLine1} />
            <br />
            <RevealText text={content.titleLine2Lead} delay={0.2} />{" "}
            <span className="italic text-white/70">
              <RevealText text={content.titleLine2Muted} delay={0.3} />
            </span>{" "}
            <span className="text-primary">
              <RevealText text={content.titleLine2Accent} delay={0.4} />
            </span>
          </h2>

          <p
            ref={descRef}
            className="font-body text-white/60 text-lg md:text-xl leading-relaxed mb-16 max-w-2xl"
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
