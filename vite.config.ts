import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  // base: "https://www.lrt.lt/static/prezidento-rinkimai-2024/",
  base: process.env.BASE_URL,
  plugins: [preact()],
  build: {
    outDir: "dist",
    manifest: "manifest.json",
  },
});
