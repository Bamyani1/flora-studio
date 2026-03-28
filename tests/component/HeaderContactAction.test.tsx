import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeaderContactAction } from "@/components/layout/HeaderContactAction";
import { setMockPathname } from "../setup/mockNextNavigation";

describe("HeaderContactAction", () => {
  it("renders a transition link to contact", () => {
    setMockPathname("/about");

    render(<HeaderContactAction />);

    expect(screen.getByRole("link", { name: "Get in touch" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("renders custom label when provided", () => {
    setMockPathname("/");

    render(<HeaderContactAction label="Contact us" />);

    expect(screen.getByRole("link", { name: "Contact us" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});
