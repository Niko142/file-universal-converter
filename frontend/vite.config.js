/// <reference types="vitest/config" />
import path from "path";
import { defineConfig } from "vite";

const __dirname = path.resolve();

export default defineConfig({
  root: ".",
  publicDir: "public",
  server: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["**/__tests__/**/*.test.js", "**/*.test.js"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
