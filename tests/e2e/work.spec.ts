import { expect, test } from "@playwright/test";

test("work routes reflect live Sanity state without placeholder fallback", async ({ page }) => {
  await page.goto("/work");
  const albumLinks = page.locator("a[href^='/work/']");
  const linkCount = await albumLinks.count();

  if (linkCount === 0) {
    await expect(page.getByText("No published albums right now.", { exact: false })).toBeVisible();
    await page.goto("/work/the-graduate");
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    return;
  }

  const firstAlbumLink = albumLinks.first();
  const href = await firstAlbumLink.getAttribute("href");

  expect(href).toBeTruthy();

  await firstAlbumLink.evaluate((element: HTMLAnchorElement) => {
    element.click();
  });

  await expect(page).toHaveURL(new RegExp(`${href}$`), { timeout: 10000 });
  await expect(page.locator("main#main-content")).toBeVisible();
});
