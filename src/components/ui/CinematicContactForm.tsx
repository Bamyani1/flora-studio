"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { contactFormReveal } from "@/lib/animations";
import { useContactForm } from "@/hooks/useContactForm";
import type { ContactFormData } from "@/lib/validations";

const photographyOptions = [
  { value: "", label: "What are we making together?" },
  { value: "milestones", label: "Milestones" },
  { value: "gatherings", label: "Gatherings" },
  { value: "motion", label: "Motion" },
  { value: "landscape", label: "Landscape" },
  { value: "portraits", label: "Portraits" },
  { value: "professional", label: "Professional" },
];

const labelClass = "block font-label text-xs uppercase tracking-wider text-primary/70 mb-2";
const inputClass =
  "w-full bg-transparent border border-border/30 rounded-sm px-4 py-3 font-body text-text tracking-wider uppercase text-sm focus:border-primary/40 focus:outline-none focus:ring-0 transition-colors duration-300 placeholder:text-muted/40 placeholder:tracking-wider placeholder:uppercase placeholder:text-sm";

export function CinematicContactForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasCompletedSubmissionRef = useRef(false);
  const { fieldErrors, formError, submitted, isPending, handleBlur, handleSubmit, resetSubmitted } =
    useContactForm({
      getData: (formData) => ({
        name: formData.get("sender") as string,
        email: formData.get("reply_to") as string,
        website: ((formData.get("website") as string) || "").trim() || undefined,
        photographyType: formData.get(
          "photographyType",
        ) as ContactFormData["photographyType"],
        message: formData.get("message") as string,
      }),
    });

  useEffect(() => {
    if (submitted) {
      hasCompletedSubmissionRef.current = true;
    }
  }, [submitted]);

  useGSAP(
    () => {
      if (!containerRef.current || submitted) return;

      const revealTargets = "[data-form-animate]";
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced || hasCompletedSubmissionRef.current) {
        gsap.set(revealTargets, { autoAlpha: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline();
      const { positions } = contactFormReveal;

      // Label
      tl.fromTo(
        "[data-form-label]",
        contactFormReveal.label.from,
        contactFormReveal.label.to,
        positions.label,
      );

      // Heading
      tl.fromTo(
        "[data-form-heading]",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: contactFormReveal.heading.to.ease },
        positions.heading,
      );

      // Fields staggered
      tl.fromTo(
        "[data-form-field]",
        contactFormReveal.field.from,
        { ...contactFormReveal.field.to, stagger: contactFormReveal.fieldStagger },
        positions.fields,
      );

      // Submit button
      tl.fromTo(
        "[data-form-submit]",
        contactFormReveal.submit.from,
        contactFormReveal.submit.to,
        positions.submit,
      );
    },
    { scope: containerRef, dependencies: [submitted], revertOnUpdate: true },
  );

  if (submitted) {
    return (
      <div
        className="flex min-h-[400px] flex-col items-center justify-center text-center"
        role="status"
        aria-live="polite"
      >
        <h2 className="font-display text-3xl italic text-text-heading md:text-4xl">
          Message received
        </h2>
        <p className="mt-4 text-sm uppercase tracking-widest text-muted">
          We&apos;ll get back to you within 24 hours.
        </p>
        <Button
          type="button"
          variant="outline-accent"
          size="sm"
          className="mt-8"
          onClick={resetSubmitted}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex h-full flex-col">
      {/* Form content — grows to fill */}
      <div className="flex-1">
        {/* Label */}
        <span
          data-form-animate
          data-form-label
          className="mb-4 block font-label text-xs uppercase tracking-wider text-primary"
          style={{ opacity: 0 }}
        >
          Book a Session
        </span>

        {/* Heading with bottom border */}
        <h2
          data-form-animate
          data-form-heading
          className="mb-10 font-display text-3xl font-light leading-tight text-text-heading md:text-4xl"
          style={{ opacity: 0 }}
        >
          Tell us about your project
        </h2>

        <form onSubmit={handleSubmit} noValidate className="max-w-[540px] space-y-7">
          <div
            aria-hidden="true"
            className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
          >
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          {formError && (
            <div
              className="border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
              role="alert"
            >
              {formError}
            </div>
          )}

          {/* Row 1: Name + Email */}
          <div
            data-form-animate
            data-form-field
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
            style={{ opacity: 0 }}
          >
            <div className="group">
              <label htmlFor="sender" className={labelClass}>
                Full Name
              </label>
              <input
                id="sender"
                name="sender"
                type="text"
                required
                autoComplete="off"
                placeholder="YOUR NAME"
                className={inputClass}
                onBlur={handleBlur("name")}
              />
              {fieldErrors.name && (
                <p className="mt-2 text-xs text-error" role="alert">
                  {fieldErrors.name}
                </p>
              )}
            </div>
            <div className="group">
              <label htmlFor="reply_to" className={labelClass}>
                Email
              </label>
              <input
                id="reply_to"
                name="reply_to"
                type="email"
                required
                autoComplete="off"
                placeholder="YOUR EMAIL ADDRESS"
                className={inputClass}
                onBlur={handleBlur("email")}
              />
              {fieldErrors.email && (
                <p className="mt-2 text-xs text-error" role="alert">
                  {fieldErrors.email}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Session Type */}
          <div data-form-animate data-form-field className="group" style={{ opacity: 0 }}>
            <label htmlFor="photographyType" className={labelClass}>
              Session Type
            </label>
            <div className="relative">
              <select
                id="photographyType"
                name="photographyType"
                required
                className={`${inputClass} cursor-pointer appearance-none pr-10`}
                defaultValue=""
                onBlur={handleBlur("photographyType")}
              >
                {photographyOptions.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.value === ""}
                    className="bg-surface"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/50"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M5 8l5 5 5-5" />
              </svg>
            </div>
            {fieldErrors.photographyType && (
              <p className="mt-2 text-xs text-error" role="alert">
                {fieldErrors.photographyType}
              </p>
            )}
          </div>

          {/* Row 3: Vision Brief */}
          <div data-form-animate data-form-field className="group" style={{ opacity: 0 }}>
            <label htmlFor="message" className={labelClass}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              placeholder="TELL US ABOUT YOUR EVENT, TIMELINE, OR ANY IDEAS..."
              className={`${inputClass} resize-none`}
              onBlur={handleBlur("message")}
            />
            {fieldErrors.message && (
              <p className="mt-2 text-xs text-error" role="alert">
                {fieldErrors.message}
              </p>
            )}
          </div>

          {/* Submit button — spinning gradient border effect */}
          <div data-form-animate data-form-submit className="pt-2" style={{ opacity: 0 }}>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full overflow-hidden p-[3px] bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {/* Outer spinning gradient glow */}
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,color-mix(in_srgb,white_40%,transparent)_95%,color-mix(in_srgb,white_70%,transparent)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
              {/* Inner spinning gradient */}
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_85%,color-mix(in_srgb,white_30%,transparent)_95%,color-mix(in_srgb,white_60%,transparent)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Button face */}
              <span className="relative z-10 flex w-full items-center justify-center bg-primary/80 py-4 font-label text-sm uppercase tracking-wider font-semibold text-surface-deep transition-colors duration-500 group-hover:bg-primary">
                {isPending ? "Sending..." : "Send Message"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
