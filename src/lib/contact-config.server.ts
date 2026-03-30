export interface ContactServerConfig {
  smtpUser: string | null;
  smtpPass: string | null;
  contactEmail: string | null;
  deliveryMode: "live" | "stub";
}

export function getContactServerConfig(): ContactServerConfig {
  return {
    smtpUser: process.env.ICLOUD_SMTP_USER || null,
    smtpPass: process.env.ICLOUD_SMTP_PASS || null,
    contactEmail: process.env.CONTACT_EMAIL || null,
    deliveryMode: process.env.CONTACT_DELIVERY_MODE === "stub" ? "stub" : "live",
  };
}
