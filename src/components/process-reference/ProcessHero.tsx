"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import styles from "./process-reference.module.css";
import type { ProcessImage } from "./types";
import { ProcessMagnetic } from "./ProcessMagnetic";

interface ProcessHeroProps {
  image: ProcessImage;
}

export function ProcessHero({ image }: ProcessHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "50%"],
  );
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      <m.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <m.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="relative h-full w-full"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            className="object-cover grayscale brightness-50"
            placeholder={image.blurDataURL ? "blur" : undefined}
            blurDataURL={image.blurDataURL ?? undefined}
            sizes="100vw"
          />
        </m.div>
      </m.div>

      <div className={`pointer-events-none absolute inset-0 z-0 ${styles.cinematicVignette}`} />

      <m.div
        initial="hidden"
        animate="visible"
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
        className="relative z-10 px-4 text-center"
      >
        <m.span
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
          }}
          className="mb-6 block font-label text-xs uppercase tracking-[0.4em] text-[var(--process-primary)]"
        >
          Silk Road Studio Process
        </m.span>
        <m.h1
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 1 } },
          }}
          className="mx-auto max-w-5xl font-display text-5xl font-light leading-none tracking-tight text-[var(--process-on-surface-variant)] md:text-8xl"
        >
          The Film Still: <br />
          <span className="italic font-light">A Narrative Pursuit</span>
        </m.h1>
        <m.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 1 } },
          }}
          className="mt-12 flex items-center justify-center gap-8"
        >
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[var(--process-outline-variant)] to-transparent" />
          <ProcessMagnetic>
            <m.a
              href="#process"
              onClick={(event) => {
                event.preventDefault();
                document
                  .getElementById("process")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              animate={prefersReducedMotion ? undefined : { y: [0, 10, 0] }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : { repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }
              }
              className="interactive cursor-pointer"
            >
              <ChevronDown className="h-8 w-8 text-[var(--process-primary)]" />
            </m.a>
          </ProcessMagnetic>
          <div className="h-[1px] w-24 bg-gradient-to-r from-[var(--process-outline-variant)] via-[var(--process-outline-variant)] to-transparent" />
        </m.div>
      </m.div>
    </section>
  );
}
