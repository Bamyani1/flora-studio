"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollIndicatorPulse } from "@/lib/animations";

export function ScrollIndicator({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!lineRef.current || !textRef.current || !containerRef.current) return;

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
    { scope: containerRef },
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
        className="font-mono text-xs uppercase tracking-widest text-muted"
        style={{ writingMode: "vertical-rl", opacity: 0 }}
      >
        Scroll
      </span>
      <div
        ref={lineRef}
        className="h-12 w-[1px] bg-muted"
        style={{ transform: "scaleY(0)", transformOrigin: "top center" }}
      />
    </div>
  );
}
