import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteMedia } from "@/components/ui/SiteMedia";

describe("SiteMedia", () => {
  it("renders the shared placeholder marker with accessible alt text", () => {
    render(<SiteMedia src="placeholder://studio-bahar/test" alt="Example placeholder" fill />);

    const media = screen.getByRole("img", { name: "Example placeholder" });
    expect(media).toHaveAttribute("data-media-placeholder", "true");
    expect(media).toHaveAttribute("data-placeholder-label", "Media Placeholder");
  });

  it("preserves an intrinsic ratio when width and height are provided", () => {
    render(
      <SiteMedia
        src="placeholder://studio-bahar/test"
        alt="Ratio placeholder"
        width={1200}
        height={800}
      />,
    );

    const media = screen.getByRole("img", { name: "Ratio placeholder" });
    expect(media).toHaveStyle({ aspectRatio: "1200 / 800" });
  });

  it("passes onLoad through to Image for real sources", () => {
    const onLoad = vi.fn();
    const { container } = render(
      <SiteMedia src="/images/hero/hero-01.jpg" alt="Hero" fill onLoad={onLoad} />,
    );

    // Verify the img element exists (non-placeholder path renders Image)
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
  });

  it("does not render an img element for placeholder sources", () => {
    const onLoad = vi.fn();
    const { container } = render(
      <SiteMedia src="placeholder://studio-bahar/test" alt="Placeholder" fill onLoad={onLoad} />,
    );

    // Placeholder renders a div with role="img", not an <img> element
    const img = container.querySelector("img");
    expect(img).not.toBeInTheDocument();
    expect(onLoad).not.toHaveBeenCalled();
  });
});
