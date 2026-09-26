import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { seoPlugin } from './seo.plugin'

export default defineConfig({
  plugins: [react(), seoPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', 'three', '@react-three/fiber'],
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
  },
})
