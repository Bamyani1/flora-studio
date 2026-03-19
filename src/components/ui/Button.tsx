"use client";

import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/animations/MagneticButton";

const variantClasses = {
  primary:
    "bg-primary text-background hover:bg-primary-muted",
  outline:
    "border border-border bg-transparent text-text hover:border-border-hover",
  ghost:
    "bg-transparent text-text hover:text-text-heading",
} as const;

const sizeClasses = {
  sm: "px-4 py-2 text-sm min-h-[44px]",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  magnetic?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  magnetic = false,
  className,
  ...props
}: ButtonProps) {
  const button = (
    <button
      className={cn(
        "inline-flex items-center justify-center font-body font-medium tracking-wide transition-colors duration-normal",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );

  if (magnetic) {
    return (
      <MagneticButton as="div" className="inline-block">
        {button}
      </MagneticButton>
    );
  }

  return button;
}
