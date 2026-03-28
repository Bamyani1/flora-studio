import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteMedia } from "@/components/ui/SiteMedia";

describe("SiteMedia", () => {
  it("renders the shared placeholder marker with accessible alt text", () => {
    render(<SiteMedia src="placeholder://bahar-studio/test" alt="Example placeholder" fill />);

    const media = screen.getByRole("img", { name: "Example placeholder" });
    expect(media).toHaveAttribute("data-media-placeholder", "true");
    expect(media).toHaveAttribute("data-placeholder-label", "Media Placeholder");
  });

  it("preserves an intrinsic ratio when width and height are provided", () => {
    render(<SiteMedia src="placeholder://bahar-studio/test" alt="Ratio placeholder" width={1200} height={800} />);

    const media = screen.getByRole("img", { name: "Ratio placeholder" });
    expect(media).toHaveStyle({ aspectRatio: "1200 / 800" });
  });
});
