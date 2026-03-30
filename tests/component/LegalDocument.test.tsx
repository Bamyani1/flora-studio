import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LegalDocument } from "@/components/legal/LegalDocument";

describe("LegalDocument", () => {
  it("renders a table of contents, section anchors, paragraphs, and bullets", () => {
    const { container } = render(
      <LegalDocument
        sections={[
          {
            id: "example-section",
            title: "Example Section",
            paragraphs: ["First paragraph.", "Second paragraph."],
            bullets: ["First bullet", "Second bullet"],
          },
        ]}
      />,
    );

    expect(screen.getByRole("navigation", { name: "Table of contents" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Example Section" })).toHaveAttribute(
      "href",
      "#example-section",
    );
    expect(container.querySelector("#example-section")).not.toBeNull();
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
    expect(screen.getByText("First bullet")).toBeInTheDocument();
    expect(screen.getByText("Second bullet")).toBeInTheDocument();
  });
});
