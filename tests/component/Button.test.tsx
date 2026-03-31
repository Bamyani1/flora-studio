import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("defaults to the GitHub body typography contract", () => {
    render(<Button>Book a session</Button>);

    expect(screen.getByRole("button", { name: "Book a session" })).toHaveClass("font-body");
  });

  it("uses the GitHub label styling for xs buttons", () => {
    render(<Button size="xs">Label button</Button>);

    expect(screen.getByRole("button", { name: "Label button" })).toHaveClass(
      "font-label",
      "uppercase",
    );
  });
});
