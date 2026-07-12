import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/lib/public-env", () => ({
  publicEnv: {
    cookieConsentEnabled: true,
  },
}));

vi.mock("@vercel/analytics/react", () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}));

vi.mock("@vercel/speed-insights/react", () => ({
  SpeedInsights: () => <div data-testid="vercel-speed-insights" />,
}));

import { VercelAnalytics } from "@/components/analytics/VercelAnalytics";
import {
  COOKIE_CONSENT_CHANGE_EVENT,
  buildCookieConsentCookieString,
  createCookieConsentState,
} from "@/lib/cookie-consent";

function writeConsentCookie(analytics: boolean) {
  document.cookie = buildCookieConsentCookieString(createCookieConsentState({ analytics }));
}

describe("VercelAnalytics", () => {
  beforeEach(() => {
    document.cookie = "flora_consent=; Max-Age=0; Path=/";
  });

  afterEach(() => {
    document.cookie = "flora_consent=; Max-Age=0; Path=/";
  });

  it("renders nothing when no consent cookie is stored", () => {
    const { container } = render(<VercelAnalytics />);

    expect(container).toBeEmptyDOMElement();
  });

  it("mounts analytics when consent is granted and the change event fires", () => {
    const { container } = render(<VercelAnalytics />);

    expect(container).toBeEmptyDOMElement();

    writeConsentCookie(true);
    fireEvent(window, new Event(COOKIE_CONSENT_CHANGE_EVENT));

    expect(screen.getByTestId("vercel-analytics")).toBeInTheDocument();
    expect(screen.getByTestId("vercel-speed-insights")).toBeInTheDocument();
  });

  it("unmounts analytics when consent is revoked and the change event fires", () => {
    writeConsentCookie(true);

    render(<VercelAnalytics />);

    expect(screen.getByTestId("vercel-analytics")).toBeInTheDocument();

    writeConsentCookie(false);
    fireEvent(window, new Event(COOKIE_CONSENT_CHANGE_EVENT));

    expect(screen.queryByTestId("vercel-analytics")).not.toBeInTheDocument();
    expect(screen.queryByTestId("vercel-speed-insights")).not.toBeInTheDocument();
  });
});
