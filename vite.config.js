import vue from '@vitejs/plugin-vue2'
const path = require('path')
const { defineConfig } = require('vite')

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/entry.js'),
      name: 'HeroVue',
      fileName: (format) => `hero-vue.${format}.js`
    },
    rollupOptions: {
      external: [
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/vue-fontawesome',
        'bootstrap/dist/css/bootstrap.css',
        'bootstrap-vue',
        'bootstrap-vue/dist/bootstrap-vue.css',
        'roslib',
        'vue'
      ],
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          '@fortawesome/fontawesome-svg-core': 'fontawesomeSvgCore',
          '@fortawesome/free-solid-svg-icons': 'freeSolidSvgIcons',
          '@fortawesome/vue-fontawesome': 'vueFontawesome',
          'bootstrap-vue': 'bootstrapVue',
          roslib: 'ROSLIB',
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [vue()]
})
