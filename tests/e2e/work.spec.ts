import { expect, test } from "@playwright/test";
import { E2E_ALBUMS, E2E_PRIMARY_ALBUM_SLUG } from "../../src/lib/e2e-content";

test("work routes follow the deterministic fixture album flow", async ({ page }) => {
  await page.goto("/work", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1, name: "Work" })).toBeVisible();
  await expect(page.getByText(/^1 collection\b/)).toBeVisible();

  const albumLink = page.locator(`a[href='/work/${E2E_PRIMARY_ALBUM_SLUG}']`).first();

  await expect(albumLink).toBeVisible();
  await albumLink.click();

  await expect(page).toHaveURL(new RegExp(`/work/${E2E_PRIMARY_ALBUM_SLUG}$`), { timeout: 10000 });
  await expect(page.locator("main#main-content")).toBeVisible();
  await expect(
    page.locator("main#main-content h1").filter({ hasText: E2E_ALBUMS[0].title }),
  ).toBeVisible();
});

test("album photos open in a full-screen viewer", async ({ page }) => {
  await page.goto(`/work/${E2E_PRIMARY_ALBUM_SLUG}`, { waitUntil: "networkidle" });

  const tiles = page.getByRole("button", { name: /View full screen$/ });
  const count = await tiles.count();
  expect(count).toBeGreaterThan(1);

  await tiles.nth(1).click();
  const viewer = page.getByRole("dialog", { name: `${E2E_ALBUMS[0].title}: photo viewer` });
  const pad = (n: number) => String(n).padStart(2, "0");

  await expect(viewer).toBeVisible();
  await expect(viewer.getByText(`02 / ${pad(count)}`)).toBeVisible();
  await expect(viewer.getByRole("button", { name: /Close/ })).toBeFocused();

  await page.keyboard.press("ArrowRight");
  await expect(viewer.getByText(`03 / ${pad(count)}`)).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(viewer).toBeHidden();
  await expect(tiles.nth(1)).toBeFocused();

  // A lone fixture album has no neighbours, but the way back up is always there
  await page.getByRole("navigation", { name: "Album navigation" }).getByRole("link", { name: "All work" }).click();
  await expect(page).toHaveURL(/\/work$/, { timeout: 10000 });
});
