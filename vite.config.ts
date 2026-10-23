import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Tailwind v4 se integra como plugin de Vite: no hay tailwind.config.js ni
// PostCSS. El CSS entra por src/index.css con `@import "tailwindcss"`.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // host explicito: por defecto Vite escucha solo en ::1 (IPv6) en macOS y
    // curl/los navegadores que resuelven localhost a 127.0.0.1 no conectan.
    host: '127.0.0.1',
    port: 5173,
    // Proxy hacia el backend en desarrollo: el frontend llama a rutas
    // relativas (/api/...) y Vite las reenvia a Spring Boot en el 8080.
    // Asi no hay CORS ni URLs distintas entre dev y produccion.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
