// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/lib/tests/setup.ts', // Vom crea acest fișier
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
