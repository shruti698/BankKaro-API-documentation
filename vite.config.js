import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      external: ['clsx', 'react-is', 'react-transition-group', 'cookie', 'set-cookie-parser'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['@mui/icons-material'],
    include: ['@mui/material', '@emotion/react', '@emotion/styled']
  }
})
