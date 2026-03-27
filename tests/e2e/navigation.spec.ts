import { expect, test } from "@playwright/test";

test("route transitions preserve scroll-triggered chrome behavior", async ({ page }) => {
  await page.goto("/about");

  const header = page.locator("header");
  const beforeHeight = await header.evaluate((element) => parseFloat(getComputedStyle(element).height));

  await page.getByLabel("Main navigation").getByRole("link", { name: "Work" }).click();
  await expect(page).toHaveURL(/\/work$/);

  await page.evaluate(() => {
    window.scrollTo({ top: window.innerHeight * 2, behavior: "instant" });
  });
  await page.waitForTimeout(500);

  const afterHeight = await header.evaluate((element) => parseFloat(getComputedStyle(element).height));

  await expect(page.getByRole("button", { name: "Back to top" })).toBeVisible();
  expect(afterHeight).toBeLessThan(beforeHeight);
});
