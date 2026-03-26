"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { submitContactForm } from "@/app/contact/action";
import { FadeIn } from "@/components/animations/FadeIn";
import { useMagnetic } from "@/hooks/useMagnetic";

const photographyOptions = [
  { value: "", label: "What are we making together?" },
  { value: "milestones", label: "Milestones" },
  { value: "gatherings", label: "Gatherings" },
  { value: "motion", label: "Motion" },
  { value: "landscape", label: "Landscape" },
  { value: "portraits", label: "Portraits" },
  { value: "professional", label: "Professional" },
];

type FieldName = keyof ContactFormData;

const labelClass = "block font-label text-[10px] uppercase tracking-[0.3em] text-muted mb-2";
const inputClass =
  "w-full bg-surface border border-border/30 px-5 py-5 text-text tracking-wider text-sm focus:border-primary/60 focus:outline-none focus:ring-0 transition-colors placeholder:text-muted/30 placeholder:tracking-wider placeholder:text-xs";

export function InlineContactForm() {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const submitRef = useRef<HTMLDivElement>(null);
  useMagnetic(submitRef);

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
      <FadeIn>
        <div
          className="flex min-h-[400px] flex-col items-center justify-center text-center"
          role="status"
          aria-live="polite"
        >
          <h2 className="font-display font-light text-3xl text-text-heading md:text-4xl">
            Thank you
          </h2>
          <p className="mt-4 text-lg text-muted">We&apos;ll get back to you within 24 hours.</p>
          <Button
            type="button"
            variant="outline-accent"
            size="sm"
            className="mt-8"
            onClick={() => setSubmitted(false)}
          >
            Send another message
          </Button>
        </div>
      </FadeIn>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-12">
      {formError && (
        <div
          className="border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {formError}
        </div>
      )}

      <FadeIn delay={0}>
        <div>
          <label htmlFor="sender" className={labelClass}>
            Your Name
          </label>
          <input
            id="sender"
            name="sender"
            type="text"
            required
            placeholder="Your name"
            className={inputClass}
            onBlur={handleBlur("name")}
          />
          {fieldErrors.name && (
            <p className="mt-2 text-xs text-error" role="alert">
              {fieldErrors.name}
            </p>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div>
          <label htmlFor="reply_to" className={labelClass}>
            Your Email
          </label>
          <input
            id="reply_to"
            name="reply_to"
            type="text"
            inputMode="email"
            required
            placeholder="your@email.com"
            className={inputClass}
            onBlur={handleBlur("email")}
          />
          {fieldErrors.email && (
            <p className="mt-2 text-xs text-error" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.16}>
        <div className="relative">
          <label htmlFor="photographyType" className={labelClass}>
            What Are You Looking For?
          </label>
          <select
            id="photographyType"
            name="photographyType"
            required
            className={`${inputClass} appearance-none pr-12`}
            defaultValue=""
            onBlur={handleBlur("photographyType")}
          >
            {photographyOptions.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-4 bottom-5 h-5 w-5 text-muted"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M5 8l5 5 5-5" />
          </svg>
          {fieldErrors.photographyType && (
            <p className="mt-2 text-xs text-error" role="alert">
              {fieldErrors.photographyType}
            </p>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.24}>
        <div>
          <label htmlFor="message" className={labelClass}>
            Tell Us More
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            placeholder="Tell us about your event, timeline, or any ideas..."
            className={`${inputClass} resize-none`}
            onBlur={handleBlur("message")}
          />
          {fieldErrors.message && (
            <p className="mt-2 text-xs text-error" role="alert">
              {fieldErrors.message}
            </p>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.32}>
        <div ref={submitRef}>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary px-6 py-5 font-label text-[10px] uppercase tracking-[0.3em] text-surface-deep transition-colors duration-300 hover:bg-primary-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Sending..." : "Send Message"}
          </button>
        </div>
      </FadeIn>
    </form>
  );
}
