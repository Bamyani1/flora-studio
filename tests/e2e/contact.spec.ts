import { expect, test } from "@playwright/test";

test("contact form validates and completes a successful submit", async ({ page }) => {
  await page.goto("/contact");

  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByText("Name must be at least 2 characters")).toBeVisible();
  await expect(page.getByText("Please enter a valid email address")).toBeVisible();
  await expect(page.getByText("Please select a photography type")).toBeVisible();

  await page.getByLabel("Full Name").fill("Ava Reed");
  await page.getByLabel("Email").fill("ava@example.com");
  await page.locator("select[name='photographyType']").selectOption("milestones");
  await page.getByLabel("Message").fill("I would love to book a graduation session this spring.");
  await page.getByRole("button", { name: "Send Message" }).click();

  await expect(page.getByRole("heading", { name: "Message received" })).toBeVisible();
});
