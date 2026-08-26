import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';

// Uso: node scripts/medir-demos.mjs [slug...] [--poster]
// Sin slugs mide todas. Con --poster guarda además la captura en
// src/assets/posters/<slug>.png (1440x900), que es lo que espera Trabajo.astro.
const args = process.argv.slice(2);
const conPoster = args.includes('--poster');
const slugs = args.filter((a) => !a.startsWith('--'));
const objetivos = slugs.length
  ? slugs
  : [
      // las mismas que enseña Trabajo.astro: si añades una allí, añádela aquí
      'demo-barberia-navaja',
      'demo-dental-sereno',
      'demo-veterinaria-manada',
      'demo-fisio-vital',
      'demo-gestoria-cauce',
      'demo-psicologia-ancla',
      'demo-arquitectos-traza',
      'demo-autoescuela-traza',
      'demo-cafe-aurora',
      'demo-gimnasio-pulso',
      'demo-dental-us',
      'demo-lawfirm-us',
    ];

// Por defecto mide las demos PUBLICADAS: los pósters deben enseñar lo que ve el visitante.
// Si acabas de mejorar una demo y aún no la has publicado, este script capturaría la versión
// vieja, así que el orden correcto es: publicar la demo -> regenerar el póster -> publicar esto.
const ORIGEN = process.env.DEMOS_ORIGEN ?? 'https://charcoles-hub.github.io';

const POSTERS = new URL('../src/assets/posters/', import.meta.url).pathname;
if (conPoster) await mkdir(POSTERS, { recursive: true });

const b = await puppeteer.launch({
  executablePath: process.env.CHROMIUM ?? '/usr/bin/chromium',
  headless: 'new',
  args: ['--no-sandbox'],
});

for (const slug of objetivos) {
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(`${ORIGEN}/${slug}/`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500)); // que asienten las animaciones de entrada
  const alto = await p.evaluate(() => document.documentElement.scrollHeight);
  console.log(`${slug.padEnd(24)} alto: ${alto}px  (${(alto / 900).toFixed(1)} pantallas)`);
  if (conPoster) await p.screenshot({ path: `${POSTERS}${slug}.png` });
  await p.close();
}

await b.close();
