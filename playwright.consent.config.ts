import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/legal-consent-enabled.spec.ts",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:3102",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3102",
    env: {
      ...process.env,
      CONTACT_DELIVERY_MODE: "stub",
      NEXT_DIST_DIR: ".next-playwright-consent",
      NEXT_PUBLIC_ENABLE_COOKIE_CONSENT: "true",
    },
    url: "http://127.0.0.1:3102",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
