"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { irisTransition } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useUIStore } from "@/stores/ui-store";
import { IrisTransition, type IrisTransitionHandle } from "./IrisTransition";

export function TransitionOverlay() {
  const pathname = usePathname();
  const router = useRouter();
  const irisRef = useRef<IrisTransitionHandle>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const previousPathnameRef = useRef(pathname);
  const fallbackTimeoutRef = useRef<number | null>(null);
  const transitionPhase = useUIStore((s) => s.transitionPhase);
  const transitionSource = useUIStore((s) => s.transitionSource);
  const startHistoryTransition = useUIStore((s) => s.startHistoryTransition);
  const beginEnterTransition = useUIStore((s) => s.beginEnterTransition);
  const finishTransition = useUIStore((s) => s.finishTransition);
  const reduced = useReducedMotion();

  const clearFallback = useCallback(() => {
    if (!fallbackTimeoutRef.current) return;
    window.clearTimeout(fallbackTimeoutRef.current);
    fallbackTimeoutRef.current = null;
  }, []);

  const setHiddenState = useCallback(() => {
    irisRef.current?.reset();
    if (fallbackRef.current) gsap.set(fallbackRef.current, { autoAlpha: 0 });
  }, []);

  const hardReset = useCallback(() => {
    clearFallback();
    setHiddenState();
    finishTransition();
  }, [clearFallback, finishTransition, setHiddenState]);

  const scheduleFailsafe = useCallback(() => {
    clearFallback();
    fallbackTimeoutRef.current = window.setTimeout(
      () => {
        hardReset();
      },
      (irisTransition.totalDuration + 0.5) * 1000,
    );
  }, [clearFallback, hardReset]);

  useEffect(() => {
    setHiddenState();
    return () => {
      clearFallback();
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

  // Handle browser back/forward
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
    if (transitionPhase === "idle") {
      clearFallback();
      setHiddenState();
      return;
    }

    scheduleFailsafe();

    if (transitionPhase === "leaving") {
      // Kill all ScrollTriggers to prevent orphans on the next page
      ScrollTrigger.getAll().forEach((st) => st.kill());
    }

    // Reduced motion: use simple opacity fade on fallback div
    if (reduced) {
      const fb = fallbackRef.current;
      if (!fb) return;

      if (transitionPhase === "leaving") {
        gsap.fromTo(
          fb,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.2,
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
          },
        );
      } else {
        gsap.fromTo(
          fb,
          { autoAlpha: 1 },
          {
            autoAlpha: 0,
            duration: 0.2,
            onComplete: hardReset,
          },
        );
      }
      return;
    }

    // Full iris shutter animation
    if (transitionPhase === "leaving") {
      irisRef.current?.close(() => {
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
      });
    } else if (transitionPhase === "entering") {
      irisRef.current?.open(() => {
        hardReset();
      });
    }
  }, [
    beginEnterTransition,
    clearFallback,
    hardReset,
    reduced,
    router,
    scheduleFailsafe,
    setHiddenState,
    transitionPhase,
    transitionSource,
  ]);

  return (
    <>
      <IrisTransition ref={irisRef} />
      {/* Fallback for reduced motion */}
      <div
        ref={fallbackRef}
        data-transition-overlay
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-100 bg-background"
        style={{ visibility: "hidden" }}
      />
    </>
  );
}
