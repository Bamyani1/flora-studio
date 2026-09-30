import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { AlbumGallery } from "@/components/sections/AlbumGallery";
import { createPlaceholderImage } from "@/lib/site-media";

const images = [
  createPlaceholderImage({ key: "one", alt: "Tip-off", width: 600, height: 900 }),
  createPlaceholderImage({ key: "two", alt: "Free throw", width: 900, height: 600 }),
  {
    ...createPlaceholderImage({ key: "three", alt: "Timeout", width: 600, height: 900 }),
    caption: "Last huddle",
  },
];

function renderGallery() {
  render(<AlbumGallery title="Game Day" images={images} />);
  return screen.getAllByRole("button", { name: /View full screen/ });
}

const counter = (dialog: HTMLElement) => within(dialog).getByText(/^\d\d \/ \d\d$/).textContent;

describe("AlbumGallery viewer", () => {
  it("labels each tile with its photo and position", () => {
    const tiles = renderGallery();
    expect(tiles).toHaveLength(3);
    expect(tiles[1]).toHaveAccessibleName("Free throw, photo 2 of 3. View full screen");
  });

  it("opens on the chosen photo and steps with the arrow keys, wrapping at the ends", () => {
    const tiles = renderGallery();
    fireEvent.click(tiles[1]);

    const dialog = screen.getByRole("dialog", { name: "Game Day: photo viewer" });
    expect(counter(dialog)).toBe("02 / 03");

    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(counter(dialog)).toBe("03 / 03");
    expect(within(dialog).getByText("Last huddle")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(counter(dialog)).toBe("01 / 03");

    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(counter(dialog)).toBe("03 / 03");
  });

  it("steps with the on-screen arrows and swipes", () => {
    const tiles = renderGallery();
    fireEvent.click(tiles[0]);
    const dialog = screen.getByRole("dialog");

    fireEvent.click(within(dialog).getByRole("button", { name: "Next photo" }));
    expect(counter(dialog)).toBe("02 / 03");

    const stage = dialog.querySelector("[data-lightbox-frame='current']")!.parentElement!;
    fireEvent.touchStart(stage, { touches: [{ clientX: 300, clientY: 200 }] });
    fireEvent.touchEnd(stage, { changedTouches: [{ clientX: 180, clientY: 210 }] });
    expect(counter(dialog)).toBe("03 / 03");
  });

  it("closes on Escape and hands focus back to the tile", async () => {
    const tiles = renderGallery();
    tiles[2].focus();
    fireEvent.click(tiles[2]);

    const dialog = screen.getByRole("dialog");
    await waitFor(() =>
      expect(within(dialog).getByRole("button", { name: /Close/ })).toHaveFocus(),
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(tiles[2]).toHaveFocus();
    expect(document.body.style.position).toBe("");
  });
});
