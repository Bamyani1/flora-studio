"use client";

import { useState, useCallback } from "react";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { submitContactForm } from "@/app/contact/action";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/animations/FadeIn";

const photographyOptions = [
  { value: "personal", label: "Personal" },
  { value: "event", label: "Event" },
  { value: "sports", label: "Sports" },
  { value: "solo", label: "Solo" },
];

type FieldName = keyof ContactFormData;

export function ContactForm() {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const validateField = useCallback((name: FieldName, value: string) => {
    const fieldSchema = contactFormSchema.shape[name];
    const result = fieldSchema.safeParse(value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: result.success ? undefined : result.error.errors[0]?.message,
    }));
  }, []);

  const handleBlur = useCallback(
    (name: FieldName) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      validateField(name, e.target.value);
    },
    [validateField],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const data: ContactFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      photographyType: formData.get("photographyType") as ContactFormData["photographyType"],
      preferredDate: (formData.get("preferredDate") as string) || undefined,
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
    const result = await submitContactForm(parsed.data);
    setIsPending(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setFormError(result.error ?? "Something went wrong. Please try again.");
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
          <h2 className="font-display text-3xl text-text-heading md:text-4xl">
            Thank you
          </h2>
          <p className="mt-4 text-lg text-muted">
            I&apos;ll be in touch soon.
          </p>
        </div>
      </FadeIn>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {formError && (
        <div className="border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-400" role="alert">
          {formError}
        </div>
      )}

      <FadeIn delay={0}>
        <Input
          name="name"
          label="Name"
          placeholder="Your name"
          required
          error={fieldErrors.name}
          onBlur={handleBlur("name")}
        />
      </FadeIn>

      <FadeIn delay={0.08}>
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="your@email.com"
          required
          error={fieldErrors.email}
          onBlur={handleBlur("email")}
        />
      </FadeIn>

      <FadeIn delay={0.16}>
        <Select
          name="photographyType"
          label="Photography Type"
          options={photographyOptions}
          defaultValue=""
          required
          error={fieldErrors.photographyType}
          onBlur={handleBlur("photographyType")}
        />
      </FadeIn>

      <FadeIn delay={0.24}>
        <Input
          name="preferredDate"
          label="Preferred Date"
          type="date"
          error={fieldErrors.preferredDate}
          onBlur={handleBlur("preferredDate")}
          style={{ colorScheme: "dark" }}
        />
      </FadeIn>

      <FadeIn delay={0.32}>
        <Textarea
          name="message"
          label="Message"
          placeholder="Tell me about your project..."
          rows={5}
          required
          error={fieldErrors.message}
          onBlur={handleBlur("message")}
        />
      </FadeIn>

      <FadeIn delay={0.4}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          magnetic
          disabled={isPending}
        >
          {isPending ? "Sending..." : "Send Message"}
        </Button>
      </FadeIn>
    </form>
  );
}
