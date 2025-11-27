import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // This proxy allows you to use '/api' in your frontend code
    // and have it redirected to your local API functions during dev
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Assuming you run 'vercel dev' or similar
        changeOrigin: true,
        secure: false,
      },
    },
  },
});