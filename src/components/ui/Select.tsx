"use client";

import { type SelectHTMLAttributes, useId } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const chevronSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`;

export function Select({
  label,
  error,
  options,
  placeholder = "Select an option",
  className,
  ...props
}: SelectProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cn("relative", className)}>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-xs uppercase tracking-wider text-muted"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={cn(
            "peer w-full appearance-none border-b bg-transparent pb-3 pt-1 pr-8 text-text outline-none transition-colors duration-normal min-h-[44px]",
            error ? "border-red-400" : "border-border",
          )}
          style={{
            backgroundImage: chevronSvg,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0 center",
            backgroundSize: "16px",
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        >
          <option value="" disabled className="bg-surface text-muted">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface text-text">
              {opt.label}
            </option>
          ))}
        </select>
        <span
          className={cn(
            "absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-normal ease-out",
            error ? "bg-red-400" : "bg-primary",
            "peer-focus:scale-x-100",
          )}
          aria-hidden="true"
        />
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
