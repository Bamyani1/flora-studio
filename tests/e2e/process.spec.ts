import { expect, test } from "@playwright/test";

test("process route exposes a working contact CTA", async ({ page }) => {
  await page.goto("/process", { waitUntil: "networkidle" });

  await page.getByRole("link", { name: "Get in touch" }).click();

  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { name: /Get in/i })).toBeVisible();
});
