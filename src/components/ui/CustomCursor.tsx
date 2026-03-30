"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface CustomCursorProps {
  disabled?: boolean;
}

export function CustomCursor({ disabled = false }: CustomCursorProps) {
  const [enabled, setEnabled] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const bladesRef = useRef<SVGGElement>(null);
  const quickToRefs = useRef<{
    x: gsap.QuickToFunc | null;
    y: gsap.QuickToFunc | null;
    rot: gsap.QuickToFunc | null;
  }>({ x: null, y: null, rot: null });
  const prevMouse = useRef({ x: 0, y: 0 });
  const angle = useRef(0);
  const latestMouse = useRef({ x: 0, y: 0 });
  const frameId = useRef<number | null>(null);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncEnabled = () => {
      setEnabled(!disabled && pointerQuery.matches && !motionQuery.matches);
    };

    syncEnabled();
    pointerQuery.addEventListener("change", syncEnabled);
    motionQuery.addEventListener("change", syncEnabled);

    return () => {
      pointerQuery.removeEventListener("change", syncEnabled);
      motionQuery.removeEventListener("change", syncEnabled);
    };
  }, [disabled]);

  useEffect(() => {
    if (!enabled || !cursorRef.current || !bladesRef.current) return;

    const cursor = cursorRef.current;
    const blades = bladesRef.current;

    quickToRefs.current.x = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "back.out(1.7)" });
    quickToRefs.current.y = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "back.out(1.7)" });
    gsap.set(blades, { transformOrigin: "50% 50%" });
    quickToRefs.current.rot = gsap.quickTo(blades, "rotation", {
      duration: 0.3,
      ease: "power2.out",
    });

    const style = document.createElement("style");
    style.textContent = "* { cursor: none !important; }";
    document.head.appendChild(style);

    const processMouseMove = () => {
      const { x, y, rot } = quickToRefs.current;
      const mx = latestMouse.current.x;
      const my = latestMouse.current.y;

      x?.(mx - 20);
      y?.(my - 20);

      const dx = mx - prevMouse.current.x;
      const dy = my - prevMouse.current.y;
      const dist = Math.hypot(dx, dy);
      angle.current += dist * 0.5;
      rot?.(angle.current);

      prevMouse.current.x = mx;
      prevMouse.current.y = my;
      frameId.current = null;
    };

    const handleMouseMove = (event: MouseEvent) => {
      latestMouse.current.x = event.clientX;
      latestMouse.current.y = event.clientY;
      if (frameId.current === null) {
        frameId.current = requestAnimationFrame(processMouseMove);
      }
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const interactive =
        target.closest("a, button, input, textarea, select") ||
        target.classList.contains("interactive");

      if (interactive) {
        gsap.to(cursor, { scale: 1.3, duration: 0.25, ease: "back.out(2)" });
      } else {
        gsap.to(cursor, { scale: 1, duration: 0.25, ease: "back.out(2)" });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      if (frameId.current !== null) cancelAnimationFrame(frameId.current);
      style.remove();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      gsap.killTweensOf(cursor);
      gsap.killTweensOf(blades);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-cursor text-[var(--color-primary)]"
      style={{ willChange: "transform", width: 40, height: 40 }}
    >
      <svg viewBox="0 0 32 32" width="40" height="40" fill="none">
        <g ref={bladesRef} transform="translate(16,16) scale(0.1077)">
          <circle cx="0" cy="0" r="130" stroke="currentColor" strokeWidth="2" />
          <circle cx="0" cy="0" r="48" stroke="currentColor" strokeWidth="1.5" />
          <polygon
            fill="currentColor"
            fillOpacity="0.85"
            points="54.34,-13.55 118.02,-30.89 94,77.77 48.5,28 54.34,-13.55"
          />
          <polygon
            fill="currentColor"
            fillOpacity="0.85"
            points="38.9,40.28 85.76,86.77 -20.35,120.29 0,56 38.9,40.28"
          />
          <polygon
            fill="currentColor"
            fillOpacity="0.85"
            points="-15.44,53.83 -32.26,117.66 -114.35,42.53 -48.5,28 -15.44,53.83"
          />
          <polygon
            fill="currentColor"
            fillOpacity="0.85"
            points="-54.34,13.55 -118.02,30.89 -94,-77.77 -48.5,-28 -54.34,13.55"
          />
          <polygon
            fill="currentColor"
            fillOpacity="0.85"
            points="-38.9,-40.28 -85.76,-86.77 20.35,-120.29 0,-56 -38.9,-40.28"
          />
          <polygon
            fill="currentColor"
            fillOpacity="0.85"
            points="15.44,-53.83 32.26,-117.66 114.35,-42.53 48.5,-28 15.44,-53.83"
          />
          <circle cx="0" cy="0" r="5" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
}
