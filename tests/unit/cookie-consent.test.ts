import { describe, expect, it } from "vitest";
import {
  COOKIE_CONSENT_COOKIE_NAME,
  buildCookieConsentCookieString,
  canLoadConsentCategory,
  createCookieConsentState,
  parseCookieConsent,
  readCookieConsent,
  serializeCookieConsent,
} from "@/lib/cookie-consent";

describe("cookie consent helpers", () => {
  it("round-trips a valid consent payload", () => {
    const consent = createCookieConsentState({
      analytics: true,
      marketing: false,
      updatedAt: "2026-03-30T12:00:00.000Z",
    });

    expect(parseCookieConsent(serializeCookieConsent(consent))).toEqual(consent);
  });

  it("returns null for invalid payloads", () => {
    const invalid = encodeURIComponent(
      JSON.stringify({
        essential: false,
        analytics: true,
        marketing: false,
        updatedAt: "not-a-date",
      }),
    );

    expect(parseCookieConsent(invalid)).toBeNull();
    expect(parseCookieConsent("definitely-not-json")).toBeNull();
  });

  it("reads a consent payload from a cookie string", () => {
    const consent = createCookieConsentState({
      analytics: false,
      marketing: true,
      updatedAt: "2026-03-30T12:00:00.000Z",
    });

    const cookieSource = `foo=bar; ${COOKIE_CONSENT_COOKIE_NAME}=${serializeCookieConsent(consent)}; theme=dark`;

    expect(readCookieConsent(cookieSource)).toEqual(consent);
  });

  it("builds a cookie string with safe defaults", () => {
    const consent = createCookieConsentState({
      analytics: true,
      marketing: true,
      updatedAt: "2026-03-30T12:00:00.000Z",
    });

    const cookieString = buildCookieConsentCookieString(consent, true);

    expect(cookieString).toContain(`${COOKIE_CONSENT_COOKIE_NAME}=`);
    expect(cookieString).toContain("Path=/");
    expect(cookieString).toContain("Max-Age=");
    expect(cookieString).toContain("SameSite=Lax");
    expect(cookieString).toContain("Secure");
  });

  it("always allows essential category and gates non-essential categories", () => {
    const consent = createCookieConsentState({
      analytics: true,
      marketing: false,
      updatedAt: "2026-03-30T12:00:00.000Z",
    });

    expect(canLoadConsentCategory(null, "essential")).toBe(true);
    expect(canLoadConsentCategory(null, "analytics")).toBe(false);
    expect(canLoadConsentCategory(consent, "analytics")).toBe(true);
    expect(canLoadConsentCategory(consent, "marketing")).toBe(false);
  });
});
