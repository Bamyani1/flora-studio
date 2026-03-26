"use client";

import { useCallback, useRef, useState } from "react";
import { submitContactForm } from "@/app/contact/action";
import { Button } from "@/components/ui/Button";
import { type ContactFormData, contactFormSchema } from "@/lib/validations";
import { ProcessMagnetic } from "./ProcessMagnetic";

const photographyOptions = [
  { value: "", label: "Session type" },
  { value: "milestones", label: "Milestones" },
  { value: "gatherings", label: "Gatherings" },
  { value: "motion", label: "Motion" },
  { value: "landscape", label: "Landscape" },
  { value: "portraits", label: "Portraits" },
  { value: "professional", label: "Professional" },
] as const;

type FieldName = keyof ContactFormData;

const fieldClassName =
  "peer w-full border-0 border-b border-outline-variant/35 bg-transparent py-4 font-label text-xs uppercase tracking-[0.2em] text-[var(--process-on-surface)] outline-none transition-all placeholder:text-neutral-700 focus:border-[var(--process-primary)]";

export function ProcessContactForm() {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const resetRef = useRef<HTMLButtonElement>(null);

  const validateField = useCallback((name: FieldName, value: string) => {
    const fieldSchema = contactFormSchema.shape[name];
    const result = fieldSchema.safeParse(value);

    setFieldErrors((current) => ({
      ...current,
      [name]: result.success ? undefined : result.error.errors[0]?.message,
    }));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const data: ContactFormData = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      photographyType: formData.get("photographyType") as ContactFormData["photographyType"],
      preferredDate: "",
      message: String(formData.get("message") ?? ""),
    };

    const parsed = contactFormSchema.safeParse(data);
    if (!parsed.success) {
      const nextErrors: Partial<Record<FieldName, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as FieldName;
        if (!nextErrors[field]) nextErrors[field] = issue.message;
      }
      setFieldErrors(nextErrors);
      return;
    }

    setIsPending(true);

    try {
      const result = await submitContactForm(parsed.data);
      if (!result.success) {
        setFormError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      setFieldErrors({});
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="rounded border border-primary/18 bg-black/20 p-8 text-left"
        role="status"
        aria-live="polite"
      >
        <h3 className="font-display text-3xl italic font-light text-[var(--process-on-surface-variant)]">
          Message received
        </h3>
        <p className="mt-4 font-body leading-relaxed text-neutral-400">
          Thanks for reaching out &mdash; we&apos;ll get back to you within 24 hours.
        </p>
        <Button
          ref={resetRef}
          type="button"
          variant="outline-accent"
          size="sm"
          className="mt-8 border-[var(--process-primary)] text-[var(--process-primary)] hover:bg-[var(--process-primary)]/10"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-8" noValidate onSubmit={handleSubmit}>
      {formError && (
        <div
          className="rounded border border-red-400/30 bg-red-500/5 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {formError}
        </div>
      )}

      <div className="group relative">
        <label htmlFor="process-name" className="sr-only">
          Name
        </label>
        <input
          id="process-name"
          name="name"
          type="text"
          placeholder="Your name"
          className={fieldClassName}
          onBlur={(event) => validateField("name", event.target.value)}
          required
        />
        <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[var(--process-primary)] transition-all duration-500 ease-out peer-focus:w-full group-hover:w-full" />
        {fieldErrors.name && (
          <p className="mt-2 text-xs text-red-300" role="alert">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div className="group relative">
        <label htmlFor="process-email" className="sr-only">
          Email
        </label>
        <input
          id="process-email"
          name="email"
          type="email"
          placeholder="Your email"
          className={fieldClassName}
          onBlur={(event) => validateField("email", event.target.value)}
          required
        />
        <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[var(--process-primary)] transition-all duration-500 ease-out peer-focus:w-full group-hover:w-full" />
        {fieldErrors.email && (
          <p className="mt-2 text-xs text-red-300" role="alert">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="group relative">
        <label htmlFor="process-photography-type" className="sr-only">
          Photography type
        </label>
        <select
          id="process-photography-type"
          name="photographyType"
          defaultValue=""
          className={`${fieldClassName} appearance-none`}
          onBlur={(event) => validateField("photographyType", event.target.value)}
          required
        >
          {photographyOptions.map((option) => (
            <option key={option.value} value={option.value} disabled={option.value === ""}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[var(--process-primary)] transition-all duration-500 ease-out peer-focus:w-full group-hover:w-full" />
        {fieldErrors.photographyType && (
          <p className="mt-2 text-xs text-red-300" role="alert">
            {fieldErrors.photographyType}
          </p>
        )}
      </div>

      <div className="group relative">
        <label htmlFor="process-message" className="sr-only">
          Message
        </label>
        <textarea
          id="process-message"
          name="message"
          rows={3}
          placeholder="Your message"
          className={`${fieldClassName} resize-none`}
          onBlur={(event) => validateField("message", event.target.value)}
          required
        />
        <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[var(--process-primary)] transition-all duration-500 ease-out peer-focus:w-full group-hover:w-full" />
        {fieldErrors.message && (
          <p className="mt-2 text-xs text-red-300" role="alert">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <ProcessMagnetic className="mt-8">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded bg-[var(--process-primary)] py-5 font-label text-xs uppercase tracking-[0.2em] text-[var(--process-on-primary)] shadow-[0_20px_60px_color-mix(in_srgb,var(--color-primary)_12%,transparent)] transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-[var(--process-primary-container)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Sending..." : "Send Message"}
        </button>
      </ProcessMagnetic>
    </form>
  );
}
