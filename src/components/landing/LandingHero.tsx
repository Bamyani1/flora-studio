"use client";

import { useCallback, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import {
  landingHeroEditorialSequence,
  landingHeroParallax,
  scrollIndicatorPulse,
} from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SiteMedia } from "@/components/ui/SiteMedia";
import { resolveImageUrl } from "@/lib/image-url";
import type { HomeHeroContent } from "@/types/content";

const IMAGE_LOAD_TIMEOUT_MS = 3000;

interface LandingHeroProps {
  content: HomeHeroContent;
  blurDataURL?: string;
}

export function LandingHero({ content, blurDataURL }: LandingHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgContainerRef = useRef<HTMLDivElement>(null);
  const imageLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  // Image-load gating: entrance + Ken Burns wait for first image, crossfade waits for all
  const loadedCountRef = useRef(0);
  const entranceTlRef = useRef<gsap.core.Timeline | null>(null);
  const kenBurnsTweenRef = useRef<gsap.core.Tween | null>(null);
  const crossfadeTlRef = useRef<gsap.core.Timeline | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalImages = content.mediaCycle.length;
  const reducedMotion = useReducedMotion();

  const playEntrance = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    entranceTlRef.current?.play();
    kenBurnsTweenRef.current?.play();
  }, []);

  const handleImageLoad = useCallback(() => {
    loadedCountRef.current++;
    if (loadedCountRef.current === 1) playEntrance();
    if (loadedCountRef.current >= totalImages) crossfadeTlRef.current?.play();
  }, [totalImages, playEntrance]);

  useGSAP(
    () => {
      const refs: Record<string, React.RefObject<HTMLElement | null>> = {
        bgImage: bgContainerRef,
        vignette: vignetteRef,
        frameLine: frameRef,
        headlineLine1: line1Ref,
        headlineLine2: line2Ref,
        description: descRef,
        scrollCue: scrollCueRef,
      };

      const layers = imageLayerRefs.current.filter(Boolean) as HTMLElement[];

      // First image visible, rest hidden
      layers.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 }));

      if (reducedMotion) {
        for (const ref of Object.values(refs)) {
          if (ref.current) gsap.set(ref.current, { autoAlpha: 1, y: 0, x: 0, scale: 1 });
        }
        return;
      }

      // Entrance sequence — paused until first image loads
      const tl = gsap.timeline({ paused: true });
      for (const step of landingHeroEditorialSequence.steps) {
        const el = refs[step.target]?.current;
        if (!el) continue;
        gsap.set(el, step.from);
        tl.fromTo(el, { ...step.from }, { ...step.to }, step.position);
      }
      entranceTlRef.current = tl;

      // Headline parallax (gentle) — scroll-driven, set up immediately
      if (line1Ref.current && line2Ref.current) {
        gsap.to([line1Ref.current, line2Ref.current], {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Frame lines subtle parallax
      if (frameRef.current) {
        gsap.to(frameRef.current, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Ken Burns — paused until first image loads
      if (bgContainerRef.current) {
        kenBurnsTweenRef.current = gsap.fromTo(
          bgContainerRef.current,
          landingHeroParallax.kenBurns.from,
          {
            ...landingHeroParallax.kenBurns.to,
            delay: landingHeroParallax.kenBurns.delay,
            paused: true,
          },
        );

        // Scroll parallax — set up immediately (scroll-driven)
        const container = bgContainerRef.current;
        gsap.to(container, {
          ...landingHeroParallax.scroll.to,
          scrollTrigger: {
            trigger: sectionRef.current,
            ...landingHeroParallax.scroll.scrollTrigger,
            onEnter: () => {
              container.style.willChange = "transform";
            },
            onLeave: () => {
              container.style.willChange = "auto";
            },
            onEnterBack: () => {
              container.style.willChange = "transform";
            },
            onLeaveBack: () => {
              container.style.willChange = "auto";
            },
          },
        });
      }

      // Scroll indicator pulse
      if (scrollLineRef.current) {
        gsap.fromTo(scrollLineRef.current, scrollIndicatorPulse.line.from, {
          ...scrollIndicatorPulse.line.to,
        });
      }

      // Fade out scroll cue on scroll
      if (scrollCueRef.current) {
        gsap.to(scrollCueRef.current, {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "15% top",
            scrub: true,
          },
        });
      }

      // Crossfade cycle — paused until all images loaded
      if (layers.length > 1) {
        const hold = 6;
        const fade = 1.5;
        const interval = hold + fade;
        const crossfade = gsap.timeline({ repeat: -1, paused: true });

        for (let i = 0; i < layers.length; i++) {
          const pos = i * interval;
          crossfade.to(
            layers[i],
            {
              autoAlpha: 0,
              duration: fade,
              ease: "power1.inOut",
            },
            pos + hold,
          );
          crossfade.to(
            layers[(i + 1) % layers.length],
            {
              autoAlpha: 1,
              duration: fade,
              ease: "power1.inOut",
            },
            pos + hold,
          );
        }
        crossfadeTlRef.current = crossfade;
      }

      // Timeout fallback: play entrance after 3s even if first image hasn't loaded
      fallbackTimerRef.current = setTimeout(() => {
        if (entranceTlRef.current?.paused()) playEntrance();
      }, IMAGE_LOAD_TIMEOUT_MS);

      return () => {
        if (fallbackTimerRef.current) {
          clearTimeout(fallbackTimerRef.current);
          fallbackTimerRef.current = null;
        }
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion, playEntrance] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative mt-[5rem] min-h-[calc(100vh-5rem)] overflow-hidden bg-background"
    >
      {/* Grain overlay */}
      <div className="grain-medium absolute inset-0 z-grain opacity-[0.02]" aria-hidden="true" />

      {/* Full-bleed image */}
      <div ref={bgContainerRef} className="absolute inset-0">
        {content.mediaCycle.map((media, index) => (
          <div
            key={`${media.asset._ref}-${index}`}
            ref={(el) => {
              imageLayerRefs.current[index] = el;
            }}
            className="absolute inset-0"
            style={{ visibility: "hidden" }}
          >
            <SiteMedia
              src={resolveImageUrl(media)}
              alt={media.alt ?? ""}
              fill
              className="object-cover"
              style={{ objectPosition: media.objectPosition ?? "center top" }}
              priority={index === 0}
              loading={index === 0 ? undefined : "eager"}
              quality={90}
              sizes="100vw"
              blurDataURL={index === 0 ? blurDataURL : undefined}
              onLoad={handleImageLoad}
            />
          </div>
        ))}
      </div>

      {/* Vignette overlay */}
      <div
        ref={vignetteRef}
        data-animate
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 20%, rgba(22,26,18,0.65) 100%)",
        }}
      />

      {/* Bottom gradient for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to top, var(--color-background) 0%, rgba(22,26,18,0.75) 25%, transparent 55%)",
        }}
      />

      {/* Stronger bottom gradient on mobile */}
      <div
        className="absolute inset-0 pointer-events-none md:hidden"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to top, var(--color-background) 5%, rgba(22,26,18,0.7) 40%, transparent 65%)",
        }}
      />

      {/* Frame lines ref kept for GSAP parallax */}
      <div ref={frameRef} className="hidden" aria-hidden="true" />

      {/* Content overlay — bottom-left, ultra-minimal */}
      <div className="absolute inset-0 z-content flex flex-row items-end gap-3 px-6 md:px-[clamp(2rem,5vw,5rem)] pb-[clamp(3rem,6vh,6rem)]">
        {/* Accent bar */}
        <div
          className="w-px h-[clamp(1rem,2.5vw,2rem)] mb-1 shrink-0"
          style={{ background: "linear-gradient(to top, rgba(224,148,56,0.35), transparent)" }}
          aria-hidden="true"
        />

        <div className="flex flex-col text-shadow-hero">
          <h1 className="font-display font-light leading-[1.2] tracking-[0.04em] text-[clamp(0.9rem,2vw,1.8rem)] text-white/65 mb-1">
            <span ref={line1Ref} data-animate>
              {content.titleLine1}{" "}
            </span>
            <span ref={line2Ref} data-animate className="text-hero-gold/55 italic">
              {content.titleLine2}
            </span>
          </h1>

          <p
            ref={descRef}
            data-animate
            className="font-body font-light text-[clamp(0.4rem,0.5vw,0.5rem)] uppercase tracking-[0.25em] text-hero-muted/25"
          >
            {content.description}
          </p>
        </div>
      </div>

      {/* Scroll indicator — bottom-center */}
      <div
        ref={scrollCueRef}
        data-animate
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-content hidden md:flex"
        aria-hidden="true"
      >
        <span className="font-label text-[9px] tracking-[0.4em] uppercase text-white/25">
          Scroll
        </span>
        <div ref={scrollLineRef} className="w-px h-8 bg-white/15 origin-top" />
      </div>
    </section>
  );
}
