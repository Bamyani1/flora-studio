import { afterEach, describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useUIStore } from "@/stores/ui-store";
import { setMockPathname } from "../setup/mockNextNavigation";

describe("MobileMenu", () => {
  afterEach(() => {
    useUIStore.setState({ menuOpen: false });
  });

  // A tap that lands mid-hydration opens the menu before the menu's own mount
  // effects have run; mounting must not undo it.
  it("keeps a menu that was opened before it mounted", () => {
    useUIStore.setState({ menuOpen: true });
    render(<MobileMenu socialLinks={[]} />);

    expect(useUIStore.getState().menuOpen).toBe(true);
  });

  it("closes when the route changes", () => {
    setMockPathname("/about");
    const { rerender } = render(<MobileMenu socialLinks={[]} />);
    useUIStore.setState({ menuOpen: true });

    setMockPathname("/work");
    rerender(<MobileMenu socialLinks={[]} />);

    expect(useUIStore.getState().menuOpen).toBe(false);
  });
});
