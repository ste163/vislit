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
      { find: "@", replacement: resolve(PACKAGE_ROOT, "src") },
      { find: "icons", replacement: resolve(PACKAGE_ROOT, "src/icons") },
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
