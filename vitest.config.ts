import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["electron/**/*.test.ts"],
    exclude: ["apps/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      include: ["electron/**/*.ts"],
      exclude: ["electron/**/*.test.ts"],
      thresholds: { lines: 80 },
    },
  },
});
