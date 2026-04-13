import { z } from "zod";

export const COOKIE_CONSENT_COOKIE_NAME = "flora_consent";
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

export type CookieConsentCategory = "essential" | "analytics" | "marketing";

export interface CookieConsentState {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

const cookieConsentSchema = z.object({
  essential: z.literal(true),
  analytics: z.boolean(),
  marketing: z.boolean(),
  updatedAt: z.string().datetime({ offset: true }),
});

export function createCookieConsentState({
  analytics = false,
  marketing = false,
  updatedAt = new Date().toISOString(),
}: {
  analytics?: boolean;
  marketing?: boolean;
  updatedAt?: string;
} = {}): CookieConsentState {
  return {
    essential: true,
    analytics,
    marketing,
    updatedAt,
  };
}

export function parseCookieConsent(value: string | null | undefined): CookieConsentState | null {
  if (!value) return null;

  try {
    const decoded = decodeURIComponent(value);
    const parsed = cookieConsentSchema.safeParse(JSON.parse(decoded));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function serializeCookieConsent(value: CookieConsentState): string {
  return encodeURIComponent(JSON.stringify(value));
}

export function readCookieConsent(cookieSource: string): CookieConsentState | null {
  const match = cookieSource
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${COOKIE_CONSENT_COOKIE_NAME}=`));

  if (!match) return null;

  return parseCookieConsent(match.slice(COOKIE_CONSENT_COOKIE_NAME.length + 1));
}

export function buildCookieConsentCookieString(value: CookieConsentState, secure = false): string {
  const parts = [
    `${COOKIE_CONSENT_COOKIE_NAME}=${serializeCookieConsent(value)}`,
    "Path=/",
    `Max-Age=${COOKIE_CONSENT_MAX_AGE}`,
    "SameSite=Lax",
  ];

  if (secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function canLoadConsentCategory(
  consent: CookieConsentState | null,
  category: CookieConsentCategory,
): boolean {
  if (category === "essential") {
    return true;
  }

  return Boolean(consent?.[category]);
}
