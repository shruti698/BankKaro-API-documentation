import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined
      }
    }
  },
  optimizeDeps: {
    include: ['clsx', '@mui/styled-engine']
  }
})
