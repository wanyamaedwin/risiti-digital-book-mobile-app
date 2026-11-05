import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  outputDir: ".next/test-results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  // Keep browser checks usable on machines with limited temporary storage/memory.
  workers: 1,
  timeout: 45_000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3210",
    channel: "chromium",
    screenshot: "only-on-failure",
    // Opt in with --trace=on when investigating a specific failure.
    trace: "off",
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3210",
    url: "http://127.0.0.1:3210",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
