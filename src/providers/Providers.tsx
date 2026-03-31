"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(
  () => import("@/components/ui/CustomCursor").then((mod) => mod.CustomCursor),
  { ssr: false },
);
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clearLenisRootState, getRouteScrollMode, lenisOptions } from "@/lib/scroll";

function LenisGsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const removeScrollListener = lenis.on("scroll", ScrollTrigger.update);
    const callback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(callback);

    return () => {
      removeScrollListener();
      gsap.ticker.remove(callback);
    };
  }, [lenis]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const scrollMode = getRouteScrollMode(pathname);
  const useNativeScroll = reducedMotion || scrollMode === "native";
  const enableCustomCursor = process.env.NEXT_PUBLIC_ENABLE_CUSTOM_CURSOR === "true";

  const cursor = enableCustomCursor ? <CustomCursor disabled={scrollMode === "native"} /> : null;

  useEffect(() => {
    if (useNativeScroll) {
      clearLenisRootState();
    }

    const timer = setTimeout(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, useNativeScroll]);

  if (useNativeScroll) {
    return (
      <>
        {cursor}
        {children}
      </>
    );
  }

  return (
    <ReactLenis root options={lenisOptions}>
      <LenisGsapSync />
      {cursor}
      {children}
    </ReactLenis>
  );
}
