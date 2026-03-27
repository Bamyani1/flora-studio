import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockSend, mockGetContactServerConfig } = vi.hoisted(() => ({
  mockSend: vi.fn(),
  mockGetContactServerConfig: vi.fn(),
}));

vi.mock("@/lib/contact-config.server", () => ({
  getContactServerConfig: mockGetContactServerConfig,
}));

vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = {
      send: mockSend,
    };
  },
}));

import { submitContactForm } from "@/app/contact/action";

describe("submitContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    mockGetContactServerConfig.mockReturnValue({
      resendApiKey: "re_test_key",
      contactEmail: "hello@baharstudio.com",
    });
  });

  it("rejects invalid form data before sending", async () => {
    const result = await submitContactForm({
      name: "A",
      email: "not-an-email",
      photographyType: "milestones",
      message: "short",
    });

    expect(result).toEqual({
      success: false,
      error: "Invalid form data. Please check your inputs.",
    });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns success without sending when contact email config is missing", async () => {
    mockGetContactServerConfig.mockReturnValue({
      resendApiKey: null,
      contactEmail: null,
    });

    const result = await submitContactForm({
      name: "Ava Reed",
      email: "ava@example.com",
      photographyType: "milestones",
      message: "I would love to book a graduation session this spring.",
    });

    expect(result).toEqual({ success: true });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns success when the provider accepts the email", async () => {
    mockSend.mockResolvedValue({
      data: { id: "email_123" },
      error: null,
    });

    const result = await submitContactForm({
      name: "Ava Reed",
      email: "ava@example.com",
      photographyType: "milestones",
      message: "I would love to book a graduation session this spring.",
    });

    expect(result).toEqual({ success: true });
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("returns a failure result when the provider returns an error payload", async () => {
    mockSend.mockResolvedValue({
      data: null,
      error: { message: "Mailbox unavailable" },
    });

    const result = await submitContactForm({
      name: "Ava Reed",
      email: "ava@example.com",
      photographyType: "milestones",
      message: "I would love to book a graduation session this spring.",
    });

    expect(result).toEqual({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
  });

  it("returns a failure result when the provider throws", async () => {
    mockSend.mockRejectedValue(new Error("network down"));

    const result = await submitContactForm({
      name: "Ava Reed",
      email: "ava@example.com",
      photographyType: "milestones",
      message: "I would love to book a graduation session this spring.",
    });

    expect(result).toEqual({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
  });
});
