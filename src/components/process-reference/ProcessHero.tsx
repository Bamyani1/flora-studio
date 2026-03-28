"use client";

import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./process-reference.module.css";
import type { ProcessImage } from "./types";
import { ProcessMagnetic } from "./ProcessMagnetic";
import { SiteMedia } from "@/components/ui/SiteMedia";

interface ProcessHeroProps {
  image: ProcessImage;
}

export function ProcessHero({ image }: ProcessHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current || !bgRef.current || !imageWrapperRef.current || !contentRef.current)
        return;

      if (reduced) {
        gsap.set([bgRef.current, contentRef.current], { autoAlpha: 1 });
        gsap.set(imageWrapperRef.current, { scale: 1 });
        return;
      }

      // Parallax: scroll-linked y + opacity fade on background (single ScrollTrigger to prevent desync)
      gsap.to(bgRef.current, {
        yPercent: 50,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onEnter: () => {
            if (bgRef.current) bgRef.current.style.willChange = "transform, opacity";
          },
          onLeave: () => {
            if (bgRef.current) bgRef.current.style.willChange = "auto";
          },
          onEnterBack: () => {
            if (bgRef.current) bgRef.current.style.willChange = "transform, opacity";
          },
          onLeaveBack: () => {
            if (bgRef.current) bgRef.current.style.willChange = "auto";
          },
        },
      });

      // Image scale entrance
      gsap.from(imageWrapperRef.current, {
        scale: 1.1,
        duration: 2,
        ease: "power2.out",
      });

      // Staggered text content entrance
      const children = contentRef.current.querySelectorAll("[data-hero-child]");
      const tl = gsap.timeline({ ...withWillChange(), delay: 0.2 });

      tl.fromTo(
        children,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" },
      );

      // Bouncing chevron
      if (chevronRef.current) {
        gsap.to(chevronRef.current, {
          y: 16,
          duration: 0.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      <div ref={bgRef} className="absolute inset-0 z-0">
        <div ref={imageWrapperRef} className="relative h-full w-full">
          <SiteMedia
            src={image.src}
            alt={image.alt}
            fill
            priority
            className="object-cover grayscale brightness-[0.35]"
            sizes="100vw"
          />
        </div>
      </div>

      <div className={`pointer-events-none absolute inset-0 z-0 ${styles.cinematicVignette}`} />

      <div ref={contentRef} className="relative z-10 px-4 text-center">
        <h1
          data-hero-child
          className="mx-auto max-w-5xl font-display text-5xl font-light leading-none tracking-tight text-[var(--process-on-surface-variant)] md:text-8xl"
        >
          Our Process: <br />
          <span className="italic font-light">Frame by Frame</span>
        </h1>
        <div data-hero-child className="mt-12 flex items-center justify-center gap-8">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[var(--process-outline-variant)] to-transparent" />
          <ProcessMagnetic>
            <a
              ref={chevronRef}
              href="#process"
              onClick={(event) => {
                event.preventDefault();
                document
                  .getElementById("process")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="interactive cursor-pointer flex items-center justify-center"
            >
              <ChevronDown className="h-6 w-6 text-[var(--process-primary)]" />
            </a>
          </ProcessMagnetic>
          <div className="h-[1px] w-24 bg-gradient-to-r from-[var(--process-outline-variant)] via-[var(--process-outline-variant)] to-transparent" />
        </div>
      </div>
    </section>
  );
}
