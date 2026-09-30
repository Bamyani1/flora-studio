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

      gsap.set(el, { autoAlpha: 1 }); // Clear CSS [data-animate] opacity; words handle their own visibility

      // Built in onSplit so autoSplit's re-splits (font load, resize) keep the reveal
      const split = new SplitText(el, {
        ...landingWordReveal.splitConfig,
        onSplit: (self) =>
          gsap.fromTo(self.words, landingWordReveal.from, {
            ...landingWordReveal.to,
            delay,
            scrollTrigger: {
              trigger: el,
              ...landingWordReveal.scrollTrigger,
            },
            ...withWillChange(),
          }),
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
