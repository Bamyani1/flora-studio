"use server";

import { cookies } from "next/headers";
import { getContactServerConfig } from "@/lib/contact-config.server";
import {
  contactFormSchema,
  photographyTypeLabel,
  type ContactFormData,
} from "@/lib/validations";

export type ContactActionResult = { success: true } | { success: false; error: string };

const DELIVERY_FAILURE_MESSAGE = "Failed to send message. Please try again later.";
const THROTTLE_MESSAGE = "Please wait a moment before submitting again.";
const CONTACT_TEST_FAILURE_COOKIE = "__contact_delivery_test";
const THROTTLE_COOKIE = "__contact_throttle";
const THROTTLE_WINDOW_SEC = 60;

type ContactDeliveryTestFailureMode = "primary" | "auto-reply";

function buildNotificationEmailText(data: ContactFormData) {
  const lines: string[] = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Type: ${photographyTypeLabel(data.photographyType)}`,
    `Preferred date: ${data.preferredDate}`,
  ];

  if (data.alternateDates && data.alternateDates.length > 0) {
    lines.push(`Alternate dates: ${data.alternateDates.join(", ")}`);
  }

  lines.push(`Location: ${data.location}`);

  lines.push("", "Message:", data.message?.trim() || "(none provided)");

  return lines.join("\n");
}

// The auto-reply is delivered to the address the submitter typed, which is not
// verified to be theirs. To stop this authenticated, DMARC-aligned mailbox from
// being used to relay attacker text to arbitrary recipients, the body echoes NO
// free-text fields — only the session type, which is constrained to the fixed
// PHOTOGRAPHY_TYPE_OPTIONS enum. The studio's own notification email (to the
// studio inbox) still carries every detail.
function buildAutoReplyText(data: ContactFormData, contactEmail: string) {
  return [
    "Hi there,",
    "",
    "Thanks — we received your inquiry and will follow up within 24 hours.",
    "",
    `· Session: ${photographyTypeLabel(data.photographyType)}`,
    "",
    "If any details need to change, just reply to this email.",
    "",
    "— Flora Studio",
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

function shouldEnforceThrottle(): boolean {
  return (
    process.env.NODE_ENV === "production" && process.env.CONTENT_RUNTIME_MODE !== "e2e"
  );
}

async function isThrottled(): Promise<boolean> {
  if (!shouldEnforceThrottle()) return false;
  const cookieStore = await cookies();
  const raw = cookieStore.get(THROTTLE_COOKIE)?.value;
  if (!raw) return false;
  const lastMs = Number(raw);
  if (!Number.isFinite(lastMs)) return false;
  const elapsedSec = Math.floor((Date.now() - lastMs) / 1000);
  return elapsedSec < THROTTLE_WINDOW_SEC;
}

async function markSubmitted(): Promise<void> {
  if (!shouldEnforceThrottle()) return;
  const cookieStore = await cookies();
  cookieStore.set(THROTTLE_COOKIE, String(Date.now()), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: THROTTLE_WINDOW_SEC,
    path: "/",
  });
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

  if (await isThrottled()) {
    return { success: false, error: THROTTLE_MESSAGE };
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

    return { success: true };
  }

  if (!smtpUser || !smtpPass || !contactEmail) {
    if (isProduction) {
      console.error("[Contact] Missing ICLOUD_SMTP_USER, ICLOUD_SMTP_PASS, or CONTACT_EMAIL.");
      return { success: false, error: DELIVERY_FAILURE_MESSAGE };
    }

    return { success: true };
  }

  try {
    await markSubmitted();
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.me.com",
      port: 587,
      secure: false,
      requireTLS: true,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `Flora Studio <${contactEmail}>`,
      to: contactEmail,
      replyTo: parsed.data.email,
      subject: `New inquiry from ${parsed.data.name}: ${photographyTypeLabel(parsed.data.photographyType)}`,
      text: buildNotificationEmailText(parsed.data),
    });

    try {
      if (deliveryTestFailureMode === "auto-reply") {
        throw new Error("Forced auto-reply failure for non-production testing.");
      }

      await transporter.sendMail({
        from: `Flora Studio <${contactEmail}>`,
        to: parsed.data.email,
        subject: "We received your inquiry | Flora Studio",
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
