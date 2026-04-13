import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const { mockLenis } = vi.hoisted(() => ({
  mockLenis: {
    start: vi.fn(),
    stop: vi.fn(),
  },
}));

vi.mock("@/lib/public-env", () => ({
  publicEnv: {
    cookieConsentEnabled: true,
  },
}));

vi.mock("lenis/react", () => ({
  useLenis: () => mockLenis,
}));

import { CookieConsentManager } from "@/components/legal/CookieConsentManager";

describe("CookieConsentManager", () => {
  beforeEach(() => {
    document.cookie = "flora_consent=; Max-Age=0; Path=/";
    mockLenis.start.mockReset();
    mockLenis.stop.mockReset();
  });

  afterEach(() => {
    document.cookie = "flora_consent=; Max-Age=0; Path=/";
  });

  it("shows the banner when enabled with no stored consent and restores it on escape", async () => {
    render(<CookieConsentManager />);

    await waitFor(() =>
      expect(screen.getByRole("region", { name: "Cookie preferences banner" })).toBeVisible(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Customize" }));

    await waitFor(() =>
      expect(screen.getByRole("dialog", { name: "Choose non-essential categories" })).toBeVisible(),
    );
    await waitFor(() =>
      expect(screen.getByRole("checkbox", { name: "Analytics consent" })).toHaveFocus(),
    );
    expect(mockLenis.stop).toHaveBeenCalled();

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Choose non-essential categories" }),
      ).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(screen.getByRole("button", { name: "Customize" })).toHaveFocus());
    expect(screen.getByRole("region", { name: "Cookie preferences banner" })).toBeVisible();
    expect(document.cookie).not.toContain("flora_consent=");
    expect(mockLenis.start).toHaveBeenCalled();
  });

  it("persists consent and restores focus to the preferences trigger after closing", async () => {
    render(<CookieConsentManager />);

    await waitFor(() =>
      expect(screen.getByRole("region", { name: "Cookie preferences banner" })).toBeVisible(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Customize" }));

    await waitFor(() =>
      expect(screen.getByRole("dialog", { name: "Choose non-essential categories" })).toBeVisible(),
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Analytics consent" }));
    fireEvent.click(screen.getByRole("button", { name: "Save choices" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Cookie Preferences" })).toBeVisible(),
    );
    expect(document.cookie).toContain("flora_consent=");

    fireEvent.click(screen.getByRole("button", { name: "Cookie Preferences" }));

    await waitFor(() =>
      expect(screen.getByRole("dialog", { name: "Choose non-essential categories" })).toBeVisible(),
    );

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Choose non-essential categories" }),
      ).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Cookie Preferences" })).toHaveFocus(),
    );
  });
});
