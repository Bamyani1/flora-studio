"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "lenis/react";

export function BackToTop() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (!buttonRef.current) return;

      gsap.set(buttonRef.current, { autoAlpha: 0 });

      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "100vh top",
        onEnter: () => gsap.to(buttonRef.current, { autoAlpha: 1, duration: 0.3 }),
        onLeaveBack: () => gsap.to(buttonRef.current, { autoAlpha: 0, duration: 0.3 }),
      });
    },
    { scope: buttonRef },
  );

  const handleClick = () => {
    if (lenis) {
      lenis.scrollTo(0);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      ref={buttonRef}
      data-back-to-top
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      className="fixed right-4 bottom-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-surface-elevated text-text transition-colors hover:bg-primary hover:text-background md:right-8 md:bottom-8"
      style={{ opacity: 0, visibility: "hidden" }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 13V3M8 3L3 8M8 3L13 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
