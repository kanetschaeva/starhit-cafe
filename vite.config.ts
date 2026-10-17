import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        id: './',
        name: 'StarHit Cafe — учебный проект',
        short_name: 'StarHit Cafe',
        description: 'Конструктор напитков и любимые комбинации.',
        lang: 'ru',
        start_url: './',
        scope: './',
        display: 'standalone',
        theme_color: '#CDE8DD',
        background_color: '#F7F2EA',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})