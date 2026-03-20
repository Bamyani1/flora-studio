"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { pageTransitionEnter, pageTransitionLeave } from "@/lib/animations";
import { useUIStore } from "@/stores/ui-store";

export function TransitionOverlay() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const popstateTimeoutRef = useRef<number | null>(null);
  const isTransitioning = useUIStore((s) => s.isTransitioning);
  const startTransition = useUIStore((s) => s.startTransition);
  const endTransition = useUIStore((s) => s.endTransition);

  const clearPopstateFallback = useCallback(
    (forceEndTransition = false) => {
      if (popstateTimeoutRef.current) {
        window.clearTimeout(popstateTimeoutRef.current);
        popstateTimeoutRef.current = null;
      }

      if (forceEndTransition && useUIStore.getState().isTransitioning) {
        endTransition();
      }
    },
    [endTransition],
  );

  useEffect(() => {
    clearPopstateFallback();

    if (!useUIStore.getState().isTransitioning) return;
    if (!overlayRef.current) {
      endTransition();
      return;
    }

    const tween = gsap.fromTo(overlayRef.current, pageTransitionEnter.overlay.from, {
      ...pageTransitionEnter.overlay.to,
      onComplete: () => {
        endTransition();
      },
    });

    return () => {
      tween.kill();
    };
  }, [pathname, clearPopstateFallback, endTransition]);

  // Handle browser back/forward
  useEffect(() => {
    let ctx: gsap.Context | undefined;

    const handlePopState = () => {
      if (useUIStore.getState().isTransitioning) return;

      const overlay = overlayRef.current;
      if (!overlay) return;

      ctx?.revert();
      clearPopstateFallback();
      startTransition();

      popstateTimeoutRef.current = window.setTimeout(() => {
        clearPopstateFallback(true);
      }, (pageTransitionLeave.totalDuration + pageTransitionEnter.totalDuration + 0.4) * 1000);

      ctx = gsap.context(() => {
        gsap.fromTo(overlay, pageTransitionLeave.overlay.from, pageTransitionLeave.overlay.to);
      }, overlayRef);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      clearPopstateFallback(true);
      ctx?.revert();
    };
  }, [clearPopstateFallback, startTransition]);

  // Reset overlay when not transitioning (initial state)
  useEffect(() => {
    if (!isTransitioning && overlayRef.current) {
      const ctx = gsap.context(() => {
        gsap.set(overlayRef.current, { scaleX: 0 });
      }, overlayRef);
      return () => ctx.revert();
    }
  }, [isTransitioning]);

  return (
    <div
      ref={overlayRef}
      data-transition-overlay
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-100 bg-overlay-solid"
      style={{ transform: "scaleX(0)", transformOrigin: "left center", willChange: "transform" }}
    />
  );
}
