import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/portal/",
  root: resolve(__dirname, "src/apps/"),
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        "localization-management": resolve(
          __dirname,
          "src/apps/localization-management/index.html"
        ),
        one: resolve(__dirname, "src/apps/one/index.html"),
        two: resolve(__dirname, "src/apps/two/index.html"),
      },
    },
  },
  publicDir: resolve(__dirname, "public/"),
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/common/styles/index.scss";`,
      },
    },
  },
});
