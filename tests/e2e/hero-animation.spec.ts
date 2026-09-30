import { expect, test } from "@playwright/test";

test("landing hero elements become visible after page load", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  // Hero headline should be visible after animations play
  const headline = page.locator("h1").first();
  await expect(headline).toBeVisible({ timeout: 10_000 });

  // Verify computed opacity is non-zero (GSAP has animated data-animate elements)
  const opacity = await headline.evaluate((el) => window.getComputedStyle(el).opacity);
  expect(parseFloat(opacity)).toBeGreaterThan(0);
});

test("landing hero images load and background becomes visible", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  // Wait for the hero section to be present
  const heroSection = page.locator("section").first();
  await expect(heroSection).toBeVisible();

  // At least one image layer should be visible (GSAP sets autoAlpha: 1)
  const visibleImageLayer = await page.evaluate(() => {
    const layers = document.querySelectorAll<HTMLElement>("section .absolute.inset-0 > .absolute");
    return Array.from(layers).some((layer) => {
      const style = window.getComputedStyle(layer);
      return style.visibility !== "hidden" && parseFloat(style.opacity) > 0;
    });
  });
  expect(visibleImageLayer).toBe(true);
});

test("anti-FOUC CSS rule hides data-animate elements initially", async ({ page }) => {
  // Check that the CSS rule exists in the stylesheet
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const hasRule = await page.evaluate(() => {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSStyleRule && rule.selectorText?.includes("[data-animate]")) {
            return true;
          }
        }
      } catch {
        // Cross-origin stylesheets throw
      }
    }
    return false;
  });

  expect(hasRule).toBe(true);
});

test("album hero and gallery photos are visible without waiting on animations", async ({
  page,
}) => {
  await page.goto("/work/march-madness", { waitUntil: "networkidle" });

  // The hero photo is the LCP: never hidden behind an entrance animation
  const hero = page.locator("main section").first().locator("img").first();
  await expect(hero).toBeVisible();
  expect(parseFloat(await hero.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);

  const firstTile = page.getByRole("button", { name: /photo 1 of \d+\. View full screen/ });
  await firstTile.scrollIntoViewIfNeeded();
  await expect(firstTile).toBeVisible();
});
