"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ThreeThreadsMark, type ThreeThreadsMarkHandle } from "./ThreeThreadsMark";

export function ScrollAperture() {
  const containerRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<ThreeThreadsMarkHandle>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    const container = containerRef.current;
    const threads = markRef.current?.threads ?? [];
    const frame = markRef.current?.frame;
    if (!container || threads.length === 0) return;

    if (reduced) {
      gsap.set(container, { autoAlpha: 0.6 });
      return;
    }

    // Start hidden, fade in after 5% scroll
    gsap.set(container, { autoAlpha: 0 });

    ScrollTrigger.create({
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;

        // Fade in after 5% scroll
        if (p < 0.05) {
          gsap.set(container, { autoAlpha: 0 });
          return;
        }
        gsap.set(container, { autoAlpha: 1 });

        // Thread splay: gently spread as user scrolls
        const spread = p * 4;
        threads.forEach((thread, i) => {
          const offset = (i - 1) * spread;
          gsap.set(thread, { x: offset });
        });

        // Frame opacity
        if (frame) {
          gsap.set(frame, { opacity: 0.3 + p * 0.4 });
        }
      },
    });
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-40 hidden md:block"
      aria-hidden="true"
    >
      <ThreeThreadsMark ref={markRef} size={32} className="text-primary" />
    </div>
  );
}
