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
      {
        find: "api",
        replacement: resolve(__dirname, "./packages/renderer/src/api"),
      },
      {
        find: "components",
        replacement: resolve(__dirname, "./packages/renderer/src/components"),
      },
      {
        find: "composables",
        replacement: resolve(__dirname, "./packages/renderer/src/composables"),
      },
      {
        find: "const",
        replacement: resolve(__dirname, "./packages/renderer/src/const/index"),
      },
      {
        find: "directives",
        replacement: resolve(__dirname, "./packages/renderer/src/directives"),
      },
      {
        find: "icons",
        replacement: resolve(__dirname, "./packages/renderer/src/icons"),
      },
      {
        find: "renderer-interfaces",
        replacement: resolve(
          __dirname,
          "./packages/renderer/src/renderer-interfaces"
        ),
      },
      {
        find: "views",
        replacement: resolve(__dirname, "./packages/renderer/src/views"),
      },
    ],
  },
});
