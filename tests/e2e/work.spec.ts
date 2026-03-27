import { expect, test } from "@playwright/test";

test("work index and album routes render through the transition flow", async ({ page }) => {
  await page.goto("/work");

  const firstAlbumLink = page.locator("a[href^='/work/']").first();
  await expect(firstAlbumLink).toBeVisible();

  const href = await firstAlbumLink.getAttribute("href");
  expect(href).toBeTruthy();

  await firstAlbumLink.evaluate((element: HTMLAnchorElement) => {
    element.click();
  });

  await expect(page).toHaveURL(new RegExp(`${href}$`), { timeout: 10000 });
  await expect(page.locator("main#main-content")).toBeVisible();
});
