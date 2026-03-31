import { expect, test } from "@playwright/test";

test("studio route serves the shell without Next error surfaces", async ({ page }) => {
  const response = await page.goto("/studio", { waitUntil: "domcontentloaded" });

  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Page not found" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Something went wrong" })).toHaveCount(0);

  await page.waitForLoadState("networkidle");
  await expect.poll(async () => page.locator("[data-ui]").count()).toBeGreaterThan(0);
});
