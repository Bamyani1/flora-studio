"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageTransitionEnter } from "@/lib/animations";
import { useUIStore } from "@/stores/ui-store";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const endTransition = useUIStore((s) => s.endTransition);

  useEffect(() => {
    if (!useUIStore.getState().isTransitioning) return;

    const timeout = window.setTimeout(() => {
      if (useUIStore.getState().isTransitioning) {
        endTransition();
      }
    }, (pageTransitionEnter.totalDuration + 0.1) * 1000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [pathname, endTransition]);

  return <>{children}</>;
}
