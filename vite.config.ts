/// <reference types="vitest" />

import { defineConfig } from "vite";
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
  },
});
