"use client";

import { m } from "motion/react";
import type { ProcessImage } from "./types";
import { ProcessContactForm } from "./ProcessContactForm";
import { ProcessParallaxImage } from "./ProcessParallaxImage";

interface ProcessContactProps {
  portrait: ProcessImage;
  quote: string;
}

export function ProcessContact({ portrait, quote }: ProcessContactProps) {
  return (
    <section
      id="contact"
      className="flex min-h-screen flex-col items-stretch bg-[var(--process-surface-container-lowest)] md:flex-row"
      style={{ scrollMarginTop: "calc(var(--header-height) + var(--space-12))" }}
    >
      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative h-[50vh] w-full overflow-hidden md:h-screen md:w-1/2"
      >
        <ProcessParallaxImage
          src={portrait.src}
          alt={portrait.alt}
          blurDataURL={portrait.blurDataURL}
          className="absolute inset-0 h-full w-full"
          imageClassName="grayscale contrast-125"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--process-surface-container-lowest)] via-transparent to-transparent" />
      </m.div>

      <div className="flex w-full flex-col justify-center bg-[var(--process-surface-container-lowest)] p-8 md:w-1/2 md:p-24">
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.2,
              },
            },
          }}
          className="max-w-md"
        >
          <m.span
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
            }}
            className="mb-4 block font-label text-[10px] uppercase tracking-[0.3em] text-[var(--process-primary)]"
          >
            The Visionary
          </m.span>
          <m.h2
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 1 } },
            }}
            className="mb-8 font-display text-5xl font-light italic text-[var(--process-on-surface-variant)] md:text-6xl"
          >
            Direct Dialogue
          </m.h2>
          <m.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 1 } },
            }}
            className="mb-12 font-body leading-relaxed text-neutral-400"
          >
            {quote}
          </m.p>
          <m.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 1 } },
            }}
          >
            <ProcessContactForm />
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
