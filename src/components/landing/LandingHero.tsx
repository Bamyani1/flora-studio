"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { landingHeroGridSequence, landingHeroParallax } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SiteMedia } from "@/components/ui/SiteMedia";
import { resolveImageUrl } from "@/lib/image-url";
import type { HomeHeroContent } from "@/types/content";

interface LandingHeroProps {
  content: HomeHeroContent;
}

export function LandingHero({ content }: LandingHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgContainerRef = useRef<HTMLDivElement>(null);
  const imageLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const refs: Record<string, React.RefObject<HTMLElement | null>> = {
        bgImage: bgContainerRef,
        eyebrow: eyebrowRef,
        headline: headlineRef,
        description: descRef,
      };

      const layers = imageLayerRefs.current.filter(Boolean) as HTMLElement[];

      // First image visible, rest hidden
      layers.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 }));

      if (reducedMotion) {
        for (const ref of Object.values(refs)) {
          if (ref.current) gsap.set(ref.current, { autoAlpha: 1, y: 0, scale: 1 });
        }
        return;
      }

      // Entrance sequence
      const tl = gsap.timeline();
      for (const step of landingHeroGridSequence.steps) {
        const el = refs[step.target]?.current;
        if (!el) continue;
        gsap.set(el, step.from);
        tl.fromTo(el, { ...step.from }, { ...step.to }, step.position);
      }

      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          yPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Ken Burns + scroll parallax on container (same as before)
      if (bgContainerRef.current) {
        gsap.fromTo(
          bgContainerRef.current,
          landingHeroParallax.kenBurns.from,
          { ...landingHeroParallax.kenBurns.to, delay: landingHeroParallax.kenBurns.delay },
        );

        const container = bgContainerRef.current;
        gsap.to(container, {
          ...landingHeroParallax.scroll.to,
          scrollTrigger: {
            trigger: sectionRef.current,
            ...landingHeroParallax.scroll.scrollTrigger,
            onEnter: () => { container.style.willChange = "transform"; },
            onLeave: () => { container.style.willChange = "auto"; },
            onEnterBack: () => { container.style.willChange = "transform"; },
            onLeaveBack: () => { container.style.willChange = "auto"; },
          },
        });
      }

      // Crossfade cycle — simple opacity swap between stacked images
      if (layers.length > 1) {
        const crossfade = gsap.timeline({ repeat: -1, delay: 3 });

        for (let i = 0; i < layers.length; i++) {
          const pos = i * 4;
          crossfade.to(layers[i], { autoAlpha: 0, duration: 1, ease: "power1.inOut" }, pos + 3);
          crossfade.to(layers[(i + 1) % layers.length], { autoAlpha: 1, duration: 1, ease: "power1.inOut" }, pos + 3);
        }
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-background">
      <div className="grain-medium absolute inset-0 z-[2]" aria-hidden="true" />
      <div className="relative min-h-screen grid grid-cols-1 md:grid-cols-[44%_56%]">
        {/* Left column — image */}
        <div className="relative row-start-1 col-start-1 overflow-hidden min-h-[60vh] md:min-h-0">
          <div ref={bgContainerRef} className="absolute inset-0">
            {content.mediaCycle.map((media, index) => (
              <div
                key={`${media.asset._ref}-${index}`}
                ref={(el) => { imageLayerRefs.current[index] = el; }}
                className="absolute inset-0"
                style={{ visibility: "hidden" }}
              >
                <SiteMedia
                  src={resolveImageUrl(media)}
                  alt={media.alt ?? ""}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 44vw"
                />
              </div>
            ))}
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, transparent 60%, var(--color-background) 100%), linear-gradient(to bottom, var(--color-background) 0%, transparent 15%, transparent 60%, var(--color-background) 100%)",
              }}
            />
          </div>
        </div>

        {/* Right column — content */}
        <div className="relative row-start-2 md:row-start-1 md:col-start-2 flex flex-col justify-center items-center text-center md:items-start md:text-left px-6 md:px-12 py-12 md:py-0 md:pt-[8vh] md:border-l md:border-white/5">
          <span
            ref={eyebrowRef}
            className="font-label-serif text-[11px] tracking-[0.35em] uppercase mb-5 text-hero-gold"
          >
            {content.eyebrow}
          </span>

          <h1
            ref={headlineRef}
            className="font-headline-serif font-bold leading-[0.95] tracking-tight mb-12"
          >
            <span className="block text-[clamp(2.5rem,9vw,8rem)] text-text">
              {content.titleLine1}
            </span>
            <span className="block text-[clamp(2.5rem,9vw,8rem)] text-hero-gold">
              {content.titleLine2}
            </span>
          </h1>

          <p
            ref={descRef}
            className="font-headline-serif font-normal text-[clamp(1.1rem,1.8vw,1.4rem)] leading-relaxed max-w-[340px] mx-auto md:mx-0 mb-12 text-hero-muted"
          >
            {content.description}
          </p>
        </div>
      </div>
    </section>
  );
}
