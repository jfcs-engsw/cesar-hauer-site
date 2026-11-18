import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Publicado em https://jfcs-engsw.github.io/cesar-hauer-site/ (protótipo).
export default defineConfig({
  plugins: [react()],
  base: '/cesar-hauer-site/',
});
