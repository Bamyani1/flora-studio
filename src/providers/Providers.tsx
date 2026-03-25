"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "@/lib/gsap";
import { CustomCursor } from "@/components/ui/CustomCursor";

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
    <ReactLenis root options={{ duration: 1.4, lerp: 0.06, autoRaf: false }}>
      <LenisGsapSync />
      <CustomCursor />
      {children}
    </ReactLenis>
  );
}
