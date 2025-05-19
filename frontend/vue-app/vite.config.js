import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue({
      customElement: true,
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.includes('-')
        }
      }
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'VueGameWidget',
      fileName: (format) => `vue-game-widget.${format}.js`,
      formats: ['umd', 'es']
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        globals: {
          vue: 'Vue'
        },
        inlineDynamicImports: true
      }
    }
  }
}) 