import { expect, test } from "@playwright/test";
import { E2E_ALBUMS, E2E_PRIMARY_ALBUM_SLUG } from "../../src/lib/e2e-content";

test("work routes follow the deterministic fixture album flow", async ({ page }) => {
  await page.goto("/work", { waitUntil: "networkidle" });

  const albumLink = page.locator(`a[href='/work/${E2E_PRIMARY_ALBUM_SLUG}']`).first();

  await expect(albumLink).toBeVisible();
  await albumLink.click();

  await expect(page).toHaveURL(new RegExp(`/work/${E2E_PRIMARY_ALBUM_SLUG}$`), { timeout: 10000 });
  await expect(page.locator("main#main-content")).toBeVisible();
  await expect(
    page.locator("main#main-content h1").filter({ hasText: E2E_ALBUMS[0].title }),
  ).toBeVisible();
});
