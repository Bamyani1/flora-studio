export interface ContactServerConfig {
  resendApiKey: string | null;
  contactEmail: string | null;
}

export function getContactServerConfig(): ContactServerConfig {
  return {
    resendApiKey: process.env.RESEND_API_KEY || null,
    contactEmail: process.env.CONTACT_EMAIL || null,
  };
}
