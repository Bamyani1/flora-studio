"use client";

import { useRef, useState, useCallback } from "react";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { submitContactForm } from "@/app/contact/action";
import { FadeIn } from "@/components/animations/FadeIn";
import { useMagnetic } from "@/hooks/useMagnetic";

const photographyOptions = [
  { value: "", label: "Select type..." },
  { value: "landscapes", label: "Landscapes" },
  { value: "nightsky", label: "Night Sky" },
  { value: "sports", label: "Sports" },
  { value: "portraits", label: "Portraits" },
  { value: "stories", label: "Stories" },
];

type FieldName = keyof ContactFormData;

const labelClass =
  "block font-label text-[10px] uppercase tracking-widest text-muted group-focus-within:text-primary transition-colors";
const inputClass =
  "w-full bg-transparent border-0 border-b border-border/30 py-4 text-text tracking-widest uppercase text-xs focus:border-primary focus:outline-none focus:ring-0 transition-colors peer";

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
      name: formData.get("name") as string,
      email: formData.get("email") as string,
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
          <p className="mt-4 text-lg text-muted">I&apos;ll be in touch soon.</p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-8 font-label text-sm uppercase tracking-wider text-primary transition-colors hover:text-text"
          >
            Send another message
          </button>
        </div>
      </FadeIn>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {formError && (
        <div
          className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {formError}
        </div>
      )}

      <FadeIn delay={0}>
        <div className="group relative">
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={inputClass}
            onBlur={handleBlur("name")}
          />
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-500 ease-out peer-focus:w-full group-hover:w-full" />
          {fieldErrors.name && (
            <p className="mt-2 text-xs text-error" role="alert">
              {fieldErrors.name}
            </p>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="group relative">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
            onBlur={handleBlur("email")}
          />
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-500 ease-out peer-focus:w-full group-hover:w-full" />
          {fieldErrors.email && (
            <p className="mt-2 text-xs text-error" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.16}>
        <div className="group relative">
          <label htmlFor="photographyType" className={labelClass}>
            Photography Type
          </label>
          <select
            id="photographyType"
            name="photographyType"
            required
            className={`${inputClass} appearance-none`}
            defaultValue=""
            onBlur={handleBlur("photographyType")}
          >
            {photographyOptions.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-500 ease-out peer-focus:w-full group-hover:w-full" />
          {fieldErrors.photographyType && (
            <p className="mt-2 text-xs text-error" role="alert">
              {fieldErrors.photographyType}
            </p>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.24}>
        <div className="group relative">
          <label htmlFor="message" className={labelClass}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className={`${inputClass} resize-none`}
            onBlur={handleBlur("message")}
          />
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-500 ease-out peer-focus:w-full group-hover:w-full" />
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
            className="w-full py-5 bg-primary text-background rounded font-label text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/10 hover:bg-primary-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Sending..." : "Send Message"}
          </button>
        </div>
      </FadeIn>
    </form>
  );
}
