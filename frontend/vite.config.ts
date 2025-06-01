import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  // rewrite /api to the backend server, keeping the /api part in the URL
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3101",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
  },
});
