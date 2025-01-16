import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/sinus/',
  plugins: [react(), eslint()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
});
