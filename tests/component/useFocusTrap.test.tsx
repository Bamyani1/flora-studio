import { useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

function FocusTrapHarness({
  active,
  withFocusable = true,
}: {
  active: boolean;
  withFocusable?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(containerRef, active);

  return (
    <div ref={containerRef}>
      {withFocusable ? (
        <>
          <button type="button">First</button>
          <button type="button">Last</button>
        </>
      ) : (
        <div>No focusable children</div>
      )}
    </div>
  );
}

describe("useFocusTrap", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("focuses the first element and wraps focus within the container", () => {
    render(<FocusTrapHarness active />);

    const first = screen.getByRole("button", { name: "First" });
    const last = screen.getByRole("button", { name: "Last" });

    expect(first).toHaveFocus();

    last.focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    expect(first).toHaveFocus();

    first.focus();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true }),
    );
    expect(last).toHaveFocus();
  });

  it("prevents tab escapes when there are no focusable children", () => {
    render(<FocusTrapHarness active withFocusable={false} />);

    const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    document.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("does not restore focus to a detached element during cleanup", () => {
    const opener = document.createElement("button");
    document.body.appendChild(opener);
    opener.focus();

    const focusSpy = vi.spyOn(opener, "focus");

    const { unmount } = render(<FocusTrapHarness active />);

    opener.remove();
    unmount();

    expect(focusSpy).not.toHaveBeenCalled();
  });
});
