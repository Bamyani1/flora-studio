import { z } from "zod";

// Single source of truth for the session-type taxonomy: the form select, the
// zod enum, and the outgoing emails all read from here so a client who picks
// "Sports or action" never sees the internal value "motion" echoed back.
export const PHOTOGRAPHY_TYPE_OPTIONS = [
  { value: "milestones", label: "Wedding or graduation" },
  { value: "gatherings", label: "Event or party" },
  { value: "motion", label: "Sports or action" },
  { value: "landscape", label: "Landscape" },
  { value: "portraits", label: "Portrait" },
  { value: "professional", label: "Headshot or commercial" },
] as const;

export type PhotographyType = (typeof PHOTOGRAPHY_TYPE_OPTIONS)[number]["value"];

export function photographyTypeLabel(value: string): string {
  return (
    PHOTOGRAPHY_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value
  );
}

// Collapse CR/LF runs to a single space so no free-text field can carry line
// breaks into an outgoing email — neutralizes header injection on fields that
// reach a header and multi-line body injection on fields echoed to a recipient.
const collapseNewlines = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

const SESSION_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_BOOKING_YEARS_AHEAD = 5;
const SESSION_DATE_MESSAGE = "Please pick a valid date from today onward";

// Date inputs submit YYYY-MM-DD. The form's `min` is only a picker hint (the form
// is noValidate), so typed past dates and 6-digit years land here. A day of slack
// covers visitors whose local "today" is still yesterday in UTC.
export function isBookableSessionDate(value: string, now: Date = new Date()): boolean {
  if (!SESSION_DATE_PATTERN.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  // Round-trip rejects impossible days such as 2026-02-31
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return false;

  const earliest = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1);
  const latest = Date.UTC(
    now.getUTCFullYear() + MAX_BOOKING_YEARS_AHEAD,
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  return date.getTime() >= earliest && date.getTime() <= latest;
}

export const contactFormSchema = z.object({
  name: z
    .string()
    .transform(collapseNewlines)
    .pipe(
      z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be 100 characters or fewer"),
    ),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email must be 254 characters or fewer"),
  website: z.string().trim().max(200).optional(),
  photographyType: z.enum(
    PHOTOGRAPHY_TYPE_OPTIONS.map((option) => option.value) as [
      PhotographyType,
      ...PhotographyType[],
    ],
    {
      errorMap: () => ({ message: "Please select a photography type" }),
    },
  ),
  preferredDate: z
    .string()
    .transform(collapseNewlines)
    .pipe(
      z
        .string()
        .min(1, "Please pick an ideal date")
        .refine((value) => isBookableSessionDate(value), SESSION_DATE_MESSAGE),
    ),
  alternateDates: z
    .array(
      z
        .string()
        .transform(collapseNewlines)
        .pipe(z.string().refine((value) => isBookableSessionDate(value), SESSION_DATE_MESSAGE)),
    )
    .max(2)
    .optional(),
  location: z
    .string()
    .transform(collapseNewlines)
    .pipe(
      z
        .string()
        .min(2, "Please add a location (or 'flexible')")
        .max(200, "Location must be 200 characters or fewer"),
    ),
  message: z.string().max(5000, "Message must be 5000 characters or fewer").optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
