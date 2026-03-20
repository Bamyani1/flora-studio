import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  photographyType: z.enum(["landscapes", "nightsky", "sports", "portraits", "stories"], {
    errorMap: () => ({ message: "Please select a photography type" }),
  }),
  preferredDate: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
