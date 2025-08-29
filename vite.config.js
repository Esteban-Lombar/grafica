import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // 👈 importa el plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 👈 activa Tailwind 4
  ],
});
