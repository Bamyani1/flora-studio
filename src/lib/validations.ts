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

export const contactFormSchema = z.object({
  name: z
    .string()
    .transform((v) => v.replace(/[\r\n]+/g, " ").trim())
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
    .min(1, "Please pick an ideal date")
    .max(100, "Preferred date must be 100 characters or fewer"),
  alternateDates: z
    .array(z.string().max(100, "Alternate dates must be 100 characters or fewer"))
    .max(2)
    .optional(),
  location: z
    .string()
    .min(2, "Please add a location (or 'flexible')")
    .max(200, "Location must be 200 characters or fewer"),
  message: z.string().max(5000, "Message must be 5000 characters or fewer").optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
