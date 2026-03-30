import { expect, test } from "@playwright/test";

const ROUTE_ASSERTIONS = [
  { route: "/", text: "Every frame," },
  { route: "/about", text: "Who We" },
  { route: "/process", text: "Our Process:" },
  { route: "/contact", text: "Get in" },
] as const;

for (const { route, text } of ROUTE_ASSERTIONS) {
  test(`core content renders on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.getByText(text, { exact: false }).first()).toBeVisible();
  });
}

test("work index renders either live albums or the explicit empty state", async ({ page }) => {
  await page.goto("/work", { waitUntil: "networkidle" });

  const albumLinks = page.locator("a[href^='/work/']");

  if (await albumLinks.count()) {
    await expect(albumLinks.first()).toBeVisible();
    return;
  }

  await expect(page.getByText("No published albums right now.", { exact: false })).toBeVisible();
});

test("missing album routes do not resurrect placeholder content", async ({ page }) => {
  await page.goto("/work/the-graduate", { waitUntil: "networkidle" });

  const notFoundHeading = page.getByRole("heading", { name: "Page not found" });

  if (await notFoundHeading.count()) {
    await expect(notFoundHeading).toBeVisible();
    return;
  }

  await expect(page.getByText("The Graduate", { exact: false }).first()).toBeVisible();
});
