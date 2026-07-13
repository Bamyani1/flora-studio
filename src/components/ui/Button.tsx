"use client";

import { type ComponentPropsWithRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/animations/MagneticButton";

// Hover states gated to fine pointers — a tap on touch latches :hover styles
const variantClasses = {
  primary: "bg-primary text-surface-deep can-hover:hover:bg-primary-muted",
  outline: "border border-border bg-transparent text-text can-hover:hover:border-border-hover",
  "outline-accent":
    "border border-primary bg-transparent text-primary can-hover:hover:bg-primary/10 can-hover:hover:text-primary",
  "outline-subtle":
    "border border-white/35 bg-transparent text-white can-hover:hover:border-white/70 can-hover:hover:bg-white/5",
  ghost: "bg-transparent text-text can-hover:hover:text-text-heading",
  bone: "bg-text text-surface-deep can-hover:hover:bg-text/85",
} as const;

// Type and padding are split because the glow structure keeps typography on the
// frame element while the inner face carries the padding.
const sizeTypeClasses = {
  chip: "text-[10px] font-label uppercase tracking-[0.2em]",
  xs: "text-[11px] font-label uppercase tracking-[0.15em]",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
} as const;

const sizePaddingClasses = {
  chip: "px-4 py-1.5",
  xs: "px-6 py-3",
  sm: "px-4 py-2 min-h-[44px]",
  md: "px-6 py-3",
  lg: "px-8 py-4",
} as const;

// Conic shimmer ring for glow buttons — gold/ember by default; override
// --glow-hi/--glow-lo at the call site for other faces. The spin runs only
// while hovered on fine pointers so touch devices never animate two conic
// gradients forever.
const glowSpinnerClasses =
  "pointer-events-none absolute inset-[-1000%] opacity-0 transition-opacity duration-500 can-hover:group-hover:opacity-100 can-hover:group-hover:animate-[spin_2s_linear_infinite]";
const glowGradientBlur =
  "bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,var(--glow-hi)_95%,var(--glow-lo)_100%)] blur-md";
const glowGradientSharp =
  "bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_85%,var(--glow-hi)_95%,var(--glow-lo)_100%)]";

type ButtonOwnProps<T extends ElementType = "button"> = {
  as?: T;
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeTypeClasses;
  magnetic?: boolean;
  glow?: boolean;
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
  glow = false,
  className,
  ...props
}: ButtonProps<T>) {
  const Component = as || "button";

  const baseClasses = cn(
    "inline-flex items-center justify-center font-body font-medium tracking-wide transition-colors duration-normal",
    "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4",
    "disabled:pointer-events-none disabled:opacity-50",
    sizeTypeClasses[size],
  );

  const element = glow ? (
    <Component
      className={cn(
        baseClasses,
        "group relative overflow-hidden bg-primary-muted p-[3px]",
        "[--glow-hi:var(--color-hero-gold)] [--glow-lo:var(--color-primary)]",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className={cn(glowSpinnerClasses, glowGradientBlur)} />
      <span aria-hidden="true" className={cn(glowSpinnerClasses, glowGradientSharp)} />
      <span
        className={cn(
          "relative z-10 flex h-full w-full items-center justify-center gap-2 transition-colors duration-500",
          variantClasses[variant],
          sizePaddingClasses[size],
        )}
      >
        {children}
      </span>
    </Component>
  ) : (
    <Component
      className={cn(baseClasses, variantClasses[variant], sizePaddingClasses[size], className)}
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
