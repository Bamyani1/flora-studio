import { create } from "zustand";

interface UIState {
  menuOpen: boolean;
  isTransitioning: boolean;
  scrollProgress: number;
  activeSection: string;
  setMenuOpen: (open: boolean) => void;
  startTransition: () => void;
  endTransition: () => void;
  setScrollProgress: (progress: number) => void;
  setActiveSection: (section: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  menuOpen: false,
  isTransitioning: false,
  scrollProgress: 0,
  activeSection: "hero",
  setMenuOpen: (open) => set({ menuOpen: open }),
  startTransition: () => set({ isTransitioning: true }),
  endTransition: () => set({ isTransitioning: false }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setActiveSection: (section) => set({ activeSection: section }),
}));
