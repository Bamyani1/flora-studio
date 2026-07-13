"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { textRevealLines, textRevealWords, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TextRevealProps {
  children: React.ReactNode;
  variant?: "lines" | "words";
  stagger?: number;
  delay?: number;
  scrub?: boolean;
  /** Play on mount instead of a scroll trigger — for text that must be
      visible at rest (hero titles) regardless of viewport height */
  immediate?: boolean;
  className?: string;
  as?: React.ElementType;
}

export function TextReveal({
  children,
  variant = "lines",
  stagger,
  delay,
  scrub = false,
  immediate = false,
  className,
  as: Tag = "div",
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;

      if (reduced) {
        gsap.set(ref.current, { autoAlpha: 1 });
        return;
      }

      // Clear the CSS [data-animate] opacity — the split animation moves the
      // lines/words, so the container itself must be visible for any of it to show
      gsap.set(ref.current, { autoAlpha: 1 });

      if (variant === "lines") {
        const split = new SplitText(ref.current, textRevealLines.splitConfig);

        gsap.fromTo(split.lines, textRevealLines.from, {
          ...textRevealLines.to,
          ...withWillChange(),
          ...(stagger !== undefined && { stagger }),
          ...(delay !== undefined && { delay }),
          ...(!immediate && {
            scrollTrigger: {
              trigger: ref.current,
              ...textRevealLines.scrollTrigger,
            },
          }),
        });

        return () => split.revert();
      }

      // Words variant
      const split = new SplitText(ref.current, textRevealWords.splitConfig);

      gsap.fromTo(split.words, textRevealWords.from, {
        ...textRevealWords.to,
        ...withWillChange("opacity"),
        ...(stagger !== undefined && { stagger }),
        ...(delay !== undefined && { delay }),
        ...(!immediate && {
          scrollTrigger: {
            trigger: ref.current,
            ...textRevealWords.scrollTrigger,
            ...(scrub && { scrub: true }),
          },
        }),
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [reduced, variant, stagger, delay, scrub, immediate] },
  );

  return (
    <Tag ref={ref} data-animate className={className}>
      {children}
    </Tag>
  );
}
