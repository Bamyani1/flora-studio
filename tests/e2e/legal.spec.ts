import { expect, test } from "@playwright/test";

test("privacy and terms pages render production copy", async ({ page }) => {
  await page.goto("/privacy");

  await expect(page).toHaveTitle(/Privacy Policy/);
  await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Who This Policy Covers" })).toBeVisible();
  await expect(page.getByText("Last updated April 13, 2026")).toBeVisible();
  await expect(page.getByText("Interim Policy")).toHaveCount(0);
  await expect(page.getByText("placeholder policy")).toHaveCount(0);

  await page.goto("/terms");

  await expect(page).toHaveTitle(/Terms of Service/);
  await expect(page.getByRole("heading", { name: "Terms of Service" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Prohibited Uses of Content" })).toBeVisible();
  await expect(page.getByText("Last updated April 13, 2026")).toBeVisible();
  await expect(page.getByText("Interim Terms")).toHaveCount(0);
  await expect(page.getByText("placeholder for launch")).toHaveCount(0);
});

test("footer legal links navigate and consent ui stays hidden when disabled", async ({ page }) => {
  await page.goto("/contact");

  const privacyLink = page.locator("footer").getByRole("link", { name: "Privacy Policy" });
  await expect(privacyLink).toBeVisible();
  await privacyLink.click();
  await expect(page).toHaveURL(/\/privacy$/);

  await page.goto("/contact");
  const termsLink = page.locator("footer").getByRole("link", { name: "Terms of Service" });
  await expect(termsLink).toBeVisible();
  await termsLink.click();
  await expect(page).toHaveURL(/\/terms$/);

  await expect(page.getByRole("button", { name: "Cookie Preferences" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Accept all" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Reject non-essential" })).toHaveCount(0);

  await page.goto("/");
  await expect(page.locator("footer").getByRole("link", { name: "Privacy Policy" })).toBeVisible();
  await page.locator("footer").getByRole("link", { name: "Privacy Policy" }).click();
  await expect(page).toHaveURL(/\/privacy$/);

  await page.goto("/process");
  await expect(
    page.locator("footer").getByRole("link", { name: "Terms of Service" }),
  ).toBeVisible();
  await page.locator("footer").getByRole("link", { name: "Terms of Service" }).click();
  await expect(page).toHaveURL(/\/terms$/);
});
