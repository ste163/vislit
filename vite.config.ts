/// <reference types="vitest" />

import { defineConfig } from "vite";
import { resolve } from "path";
import eslintPlugin from "vite-plugin-eslint";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue({ reactivityTransform: true }), eslintPlugin()],
  test: {
    environment: "happy-dom",
    coverage: {
      reporter: ["text", "lcov"],
      exclude: ["**/*.spec.ts"],
    },
    testTimeout: 6000,
  },
  // vitest requires renderer paths to be resolved here, in main config
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "./packages/renderer/src") },
      {
        find: "icons",
        replacement: resolve(__dirname, "./packages/renderer/src/icons"),
      },
    ],
  },
});
