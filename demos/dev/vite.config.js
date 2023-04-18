import { defineConfig } from 'vite'
import { createVuePlugin as vue2 } from 'vite-plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2({
      jsx: true,
    }),
  ],
  build: {
    brotliSize: false,
    outDir: '../../docs',
  },

  base: '/vue-scratch-v2',
})
