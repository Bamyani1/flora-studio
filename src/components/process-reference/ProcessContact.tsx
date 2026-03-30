"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProcessMagnetic } from "./ProcessMagnetic";

export function ProcessContact({
  heading,
  buttonHref,
  buttonLabel,
}: {
  heading: string;
  buttonHref: string;
  buttonLabel: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const elements = sectionRef.current.querySelectorAll("[data-contact-animate]");

      if (reduced) {
        gsap.set(elements, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        elements,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ...withWillChange(),
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex min-h-[50vh] flex-col items-center justify-center bg-[var(--process-surface-container-lowest)] px-8 py-32"
      style={{ scrollMarginTop: "calc(var(--header-height) + var(--space-12))" }}
    >
      <div className="grain-medium absolute inset-0 z-[2]" aria-hidden="true" />
      <h2
        data-contact-animate
        className="mb-10 font-display text-5xl font-light italic text-[var(--process-on-surface-variant)] md:text-6xl"
      >
        {heading}
      </h2>
      <ProcessMagnetic>
        <Link
          href={buttonHref}
          data-contact-animate
          className="inline-block bg-[var(--process-primary)] px-12 py-4 font-label text-[11px] uppercase tracking-[0.2em] text-[var(--process-on-primary)]"
        >
          {buttonLabel}
        </Link>
      </ProcessMagnetic>
    </section>
  );
}
