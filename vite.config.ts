import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: path.resolve(__dirname, "./dist/"),
  plugins: [vue(), eslintPlugin()],
});
