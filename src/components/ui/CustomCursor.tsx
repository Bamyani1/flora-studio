"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const quickToRefs = useRef<{
    dotX: gsap.QuickToFunc | null;
    dotY: gsap.QuickToFunc | null;
    ringX: gsap.QuickToFunc | null;
    ringY: gsap.QuickToFunc | null;
  }>({ dotX: null, dotY: null, ringX: null, ringY: null });

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncEnabled = () => {
      setEnabled(pointerQuery.matches && !motionQuery.matches);
    };

    syncEnabled();
    pointerQuery.addEventListener("change", syncEnabled);
    motionQuery.addEventListener("change", syncEnabled);

    return () => {
      pointerQuery.removeEventListener("change", syncEnabled);
      motionQuery.removeEventListener("change", syncEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !dotRef.current || !ringRef.current) return;

    const dot = dotRef.current;
    const ring = ringRef.current;

    // gsap.quickTo: purpose-built for high-frequency updates (cursor tracking)
    // Inner dot: tight follow (short duration)
    quickToRefs.current.dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "back.out(1.7)" });
    quickToRefs.current.dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "back.out(1.7)" });
    // Outer ring: lazy follow with gentle overshoot for trailing effect
    quickToRefs.current.ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "back.out(1.4)" });
    quickToRefs.current.ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "back.out(1.4)" });

    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "none";

    const handleMouseMove = (event: MouseEvent) => {
      const { dotX, dotY, ringX, ringY } = quickToRefs.current;
      dotX?.(event.clientX - 8);
      dotY?.(event.clientY - 8);
      ringX?.(event.clientX - 20);
      ringY?.(event.clientY - 20);
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const interactive =
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "input" ||
        target.tagName.toLowerCase() === "textarea" ||
        target.tagName.toLowerCase() === "select" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select") ||
        target.classList.contains("interactive");

      if (interactive) {
        gsap.to(dot, { scale: 2.5, duration: 0.25, ease: "back.out(2)" });
        gsap.to(ring, { scale: 1.5, opacity: 0, duration: 0.25, ease: "back.out(2)" });
      } else {
        gsap.to(dot, { scale: 1, duration: 0.25, ease: "back.out(2)" });
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(2)" });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.body.style.cursor = previousCursor;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      gsap.killTweensOf(dot);
      gsap.killTweensOf(ring);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-4 w-4 rounded-full bg-[var(--color-primary)] mix-blend-difference"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[99] h-10 w-10 rounded-full border border-[var(--color-primary-muted)]"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
