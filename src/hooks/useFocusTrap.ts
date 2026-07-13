"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, active: boolean) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    // Store the element that had focus before trap activated
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const container = containerRef.current;

    // Focus after the frame in which sibling effects reveal the container —
    // focusing a child while the dialog is still visibility:hidden is a silent no-op.
    const focusFrame = window.requestAnimationFrame(() => {
      const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      focusableElements[0]?.focus();
    });

    // Fully managed Tab cycling: WebKit's native Tab skips plain links, so
    // relying on browser tab order would hop from the last button straight out
    // of the dialog. Moving focus ourselves keeps every engine on the same loop.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      // Re-query in case DOM changed
      const currentFocusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      e.preventDefault();
      if (currentFocusable.length === 0) return;

      const activeIndex = currentFocusable.indexOf(document.activeElement as HTMLElement);
      const nextIndex = e.shiftKey
        ? activeIndex <= 0
          ? currentFocusable.length - 1
          : activeIndex - 1
        : activeIndex === -1 || activeIndex === currentFocusable.length - 1
          ? 0
          : activeIndex + 1;

      currentFocusable[nextIndex]?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      // Return focus to the element that had it before
      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, containerRef]);
}
