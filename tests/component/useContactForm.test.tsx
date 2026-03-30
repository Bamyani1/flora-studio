"use client";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useContactForm } from "@/hooks/useContactForm";
import type { ContactFormData } from "@/lib/validations";

const { mockSubmitContactForm } = vi.hoisted(() => ({
  mockSubmitContactForm: vi.fn(),
}));

vi.mock("@/app/contact/action", () => ({
  submitContactForm: mockSubmitContactForm,
}));

function ContactFormHarness() {
  const { fieldErrors, formError, submitted, isPending, handleBlur, handleSubmit, resetSubmitted } =
    useContactForm({
      getData: (formData) => ({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        photographyType: formData.get("photographyType") as ContactFormData["photographyType"],
        message: formData.get("message") as string,
      }),
    });

  if (submitted) {
    return (
      <div>
        <span>Submitted</span>
        <button type="button" onClick={resetSubmitted}>
          Reset
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {formError ? <div role="alert">{formError}</div> : null}
      <input aria-label="Name" name="name" onBlur={handleBlur("name")} />
      {fieldErrors.name ? <div role="alert">{fieldErrors.name}</div> : null}
      <input aria-label="Email" name="email" onBlur={handleBlur("email")} />
      {fieldErrors.email ? <div role="alert">{fieldErrors.email}</div> : null}
      <select aria-label="Photography Type" name="photographyType" onBlur={handleBlur("photographyType")}>
        <option value="">Select one</option>
        <option value="milestones">Milestones</option>
      </select>
      {fieldErrors.photographyType ? <div role="alert">{fieldErrors.photographyType}</div> : null}
      <textarea aria-label="Message" name="message" onBlur={handleBlur("message")} />
      {fieldErrors.message ? <div role="alert">{fieldErrors.message}</div> : null}
      <button type="submit">{isPending ? "Sending" : "Submit"}</button>
    </form>
  );
}

describe("useContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates individual fields on blur", () => {
    render(<ContactFormHarness />);

    fireEvent.blur(screen.getByLabelText("Email"), { target: { value: "bad-email" } });

    expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument();
  });

  it("marks the form as submitted after a successful send", async () => {
    mockSubmitContactForm.mockResolvedValue({ success: true });

    render(<ContactFormHarness />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ava Reed" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ava@example.com" } });
    fireEvent.change(screen.getByLabelText("Photography Type"), {
      target: { value: "milestones" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "I would love to book a portrait session this spring." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(screen.getByText("Submitted")).toBeInTheDocument();
    });
  });

  it("returns to a fresh form after resetting a successful submit", async () => {
    mockSubmitContactForm.mockResolvedValue({ success: true });

    render(<ContactFormHarness />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ava Reed" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ava@example.com" } });
    fireEvent.change(screen.getByLabelText("Photography Type"), {
      target: { value: "milestones" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "I would love to book a portrait session this spring." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(screen.getByText("Submitted")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Photography Type")).toHaveValue("");
    expect(screen.getByLabelText("Message")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("surfaces provider errors after a valid submit", async () => {
    mockSubmitContactForm.mockResolvedValue({
      success: false,
      error: "Failed to send message. Please try again later.",
    });

    render(<ContactFormHarness />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ava Reed" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ava@example.com" } });
    fireEvent.change(screen.getByLabelText("Photography Type"), {
      target: { value: "milestones" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "I would love to book a portrait session this spring." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to send message. Please try again later."),
      ).toBeInTheDocument();
    });
  });
});
