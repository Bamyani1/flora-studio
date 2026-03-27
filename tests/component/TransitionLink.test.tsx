import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { useUIStore } from "@/stores/ui-store";
import { mockRouter, setMockPathname } from "../setup/mockNextNavigation";

describe("TransitionLink", () => {
  beforeEach(() => {
    useUIStore.setState({
      menuOpen: false,
      transitionPhase: "idle",
      transitionSource: null,
      pendingHref: null,
    });
  });

  it("skips router prefetch when prefetch is disabled", () => {
    render(
      <TransitionLink href="/work" prefetch={false}>
        Work
      </TransitionLink>,
    );

    fireEvent.mouseEnter(screen.getByRole("link", { name: "Work" }));

    expect(mockRouter.prefetch).not.toHaveBeenCalled();
  });

  it("prefetches when hover prefetch is enabled", () => {
    render(<TransitionLink href="/work">Work</TransitionLink>);

    fireEvent.mouseEnter(screen.getByRole("link", { name: "Work" }));

    expect(mockRouter.prefetch).toHaveBeenCalledWith("/work");
  });

  it("requests a route transition for a new internal destination", () => {
    setMockPathname("/about");

    render(<TransitionLink href="/work">Work</TransitionLink>);

    fireEvent.click(screen.getByRole("link", { name: "Work" }));

    expect(useUIStore.getState()).toMatchObject({
      transitionPhase: "leaving",
      transitionSource: "link",
      pendingHref: "/work",
    });
  });

  it("does not start a transition when linking to the current path", () => {
    setMockPathname("/work");

    render(<TransitionLink href="/work">Work</TransitionLink>);

    fireEvent.click(screen.getByRole("link", { name: "Work" }));

    expect(useUIStore.getState()).toMatchObject({
      transitionPhase: "idle",
      transitionSource: null,
      pendingHref: null,
    });
  });
});
