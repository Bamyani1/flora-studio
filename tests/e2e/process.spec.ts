import { expect, test } from "@playwright/test";

test("process header action scrolls to the contact section", async ({ page }) => {
  await page.goto("/process");

  const contactSection = page.locator("#contact");
  const before = await contactSection.evaluate((element) => element.getBoundingClientRect().top);

  await page.getByRole("button", { name: "Get in touch" }).click();
  await page.waitForTimeout(1000);

  const after = await contactSection.evaluate((element) => element.getBoundingClientRect().top);

  expect(after).toBeLessThan(before);
  expect(Math.abs(after)).toBeLessThan(200);
  await expect(page).toHaveURL(/\/process$/);
});
