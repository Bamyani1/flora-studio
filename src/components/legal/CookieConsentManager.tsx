"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { publicEnv } from "@/lib/public-env";
import {
  buildCookieConsentCookieString,
  createCookieConsentState,
  readCookieConsent,
  type CookieConsentState,
} from "@/lib/cookie-consent";

type ConsentDraft = {
  analytics: boolean;
  marketing: boolean;
};

interface ConsentUiState {
  bannerVisible: boolean;
  consent: CookieConsentState | null;
  draft: ConsentDraft;
  isReady: boolean;
}

const panelClass =
  "fixed inset-x-4 bottom-4 z-[70] border border-border bg-surface-lowest p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:left-1/2 md:max-w-3xl md:-translate-x-1/2";

const actionClass =
  "inline-flex min-h-[44px] items-center justify-center border border-border px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-text transition-colors duration-300 hover:border-primary hover:text-primary";

const primaryActionClass =
  "inline-flex min-h-[44px] items-center justify-center bg-primary px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-background transition-colors duration-300 hover:bg-primary-muted";

const DEFAULT_DRAFT: ConsentDraft = {
  analytics: false,
  marketing: false,
};

function draftFromConsent(consent: CookieConsentState | null): ConsentDraft {
  return {
    analytics: consent?.analytics ?? false,
    marketing: consent?.marketing ?? false,
  };
}

export function CookieConsentManager() {
  const enabled = publicEnv.cookieConsentEnabled;
  const lenis = useLenis();
  const dialogRef = useRef<HTMLDivElement>(null);
  const bannerCustomizeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [consentState, setConsentState] = useState<ConsentUiState>({
    bannerVisible: false,
    consent: null,
    draft: DEFAULT_DRAFT,
    isReady: !enabled,
  });
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useFocusTrap(dialogRef, preferencesOpen);

  useEffect(() => {
    if (!enabled) return;

    const frameId = window.requestAnimationFrame(() => {
      const existingConsent = readCookieConsent(document.cookie);
      setConsentState({
        bannerVisible: !existingConsent,
        consent: existingConsent,
        draft: draftFromConsent(existingConsent),
        isReady: true,
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [enabled]);

  useEffect(() => {
    if (!preferencesOpen) return;

    lenis?.stop();

    return () => {
      lenis?.start();
    };
  }, [lenis, preferencesOpen]);

  const restoreFocus = useCallback((target: "banner" | "trigger") => {
    window.requestAnimationFrame(() => {
      if (target === "trigger") {
        triggerRef.current?.focus();
        return;
      }

      bannerCustomizeRef.current?.focus();
    });
  }, []);

  const closePreferences = useCallback(() => {
    const hasStoredConsent = Boolean(consentState.consent);

    setPreferencesOpen(false);
    if (!hasStoredConsent) {
      setConsentState((current) => ({
        ...current,
        bannerVisible: true,
        draft: DEFAULT_DRAFT,
      }));
    }

    restoreFocus(hasStoredConsent ? "trigger" : "banner");
  }, [consentState.consent, restoreFocus]);

  useEffect(() => {
    if (!preferencesOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      closePreferences();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closePreferences, preferencesOpen]);

  const openPreferences = useCallback(
    (source: "banner" | "trigger") => {
      setConsentState((current) => ({
        ...current,
        bannerVisible: source === "banner" ? false : current.bannerVisible,
        draft: draftFromConsent(current.consent),
      }));
      setPreferencesOpen(true);
    },
    [],
  );

  const saveConsent = useCallback((nextDraft: ConsentDraft) => {
    const nextConsent = createCookieConsentState(nextDraft);
    document.cookie = buildCookieConsentCookieString(
      nextConsent,
      window.location.protocol === "https:",
    );
    setConsentState({
      bannerVisible: false,
      consent: nextConsent,
      draft: nextDraft,
      isReady: true,
    });
    setPreferencesOpen(false);
    restoreFocus("trigger");
  }, [restoreFocus]);

  const bannerVisible = enabled && consentState.isReady && consentState.bannerVisible && !preferencesOpen;
  const triggerVisible =
    enabled &&
    consentState.isReady &&
    !preferencesOpen &&
    !consentState.bannerVisible &&
    Boolean(consentState.consent);

  if (!enabled || !consentState.isReady) {
    return null;
  }

  return (
    <>
      {bannerVisible ? (
        <div className={panelClass} role="region" aria-label="Cookie preferences banner">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="font-label text-xs uppercase tracking-[0.2em] text-primary">
                Cookie Preferences
              </p>
              <p className="text-sm leading-relaxed text-muted md:text-base">
                Essential site technologies are always enabled. If Bahar Studio activates future
                analytics or marketing tools, you can manage those categories here before they are
                used.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <button
                type="button"
                className={primaryActionClass}
                onClick={() => saveConsent({ analytics: true, marketing: true })}
              >
                Accept all
              </button>
              <button
                type="button"
                className={actionClass}
                onClick={() => saveConsent({ analytics: false, marketing: false })}
              >
                Reject non-essential
              </button>
              <button
                ref={bannerCustomizeRef}
                type="button"
                className={actionClass}
                onClick={() => openPreferences("banner")}
              >
                Customize
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {preferencesOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-background/80 px-4 py-6 md:items-center"
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            closePreferences();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-preferences-title"
        >
          <div
            ref={dialogRef}
            className="w-full max-w-2xl border border-border bg-surface-lowest p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          >
            <div className="space-y-2">
              <p className="font-label text-xs uppercase tracking-[0.2em] text-primary">
                Cookie Preferences
              </p>
              <h2
                id="cookie-preferences-title"
                className="font-display text-3xl font-light text-text-heading"
              >
                Choose non-essential categories
              </h2>
              <p className="text-sm leading-relaxed text-muted md:text-base">
                Essential technologies remain on because they are required for the site to operate.
                Analytics and marketing categories remain off unless you choose otherwise.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-label text-xs uppercase tracking-[0.2em] text-text-heading">
                      Essential
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Required for core site operation and consent storage.
                    </p>
                  </div>
                  <span className="font-label text-xs uppercase tracking-[0.2em] text-primary">
                    Always on
                  </span>
                </div>
              </div>

              <label className="block border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-label text-xs uppercase tracking-[0.2em] text-text-heading">
                      Analytics
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Controls future site-measurement tools if Bahar Studio adds them later.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={consentState.draft.analytics}
                    onChange={(event) =>
                      setConsentState((current) => ({
                        ...current,
                        draft: { ...current.draft, analytics: event.target.checked },
                      }))
                    }
                    aria-label="Analytics consent"
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                </div>
              </label>

              <label className="block border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-label text-xs uppercase tracking-[0.2em] text-text-heading">
                      Marketing
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Controls future advertising or remarketing tools if Bahar Studio adds them
                      later.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={consentState.draft.marketing}
                    onChange={(event) =>
                      setConsentState((current) => ({
                        ...current,
                        draft: { ...current.draft, marketing: event.target.checked },
                      }))
                    }
                    aria-label="Marketing consent"
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                </div>
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row md:justify-end">
              <button type="button" className={actionClass} onClick={closePreferences}>
                Cancel
              </button>
              <button
                type="button"
                className={actionClass}
                onClick={() => saveConsent({ analytics: false, marketing: false })}
              >
                Reject non-essential
              </button>
              <button
                type="button"
                className={primaryActionClass}
                onClick={() => saveConsent(consentState.draft)}
              >
                Save choices
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {triggerVisible ? (
        <button
          ref={triggerRef}
          type="button"
          className="fixed right-4 bottom-4 z-[60] border border-border bg-surface-lowest px-4 py-3 font-label text-[11px] uppercase tracking-[0.18em] text-text transition-colors duration-300 hover:border-primary hover:text-primary"
          onClick={() => openPreferences("trigger")}
        >
          Cookie Preferences
        </button>
      ) : null}
    </>
  );
}
