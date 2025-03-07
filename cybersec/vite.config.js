import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    allowedHosts: ["8bdc-91-145-144-188.ngrok-free.app"], // Dodaj tutaj Twój ngrok host
    proxy: {
      "/api": {
        target: "http://212.33.90.170:8006/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
