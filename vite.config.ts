import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base: served at root in dev, under /sehat-saathi-l3/ on GitHub Pages.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/sehat-saathi-l3/' : '/',
  plugins: [react()],
}))
