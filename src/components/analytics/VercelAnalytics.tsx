"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useSyncExternalStore } from "react";

import { canLoadConsentCategory, readCookieConsent } from "@/lib/cookie-consent";
import { publicEnv } from "@/lib/public-env";

function subscribe(onStoreChange: () => void) {
  document.addEventListener("visibilitychange", onStoreChange);
  window.addEventListener("focus", onStoreChange);
  return () => {
    document.removeEventListener("visibilitychange", onStoreChange);
    window.removeEventListener("focus", onStoreChange);
  };
}

function getSnapshot(): boolean {
  if (!publicEnv.cookieConsentEnabled) return true;
  const consent = readCookieConsent(document.cookie);
  return canLoadConsentCategory(consent, "analytics");
}

function getServerSnapshot(): boolean {
  return !publicEnv.cookieConsentEnabled;
}

export function VercelAnalytics() {
  const allowed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!allowed) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
