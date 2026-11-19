import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base relativa: o mesmo build serve no GitHub Pages e na VPS FESB (rotas por hash).
export default defineConfig({
  plugins: [react()],
  base: './',
});
