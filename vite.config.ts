import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  base: './',
  build: {
    outDir: 'dist-react',
    emptyOutDir: true,
  },
  server: {
    port: parseInt(process.env.PORT || '5173', 10),
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
