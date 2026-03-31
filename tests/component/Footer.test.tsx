import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import { LEGAL_NAV_ITEMS } from "@/lib/navigation";

describe("Footer", () => {
  it("renders privacy and terms links", () => {
    render(<Footer socialLinks={[]} />);

    for (const link of LEGAL_NAV_ITEMS) {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute("href", link.href);
    }
  });
});
