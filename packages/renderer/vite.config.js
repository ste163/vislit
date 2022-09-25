/* eslint-env node */

import { chrome } from "../../.electron-vendors.cache.json";
import { resolve } from "path";
import { builtinModules } from "module";
import vue from "@vitejs/plugin-vue";

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: [
      {
        find: "api",
        replacement: resolve(PACKAGE_ROOT, "src/api"),
      },
      {
        find: "components",
        replacement: resolve(PACKAGE_ROOT, "src/components"),
      },
      {
        find: "composables",
        replacement: resolve(PACKAGE_ROOT, "src/composables"),
      },
      {
        find: "const",
        replacement: resolve(PACKAGE_ROOT, "src/const"),
      },
      {
        find: "directives",
        replacement: resolve(PACKAGE_ROOT, "src/directives"),
      },
      { find: "icons", replacement: resolve(PACKAGE_ROOT, "src/icons") },
      {
        find: "renderer-interfaces",
        replacement: resolve(__dirname, "src/renderer-interfaces"),
      },
      { find: "views", replacement: resolve(PACKAGE_ROOT, "src/views") },
    ],
  },
  plugins: [vue()],
  base: "",
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: "dist",
    assetsDir: ".",
    rollupOptions: {
      external: [...builtinModules],
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
};

export default config;
