import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: { port: 8000 },
  base: '/askba14/',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        grid:  resolve(__dirname, 'grid.html'),
      },
    },
  },
})
