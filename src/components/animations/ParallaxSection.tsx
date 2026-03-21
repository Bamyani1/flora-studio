"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { parallaxLayer } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxSection({
  children,
  speed = 0.15,
  className,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current || reduced) return;

      const preset = parallaxLayer(speed);

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.to(ref.current, {
          ...preset.to,
          scrollTrigger: {
            trigger: ref.current,
            ...preset.scrollTrigger,
          },
        });
      });
    },
    { scope: ref, dependencies: [reduced, speed] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
