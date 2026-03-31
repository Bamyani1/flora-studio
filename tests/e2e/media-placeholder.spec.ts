import { expect, test } from "@playwright/test";
import { E2E_ALBUMS, E2E_PRIMARY_ALBUM_SLUG } from "../../src/lib/e2e-content";

const ROUTE_ASSERTIONS = [
  { route: "/", text: "Every frame," },
  { route: "/about", text: "Who We" },
  { route: "/process", text: "Our Process:" },
  { route: "/contact", text: "Get in" },
] as const;

for (const { route, text } of ROUTE_ASSERTIONS) {
  test(`core content renders on ${route}`, async ({ page }) => {
    await page.goto(route, {
      waitUntil: route === "/process" ? "domcontentloaded" : "networkidle",
    });
    await expect(page.getByText(text, { exact: false }).first()).toBeVisible();
  });
}

test("work index renders the checked-in fixture album", async ({ page }) => {
  await page.goto("/work", { waitUntil: "networkidle" });

  await expect(page.locator(`a[href='/work/${E2E_PRIMARY_ALBUM_SLUG}']`).first()).toBeVisible();
  await expect(page.getByText(E2E_ALBUMS[0].title, { exact: false }).first()).toBeVisible();
});

test("missing album routes stay missing in fixture mode", async ({ page }) => {
  await page.goto("/work/the-graduate", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});
