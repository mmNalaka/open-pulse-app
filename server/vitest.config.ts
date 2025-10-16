import path from "node:path";
import { defineConfig } from "vitest/config";

const aliases = {
  "@": path.resolve(__dirname, "./src"),
  "@tests": path.resolve(__dirname, "./tests"),
};

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    alias: aliases,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "tests/",
        "dist/",
        "**/*.d.ts",
        "**/index.ts",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
    testTimeout: 10_000,
    hookTimeout: 10_000,
  },
  resolve: {
    alias: aliases,
  },
});
