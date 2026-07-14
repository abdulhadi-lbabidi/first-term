import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Vercel Hotels',
        short_name: 'Vercel Hotels',
        description: 'Vercel Hotels - Experience ultimate luxury.',
        theme_color: '#B79A5A',
        background_color: '#F5F1E8',
        display: 'standalone',
        icons: [
          {
            src: '/logo-primary.webp',
            sizes: '192x192',
            type: 'image/webp',
            purpose: 'any maskable'
          },
          {
            src: '/logo-primary.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

