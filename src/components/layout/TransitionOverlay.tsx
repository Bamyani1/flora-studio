"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { pageTransitionEnter, pageTransitionLeave } from "@/lib/animations";
import { useUIStore } from "@/stores/ui-store";

export function TransitionOverlay() {
  const pathname = usePathname();
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousPathnameRef = useRef(pathname);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const fallbackTimeoutRef = useRef<number | null>(null);
  const transitionPhase = useUIStore((s) => s.transitionPhase);
  const transitionSource = useUIStore((s) => s.transitionSource);
  const pendingHref = useUIStore((s) => s.pendingHref);
  const startHistoryTransition = useUIStore((s) => s.startHistoryTransition);
  const beginEnterTransition = useUIStore((s) => s.beginEnterTransition);
  const finishTransition = useUIStore((s) => s.finishTransition);

  const clearFallback = useCallback(() => {
    if (!fallbackTimeoutRef.current) return;
    window.clearTimeout(fallbackTimeoutRef.current);
    fallbackTimeoutRef.current = null;
  }, []);

  const setHiddenState = useCallback(() => {
    if (!overlayRef.current) return;
    gsap.set(overlayRef.current, {
      scaleX: 0,
      transformOrigin: "left center",
    });
  }, []);

  const hardReset = useCallback(() => {
    clearFallback();
    animationRef.current?.kill();
    animationRef.current = null;
    setHiddenState();
    finishTransition();
  }, [clearFallback, finishTransition, setHiddenState]);

  const scheduleFailsafe = useCallback(() => {
    clearFallback();
    fallbackTimeoutRef.current = window.setTimeout(() => {
      hardReset();
    }, (pageTransitionLeave.totalDuration + pageTransitionEnter.totalDuration + 0.4) * 1000);
  }, [clearFallback, hardReset]);

  useEffect(() => {
    setHiddenState();
    return () => {
      clearFallback();
      animationRef.current?.kill();
      animationRef.current = null;
    };
  }, [clearFallback, setHiddenState]);

  useEffect(() => {
    const previousPathname = previousPathnameRef.current;
    previousPathnameRef.current = pathname;

    if (previousPathname === pathname) return;

    const state = useUIStore.getState();
    if (state.transitionPhase === "leaving" && state.transitionSource === "link") {
      beginEnterTransition();
      return;
    }

    if (state.transitionPhase === "idle") {
      setHiddenState();
    }
  }, [beginEnterTransition, pathname, setHiddenState]);

  // Handle browser back/forward.
  useEffect(() => {
    const handlePopState = () => {
      if (useUIStore.getState().transitionPhase !== "idle") return;
      startHistoryTransition();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [startHistoryTransition]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    animationRef.current?.kill();
    animationRef.current = null;

    if (transitionPhase === "idle") {
      clearFallback();
      setHiddenState();
      return;
    }

    scheduleFailsafe();

    if (transitionPhase === "leaving") {
      animationRef.current = gsap.fromTo(overlay, pageTransitionLeave.overlay.from, {
        ...pageTransitionLeave.overlay.to,
        onComplete: () => {
          const state = useUIStore.getState();
          if (state.transitionPhase !== "leaving") return;

          if (state.transitionSource === "history") {
            beginEnterTransition();
            return;
          }

          if (state.pendingHref) {
            router.push(state.pendingHref);
            return;
          }

          hardReset();
        },
      });
    } else {
      animationRef.current = gsap.fromTo(overlay, pageTransitionEnter.overlay.from, {
        ...pageTransitionEnter.overlay.to,
        onComplete: () => {
          hardReset();
        },
      });
    }

    return () => {
      animationRef.current?.kill();
      animationRef.current = null;
    };
  }, [
    beginEnterTransition,
    clearFallback,
    hardReset,
    pendingHref,
    router,
    scheduleFailsafe,
    setHiddenState,
    transitionPhase,
    transitionSource,
  ]);

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
