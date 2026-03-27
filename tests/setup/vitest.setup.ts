import "@testing-library/jest-dom/vitest";
import { beforeEach, vi } from "vitest";
import "./mockNextNavigation";
import { resetMockNavigation } from "./mockNextNavigation";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

vi.mock("@gsap/react", () => ({
  useGSAP: () => undefined,
}));

vi.mock("@/lib/gsap", () => {
  const scrollTriggerInstance = {
    kill: vi.fn(),
  };

  return {
    gsap: {
      set: vi.fn(),
      to: vi.fn(),
      fromTo: vi.fn(),
      timeline: vi.fn(() => ({ fromTo: vi.fn(), to: vi.fn() })),
      quickTo: vi.fn(() => vi.fn()),
      killTweensOf: vi.fn(),
      registerPlugin: vi.fn(),
      context: vi.fn((callback: () => void) => {
        callback();
        return { revert: vi.fn() };
      }),
      matchMedia: vi.fn(() => ({ add: vi.fn(), revert: vi.fn() })),
      ticker: {
        add: vi.fn(),
        remove: vi.fn(),
        lagSmoothing: vi.fn(),
      },
    },
    ScrollTrigger: {
      create: vi.fn(() => scrollTriggerInstance),
      refresh: vi.fn(),
      getAll: vi.fn(() => []),
      matchMedia: vi.fn(),
    },
    SplitText: vi.fn(),
    Flip: {},
  };
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  writable: true,
  value: vi.fn(),
});

beforeEach(() => {
  resetMockNavigation();
});
