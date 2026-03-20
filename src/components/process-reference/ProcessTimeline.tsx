"use client";

import Link from "next/link";
import { m } from "motion/react";
import styles from "./process-reference.module.css";
import type { ProcessStep } from "./types";
import { ProcessMagnetic } from "./ProcessMagnetic";
import { ProcessParallaxImage } from "./ProcessParallaxImage";

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <section
      id="process"
      className="overflow-hidden bg-[var(--process-surface)] py-32"
      style={{ scrollMarginTop: "calc(var(--header-height) + var(--space-12))" }}
    >
      <div className="mx-auto max-w-[1440px] px-8 md:px-16">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-32 text-center"
        >
          <h2 className="mb-6 font-display text-4xl font-light tracking-tight text-[var(--process-on-surface)] md:text-6xl">
            The Process
          </h2>
          <p className="mx-auto max-w-2xl font-body leading-relaxed text-[rgba(209,197,180,0.7)]">
            Every image begins long before the shutter opens. The method is a dialogue between
            light, timing, and atmosphere, shaped deliberately so the final frame feels inevitable.
          </p>
        </m.div>

        <div className={styles.timelineRule}>
          {steps.map((step) => (
            <div
              key={step.id}
              className={`relative mb-48 flex flex-col items-center last:mb-0 md:flex-row ${
                step.align === "right" ? "md:flex-row-reverse" : ""
              }`}
            >
              <m.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                    },
                  },
                }}
                className={`group mb-8 w-full md:mb-0 md:w-1/2 ${
                  step.align === "left" ? "text-left md:pr-24 md:text-right" : "md:pl-24"
                }`}
              >
                <m.h3
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                  }}
                  className="mb-4 font-display text-3xl text-[var(--process-primary)] transition-all duration-500 group-hover:tracking-wider"
                >
                  {step.title}
                </m.h3>
                <m.p
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                  }}
                  className={`max-w-md font-body leading-relaxed text-[var(--process-on-surface-variant)] ${
                    step.align === "left" ? "md:ml-auto" : ""
                  }`}
                >
                  {step.description}
                </m.p>

                {step.meta && (
                  <m.span
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                    }}
                    className="mt-6 block font-label text-[10px] uppercase tracking-[0.3em] text-[rgba(209,197,180,0.55)]"
                  >
                    {step.meta}
                  </m.span>
                )}

                {step.metaList && (
                  <m.ul
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                    }}
                    className="mt-6 space-y-3 font-label text-[10px] uppercase tracking-widest text-[rgba(209,197,180,0.75)]"
                  >
                    {step.metaList.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="h-[1px] w-1.5 bg-[var(--process-primary)]" /> {item}
                      </li>
                    ))}
                  </m.ul>
                )}

                {step.action && (
                  <m.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                    }}
                    className="mt-8 inline-block"
                  >
                    <ProcessMagnetic>
                      <Link
                        href={step.action.href}
                        className="inline-flex border border-[rgba(78,70,57,0.45)] px-8 py-3 font-label text-[10px] uppercase tracking-widest text-[var(--process-on-surface)] transition-all hover:border-[var(--process-primary)] hover:text-[var(--process-primary)]"
                      >
                        {step.action.label}
                      </Link>
                    </ProcessMagnetic>
                  </m.div>
                )}
              </m.div>

              <div className="absolute left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center justify-center md:flex">
                <m.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="flex h-12 w-12 items-center justify-center border border-[rgba(233,193,118,0.2)] bg-[var(--process-surface-container)] backdrop-blur-md"
                >
                  <span className="font-display text-xl italic text-[var(--process-primary)]">
                    {step.id}
                  </span>
                </m.div>
              </div>

              <m.div
                initial={{ opacity: 0, x: step.align === "left" ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={`w-full md:w-1/2 ${step.align === "left" ? "md:pl-24" : "md:pr-24"}`}
              >
                {step.layout === "grid" ? (
                  <div className="grid grid-cols-2 gap-4">
                    {step.images.map((image) => (
                      <div
                        key={image.src}
                        className="group relative aspect-square overflow-hidden rounded"
                      >
                        <ProcessParallaxImage
                          src={image.src}
                          alt={image.alt}
                          blurDataURL={image.blurDataURL}
                          className="h-full w-full"
                          imageClassName="grayscale transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0"
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
                            ? "aspect-video"
                            : "aspect-[21/9]"
                      }`}
                    >
                      <ProcessParallaxImage
                        src={step.images[0].src}
                        alt={step.images[0].alt}
                        blurDataURL={step.images[0].blurDataURL}
                        className="h-full w-full"
                        imageClassName="grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-black/20 transition-colors duration-700 group-hover:bg-transparent" />
                    </div>
                  </div>
                )}
              </m.div>

              <div
                className={`absolute top-0 md:hidden ${
                  step.align === "left" ? "left-0" : "right-0"
                } -translate-y-full bg-[var(--process-primary)] px-3 py-1`}
              >
                <span className="font-display text-sm italic text-[var(--process-on-primary)]">
                  {step.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
