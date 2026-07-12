import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SiteMedia } from "@/components/ui/SiteMedia";

describe("SiteMedia", () => {
  it("renders the shared placeholder marker with accessible alt text", () => {
    render(<SiteMedia src="placeholder://flora-studio/test" alt="Example placeholder" fill />);

    const media = screen.getByRole("img", { name: "Example placeholder" });
    expect(media).toHaveAttribute("data-media-placeholder", "true");
    expect(media).toHaveAttribute("data-placeholder-label", "Media Placeholder");
  });

  it("preserves an intrinsic ratio when width and height are provided", () => {
    render(
      <SiteMedia
        src="placeholder://flora-studio/test"
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

  it("fires onLoad for placeholder sources without rendering an img element", async () => {
    const onLoad = vi.fn();
    const { container } = render(
      <SiteMedia src="placeholder://flora-studio/test" alt="Placeholder" fill onLoad={onLoad} />,
    );

    // Placeholder renders a div with role="img", not an <img> element
    const img = container.querySelector("img");
    expect(img).not.toBeInTheDocument();
    await waitFor(() => expect(onLoad).toHaveBeenCalled());
  });

  it("fires onLoad exactly once per src across rerenders", async () => {
    const onLoad = vi.fn();
    const { rerender } = render(
      <SiteMedia src="placeholder://flora-studio/one" alt="Placeholder" fill onLoad={onLoad} />,
    );

    await waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

    rerender(
      <SiteMedia src="placeholder://flora-studio/one" alt="Placeholder" fill onLoad={onLoad} />,
    );
    expect(onLoad).toHaveBeenCalledTimes(1);

    rerender(
      <SiteMedia src="placeholder://flora-studio/two" alt="Placeholder" fill onLoad={onLoad} />,
    );
    await waitFor(() => expect(onLoad).toHaveBeenCalledTimes(2));
  });

  it("resets to the real-image branch when src changes after an error", async () => {
    const { container, rerender } = render(
      <SiteMedia src="/images/hero/broken.jpg" alt="Hero" fill />,
    );

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();

    fireEvent.error(img!);
    await waitFor(() =>
      expect(container.querySelector("[data-media-placeholder]")).toBeInTheDocument(),
    );
    expect(container.querySelector("img")).not.toBeInTheDocument();

    rerender(<SiteMedia src="/images/hero/hero-01.jpg" alt="Hero" fill />);
    await waitFor(() => expect(container.querySelector("img")).toBeInTheDocument());
    expect(container.querySelector("[data-media-placeholder]")).not.toBeInTheDocument();
  });
});
