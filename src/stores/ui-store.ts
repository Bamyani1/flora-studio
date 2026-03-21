import { create } from "zustand";

export type TransitionPhase = "idle" | "leaving" | "entering";
export type TransitionSource = "link" | "history" | null;

interface UIState {
  menuOpen: boolean;
  transitionPhase: TransitionPhase;
  transitionSource: TransitionSource;
  pendingHref: string | null;
  scrollProgress: number;
  activeSection: string;
  setMenuOpen: (open: boolean) => void;
  requestRouteTransition: (href: string) => void;
  startHistoryTransition: () => void;
  beginEnterTransition: () => void;
  finishTransition: () => void;
  setScrollProgress: (progress: number) => void;
  setActiveSection: (section: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  menuOpen: false,
  transitionPhase: "idle",
  transitionSource: null,
  pendingHref: null,
  scrollProgress: 0,
  activeSection: "hero",
  setMenuOpen: (open) => set({ menuOpen: open }),
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
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setActiveSection: (section) => set({ activeSection: section }),
}));
