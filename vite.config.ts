import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// Vite config for DEVELOPMENT MODE ONLY
// Production builds use pure Rollup (see build/rollup.config.js)
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 8080,
    open: '/dev/'
  },
  root: '.'
})
