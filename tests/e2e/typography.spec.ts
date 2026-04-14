import { expect, test } from "@playwright/test";

const CONTACT_TEST_FAILURE_COOKIE = "__contact_delivery_test";

async function fillValidContactForm(page: import("@playwright/test").Page) {
  await page.locator("#sender").fill("Ava Reed");
  await page.locator("#reply_to").fill("ava@example.com");
  await page.locator("#photographyType").selectOption("milestones");
  await page.locator("#message").fill("I would love to book a graduation session this spring.");
}

test("landing page typography matches the GitHub runtime", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const styles = await page.evaluate(() => {
    const pick = (element: Element | null) =>
      element ? getComputedStyle(element as HTMLElement).fontFamily.toLowerCase() : null;

    return {
      heroHeading: pick(document.querySelector("main h1.font-display")),
      heroCopy: pick(document.querySelector("main p.font-body")),
      editorialHeading: pick(document.querySelector("h2.font-headline")),
      exhibitionHeading: pick(document.querySelector("h3.font-headline")),
      studioHeading: pick(Array.from(document.querySelectorAll("h2.font-headline")).pop() ?? null),
      navLabel: pick(document.querySelector("header nav a span")),
      headerCta: pick(
        Array.from(document.querySelectorAll("header a span")).find((element) =>
          element.textContent?.includes("Get in touch"),
        ) ?? null,
      ),
      footerNav: pick(
        Array.from(document.querySelectorAll("footer a")).find((element) =>
          element.textContent?.includes("Work"),
        ) ?? null,
      ),
    };
  });

  expect(styles.heroHeading).toContain("inter");
  expect(styles.heroCopy).toContain("inter");
  expect(styles.editorialHeading).toContain("cormorant garamond");
  expect(styles.exhibitionHeading).toContain("cormorant garamond");
  expect(styles.studioHeading).toContain("cormorant garamond");
  expect(styles.navLabel).toContain("inter");
  expect(styles.headerCta).toContain("inter");
  expect(styles.footerNav).toContain("inter");
});

test("about, work, and process headings match the GitHub runtime", async ({ page }) => {
  await page.goto("/about", { waitUntil: "networkidle" });
  const about = await page.evaluate(() => {
    const pick = (element: Element | null) =>
      element ? getComputedStyle(element as HTMLElement).fontFamily.toLowerCase() : null;

    return {
      pageHeading: pick(document.querySelector("main h1.font-display")),
      manifesto: pick(document.querySelector("span.font-display")),
      quote: pick(document.querySelector("blockquote.font-display")),
      teamHeading: pick(document.querySelector("h2.font-display")),
    };
  });

  expect(about.pageHeading).toContain("cormorant garamond");
  expect(about.manifesto).toContain("cormorant garamond");
  expect(about.quote).toContain("cormorant garamond");
  expect(about.teamHeading).toContain("cormorant garamond");

  await page.goto("/work", { waitUntil: "networkidle" });
  const work = await page.evaluate(() => {
    const pick = (element: Element | null) =>
      element ? getComputedStyle(element as HTMLElement).fontFamily.toLowerCase() : null;

    return {
      heroHeading: pick(document.querySelector("h2.font-display")),
    };
  });

  expect(work.heroHeading).toContain("cormorant garamond");

  await page.goto("/process", { waitUntil: "domcontentloaded" });
  const process = await page.evaluate(() => {
    const pick = (element: Element | null) =>
      element ? getComputedStyle(element as HTMLElement).fontFamily.toLowerCase() : null;

    return {
      heroHeading: pick(document.querySelector("main h1.font-display")),
      sectionHeading: pick(document.querySelector("main h2.font-display")),
      firstPhaseTitle: pick(document.querySelector("main h3.font-display")),
      firstPhaseIndex: pick(document.querySelector("main span.font-display")),
    };
  });

  expect(process.heroHeading).toContain("inter");
  expect(process.sectionHeading).toContain("inter");
  expect(process.firstPhaseTitle).toContain("cormorant garamond");
  expect(process.firstPhaseIndex).toContain("cormorant garamond");
});

test("contact page typography matches the GitHub runtime", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "networkidle" });

  const pristineStyles = await page.evaluate(() => {
    const label = document.querySelector("label[for='sender']");
    const input = document.querySelector("#sender") as HTMLInputElement | null;
    const submitLabel = Array.from(document.querySelectorAll("button span")).find((element) =>
      element.textContent?.includes("Send Message"),
    );
    const heading = document.querySelector("[data-form-heading]");

    const pick = (element: Element | null) =>
      element
        ? {
            fontFamily: getComputedStyle(element as HTMLElement).fontFamily.toLowerCase(),
            textTransform: getComputedStyle(element as HTMLElement).textTransform,
          }
        : null;

    return {
      label: pick(label),
      input: pick(input),
      placeholder: input
        ? {
            fontFamily: getComputedStyle(input, "::placeholder").fontFamily.toLowerCase(),
            textTransform: getComputedStyle(input, "::placeholder").textTransform,
          }
        : null,
      submitLabel: pick(submitLabel ?? null),
      heading: pick(heading),
      pageHeading: pick(document.querySelector("main h1")),
    };
  });

  expect(pristineStyles.label?.fontFamily).toContain("inter");
  expect(pristineStyles.label?.textTransform).toBe("uppercase");
  expect(pristineStyles.input?.fontFamily).toContain("inter");
  expect(pristineStyles.input?.textTransform).toBe("uppercase");
  expect(pristineStyles.placeholder?.fontFamily).toContain("inter");
  expect(pristineStyles.placeholder?.textTransform).toBe("uppercase");
  expect(pristineStyles.submitLabel?.fontFamily).toContain("inter");
  expect(pristineStyles.submitLabel?.textTransform).toBe("uppercase");
  expect(pristineStyles.heading?.fontFamily).toContain("inter");
  expect(pristineStyles.pageHeading?.fontFamily).toContain("inter");

  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByText("Please enter a valid email address")).toBeVisible();

  const validationStyles = await page.evaluate(() => {
    const errorMessage = Array.from(document.querySelectorAll("[role='alert']")).find((element) =>
      element.textContent?.includes("Please enter a valid email address"),
    );

    return errorMessage
      ? {
          fontFamily: getComputedStyle(errorMessage as HTMLElement).fontFamily.toLowerCase(),
          textTransform: getComputedStyle(errorMessage as HTMLElement).textTransform,
        }
      : null;
  });

  expect(validationStyles?.fontFamily).toContain("inter");
  expect(validationStyles?.textTransform).toBe("none");

  await page.context().addCookies([
    {
      name: CONTACT_TEST_FAILURE_COOKIE,
      value: "primary",
      url: "http://127.0.0.1:3101",
    },
  ]);
  await page.goto("/contact", { waitUntil: "networkidle" });
  await fillValidContactForm(page);
  await page.getByRole("button", { name: "Send Message" }).click();

  const failureBanner = page.getByRole("alert").filter({
    hasText: "Failed to send message. Please try again later.",
  });
  await expect(failureBanner).toBeVisible();

  const failureStyles = await failureBanner.evaluate((element) => ({
    fontFamily: getComputedStyle(element as HTMLElement).fontFamily.toLowerCase(),
    textTransform: getComputedStyle(element as HTMLElement).textTransform,
  }));

  expect(failureStyles.fontFamily).toContain("inter");
  expect(failureStyles.textTransform).toBe("none");

  await page.context().clearCookies();
  await page.goto("/contact", { waitUntil: "networkidle" });
  await fillValidContactForm(page);
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByRole("heading", { name: "Message received" })).toBeVisible();

  const successStyles = await page.evaluate(() => {
    const successCopy = Array.from(document.querySelectorAll("[role='status'] p")).find((element) =>
      element.textContent?.includes("We'll get back to you within 24 hours."),
    );

    return successCopy
      ? {
          fontFamily: getComputedStyle(successCopy as HTMLElement).fontFamily.toLowerCase(),
          textTransform: getComputedStyle(successCopy as HTMLElement).textTransform,
        }
      : null;
  });

  expect(successStyles?.fontFamily).toContain("inter");
  expect(successStyles?.textTransform).toBe("uppercase");
});

test("mobile navigation matches the GitHub runtime split", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(300);

  const styles = await page.evaluate(() => {
    const menuItem = document.querySelector("[data-mobile-menu] nav a");
    const menuCta = Array.from(document.querySelectorAll("[data-mobile-menu] a")).find((element) =>
      element.textContent?.includes("Get in touch"),
    );
    const supportLink = document.querySelector("[data-mobile-menu] a[target='_blank']");

    const pick = (element: Element | null) =>
      element ? getComputedStyle(element as HTMLElement).fontFamily.toLowerCase() : null;

    return {
      menuItem: pick(menuItem),
      menuCta: pick(menuCta ?? null),
      supportLink: pick(supportLink),
    };
  });

  expect(styles.menuItem).toContain("cormorant garamond");
  expect(styles.menuCta).toContain("inter");
  expect(styles.supportLink).toContain("inter");
});
