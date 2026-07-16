// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://charcoles-hub.github.io',
  base: '/',
  vite: {
    plugins: [tailwindcss()],
    server: {
      // En producción /demo-* son project pages del mismo origen y esto no hace
      // falta. En local hay que traerlas para que el iframe sea del mismo origen
      // y se pueda scrollear por dentro.
      proxy: {
        '/demo-': { target: 'https://charcoles-hub.github.io', changeOrigin: true },
      },
    },
  },
});
