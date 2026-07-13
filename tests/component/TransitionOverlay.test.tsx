import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { TransitionOverlay } from "@/components/layout/TransitionOverlay";
import { useUIStore } from "@/stores/ui-store";
import { mockRouter, setMockPathname } from "../setup/mockNextNavigation";

describe("TransitionOverlay", () => {
  beforeAll(() => {
    // Plain functions on purpose: mockReset/restoreMocks would wipe vi.fn
    // implementations between tests.
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }));
  });

  beforeEach(() => {
    useUIStore.setState({
      menuOpen: false,
      overlayMounted: false,
      transitionPhase: "idle",
      transitionSource: null,
      pendingHref: null,
    });
  });

  it("tracks overlay mount state for its lifetime", () => {
    const { unmount } = render(<TransitionOverlay />);

    expect(useUIStore.getState().overlayMounted).toBe(true);

    unmount();

    expect(useUIStore.getState().overlayMounted).toBe(false);
  });

  it("resets a stale transition instead of replaying it on mount", async () => {
    setMockPathname("/");
    useUIStore.setState({
      transitionPhase: "leaving",
      transitionSource: "link",
      pendingHref: "/work/missing-album",
    });

    render(<TransitionOverlay />);

    await waitFor(() => {
      expect(useUIStore.getState()).toMatchObject({
        transitionPhase: "idle",
        transitionSource: null,
        pendingHref: null,
      });
    });
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
