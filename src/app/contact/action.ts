"use server";

import { contactFormSchema, type ContactFormData } from "@/lib/validations";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function submitContactForm(data: ContactFormData): Promise<ActionResult> {
  const parsed = contactFormSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "Invalid form data. Please check your inputs." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !contactEmail) {
    console.log("[Contact] No RESEND_API_KEY or CONTACT_EMAIL configured. Logging submission:");
    console.log(JSON.stringify(parsed.data, null, 2));
    return { success: true };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "Silk Road Studio <onboarding@resend.dev>",
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

    return { success: true };
  } catch (err) {
    console.error("[Contact] Failed to send email:", err);
    return { success: false, error: "Failed to send message. Please try again later." };
  }
}
