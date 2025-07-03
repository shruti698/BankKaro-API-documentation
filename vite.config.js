import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true
  },
  preview: {
    port: 5173,
    host: true
  },
  build: {
    rollupOptions: {
      external: ['react-transition-group', 'set-cookie-parser', '@mui/icons-material'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'esbuild'
  },
  optimizeDeps: {
    include: [
      '@mui/material', 
      '@emotion/react', 
      '@emotion/styled',
      'react-is',
      'react-transition-group',
      'set-cookie-parser'
    ],
    exclude: ['@mui/icons-material']
  },
  resolve: {
    alias: {
      cookie: 'cookie',
      'react-is': 'react-is'
    }
  }
})
