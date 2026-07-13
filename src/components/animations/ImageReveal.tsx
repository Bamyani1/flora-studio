"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { imageReveal, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
}

// Darkroom reveal: the photograph resolves up from near-black like a print
// developing. (This replaced an ember panel wipe — a colored blade sweeping
// across the frame put UI chrome in front of the photograph.)
export function ImageReveal({ children, className }: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!containerRef.current || !imageWrapRef.current) return;

      // Clear CSS [data-animate] opacity on the container — children handle their own animation
      gsap.set(containerRef.current, { autoAlpha: 1 });

      if (reduced) {
        gsap.set(imageWrapRef.current, { autoAlpha: 1, scale: 1, filter: "none" });
        return;
      }

      gsap.fromTo(imageWrapRef.current, imageReveal.image.from, {
        ...imageReveal.image.to,
        ...withWillChange("opacity, filter, transform"),
        scrollTrigger: {
          trigger: containerRef.current,
          ...imageReveal.scrollTrigger,
        },
      });
    },
    { scope: containerRef, dependencies: [reduced] },
  );

  return (
    <div ref={containerRef} data-animate className={`overflow-hidden ${className ?? ""}`}>
      <div ref={imageWrapRef} className="relative h-full w-full">
        {children}
      </div>
    </div>
  );
}
