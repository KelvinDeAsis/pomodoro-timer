import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    includeAssets: ['icons/*', 'images/*', 'audio/*'],
    manifest: {
      name: 'Hamster Pomodoro', short_name: 'Hamster Pomodoro',
      description: 'Your little space to focus, rest, and doodle.',
      theme_color: '#f8d6dc', background_color: '#fff8ef',
      display: 'standalone', start_url: './', scope: './',
      icons: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,gif,woff,woff2,mp3,txt}'],
      maximumFileSizeToCacheInBytes: 16 * 1024 * 1024,
      navigateFallback: 'index.html',
      cleanupOutdatedCaches: true,
    },
  })],
});
