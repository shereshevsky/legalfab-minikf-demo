import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Set base path for GitHub Pages - change 'legalfab-minikf-demo' to your repo name
  base: process.env.NODE_ENV === 'production' ? '/legalfab-minikf-demo/' : '/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
