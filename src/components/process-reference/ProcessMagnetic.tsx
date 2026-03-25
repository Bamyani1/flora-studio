"use client";

import { useRef } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

export function ProcessMagnetic({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useMagnetic(ref, { strength: 0.2 });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
