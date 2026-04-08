"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { landingWordReveal, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function RevealText({ text, className = "", delay = 0 }: RevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (reduced) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }

      const split = new SplitText(el, landingWordReveal.splitConfig);

      gsap.set(el, { autoAlpha: 1 }); // Clear CSS [data-animate] opacity; words handle their own visibility
      gsap.set(split.words, { yPercent: 120, rotation: 4, autoAlpha: 0 });

      gsap.to(split.words, {
        ...landingWordReveal.to,
        delay,
        scrollTrigger: {
          trigger: el,
          ...landingWordReveal.scrollTrigger,
        },
        ...withWillChange(),
      });

      return () => {
        split.revert();
      };
    },
    { scope: ref, dependencies: [reduced, delay] },
  );

  return (
    <span ref={ref} data-animate className={`inline-block ${className}`}>
      {text}
    </span>
  );
}
