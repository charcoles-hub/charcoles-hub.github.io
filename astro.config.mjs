// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sergiogarciaweb.com',
  base: '/',
  integrations: [
    sitemap({
      // Fuera del sitemap: las páginas de gracias y los formularios de reseña,
      // que llevan noindex. Lo que no se quiere indexar no se anuncia.
      filter: (pagina) => !/\/(gracias|thanks|gracies|gracias-revision|resena|review|ressenya)\/$/.test(pagina),
    }),
  ],
  vite: {
    build: {
      // esbuild, NO lightningcss: lightningcss fusiona animation-timeline
      // dentro del shorthand `animation` (sintaxis de un borrador viejo que
      // Chrome rechaza) y mata TODAS las animaciones ligadas al scroll.
      cssMinify: 'esbuild',
    },
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
        '^/(demo-|fisioymes)': { target: 'https://sergiogarciaweb.com', changeOrigin: true },
      },
    },
  },
});
