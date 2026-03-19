"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { clipRevealUp, clipRevealLeft } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ClipRevealProps {
  children: React.ReactNode;
  direction?: "up" | "left";
  className?: string;
  as?: React.ElementType;
}

export function ClipReveal({
  children,
  direction = "up",
  className,
  as: Tag = "div",
}: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const preset = direction === "up" ? clipRevealUp : clipRevealLeft;

  useGSAP(
    () => {
      if (!ref.current) return;

      if (reduced) {
        gsap.set(ref.current, { clipPath: "inset(0% 0% 0% 0%)" });
        return;
      }

      gsap.fromTo(ref.current, preset.from, {
        ...preset.to,
        scrollTrigger: {
          trigger: ref.current,
          ...preset.scrollTrigger,
        },
      });
    },
    { scope: ref, dependencies: [reduced, direction] },
  );

  return (
    <Tag ref={ref} className={className} style={{ clipPath: preset.from.clipPath }}>
      {children}
    </Tag>
  );
}
