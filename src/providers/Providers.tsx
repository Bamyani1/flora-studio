"use client";

import { useEffect } from "react";
import { LazyMotion } from "motion/react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "@/lib/gsap";

const features = () => import("@/lib/motion-features").then((mod) => mod.default);

function LenisGsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const callback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(callback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(callback);
    };
  }, [lenis]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.06, duration: 1.4, autoRaf: false }}>
      <LenisGsapSync />
      <LazyMotion features={features} strict>
        {children}
      </LazyMotion>
    </ReactLenis>
  );
}
