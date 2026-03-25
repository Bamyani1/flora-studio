"use client";

import { usePathname } from "next/navigation";
import { TransitionLink } from "./TransitionLink";

interface HeaderContactActionProps {
  className?: string;
  label?: string;
  children?: React.ReactNode;
  onBeforeAction?: () => void;
  scrollDelayMs?: number;
}

function scrollToProcessContact(scrollDelayMs: number) {
  const performScroll = () => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (scrollDelayMs > 0) {
    window.setTimeout(performScroll, scrollDelayMs);
    return;
  }

  performScroll();
}

export function HeaderContactAction({
  className,
  label = "Get in touch",
  children,
  onBeforeAction,
  scrollDelayMs = 0,
}: HeaderContactActionProps) {
  const pathname = usePathname();
  const isProcessRoute = pathname === "/process";
  const content = children ?? label;

  if (isProcessRoute) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => {
          onBeforeAction?.();
          scrollToProcessContact(scrollDelayMs);
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
