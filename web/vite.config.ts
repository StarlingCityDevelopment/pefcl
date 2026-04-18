import path from 'node:path';
import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@hooks': path.resolve(__dirname, './src/hooks/'),
      '@components': path.resolve(__dirname, './src/components/'),
      '@ui': path.resolve(__dirname, './src/components/ui/'),
      '@utils': path.resolve(__dirname, './src/utils/'),
      '@typings': path.resolve(__dirname, '../typings/'),
      src: path.resolve(__dirname, './src/'),
      '@locales': path.resolve(__dirname, '../locales/'),
      '@data': path.resolve(__dirname, './src/data/'),
      '@common': path.resolve(__dirname, '../src/common'),
    },
  },
  base: './',
  define: {
    process: {
      env: {
        VITE_REACT_APP_IN_GAME: process.env.VITE_REACT_APP_IN_GAME,
      },
    },
  },
  server: {
    port: 3002,
  },
  build: {
    outDir: '../dist/web',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('@mui') ||
              id.includes('@emotion') ||
              id.includes('framer-motion') ||
              id.includes('motion')
            ) {
              return 'vendor_ui';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});
