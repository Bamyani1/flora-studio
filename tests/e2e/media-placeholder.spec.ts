import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/work", "/work/the-graduate", "/about", "/process", "/heroes/frame"] as const;

for (const route of ROUTES) {
  test(`placeholder media renders on ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('[data-media-placeholder="true"]').first()).toBeAttached();
  });
}
