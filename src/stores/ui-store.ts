import { create } from "zustand";

interface UIState {
  menuOpen: boolean;
  isTransitioning: boolean;
  transitionType: "wipe" | "morph";
  morphSource: unknown | null;
  scrollProgress: number;
  activeSection: string;
  setMenuOpen: (open: boolean) => void;
  startTransition: (type: "wipe" | "morph", morphState?: unknown) => void;
  endTransition: () => void;
  setScrollProgress: (progress: number) => void;
  setActiveSection: (section: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  menuOpen: false,
  isTransitioning: false,
  transitionType: "wipe",
  morphSource: null,
  scrollProgress: 0,
  activeSection: "hero",
  setMenuOpen: (open) => set({ menuOpen: open }),
  startTransition: (type, morphState) =>
    set({ isTransitioning: true, transitionType: type, morphSource: morphState ?? null }),
  endTransition: () => set({ isTransitioning: false, morphSource: null }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setActiveSection: (section) => set({ activeSection: section }),
}));
