import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockCookies,
  mockCookieGet,
  mockCreateTransport,
  mockGetContactServerConfig,
  mockSendMail,
} = vi.hoisted(() => ({
  mockCookies: vi.fn(),
  mockCookieGet: vi.fn(),
  mockCreateTransport: vi.fn(),
  mockGetContactServerConfig: vi.fn(),
  mockSendMail: vi.fn(),
}));

vi.mock("@/lib/contact-config.server", () => ({
  getContactServerConfig: mockGetContactServerConfig,
}));

vi.mock("next/headers", () => ({
  cookies: mockCookies,
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: mockCreateTransport,
  },
  createTransport: mockCreateTransport,
}));

const smtpUser = "studio-mailbox@icloud.com";
const contactEmail = "info@floraohio.com";

// Session dates must be bookable (today onward), so fixtures are relative to now
const daysFromNow = (days: number) =>
  new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
const preferredDate = daysFromNow(60);

const validPayload = {
  name: "Ava Reed",
  email: "ava@example.com",
  photographyType: "milestones" as const,
  preferredDate,
  location: "Dayton, Ohio",
  message: "I would love to book a graduation session this spring.",
};

describe("submitContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "test");
    mockCookies.mockResolvedValue({ get: mockCookieGet });
    mockCookieGet.mockReturnValue(undefined);
    mockCreateTransport.mockReturnValue({
      sendMail: mockSendMail,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns success immediately in stub delivery mode outside production", async () => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "stub",
    });

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(submitContactForm(validPayload)).resolves.toEqual({ success: true });
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("returns success when SMTP credentials are missing outside production", async () => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser: null,
      smtpPass: null,
      contactEmail: null,
      deliveryMode: "live",
    });

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(submitContactForm(validPayload)).resolves.toEqual({ success: true });
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("returns a user-facing error when stub mode is enabled in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "stub",
    });

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(submitContactForm(validPayload)).resolves.toEqual({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("returns a user-facing error when credentials are missing in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    mockGetContactServerConfig.mockReturnValue({
      smtpUser: null,
      smtpPass: null,
      contactEmail: null,
      deliveryMode: "live",
    });

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(submitContactForm(validPayload)).resolves.toEqual({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("sends the studio notification and confirmation auto-reply on success", async () => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });
    mockSendMail.mockResolvedValue({});

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(submitContactForm(validPayload)).resolves.toEqual({ success: true });
    expect(mockCreateTransport).toHaveBeenCalledWith({
      host: "smtp.mail.me.com",
      port: 587,
      secure: false,
      requireTLS: true,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
      auth: {
        user: smtpUser,
        pass: "app-specific-password",
      },
    });
    expect(mockSendMail).toHaveBeenCalledTimes(2);
    expect(mockSendMail).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        from: `Flora Studio <${contactEmail}>`,
        to: contactEmail,
        replyTo: "ava@example.com",
        text: expect.stringContaining(`Preferred date: ${preferredDate}`),
      }),
    );
    expect(mockSendMail).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        from: `Flora Studio <${contactEmail}>`,
        to: "ava@example.com",
        subject: "We received your inquiry | Flora Studio",
        text: expect.stringContaining("Session: Wedding or graduation"),
      }),
    );
    // The auto-reply lands at the submitter-chosen address, so it must echo none
    // of the attacker-controlled free-text fields (email-relay / phishing guard).
    const autoReplyText = mockSendMail.mock.calls[1][0].text as string;
    expect(autoReplyText).not.toContain("Dayton, Ohio");
    expect(autoReplyText).not.toContain("Ava Reed");
  });

  it("keeps attacker-controlled free text out of the submitter auto-reply", async () => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });
    mockSendMail.mockResolvedValue({});

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(
      submitContactForm({
        ...validPayload,
        name: "Accounts Payable",
        location: "Re-confirm your deposit at http://flora-billing.example/verify",
        message: "URGENT act within 24h: click http://evil.example now",
      }),
    ).resolves.toEqual({ success: true });

    const autoReply = mockSendMail.mock.calls[1][0];
    const body = autoReply.text as string;
    expect(body).not.toContain("flora-billing.example");
    expect(body).not.toContain("evil.example");
    expect(body).not.toContain("Accounts Payable");
    expect(body).not.toContain("URGENT");
  });

  it.each([
    ["free text", "URGENT act within 24h"],
    ["a past date", daysFromNow(-30)],
    ["a six-digit year", "20266-06-14"],
    ["an impossible day", "2027-02-31"],
    ["a CR/LF-smuggled suffix", `${preferredDate}\nExtra`],
  ])("rejects %s as the preferred date", async (_label, badDate) => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(submitContactForm({ ...validPayload, preferredDate: badDate })).resolves.toEqual({
      success: false,
      error: "Invalid form data. Please check your inputs.",
    });
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("rejects a past alternate date", async () => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(
      submitContactForm({ ...validPayload, alternateDates: [daysFromNow(-3)] }),
    ).resolves.toMatchObject({ success: false });
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("collapses CR/LF in location before it reaches any email", async () => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });
    mockSendMail.mockResolvedValue({});

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(
      submitContactForm({
        ...validPayload,
        location: "Dayton\r\nInjected: line",
      }),
    ).resolves.toEqual({ success: true });

    const studioBody = mockSendMail.mock.calls[0][0].text as string;
    expect(studioBody).toContain("Location: Dayton Injected: line");
    expect(studioBody).toContain(`Preferred date: ${preferredDate}`);
  });

  it("includes alternate dates in the email when provided", async () => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });
    mockSendMail.mockResolvedValue({});

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(
      submitContactForm({
        ...validPayload,
        alternateDates: [daysFromNow(67), daysFromNow(74)],
      }),
    ).resolves.toEqual({ success: true });

    expect(mockSendMail).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        text: expect.stringContaining(`Alternate dates: ${daysFromNow(67)}, ${daysFromNow(74)}`),
      }),
    );
  });

  it("rejects submissions missing the required location field", async () => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(
      submitContactForm({
        ...validPayload,
        location: "",
      }),
    ).resolves.toEqual({
      success: false,
      error: "Invalid form data. Please check your inputs.",
    });
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("rejects submissions missing the required preferred date", async () => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(
      submitContactForm({
        ...validPayload,
        preferredDate: "",
      }),
    ).resolves.toEqual({
      success: false,
      error: "Invalid form data. Please check your inputs.",
    });
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("rejects submissions with an over-length name", async () => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(
      submitContactForm({
        ...validPayload,
        name: "A".repeat(101),
      }),
    ).resolves.toEqual({
      success: false,
      error: "Invalid form data. Please check your inputs.",
    });
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("strips CR/LF from the name before it reaches the email subject", async () => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });
    mockSendMail.mockResolvedValue({});

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(
      submitContactForm({
        ...validPayload,
        name: "Ava\r\nBcc: attacker@example.com\nReed",
      }),
    ).resolves.toEqual({ success: true });

    const subject = mockSendMail.mock.calls[0][0].subject as string;
    expect(subject).not.toMatch(/[\r\n]/);
    expect(subject).toContain("Ava Bcc: attacker@example.com Reed");
  });

  it("treats a future throttle timestamp as throttled in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CONTENT_RUNTIME_MODE", "");
    mockCookieGet.mockImplementation((name: string) =>
      name === "__contact_throttle" ? { value: String(Date.now() + 120_000) } : undefined,
    );
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(submitContactForm(validPayload)).resolves.toEqual({
      success: false,
      error: "Please wait a moment before submitting again.",
    });
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("returns a user-facing error when the non-production test cookie forces a primary failure", async () => {
    mockCookieGet.mockReturnValue({ value: "primary" });
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "stub",
    });

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(submitContactForm(validPayload)).resolves.toEqual({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it("returns a user-facing error when the primary inquiry email fails", async () => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });
    mockSendMail.mockRejectedValue(new Error("SMTP auth failed"));

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(submitContactForm(validPayload)).resolves.toEqual({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
    expect(mockSendMail).toHaveBeenCalledTimes(1);
  });

  it("leaves the visitor free to retry when the primary send fails in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CONTENT_RUNTIME_MODE", "");
    const mockCookieSet = vi.fn();
    mockCookies.mockResolvedValue({ get: mockCookieGet, set: mockCookieSet });
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });
    mockSendMail.mockRejectedValueOnce(new Error("SMTP timeout"));

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(submitContactForm(validPayload)).resolves.toMatchObject({ success: false });
    expect(mockCookieSet).not.toHaveBeenCalled();

    mockSendMail.mockResolvedValue({});
    await expect(submitContactForm(validPayload)).resolves.toEqual({ success: true });
    expect(mockCookieSet).toHaveBeenCalledWith(
      "__contact_throttle",
      expect.any(String),
      expect.any(Object),
    );
  });

  it("returns success when the auto-reply fails after the inquiry was delivered", async () => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });
    mockSendMail.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error("Mailbox unavailable"));

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(submitContactForm(validPayload)).resolves.toEqual({ success: true });
    expect(mockSendMail).toHaveBeenCalledTimes(2);
  });

  it("treats honeypot submissions as successful no-send attempts", async () => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });

    const { submitContactForm } = await import("@/app/(site)/contact/action");

    await expect(
      submitContactForm({
        ...validPayload,
        website: "https://spam.example",
      }),
    ).resolves.toEqual({ success: true });
    expect(mockSendMail).not.toHaveBeenCalled();
  });
});
