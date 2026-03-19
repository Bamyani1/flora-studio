"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { fadeUp } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  as?: React.ElementType;
}

export function FadeIn({
  children,
  delay = 0,
  duration,
  y,
  className,
  as: Tag = "div",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;

      if (reduced) {
        gsap.set(ref.current, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        ref.current,
        { ...fadeUp.from, ...(y !== undefined && { y }) },
        {
          ...fadeUp.to,
          ...(duration !== undefined && { duration }),
          ...(y !== undefined && { y: 0 }),
          delay,
          scrollTrigger: {
            trigger: ref.current,
            ...fadeUp.scrollTrigger,
          },
        },
      );
    },
    { scope: ref, dependencies: [reduced, delay, duration, y] },
  );

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ opacity: 0, visibility: "hidden" }}
    >
      {children}
    </Tag>
  );
}
