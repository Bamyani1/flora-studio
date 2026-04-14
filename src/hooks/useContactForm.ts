"use client";

import { useCallback, useState } from "react";
import { submitContactForm, type ContactActionResult } from "@/app/(site)/contact/action";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";

export type ContactFieldName = keyof ContactFormData;
export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

export interface UseContactFormOptions<TData extends ContactFormData = ContactFormData> {
  getData: (formData: FormData) => TData;
}

function mapIssuesToFieldErrors(data: ContactFormData): ContactFieldErrors {
  const parsed = contactFormSchema.safeParse(data);
  if (parsed.success) return {};

  const errors: ContactFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as ContactFieldName;
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  }

  return errors;
}

export function useContactForm<TData extends ContactFormData>({ getData }: UseContactFormOptions<TData>) {
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const validateField = useCallback((name: ContactFieldName, value: string) => {
    const fieldSchema = contactFormSchema.shape[name];
    const result = fieldSchema.safeParse(value);

    setFieldErrors((current) => ({
      ...current,
      [name]: result.success ? undefined : result.error.errors[0]?.message,
    }));
  }, []);

  const handleBlur = useCallback(
    (name: ContactFieldName) =>
      (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        validateField(name, event.target.value);
      },
    [validateField],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFormError(null);

      const data = getData(new FormData(event.currentTarget));
      const errors = mapIssuesToFieldErrors(data);

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      setFieldErrors({});
      setIsPending(true);

      let result: ContactActionResult;
      try {
        result = await submitContactForm(data);
      } catch {
        result = { success: false, error: "Something went wrong. Please try again." };
      } finally {
        setIsPending(false);
      }

      if (result.success) {
        setSubmitted(true);
        return;
      }

      setFormError(result.error);
    },
    [getData],
  );

  const resetSubmitted = useCallback(() => {
    setFieldErrors({});
    setFormError(null);
    setSubmitted(false);
  }, []);

  return {
    fieldErrors,
    formError,
    submitted,
    isPending,
    validateField,
    handleBlur,
    handleSubmit,
    resetSubmitted,
  };
}
