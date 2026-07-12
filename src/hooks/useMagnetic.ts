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
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const handleMouseEnter = () => {
      cachedRect = el.getBoundingClientRect();
    };

    // Coalesce mousemove into one rAF (high-poll mice fire at 120Hz+, and each
    // uncoalesced event would spawn/overwrite a tween) — same pattern as CustomCursor
    const applyPull = () => {
      frame = 0;
      if (!cachedRect) cachedRect = el.getBoundingClientRect();
      const centerX = cachedRect.left + cachedRect.width / 2;
      const centerY = cachedRect.top + cachedRect.height / 2;
      const dx = pointerX - centerX;
      const dy = pointerY - centerY;
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

    const handleMouseMove = (e: MouseEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!frame) frame = requestAnimationFrame(applyPull);
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
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      gsap.killTweensOf(el);
    };
  }, [ref, radius, strength, enabled]);
}
