"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { timelinePhaseReveal, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";
import styles from "./process-reference.module.css";
import type { ProcessStep } from "./types";
import { ProcessMagnetic } from "./ProcessMagnetic";
import { ProcessParallaxImage } from "./ProcessParallaxImage";

interface ProcessTimelineProps {
  title: string;
  description: string;
  steps: ProcessStep[];
}

export function ProcessTimeline({ title, description, steps }: ProcessTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      if (reduced) {
        const allElements = sectionRef.current.querySelectorAll("[data-timeline-animate]");
        gsap.set(allElements, { autoAlpha: 1, y: 0, x: 0, scale: 1 });
        return;
      }

      // Header entrance
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ...withWillChange(),
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Per-step animations
      const stepElements = sectionRef.current.querySelectorAll("[data-step]");
      stepElements.forEach((stepEl) => {
        const textChildren = stepEl.querySelectorAll("[data-step-text]");
        const badge = stepEl.querySelector("[data-step-badge]");
        const imageBlock = stepEl.querySelector("[data-step-image]");

        // Text children: staggered fade+rise
        if (textChildren.length > 0) {
          gsap.fromTo(textChildren, timelinePhaseReveal.textChild.from, {
            ...timelinePhaseReveal.textChild.to,
            stagger: timelinePhaseReveal.textStagger,
            ...withWillChange(),
            scrollTrigger: {
              trigger: stepEl,
              ...timelinePhaseReveal.scrollTrigger,
            },
          });
        }

        // Badge: elastic scale entrance
        if (badge) {
          gsap.fromTo(badge, timelinePhaseReveal.badge.from, {
            ...timelinePhaseReveal.badge.to,
            ...withWillChange(),
            scrollTrigger: {
              trigger: stepEl,
              ...timelinePhaseReveal.scrollTrigger,
            },
          });
        }

        // Image: directional slide
        if (imageBlock) {
          const align = stepEl.getAttribute("data-step-align");
          const imagePreset =
            align === "left" ? timelinePhaseReveal.image : timelinePhaseReveal.imageReverse;

          gsap.fromTo(imageBlock, imagePreset.from, {
            ...imagePreset.to,
            delay: 0.2,
            ...withWillChange(),
            scrollTrigger: {
              trigger: stepEl,
              ...timelinePhaseReveal.scrollTrigger,
            },
          });
        }
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  const stepTotal = String(steps.length).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      id="process"
      className="overflow-hidden bg-[var(--process-surface)] py-20 md:py-32"
      style={{ scrollMarginTop: "calc(var(--header-height) + var(--space-12))" }}
    >
      <div className="mx-auto max-w-[1440px] px-8 md:px-16">
        <div ref={headerRef} data-timeline-animate className="mb-16 text-center md:mb-24">
          <h2 className="mb-6 font-display text-4xl font-light tracking-tight text-[var(--process-on-surface)] md:text-6xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl font-body leading-relaxed text-on-surface-variant/90">
            {description}
          </p>
        </div>

        <div className={styles.timelineRule}>
          {steps.map((step) => {
            // meta and metaList carry the same kind of content — render them identically
            const metaItems = step.metaList ?? (step.meta ? [step.meta] : undefined);
            return (
            <div
              key={step.id}
              data-step
              data-step-align={step.align}
              className={`relative mb-20 lg:mb-28 flex flex-col items-start last:mb-0 lg:flex-row ${
                step.align === "right" ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div
                className={`group mb-8 w-full lg:mb-0 lg:w-1/2 ${
                  step.align === "left" ? "text-left lg:pr-24 lg:text-right" : "lg:pl-24"
                }`}
              >
                <h3
                  data-step-text
                  data-timeline-animate
                  className="mb-4 font-display text-3xl text-[var(--process-primary)] transition-all duration-500 group-hover:tracking-wider"
                >
                  {step.title}
                </h3>
                <p
                  data-step-text
                  data-timeline-animate
                  className={`max-w-md font-body leading-relaxed text-[var(--process-on-surface-variant)] ${
                    step.align === "left" ? "lg:ml-auto" : ""
                  }`}
                >
                  {step.description}
                </p>

                {metaItems && (
                  <ul
                    data-step-text
                    data-timeline-animate
                    className="mt-6 space-y-3 eyebrow text-on-surface-variant/90"
                  >
                    {metaItems.map((item) => (
                      <li
                        key={item}
                        className={`flex items-center gap-3 ${
                          step.align === "left" ? "lg:justify-end" : ""
                        }`}
                      >
                        <span className="h-[1px] w-1.5 bg-[var(--process-primary)]" /> {item}
                      </li>
                    ))}
                  </ul>
                )}

                {step.action && (
                  <div data-step-text data-timeline-animate className="mt-8 inline-block">
                    <ProcessMagnetic>
                      <Button
                        as={Link}
                        href={step.action.href}
                        variant="outline-accent"
                        size="xs"
                      >
                        {step.action.label}
                      </Button>
                    </ProcessMagnetic>
                  </div>
                )}
              </div>

              <div className="absolute left-1/2 top-2 z-10 hidden -translate-x-1/2 flex-col items-center justify-center lg:flex">
                <div
                  data-step-badge
                  data-timeline-animate
                  className="flex h-12 min-w-12 items-center justify-center border border-primary/20 bg-[var(--process-surface-container)] px-2 backdrop-blur-md"
                >
                  {/* Lining Inter figures — italic serif digits misread ("01" → "OI"),
                      and bone clears AA where 20px ember measured 3.8:1. The
                      "NN / NN" form ties the timeline into the site-wide grammar. */}
                  <span className="whitespace-nowrap font-label text-base tabular-nums tracking-[0.15em] text-text">
                    {step.id}
                    <span className="text-[var(--process-primary)]"> / {stepTotal}</span>
                  </span>
                </div>
              </div>

              <div
                data-step-image
                data-timeline-animate
                className={`w-full lg:w-1/2 ${step.align === "left" ? "lg:pl-24" : "lg:pr-24"}`}
              >
                {step.layout === "grid" ? (
                  <div className="grid grid-cols-2 gap-4">
                    {step.images.map((img) => (
                      <div
                        key={`${step.id}-${img.alt}`}
                        className="group relative aspect-square overflow-hidden rounded"
                      >
                        <ProcessParallaxImage
                          src={img.src}
                          alt={img.alt}
                          className="h-full w-full"
                          imageClassName="transition-transform duration-1000 can-hover:group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`group relative overflow-hidden rounded ${
                      step.layout === "bordered"
                        ? "border border-white/5 bg-[var(--process-surface-container-low)] p-2"
                        : ""
                    }`}
                  >
                    <div
                      className={`relative w-full overflow-hidden rounded ${
                        step.layout === "single"
                          ? "aspect-[4/3]"
                          : step.layout === "bordered"
                            ? "aspect-[4/3] md:aspect-video"
                            : "aspect-[3/2] md:aspect-[21/9]"
                      }`}
                    >
                      <ProcessParallaxImage
                        src={step.images[0].src}
                        alt={step.images[0].alt}
                        className="h-full w-full"
                        imageClassName="transition-transform duration-1000 can-hover:group-hover:scale-105"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute right-0 top-0 -translate-y-full bg-[var(--process-primary)] px-3 py-1 lg:hidden">
                <span className="whitespace-nowrap font-label text-base tabular-nums tracking-[0.1em] text-[var(--process-on-primary)]">
                  {step.id} / {stepTotal}
                </span>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
