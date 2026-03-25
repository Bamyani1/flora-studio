"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { fadeUp, fadeLeft, fadeRight, blurReveal, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  direction?: "up" | "left" | "right";
  blur?: boolean;
  scale?: number;
  className?: string;
  as?: React.ElementType;
}

export function FadeIn({
  children,
  delay = 0,
  duration,
  y,
  direction = "up",
  blur = false,
  scale,
  className,
  as: Tag = "div",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const preset = direction === "left" ? fadeLeft : direction === "right" ? fadeRight : fadeUp;

  useGSAP(
    () => {
      if (!ref.current) return;

      if (reduced) {
        gsap.set(ref.current, { autoAlpha: 1, x: 0, y: 0, scale: 1, filter: "none" });
        return;
      }

      const fromVars: gsap.TweenVars = {
        ...preset.from,
        ...(y !== undefined && { y }),
        ...(blur && { filter: blurReveal.from.filter }),
        ...(scale !== undefined && { scale }),
      };

      const toVars: gsap.TweenVars = {
        ...preset.to,
        ...withWillChange(),
        ...(duration !== undefined && { duration }),
        ...(y !== undefined && { y: 0 }),
        ...(blur && { filter: blurReveal.to.filter }),
        ...(scale !== undefined && { scale: 1 }),
        delay,
        scrollTrigger: {
          trigger: ref.current,
          ...preset.scrollTrigger,
        },
      };

      gsap.set(ref.current, fromVars);
      gsap.fromTo(ref.current, fromVars, toVars);
    },
    { scope: ref, dependencies: [reduced, delay, duration, y, direction, blur, scale] },
  );

  return (
    <Tag
      ref={ref}
      className={className}
    >
      {children}
    </Tag>
  );
}
