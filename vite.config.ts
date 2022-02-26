/// <reference types="vitest" />

import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  base: path.resolve(__dirname, "./dist/"),
  plugins: [vue({ reactivityTransform: true }), eslintPlugin()],
  test: {
    environment: "happy-dom",
    coverage: {
      reporter: ["text", "lcov"],
      exclude: ["**/*.spec.ts"],
    },
  },
});
