import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base relativa: o mesmo build serve no GitHub Pages e na VPS FESB (rotas por hash).
export default defineConfig({
  plugins: [react()],
  base: './',
  // Em desenvolvimento, /api vai para a chd-plataforma-api local (uvicorn na 8000), no mesmo domínio do cookie.
  server: {
    proxy: { '/api': 'http://127.0.0.1:8000' },
  },
});
