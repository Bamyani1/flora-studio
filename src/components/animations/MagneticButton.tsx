"use client";

import { useRef } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MagneticButtonProps {
  children: React.ReactNode;
  radius?: number;
  strength?: number;
  as?: React.ElementType;
  className?: string;
  [key: string]: unknown;
}

export function MagneticButton({
  children,
  radius,
  strength,
  as: Tag = "button",
  className,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const hasHover = useMediaQuery("(hover: hover)");
  const reduced = useReducedMotion();

  useMagnetic(ref, {
    radius,
    strength,
    enabled: hasHover && !reduced,
  });

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
}
