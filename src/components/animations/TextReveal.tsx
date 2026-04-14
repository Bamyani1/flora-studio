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
  className?: string;
  as?: React.ElementType;
}

export function TextReveal({
  children,
  variant = "lines",
  stagger,
  delay,
  scrub = false,
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

      if (variant === "lines") {
        const split = new SplitText(ref.current, textRevealLines.splitConfig);

        gsap.fromTo(split.lines, textRevealLines.from, {
          ...textRevealLines.to,
          ...withWillChange(),
          ...(stagger !== undefined && { stagger }),
          ...(delay !== undefined && { delay }),
          scrollTrigger: {
            trigger: ref.current,
            ...textRevealLines.scrollTrigger,
          },
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
        scrollTrigger: {
          trigger: ref.current,
          ...textRevealWords.scrollTrigger,
          ...(scrub && { scrub: true }),
        },
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [reduced, variant, stagger, delay, scrub] },
  );

  return (
    <Tag ref={ref} data-animate className={className}>
      {children}
    </Tag>
  );
}
