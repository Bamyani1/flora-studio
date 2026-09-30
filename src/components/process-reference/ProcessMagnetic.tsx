"use client";

import { useRef } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ProcessMagnetic({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hasHover = useMediaQuery("(hover: hover)");
  const reduced = useReducedMotion();
  // Touch taps emit mouseenter/move with no mouseleave, which strands the pull
  useMagnetic(ref, { strength: 0.2, enabled: hasHover && !reduced });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
