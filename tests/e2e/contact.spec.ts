import { expect, test } from "@playwright/test";

const CONTACT_TEST_FAILURE_COOKIE = "__contact_delivery_test";

async function fillValidContactForm(page: import("@playwright/test").Page) {
  await page.locator("#photographyType").selectOption("milestones");
  await page.locator("#preferredDate").fill("2026-06-14");
  await page.locator("#location").fill("Dayton, Ohio");
  await page.locator("#sender").fill("Ava Reed");
  await page.locator("#reply_to").fill("ava@example.com");
}

test("contact form validates and supports submitting another message after success", async ({
  page,
}) => {
  await page.goto("/contact", { waitUntil: "networkidle" });
  await expect(page.getByRole("main").getByText("info@floraohio.com")).toBeVisible();

  await page.getByRole("button", { name: /send inquiry/i }).click();
  await expect(page.getByText("Name must be at least 2 characters")).toBeVisible();
  await expect(page.getByText("Please enter a valid email address")).toBeVisible();
  await expect(page.getByText("Please select a photography type")).toBeVisible();
  await expect(page.getByText("Please pick an ideal date")).toBeVisible();
  await expect(page.getByText(/Please add a location/i)).toBeVisible();

  await fillValidContactForm(page);
  await page.getByRole("button", { name: /send inquiry/i }).click();

  await expect(page.getByRole("heading", { name: "Message received" })).toBeVisible();

  await page.getByRole("button", { name: "Send another message" }).click();

  await expect(page.getByLabel("Full Name")).toBeVisible();
  await expect(page.getByRole("button", { name: /send inquiry/i })).toBeVisible();
  await expect(page.locator("#sender")).toHaveValue("");
  await expect(page.locator("#reply_to")).toHaveValue("");
  await expect(page.locator("#photographyType")).toHaveValue("");
  await expect(page.locator("#preferredDate")).toHaveValue("");
  await expect(page.locator("#location")).toHaveValue("");

  await fillValidContactForm(page);
  await page.getByRole("button", { name: /send inquiry/i }).click();

  await expect(page.getByRole("heading", { name: "Message received" })).toBeVisible();
});

test("contact form surfaces a server-side delivery error", async ({ page }) => {
  await page.context().addCookies([
    {
      name: CONTACT_TEST_FAILURE_COOKIE,
      value: "primary",
      url: "http://127.0.0.1:3101",
    },
  ]);
  await page.goto("/contact", { waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: /send inquiry/i })).toBeVisible();
  await fillValidContactForm(page);

  await page.getByRole("button", { name: /send inquiry/i }).click();

  await expect(page.getByText("Failed to send message. Please try again later.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Message received" })).toHaveCount(0);
});
