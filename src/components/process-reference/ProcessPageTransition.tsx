"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { blurReveal, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ProcessPageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;

      if (reduced) {
        gsap.set(ref.current, { autoAlpha: 1, filter: "none" });
        return;
      }

      // clearProps: a lingering filter (even blur(0px)) keeps the whole page on one
      // composited layer that every parallax/scrub trigger repaints through
      gsap.fromTo(ref.current, blurReveal.from, {
        ...blurReveal.to,
        ...withWillChange("opacity, filter"),
        clearProps: "filter",
      });
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <div ref={ref} data-animate>
      {children}
    </div>
  );
}
