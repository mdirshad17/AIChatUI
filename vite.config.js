import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true // Tells Vite to fail if port 3000 is already in use
  },
  proxy: {
      // This tells Vite: "If the URL doesn't match a file, just show index.html"
      '/dashboard': {
        target: 'http://localhost:3000/',
        rewrite: () => '/index.html'
      }
    }
})
