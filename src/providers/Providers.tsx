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

    return () => {
      gsap.ticker.remove(callback);
    };
  }, [lenis]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ duration: 1.2, autoRaf: false }}>
      <LenisGsapSync />
      <LazyMotion features={features} strict>
        {children}
      </LazyMotion>
    </ReactLenis>
  );
}
