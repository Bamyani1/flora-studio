import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { HeaderContactAction } from "@/components/layout/HeaderContactAction";
import { setMockPathname } from "../setup/mockNextNavigation";

describe("HeaderContactAction", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("renders a transition link outside the process route", () => {
    setMockPathname("/about");

    render(<HeaderContactAction />);

    expect(screen.getByRole("link", { name: "Get in touch" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("scrolls to the process contact section on the process route", () => {
    setMockPathname("/process");
    const target = document.createElement("section");
    target.id = "contact";
    const scrollSpy = vi.spyOn(target, "scrollIntoView");
    document.body.appendChild(target);

    render(<HeaderContactAction />);

    fireEvent.click(screen.getByRole("button", { name: "Get in touch" }));

    expect(scrollSpy).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("clears delayed process-route scroll timers on unmount", () => {
    setMockPathname("/process");
    const target = document.createElement("section");
    target.id = "contact";
    const scrollSpy = vi.spyOn(target, "scrollIntoView");
    document.body.appendChild(target);

    const { unmount } = render(<HeaderContactAction scrollDelayMs={300} />);

    fireEvent.click(screen.getByRole("button", { name: "Get in touch" }));
    unmount();
    vi.advanceTimersByTime(300);

    expect(scrollSpy).not.toHaveBeenCalled();
  });
});
