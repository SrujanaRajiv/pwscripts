import { defineConfig, devices } from '@playwright/test';

/**
 * Contact Us Automation — Chromium + installed Microsoft Edge, zero retries, failure artifacts.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://www.webdriveruniversity.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'msedge',
      timeout: 120_000,
      workers: 1,
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
});
