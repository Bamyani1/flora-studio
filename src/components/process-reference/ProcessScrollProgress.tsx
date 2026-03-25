"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";

export function ProcessScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!barRef.current) return;

    const bar = barRef.current;
    bar.style.willChange = "transform";

    ScrollTrigger.create({
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        bar.style.transform = `scaleX(${self.progress})`;
      },
    });
  });

  return (
    <div
      ref={barRef}
      className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-[var(--process-primary)]"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
