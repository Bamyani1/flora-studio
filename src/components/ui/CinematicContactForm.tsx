"use client";

import { type ChangeEvent, useEffect, useId, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { contactFormReveal } from "@/lib/animations";
import { useContactForm } from "@/hooks/useContactForm";
import type { ContactFormData } from "@/lib/validations";

const photographyOptions = [
  { value: "", label: "Select one" },
  { value: "milestones", label: "Wedding or graduation" },
  { value: "gatherings", label: "Event or party" },
  { value: "motion", label: "Sports or action" },
  { value: "landscape", label: "Landscape" },
  { value: "portraits", label: "Portrait" },
  { value: "professional", label: "Headshot or commercial" },
];

const labelClass = "block font-label text-xs uppercase tracking-wider text-primary/70 mb-2";
const inputClass =
  "w-full bg-transparent border border-border/30 rounded-sm px-4 py-3 font-body text-text tracking-wider text-sm focus:border-primary/40 focus:outline-2 focus:outline-primary focus:outline-offset-2 transition-colors duration-300 placeholder:text-muted/40 placeholder:tracking-wider placeholder:text-sm";

const MAX_ALTERNATE_DATES = 2;

function extractFormData(formData: FormData): ContactFormData {
  const alternateDates = formData
    .getAll("alternateDates")
    .map((value) => String(value).trim())
    .filter((value) => value.length > 0);

  return {
    name: (formData.get("sender") as string) || "",
    email: (formData.get("reply_to") as string) || "",
    website: ((formData.get("website") as string) || "").trim() || undefined,
    photographyType: formData.get("photographyType") as ContactFormData["photographyType"],
    preferredDate: (formData.get("preferredDate") as string) || "",
    alternateDates: alternateDates.length > 0 ? alternateDates : undefined,
    location: (formData.get("location") as string) || "",
    message: ((formData.get("message") as string) || "").trim() || undefined,
  };
}

export function CinematicContactForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasCompletedSubmissionRef = useRef(false);
  const instanceId = useId();
  const [alternateDateIds, setAlternateDateIds] = useState<string[]>([]);

  const {
    fieldErrors,
    formError,
    submitted,
    isPending,
    validateField,
    handleBlur,
    handleSubmit,
    resetSubmitted,
  } = useContactForm<ContactFormData>({
    getData: extractFormData,
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

      tl.fromTo(
        "[data-form-label]",
        contactFormReveal.label.from,
        contactFormReveal.label.to,
        positions.label,
      );

      tl.fromTo(
        "[data-form-heading]",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: contactFormReveal.heading.to.ease },
        positions.heading,
      );

      tl.fromTo(
        "[data-form-field]",
        contactFormReveal.field.from,
        { ...contactFormReveal.field.to, stagger: contactFormReveal.fieldStagger },
        positions.fields,
      );

      tl.fromTo(
        "[data-form-submit]",
        contactFormReveal.submit.from,
        contactFormReveal.submit.to,
        positions.submit,
      );
    },
    { scope: containerRef, dependencies: [submitted], revertOnUpdate: true },
  );

  const handleFieldChange =
    (name: keyof typeof fieldErrors) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      if (!fieldErrors[name]) {
        return;
      }
      validateField(name, event.target.value);
    };

  const addAlternateDate = () => {
    setAlternateDateIds((ids) => {
      if (ids.length >= MAX_ALTERNATE_DATES) return ids;
      return [...ids, `${instanceId}-alt-${Date.now()}-${ids.length}`];
    });
  };

  const removeAlternateDate = (idToRemove: string) => {
    setAlternateDateIds((ids) => ids.filter((id) => id !== idToRemove));
  };

  const handleReset = () => {
    setAlternateDateIds([]);
    resetSubmitted();
  };

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
          onClick={handleReset}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex h-full flex-col">
      <div className="flex-1">
        <span
          data-form-animate
          data-form-label
          className="mb-4 block font-label text-xs uppercase tracking-wider text-primary"
          style={{ opacity: 0 }}
        >
          Book a Session
        </span>

        <h2
          data-form-animate
          data-form-heading
          className="mb-10 font-display text-3xl font-light leading-tight text-text-heading md:text-4xl"
          style={{ opacity: 0 }}
        >
          Tell us about your vision
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Honeypot */}
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
                className={`${inputClass} capitalize`}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "sender-error" : undefined}
                onChange={handleFieldChange("name")}
                onBlur={handleBlur("name")}
              />
              {fieldErrors.name && (
                <p id="sender-error" className="mt-2 text-xs text-error" role="alert">
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
                className={inputClass}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "reply-to-error" : undefined}
                onChange={handleFieldChange("email")}
                onBlur={handleBlur("email")}
              />
              {fieldErrors.email && (
                <p id="reply-to-error" className="mt-2 text-xs text-error" role="alert">
                  {fieldErrors.email}
                </p>
              )}
            </div>
          </div>

          <div
            data-form-animate
            data-form-field
            className="space-y-6"
            style={{ opacity: 0 }}
          >
            <div className="group">
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
                  aria-invalid={!!fieldErrors.photographyType}
                  aria-describedby={
                    fieldErrors.photographyType ? "photography-type-error" : undefined
                  }
                  onChange={handleFieldChange("photographyType")}
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
                <p id="photography-type-error" className="mt-2 text-xs text-error" role="alert">
                  {fieldErrors.photographyType}
                </p>
              )}
            </div>

            <div className="group">
              <div className="mb-2 flex items-baseline justify-between">
                <label htmlFor="preferredDate" className="block font-label text-xs uppercase tracking-wider text-primary/70">
                  Ideal date
                </label>
                {alternateDateIds.length < MAX_ALTERNATE_DATES && (
                  <button
                    type="button"
                    className="font-label text-xs uppercase tracking-wider text-primary/70 transition-colors hover:text-primary"
                    onClick={addAlternateDate}
                  >
                    + Add an alternate date
                  </button>
                )}
              </div>
              <input
                id="preferredDate"
                name="preferredDate"
                type="date"
                required
                className={`${inputClass} [color-scheme:dark]`}
                aria-invalid={!!fieldErrors.preferredDate}
                aria-describedby={fieldErrors.preferredDate ? "preferred-date-error" : undefined}
                onChange={handleFieldChange("preferredDate")}
                onBlur={handleBlur("preferredDate")}
              />
              {fieldErrors.preferredDate && (
                <p id="preferred-date-error" className="mt-2 text-xs text-error" role="alert">
                  {fieldErrors.preferredDate}
                </p>
              )}
            </div>

            {alternateDateIds.map((id, index) => (
              <div key={id} className="group">
                <div className="mb-2 flex items-baseline justify-between">
                  <label
                    htmlFor={id}
                    className="block font-label text-xs uppercase tracking-wider text-primary/70"
                  >
                    {`Alternate date ${index + 1}`}
                  </label>
                  <button
                    type="button"
                    className="font-label text-xs uppercase tracking-wider text-muted transition-colors hover:text-primary"
                    onClick={() => removeAlternateDate(id)}
                  >
                    Remove
                  </button>
                </div>
                <input id={id} name="alternateDates" type="date" className={`${inputClass} [color-scheme:dark]`} />
              </div>
            ))}

            <div className="group">
              <label htmlFor="location" className={labelClass}>
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                autoComplete="off"
                placeholder="City, venue, or flexible"
                className={inputClass}
                aria-invalid={!!fieldErrors.location}
                aria-describedby={fieldErrors.location ? "location-error" : undefined}
                onChange={handleFieldChange("location")}
                onBlur={handleBlur("location")}
              />
              {fieldErrors.location && (
                <p id="location-error" className="mt-2 text-xs text-error" role="alert">
                  {fieldErrors.location}
                </p>
              )}
            </div>
          </div>

          <div
            data-form-animate
            data-form-field
            className="space-y-6"
            style={{ opacity: 0 }}
          >
            <div className="group">
              <label htmlFor="message" className={labelClass}>
                Anything else?
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Vibe, references, anything specific you'd want us to know."
                className={`${inputClass} resize-none`}
                aria-invalid={!!fieldErrors.message}
                aria-describedby={fieldErrors.message ? "message-error" : undefined}
                onChange={handleFieldChange("message")}
                onBlur={handleBlur("message")}
              />
              {fieldErrors.message && (
                <p id="message-error" className="mt-2 text-xs text-error" role="alert">
                  {fieldErrors.message}
                </p>
              )}
            </div>
          </div>

          <div data-form-animate data-form-submit style={{ opacity: 0 }}>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full overflow-hidden p-[3px] bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,color-mix(in_srgb,white_40%,transparent)_95%,color-mix(in_srgb,white_70%,transparent)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_85%,color-mix(in_srgb,white_30%,transparent)_95%,color-mix(in_srgb,white_60%,transparent)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex w-full items-center justify-center bg-primary/80 py-4 font-label text-sm uppercase tracking-wider font-semibold text-surface-deep transition-colors duration-500 group-hover:bg-primary">
                {isPending ? "Sending..." : "Send inquiry"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
