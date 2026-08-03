/// <reference types="vitest/config" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "node:url"
import tailwindcss from "@tailwindcss/vite"
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Zachowane aliasy z oryginalnego projektu Next.js, tak żeby
      // przeniesiony kod zadań nie wymagał zmian w importach.
      "@/types": fileURLToPath(new URL("./src/shared/types/index.ts", import.meta.url)),
      "@/store": fileURLToPath(new URL("./src/shared/store", import.meta.url)),
      "@/lib": fileURLToPath(new URL("./src/shared/lib", import.meta.url)),
      "@/utils": fileURLToPath(new URL("./src/shared/utils", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
    css: false,
  },
})
