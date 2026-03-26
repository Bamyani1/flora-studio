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

    let cachedRect: DOMRect | null = null;

    const handleMouseEnter = () => {
      cachedRect = el.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!cachedRect) cachedRect = el.getBoundingClientRect();
      const centerX = cachedRect.left + cachedRect.width / 2;
      const centerY = cachedRect.top + cachedRect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.25,
          ease: magneticPull.ease,
          overwrite: true,
        });
      }
    };

    const handleMouseLeave = () => {
      cachedRect = null;
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: magneticPull.returnEase,
        overwrite: true,
      });
    };

    const handleResize = () => {
      cachedRect = null;
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      gsap.killTweensOf(el);
    };
  }, [ref, radius, strength, enabled]);
}
