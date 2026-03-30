"use client";

import { type ComponentPropsWithRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/animations/MagneticButton";

const variantClasses = {
  primary: "bg-primary text-background hover:bg-primary-muted",
  outline: "border border-border bg-transparent text-text hover:border-border-hover",
  "outline-accent":
    "border border-primary bg-transparent text-primary hover:bg-primary/10 hover:text-primary",
  "outline-subtle": "border border-white/35 bg-transparent text-white hover:border-white/70 hover:bg-white/5",
  ghost: "bg-transparent text-text hover:text-text-heading",
} as const;

const sizeClasses = {
  xs: "px-6 py-3 text-[11px] font-label uppercase tracking-[0.15em]",
  sm: "px-4 py-2 text-sm min-h-[44px]",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
} as const;

type ButtonOwnProps<T extends ElementType = "button"> = {
  as?: T;
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  magnetic?: boolean;
  children?: ReactNode;
  className?: string;
};

type ButtonProps<T extends ElementType = "button"> = ButtonOwnProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof ButtonOwnProps<T>>;

export function Button<T extends ElementType = "button">({
  as,
  children,
  variant = "primary",
  size = "md",
  magnetic = false,
  className,
  ...props
}: ButtonProps<T>) {
  const Component = as || "button";

  const element = (
    <Component
      className={cn(
        "inline-flex items-center justify-center font-body font-medium tracking-wide transition-colors duration-normal",
        "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );

  if (magnetic) {
    return (
      <MagneticButton as="div" className="inline-block">
        {element}
      </MagneticButton>
    );
  }

  return element;
}
