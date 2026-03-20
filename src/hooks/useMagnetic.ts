"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { magneticPull } from "@/lib/animations";

interface UseMagneticOptions {
  radius?: number;
  strength?: number;
  enabled?: boolean;
}

export function useMagnetic(
  ref: React.RefObject<HTMLElement | null>,
  options: UseMagneticOptions = {},
) {
  const {
    radius = magneticPull.proximityRadius,
    strength = magneticPull.strength,
    enabled = true,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.3,
          ease: magneticPull.ease,
          overwrite: true,
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: magneticPull.returnDuration,
        ease: magneticPull.returnEase,
        overwrite: true,
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      gsap.killTweensOf(el);
    };
  }, [ref, radius, strength, enabled]);
}
