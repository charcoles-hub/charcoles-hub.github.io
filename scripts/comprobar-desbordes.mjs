import puppeteer from 'puppeteer-core';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Uso: npm run build && npm run servir   (en otra terminal)
//      node scripts/comprobar-desbordes.mjs [http://localhost:4321]
// Recorre todas las páginas de dist/ a cinco anchos y falla si alguna tiene
// scroll horizontal (la red de seguridad desde que html/body no llevan
// overflow-x:hidden, que rompería la cabecera fija).

const base = process.argv[2] ?? 'http://localhost:4321';
const CANDIDATOS = [
  process.env.CHROMIUM,
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/usr/bin/chromium',
  '/usr/bin/google-chrome',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
].filter(Boolean);
const navegador = CANDIDATOS.find((c) => existsSync(c));
if (!navegador) {
  console.error('No encuentro un Chromium. Pásalo con CHROMIUM=<ruta>.');
  process.exit(1);
}

const paginas = [];
(function recorre(dir, ruta = '/') {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) recorre(join(dir, e.name), `${ruta}${e.name}/`);
    else if (e.name === 'index.html') paginas.push(ruta);
  }
})('dist');

const b = await puppeteer.launch({ executablePath: navegador, headless: true, args: ['--no-sandbox'] });
const p = await b.newPage();
let fallos = 0;
for (const ancho of [360, 390, 768, 1024, 1440]) {
  await p.setViewport({ width: ancho, height: 900 });
  for (const ruta of paginas) {
    await p.goto(base + ruta, { waitUntil: 'load' });
    const culpables = await p.evaluate(() => {
      if (document.documentElement.scrollWidth <= innerWidth) return null;
      return [...document.querySelectorAll('body *')]
        .filter((el) => el.getBoundingClientRect().right > innerWidth + 1 && getComputedStyle(el).position !== 'fixed')
        .slice(0, 4)
        .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
    });
    if (culpables) {
      fallos++;
      console.log(`DESBORDA a ${ancho}px: ${ruta} → ${culpables.join(', ')}`);
    }
  }
}
await b.close();
if (fallos) process.exit(1);
console.log(`OK: sin scroll horizontal en ${paginas.length} páginas a 5 anchos.`);
