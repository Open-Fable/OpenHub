import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "electron/tests/e2e",
  timeout: 30000,
  use: {
    trace: "on-first-retry",
  },
});
