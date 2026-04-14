import { expect, test } from "@playwright/test";

const CONTACT_TEST_FAILURE_COOKIE = "__contact_delivery_test";

async function fillValidContactForm(page: import("@playwright/test").Page) {
  await page.locator("#sender").fill("Ava Reed");
  await expect(page.locator("#sender")).toHaveValue("Ava Reed");
  await page.locator("#reply_to").fill("ava@example.com");
  await expect(page.locator("#reply_to")).toHaveValue("ava@example.com");
  await page.locator("#photographyType").selectOption("milestones");
  await expect(page.locator("#photographyType")).toHaveValue("milestones");
  await page.locator("#message").fill("I would love to book a graduation session this spring.");
  await expect(page.locator("#message")).toHaveValue(
    "I would love to book a graduation session this spring.",
  );
}

test("contact form validates and supports submitting another message after success", async ({
  page,
}) => {
  await page.goto("/contact");
  await expect(page.getByText("info@floraohio.com")).toBeVisible();

  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByText("Name must be at least 2 characters")).toBeVisible();
  await expect(page.getByText("Please enter a valid email address")).toBeVisible();
  await expect(page.getByText("Please select a photography type")).toBeVisible();

  await fillValidContactForm(page);
  await page.getByRole("button", { name: "Send Message" }).click();

  await expect(page.getByRole("heading", { name: "Message received" })).toBeVisible();

  await page.getByRole("button", { name: "Send another message" }).click();

  await expect(page.getByLabel("Full Name")).toBeVisible();
  await expect(page.getByRole("button", { name: "Send Message" })).toBeVisible();
  await expect(page.getByLabel("Full Name")).toHaveValue("");
  await expect(page.getByLabel("Email")).toHaveValue("");
  await expect(page.locator("select[name='photographyType']")).toHaveValue("");
  await expect(page.getByLabel("Message")).toHaveValue("");

  await page.getByLabel("Full Name").fill("Jordan Vale");
  await page.getByLabel("Email").fill("jordan@example.com");
  await page.locator("select[name='photographyType']").selectOption("portraits");
  await page.getByLabel("Message").fill("Following up with a second inquiry without reloading.");
  await page.getByRole("button", { name: "Send Message" }).click();

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
  await expect(page.getByRole("button", { name: "Send Message" })).toBeVisible();
  await fillValidContactForm(page);

  await page.getByRole("button", { name: "Send Message" }).click();

  await expect(page.getByText("Failed to send message. Please try again later.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Message received" })).toHaveCount(0);
});
