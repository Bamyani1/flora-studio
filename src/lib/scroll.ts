import type { LenisOptions } from "lenis";

export type ScrollMode = "lenis" | "native";

const NATIVE_SCROLL_ROUTE_PREFIXES: string[] = [];

// Shared scroll profile for the entire site. Keep this direct enough to feel attached
// to user input while preserving a cinematic glide on longer gestures.
export const lenisOptions: LenisOptions = {
  autoRaf: false,
  lerp: 0.06,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1,
  syncTouch: false,
  stopInertiaOnNavigate: true,
};

export function getRouteScrollMode(pathname?: string | null): ScrollMode {
  if (!pathname) return "lenis";

  return NATIVE_SCROLL_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
    ? "native"
    : "lenis";
}

export function clearLenisRootState() {
  if (typeof document === "undefined") return;

  const lenisClasses = ["lenis", "lenis-smooth", "lenis-stopped", "lenis-scrolling"];
  document.documentElement.classList.remove(...lenisClasses);
  document.body.classList.remove(...lenisClasses);
}
