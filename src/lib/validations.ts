import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  website: z.string().trim().optional(),
  photographyType: z.enum(
    ["milestones", "gatherings", "motion", "portraits", "professional", "landscape"],
    {
      errorMap: () => ({ message: "Please select a photography type" }),
    },
  ),
  preferredDate: z.string().min(1, "Please pick an ideal date"),
  alternateDates: z.array(z.string()).max(2).optional(),
  location: z.string().min(2, "Please add a location (or 'flexible')"),
  message: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
