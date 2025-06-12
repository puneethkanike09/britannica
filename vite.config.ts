import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      "/britanica/pbl_api": {
        target: "https://pbl.4edgeit.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});