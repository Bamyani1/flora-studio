"use client";

import { useEffect, useRef } from "react";
import { LazyMotion } from "motion/react";
import Lenis from "lenis";
import { gsap } from "@/lib/gsap";

const features = () => import("@/lib/motion-features").then((mod) => mod.default);

export function Providers({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.06,
      duration: 1.4,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LazyMotion features={features} strict>
      {children}
    </LazyMotion>
  );
}
