// Playwright + axe-core test suite (dev-only). Runs against the production build:
//   npm run build && npm run test
// It starts `next start` on port 3100 unless BASE_URL points at a running server.
// The installed Google Chrome is used (channel: 'chrome'); run `npm run test:install`
// instead to download Playwright's own Chromium if Chrome isn't available.
const { defineConfig } = require('@playwright/test');

const PORT = process.env.TEST_PORT || 3100;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    channel: process.env.PW_CHANNEL ?? 'chrome',
    trace: 'retain-on-failure',
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npx next start -p ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
