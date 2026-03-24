"use client";

import { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { submitContactForm } from "@/app/contact/action";
import { contactFormReveal } from "@/lib/animations";
import { useMagnetic } from "@/hooks/useMagnetic";

const photographyOptions = [
  { value: "", label: "Select session type..." },
  { value: "graduation", label: "Graduation" },
  { value: "events", label: "Events" },
  { value: "sports", label: "Sports" },
  { value: "personal", label: "Personal" },
  { value: "family", label: "Family" },
  { value: "corporate", label: "Corporate / Headshot" },
];

type FieldName = keyof ContactFormData;

const labelClass =
  "block font-label text-[9px] uppercase tracking-[0.35em] text-muted/60 group-focus-within:text-primary transition-colors duration-500 mb-1";
const inputClass =
  "w-full bg-transparent border-0 border-b border-border/30 py-3 font-body text-text tracking-wider uppercase text-xs focus:border-primary focus:outline-none focus:ring-0 transition-all duration-500 placeholder:text-muted/30 placeholder:tracking-wider placeholder:uppercase placeholder:text-xs";

export function CinematicContactForm() {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLDivElement>(null);
  useMagnetic(submitRef);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        gsap.set("[data-form-animate]", { autoAlpha: 1 });
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
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 1.0, ease: contactFormReveal.heading.to.ease },
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
    { scope: containerRef },
  );

  const validateField = useCallback((name: FieldName, value: string) => {
    const fieldSchema = contactFormSchema.shape[name];
    const result = fieldSchema.safeParse(value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: result.success ? undefined : result.error.errors[0]?.message,
    }));
  }, []);

  const handleBlur =
    (name: FieldName) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      validateField(name, e.target.value);
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const data: ContactFormData = {
      name: formData.get("sender") as string,
      email: formData.get("reply_to") as string,
      photographyType: formData.get("photographyType") as ContactFormData["photographyType"],
      message: formData.get("message") as string,
    };

    const parsed = contactFormSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Partial<Record<FieldName, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as FieldName;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setIsPending(true);
    try {
      const result = await submitContactForm(parsed.data);
      if (result.success) {
        setSubmitted(true);
      } else {
        setFormError(result.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="flex min-h-[400px] flex-col items-center justify-center text-center"
        role="status"
        aria-live="polite"
      >
        <h2 className="font-display text-3xl italic text-text-heading md:text-4xl">
          Thank you
        </h2>
        <p className="mt-4 text-sm uppercase tracking-widest text-muted">
          We&apos;ll be in touch soon.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-8 font-label text-[10px] uppercase tracking-[0.3em] text-primary transition-colors hover:text-text"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <div className="mb-12">
        <span
          data-form-animate
          data-form-label
          className="mb-4 block font-label text-[10px] uppercase tracking-[0.5em] text-primary"
          style={{ opacity: 0 }}
        >
          Get In Touch
        </span>
        <h1
          data-form-animate
          data-form-heading
          className="font-display text-5xl italic leading-none tracking-tight text-text-heading md:text-7xl"
          style={{ opacity: 0 }}
        >
          Start your <span className="not-italic font-bold">story.</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-10">
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
          className="grid grid-cols-1 gap-10 md:grid-cols-2"
          style={{ opacity: 0 }}
        >
          <div className="group relative">
            <label htmlFor="sender" className={labelClass}>
              Identity
            </label>
            <input
              id="sender"
              name="sender"
              type="text"
              required
              placeholder="NAME / BRAND"
              className={inputClass}
              onBlur={handleBlur("name")}
            />
            {fieldErrors.name && (
              <p className="mt-2 text-xs text-error" role="alert">
                {fieldErrors.name}
              </p>
            )}
          </div>
          <div className="group relative">
            <label htmlFor="reply_to" className={labelClass}>
              Digital Correspondence
            </label>
            <input
              id="reply_to"
              name="reply_to"
              type="email"
              required
              placeholder="EMAIL ADDRESS"
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

        <div data-form-animate data-form-field className="group relative" style={{ opacity: 0 }}>
          <label htmlFor="photographyType" className={labelClass}>
            Engagement Type
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
              className="pointer-events-none absolute right-2 bottom-4 h-4 w-4 text-muted"
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

        <div data-form-animate data-form-field className="group relative" style={{ opacity: 0 }}>
          <label htmlFor="message" className={labelClass}>
            Creative Intent
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            required
            placeholder="TELL US ABOUT THE VISION..."
            className={`${inputClass} resize-none`}
            onBlur={handleBlur("message")}
          />
          {fieldErrors.message && (
            <p className="mt-2 text-xs text-error" role="alert">
              {fieldErrors.message}
            </p>
          )}
        </div>

        <div data-form-animate data-form-submit className="pt-4" style={{ opacity: 0 }}>
          <div ref={submitRef}>
            <button
              type="submit"
              disabled={isPending}
              className="group relative overflow-hidden bg-primary/90 px-12 py-5 font-label text-[10px] uppercase tracking-[0.4em] font-bold text-surface-deep transition-all duration-500 hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="relative z-10">
                {isPending ? "Sending..." : "Transmit Inquiry"}
              </span>
              <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-500 group-hover:translate-y-0" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
