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
      // Los otros repos de Sergio publicados en el mismo usuario de GitHub
      // Pages. En producción viven en /<slug>/ del propio dominio y esto no
      // hace falta; en local hay que traerlos para que el iframe sea del mismo
      // origen y se pueda scrollear por dentro.
      // OJO: al añadir un cliente nuevo, añade su slug AQUÍ y en
      // scripts/servir.mjs, o su iframe cargará un 404 en local. El arnés lo
      // caza ("la demo se recorre al scrollear" da 0 -> 0), pero cuesta menos
      // acordarse.
      proxy: {
        '^/(demo-|fisioymes)': { target: 'https://charcoles-hub.github.io', changeOrigin: true },
      },
    },
  },
});
