import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Configure CSV files to be loaded as raw text
  assetsInclude: [],
  build: {
    rollupOptions: {
      plugins: []
    }
  }
});
