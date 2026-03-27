import { beforeEach, describe, expect, it } from "vitest";
import { useUIStore } from "@/stores/ui-store";

describe("ui-store transitions", () => {
  beforeEach(() => {
    useUIStore.setState({
      menuOpen: false,
      transitionPhase: "idle",
      transitionSource: null,
      pendingHref: null,
    });
  });

  it("requests link transitions only while idle", () => {
    useUIStore.getState().requestRouteTransition("/work");

    expect(useUIStore.getState()).toMatchObject({
      transitionPhase: "leaving",
      transitionSource: "link",
      pendingHref: "/work",
    });

    useUIStore.getState().requestRouteTransition("/about");

    expect(useUIStore.getState()).toMatchObject({
      transitionPhase: "leaving",
      transitionSource: "link",
      pendingHref: "/work",
    });
  });

  it("starts history transitions only while idle", () => {
    useUIStore.getState().startHistoryTransition();

    expect(useUIStore.getState()).toMatchObject({
      transitionPhase: "leaving",
      transitionSource: "history",
      pendingHref: null,
    });
  });

  it("only enters when a leave transition is already active", () => {
    useUIStore.getState().beginEnterTransition();
    expect(useUIStore.getState().transitionPhase).toBe("idle");

    useUIStore.getState().requestRouteTransition("/work");
    useUIStore.getState().beginEnterTransition();

    expect(useUIStore.getState()).toMatchObject({
      transitionPhase: "entering",
      transitionSource: "link",
      pendingHref: null,
    });
  });

  it("finishes by resetting the transition state", () => {
    useUIStore.getState().requestRouteTransition("/work");
    useUIStore.getState().finishTransition();

    expect(useUIStore.getState()).toMatchObject({
      transitionPhase: "idle",
      transitionSource: null,
      pendingHref: null,
    });
  });
});
