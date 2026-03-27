import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("mobile menu traps focus and restores it after escape", async ({ page }) => {
  await page.goto("/about");

  const openButton = page.getByRole("button", { name: "Open menu" });
  await openButton.click();

  const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Tab");

  const focusInsideMenu = await page.evaluate(() => {
    const active = document.activeElement;
    const dialogEl = document.getElementById("mobile-menu");
    return !!active && !!dialogEl && dialogEl.contains(active);
  });

  expect(focusInsideMenu).toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(openButton).toBeFocused();
});
