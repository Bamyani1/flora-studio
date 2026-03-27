"use server";

import { getContactServerConfig } from "@/lib/contact-config.server";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";

export type ContactActionResult =
  | { success: true }
  | { success: false; error: string };

export async function submitContactForm(data: ContactFormData): Promise<ContactActionResult> {
  const parsed = contactFormSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "Invalid form data. Please check your inputs." };
  }

  const { resendApiKey, contactEmail } = getContactServerConfig();

  if (!resendApiKey || !contactEmail) {
    console.log("[Contact] No RESEND_API_KEY or CONTACT_EMAIL configured. Skipping email send.");
    return { success: true };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);

    const result = await resend.emails.send({
      from: "Bahar Studio <onboarding@resend.dev>",
      to: contactEmail,
      replyTo: parsed.data.email,
      subject: `New inquiry from ${parsed.data.name} — ${parsed.data.photographyType}`,
      text: [
        `Name: ${parsed.data.name}`,
        `Email: ${parsed.data.email}`,
        `Type: ${parsed.data.photographyType}`,
        parsed.data.preferredDate ? `Preferred Date: ${parsed.data.preferredDate}` : null,
        `\nMessage:\n${parsed.data.message}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (result.error) {
      console.error("[Contact] Failed to send email:", result.error);
      return { success: false, error: "Failed to send message. Please try again later." };
    }

    return { success: true };
  } catch (err) {
    console.error("[Contact] Failed to send email:", err);
    return { success: false, error: "Failed to send message. Please try again later." };
  }
}
