"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { pageTransitionLeave } from "@/lib/animations";
import { useUIStore } from "@/stores/ui-store";

export function TransitionOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useUIStore((s) => s.isTransitioning);
  const startTransition = useUIStore((s) => s.startTransition);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      // Skip if already transitioning
      if (useUIStore.getState().isTransitioning) return;

      startTransition("wipe");

      const overlay = overlayRef.current;
      if (!overlay) return;

      gsap.fromTo(overlay, pageTransitionLeave.overlay.from, {
        ...pageTransitionLeave.overlay.to,
        onComplete: () => {
          // Browser handles the route change on popstate
        },
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [startTransition]);

  // Reset overlay when not transitioning (initial state)
  useEffect(() => {
    if (!isTransitioning && overlayRef.current) {
      gsap.set(overlayRef.current, { scaleX: 0 });
    }
  }, [isTransitioning]);

  return (
    <div
      ref={overlayRef}
      data-transition-overlay
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-100 bg-overlay-solid"
      style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
    />
  );
}
