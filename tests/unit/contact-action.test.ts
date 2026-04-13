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

const validPayload = {
  name: "Ava Reed",
  email: "ava@example.com",
  photographyType: "milestones" as const,
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

    const { submitContactForm } = await import("@/app/contact/action");

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

    const { submitContactForm } = await import("@/app/contact/action");

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

    const { submitContactForm } = await import("@/app/contact/action");

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

    const { submitContactForm } = await import("@/app/contact/action");

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

    const { submitContactForm } = await import("@/app/contact/action");

    await expect(submitContactForm(validPayload)).resolves.toEqual({ success: true });
    expect(mockCreateTransport).toHaveBeenCalledWith({
      host: "smtp.mail.me.com",
      port: 587,
      secure: false,
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
      }),
    );
    expect(mockSendMail).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        from: `Flora Studio <${contactEmail}>`,
        to: "ava@example.com",
        subject: "We received your message — Flora Studio",
      }),
    );
  });

  it("returns a user-facing error when the non-production test cookie forces a primary failure", async () => {
    mockCookieGet.mockReturnValue({ value: "primary" });
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "stub",
    });

    const { submitContactForm } = await import("@/app/contact/action");

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

    const { submitContactForm } = await import("@/app/contact/action");

    await expect(submitContactForm(validPayload)).resolves.toEqual({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
    expect(mockSendMail).toHaveBeenCalledTimes(1);
  });

  it("returns success when the auto-reply fails after the inquiry was delivered", async () => {
    mockGetContactServerConfig.mockReturnValue({
      smtpUser,
      smtpPass: "app-specific-password",
      contactEmail,
      deliveryMode: "live",
    });
    mockSendMail.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error("Mailbox unavailable"));

    const { submitContactForm } = await import("@/app/contact/action");

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

    const { submitContactForm } = await import("@/app/contact/action");

    await expect(
      submitContactForm({
        ...validPayload,
        website: "https://spam.example",
      }),
    ).resolves.toEqual({ success: true });
    expect(mockSendMail).not.toHaveBeenCalled();
  });
});
