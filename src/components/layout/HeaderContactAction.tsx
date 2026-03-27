"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "./TransitionLink";

interface HeaderContactActionProps {
  className?: string;
  label?: string;
  children?: React.ReactNode;
  onBeforeAction?: () => void;
  scrollDelayMs?: number;
}

export function HeaderContactAction({
  className,
  label = "Get in touch",
  children,
  onBeforeAction,
  scrollDelayMs = 0,
}: HeaderContactActionProps) {
  const pathname = usePathname();
  const scrollTimeoutRef = useRef<number | null>(null);
  const isProcessRoute = pathname === "/process";
  const content = children ?? label;

  const clearScrollTimeout = useCallback(() => {
    if (!scrollTimeoutRef.current) return;
    window.clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = null;
  }, []);

  const scrollToProcessContact = useCallback(() => {
    const performScroll = () => {
      document.getElementById("contact")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    clearScrollTimeout();

    if (scrollDelayMs > 0) {
      scrollTimeoutRef.current = window.setTimeout(() => {
        scrollTimeoutRef.current = null;
        performScroll();
      }, scrollDelayMs);
      return;
    }

    performScroll();
  }, [clearScrollTimeout, scrollDelayMs]);

  useEffect(() => clearScrollTimeout, [clearScrollTimeout]);

  if (isProcessRoute) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => {
          onBeforeAction?.();
          scrollToProcessContact();
        }}
      >
        {content}
      </button>
    );
  }

  return (
    <TransitionLink href="/contact" onClick={onBeforeAction} className={className}>
      {content}
    </TransitionLink>
  );
}
