"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollIndicatorPulse } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollIndicator({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!lineRef.current || !textRef.current || !containerRef.current) return;

      if (reduced) {
        gsap.set(containerRef.current, { autoAlpha: 1 });
        gsap.set(textRef.current, { opacity: 1 });
        gsap.set(lineRef.current, { scaleY: 1 });
        return;
      }

      // Text fade in
      gsap.fromTo(textRef.current, scrollIndicatorPulse.text.from, scrollIndicatorPulse.text.to);

      // Line pulse
      gsap.fromTo(lineRef.current, scrollIndicatorPulse.line.from, scrollIndicatorPulse.line.to);

      // Fade out at 50vh
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "50vh top",
        onEnter: () => gsap.to(containerRef.current, { autoAlpha: 0, duration: 0.3 }),
        onLeaveBack: () => gsap.to(containerRef.current, { autoAlpha: 1, duration: 0.3 }),
      });
    },
    { scope: containerRef, dependencies: [reduced] },
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={[
        "scroll-indicator hidden flex-col items-center gap-3 md:flex",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        ref={textRef}
        className="font-label text-xs uppercase tracking-widest text-muted"
        style={{ writingMode: "vertical-rl" }}
      >
        Scroll
      </span>
      <div
        ref={lineRef}
        className="h-12 w-[1px] bg-muted"
        style={{ transformOrigin: "top center" }}
      />
    </div>
  );
}
