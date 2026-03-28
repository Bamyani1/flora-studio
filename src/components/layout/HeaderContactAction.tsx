"use client";

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
}: HeaderContactActionProps) {
  const content = children ?? label;

  return (
    <TransitionLink href="/contact" onClick={onBeforeAction} className={className}>
      {content}
    </TransitionLink>
  );
}
