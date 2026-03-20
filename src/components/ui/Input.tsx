"use client";

import { type InputHTMLAttributes, useId } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cn("relative", className)}>
      <label
        htmlFor={id}
        className="mb-2 block font-label text-xs uppercase tracking-wider text-muted"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={cn(
            "peer w-full border border-border rounded-lg bg-surface-elevated px-4 pb-3 pt-3 text-text outline-none transition-colors duration-normal placeholder:text-muted/50 min-h-[44px]",
            error ? "border-error" : "border-border-hover",
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        <span
          className={cn(
            "absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-normal ease-out",
            error ? "bg-error" : "bg-primary",
            "peer-focus:scale-x-100",
          )}
          aria-hidden="true"
        />
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
