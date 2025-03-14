import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
