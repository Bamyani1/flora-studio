"use server";

import { cookies } from "next/headers";
import { getContactServerConfig } from "@/lib/contact-config.server";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";

export type ContactActionResult = { success: true } | { success: false; error: string };

const DELIVERY_FAILURE_MESSAGE = "Failed to send message. Please try again later.";
const CONTACT_TEST_FAILURE_COOKIE = "__contact_delivery_test";

type ContactDeliveryTestFailureMode = "primary" | "auto-reply";

function buildNotificationEmailText(data: ContactFormData) {
  return [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Type: ${data.photographyType}`,
    data.preferredDate ? `Preferred Date: ${data.preferredDate}` : null,
    `\nMessage:\n${data.message}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildAutoReplyText(data: ContactFormData, contactEmail: string) {
  return [
    `Hi ${data.name},`,
    "",
    "Thanks for reaching out to Flora Studio.",
    "We received your message and will follow up within 24 hours.",
    "",
    `Inquiry type: ${data.photographyType}`,
    "",
    "If you need to add anything else before then, just reply to this email.",
    "",
    "Flora Studio",
    contactEmail,
  ].join("\n");
}

async function getDeliveryTestFailureMode(
  isProduction: boolean,
): Promise<ContactDeliveryTestFailureMode | null> {
  if (isProduction) {
    return null;
  }

  const cookieStore = await cookies();
  const failureMode = cookieStore.get(CONTACT_TEST_FAILURE_COOKIE)?.value;

  if (failureMode === "primary" || failureMode === "auto-reply") {
    return failureMode;
  }

  return null;
}

export async function submitContactForm(data: ContactFormData): Promise<ContactActionResult> {
  const parsed = contactFormSchema.safeParse(data);
  const isProduction = process.env.NODE_ENV === "production";

  if (!parsed.success) {
    return { success: false, error: "Invalid form data. Please check your inputs." };
  }

  if (parsed.data.website?.trim()) {
    console.warn("[Contact] Honeypot field was filled. Skipping delivery.");
    return { success: true };
  }

  const deliveryTestFailureMode = await getDeliveryTestFailureMode(isProduction);

  if (deliveryTestFailureMode === "primary") {
    return { success: false, error: DELIVERY_FAILURE_MESSAGE };
  }

  const { smtpUser, smtpPass, contactEmail, deliveryMode } = getContactServerConfig();

  if (deliveryMode === "stub") {
    if (isProduction) {
      console.error("[Contact] Stub delivery mode is not allowed in production.");
      return { success: false, error: DELIVERY_FAILURE_MESSAGE };
    }

    console.log("[Contact] Stub delivery mode enabled. Skipping email send.");
    return { success: true };
  }

  if (!smtpUser || !smtpPass || !contactEmail) {
    if (isProduction) {
      console.error("[Contact] Missing ICLOUD_SMTP_USER, ICLOUD_SMTP_PASS, or CONTACT_EMAIL.");
      return { success: false, error: DELIVERY_FAILURE_MESSAGE };
    }

    console.log("[Contact] Missing SMTP credentials outside production. Skipping email send.");
    return { success: true };
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.me.com",
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `Flora Studio <${contactEmail}>`,
      to: contactEmail,
      replyTo: parsed.data.email,
      subject: `New inquiry from ${parsed.data.name}: ${parsed.data.photographyType}`,
      text: buildNotificationEmailText(parsed.data),
    });

    try {
      if (deliveryTestFailureMode === "auto-reply") {
        throw new Error("Forced auto-reply failure for non-production testing.");
      }

      await transporter.sendMail({
        from: `Flora Studio <${contactEmail}>`,
        to: parsed.data.email,
        subject: "We received your message | Flora Studio",
        text: buildAutoReplyText(parsed.data, contactEmail),
      });
    } catch (err) {
      console.error("[Contact] Failed to send confirmation auto-reply:", err);
    }

    return { success: true };
  } catch (err) {
    console.error("[Contact] Failed to send email:", err);
    return { success: false, error: DELIVERY_FAILURE_MESSAGE };
  }
}
