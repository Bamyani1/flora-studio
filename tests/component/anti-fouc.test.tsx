import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FadeIn } from "@/components/animations/FadeIn";
import { TextReveal } from "@/components/animations/TextReveal";
import { ImageReveal } from "@/components/animations/ImageReveal";

vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

describe("anti-FOUC data-animate attributes", () => {
  it("FadeIn wrapper has data-animate", () => {
    render(<FadeIn>Content</FadeIn>);

    const wrapper = screen.getByText("Content").closest("[data-animate]");
    expect(wrapper).toBeInTheDocument();
  });

  it("TextReveal wrapper has data-animate", () => {
    render(<TextReveal>Reveal text</TextReveal>);

    const wrapper = screen.getByText("Reveal text").closest("[data-animate]");
    expect(wrapper).toBeInTheDocument();
  });

  it("ImageReveal container has data-animate", () => {
    render(
      <ImageReveal>
        <div data-testid="inner">Image content</div>
      </ImageReveal>,
    );

    const inner = screen.getByTestId("inner");
    const container = inner.closest("[data-animate]");
    expect(container).toBeInTheDocument();
  });
});
