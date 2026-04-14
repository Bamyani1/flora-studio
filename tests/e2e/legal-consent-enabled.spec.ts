import { expect, test } from "@playwright/test";

test("banner persists until a choice is made and cancel restores it", async ({ page }) => {
  await page.goto("/contact");

  await expect(page.getByRole("region", { name: "Cookie preferences banner" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Cookie Preferences" })).toHaveCount(0);

  await page.getByRole("button", { name: "Customize" }).click();

  await expect(page.getByRole("dialog", { name: "Choose non-essential categories" })).toBeVisible();

  await page.keyboard.press("Escape");

  await expect(page.getByRole("dialog", { name: "Choose non-essential categories" })).toHaveCount(
    0,
  );
  await expect(page.getByRole("region", { name: "Cookie preferences banner" })).toBeVisible();
});

test("saving consent stores the choice and exposes the preferences trigger", async ({ page }) => {
  await page.goto("/privacy");

  await expect(page.getByRole("region", { name: "Cookie preferences banner" })).toBeVisible();
  await page.getByRole("button", { name: "Customize" }).click();

  await expect(page.getByRole("dialog", { name: "Choose non-essential categories" })).toBeVisible();

  await page.getByRole("checkbox", { name: "Analytics consent" }).check();
  await page.getByRole("button", { name: "Save choices" }).click();

  await expect(page.getByRole("button", { name: "Cookie Preferences" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Cookie preferences banner" })).toHaveCount(0);

  const cookies = await page.context().cookies();
  const consentCookie = cookies.find((cookie) => cookie.name === "flora_consent");
  expect(consentCookie).toBeDefined();

  await page.reload();

  await expect(page.getByRole("button", { name: "Cookie Preferences" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Cookie preferences banner" })).toHaveCount(0);
});
