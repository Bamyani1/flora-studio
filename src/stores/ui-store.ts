import { create } from "zustand";

export type TransitionPhase = "idle" | "leaving" | "entering";
export type TransitionSource = "link" | "history" | null;

interface UIState {
  menuOpen: boolean;
  overlayMounted: boolean;
  transitionPhase: TransitionPhase;
  transitionSource: TransitionSource;
  pendingHref: string | null;
  setMenuOpen: (open: boolean) => void;
  setOverlayMounted: (mounted: boolean) => void;
  requestRouteTransition: (href: string) => void;
  startHistoryTransition: () => void;
  beginEnterTransition: () => void;
  finishTransition: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  menuOpen: false,
  overlayMounted: false,
  transitionPhase: "idle",
  transitionSource: null,
  pendingHref: null,
  setMenuOpen: (open) => set({ menuOpen: open }),
  setOverlayMounted: (mounted) => set({ overlayMounted: mounted }),
  requestRouteTransition: (href) =>
    set((state) => {
      if (state.transitionPhase !== "idle") return state;
      return {
        transitionPhase: "leaving",
        transitionSource: "link",
        pendingHref: href,
      };
    }),
  startHistoryTransition: () =>
    set((state) => {
      if (state.transitionPhase !== "idle") return state;
      return {
        transitionPhase: "leaving",
        transitionSource: "history",
        pendingHref: null,
      };
    }),
  beginEnterTransition: () =>
    set((state) => {
      if (state.transitionPhase !== "leaving") return state;
      return {
        transitionPhase: "entering",
        transitionSource: state.transitionSource,
        pendingHref: null,
      };
    }),
  finishTransition: () =>
    set({
      transitionPhase: "idle",
      transitionSource: null,
      pendingHref: null,
    }),
}));
