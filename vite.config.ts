import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'logo.svg'],
      manifest: {
        name: 'ClamFlow Pro',
        short_name: 'ClamFlow',
        description: 'Streamlined Clam Processing Management System',
        theme_color: '#1e40af',
        background_color: '#1e40af',
        display: 'standalone',
        icons: [
          {
            src: '/icons/manifest-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/manifest-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    })
  ],
  server: {
    hmr: {
      overlay: false // Disable the error overlay
    }
  }
});