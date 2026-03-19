"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { pageTransitionEnter } from "@/lib/animations";
import { useUIStore } from "@/stores/ui-store";

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const endTransition = useUIStore((s) => s.endTransition);

  useEffect(() => {
    if (hasAnimated.current) return;

    const isTransitioning = useUIStore.getState().isTransitioning;
    if (!isTransitioning) return;

    hasAnimated.current = true;

    const overlay = document.querySelector("[data-transition-overlay]");
    if (!overlay) {
      endTransition();
      return;
    }

    // Small delay to let the new page render
    gsap.fromTo(overlay, pageTransitionEnter.overlay.from, {
      ...pageTransitionEnter.overlay.to,
      onComplete: () => {
        endTransition();
      },
    });
  }, [endTransition]);

  return <div ref={containerRef}>{children}</div>;
}
