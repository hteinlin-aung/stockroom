import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // anything starting with /api goes to the Express server,
      // so the frontend can just fetch("/api/products")
      "/api": "http://localhost:4000",
    },
  },
})
