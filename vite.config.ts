import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/entry.ts'),
      name: 'HeroVue',
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => {
        if (format === 'es') return 'hero-vue.esm.js'
        if (format === 'cjs') return 'hero-vue.ssr.js'
        return 'hero-vue.min.js'
      }
    },
    rollupOptions: {
      external: [
        'vue',
        'roslib',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/vue-fontawesome',
        'bootstrap/dist/css/bootstrap.css'
      ],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          roslib: 'ROSLIB',
          '@fortawesome/fontawesome-svg-core': 'fontawesomeSvgCore',
          '@fortawesome/free-solid-svg-icons': 'freeSolidSvgIcons',
          '@fortawesome/vue-fontawesome': 'vueFontawesome'
        }
      }
    }
  },
  server: {
    port: 8080
  }
})
