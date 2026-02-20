import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  server: {
    allowedHosts: ['ameno.local'],
    proxy: {
      '/ome-ws': {
        target: 'https://stream.kirr.nu',
        ws: true,
        changeOrigin: true,
        secure: true,
        headers: {
          origin: 'null',
          host: 'stream.kirr.nu',
        },
        rewrite: (path) => path.replace(/^\/ome-ws/, ''),
        configure: (proxy) => {
          proxy.on('proxyReqWs', (proxyReq) => {
            proxyReq.setHeader('origin', 'null');
            proxyReq.setHeader('sec-websocket-origin', 'null');
            proxyReq.setHeader('host', 'stream.kirr.nu');
          });

          proxy.on('error', (error) => {
            console.error('[ome-ws proxy error]', error);
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
});
