"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { irisTransition } from "@/lib/animations";

/**
 * 8 vertical blind strips that cascade closed then open
 * to cover/reveal pages during route transitions.
 */

const STRIP_COUNT = 8;
const STRIP_WIDTH = 100 / STRIP_COUNT;

export interface IrisTransitionHandle {
  close: (onComplete: () => void) => void;
  open: (onComplete: () => void) => void;
  reset: () => void;
}

export const IrisTransition = forwardRef<IrisTransitionHandle>(function IrisTransition(_, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const getStrips = () => stripRefs.current.filter(Boolean) as HTMLDivElement[];

  useImperativeHandle(
    ref,
    () => ({
      close(onComplete: () => void) {
        timelineRef.current?.kill();
        const strips = getStrips();
        const container = containerRef.current;
        if (!container || strips.length === 0) {
          onComplete();
          return;
        }

        gsap.set(container, { autoAlpha: 1 });
        strips.forEach((s) => (s.style.willChange = "transform"));

        const tl = gsap.timeline({ onComplete });
        tl.fromTo(
          strips,
          irisTransition.blade.close.from,
          {
            ...irisTransition.blade.close.to,
            duration: irisTransition.durations.close,
          },
          0,
        );
        timelineRef.current = tl;
      },

      open(onComplete: () => void) {
        timelineRef.current?.kill();
        const strips = getStrips();
        const container = containerRef.current;
        if (!container || strips.length === 0) {
          onComplete();
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => {
            strips.forEach((s) => (s.style.willChange = "auto"));
            gsap.set(container, { autoAlpha: 0 });
            onComplete();
          },
        });

        tl.fromTo(
          strips,
          irisTransition.blade.open.from,
          {
            ...irisTransition.blade.open.to,
            duration: irisTransition.durations.open,
          },
          irisTransition.durations.hold,
        );
        timelineRef.current = tl;
      },

      reset() {
        timelineRef.current?.kill();
        timelineRef.current = null;
        const strips = getStrips();
        const container = containerRef.current;
        if (container) gsap.set(container, { autoAlpha: 0 });
        if (strips.length > 0) {
          gsap.set(strips, { scaleX: 0 });
          strips.forEach((s) => (s.style.willChange = "auto"));
        }
      },
    }),
    [],
  );

  // Cleanup GSAP timeline on unmount
  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-iris-transition
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-100"
      style={{ visibility: "hidden" }}
    >
      {Array.from({ length: STRIP_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            stripRefs.current[i] = el;
          }}
          className="absolute top-0 h-full bg-background"
          style={{
            width: `${STRIP_WIDTH}%`,
            left: `${i * STRIP_WIDTH}%`,
            transform: "scaleX(0)",
            transformOrigin: "left center",
          }}
        />
      ))}
    </div>
  );
});
