import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

// Uso: node scripts/captura-completa.mjs <url> <destino.png>
// Captura una web entera a 1440 de ancho para el marco recorrido de Destacado.
// Imprime el alto real, que hay que copiar a `alto:` en src/config/site.ts.
//
// La captura a página completa NO basta por sí sola: las webs con revelado al
// scroll (la del cliente sin ir más lejos) mantienen su contenido a opacity 0
// hasta que el observador dispara, y una captura de una sola pasada sale en
// blanco. Por eso aquí se recorre la página entera antes de disparar.

const [url, destino] = process.argv.slice(2);
if (!url || !destino) {
  console.error('Uso: node scripts/captura-completa.mjs <url> <destino.png>');
  process.exit(1);
}

const CANDIDATOS = [
  process.env.CHROMIUM,
  '/usr/bin/chromium',
  'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean);
const navegador = CANDIDATOS.find((c) => existsSync(c));
if (!navegador) {
  console.error('No encuentro un Chromium. Pásalo con CHROMIUM=<ruta>.');
  process.exit(1);
}

const b = await puppeteer.launch({
  executablePath: navegador,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto(url, { waitUntil: 'networkidle2' });

// Los paneles de consentimiento se ocultan por CSS, sin pulsar nada: aceptar o
// rechazar en nombre del cliente no es cosa de un script de capturas. De paso
// se devuelve el scroll, que esos paneles bloquean con overflow:hidden.
await p.addStyleTag({
  content: `
    [id*="pdcc"], [class*="pdcc"], [id*="cookie"], [class*="cookie-banner"],
    [class*="cookieconsent"], [aria-label*="cookie" i] { display: none !important; }
    html, body { overflow: visible !important; height: auto !important; }
  `,
});

// Recorrido completo para despertar los revelados al scroll, y vuelta arriba.
// A 250 px por paso y 250 ms de espera, NO más rápido: con pasos de 500 px y
// 120 ms las reseñas del cliente (que entran escalonadas, una tras otra) se
// quedaban a medio revelar y esa sección salía en blanco. Medido: barrido
// rápido deja 6 elementos a opacity 0; este, ninguno.
await p.evaluate(async () => {
  const paso = 250;
  for (let y = 0; y < document.documentElement.scrollHeight; y += paso) {
    window.scrollTo(0, y);
    document.documentElement.scrollTop = y;
    await new Promise((r) => setTimeout(r, 250));
  }
  await new Promise((r) => setTimeout(r, 1500));
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  await new Promise((r) => setTimeout(r, 800));
});

// Red de seguridad: si algo sigue invisible tras el recorrido, se dice en voz
// alta en vez de guardar otra captura con agujeros.
const dormidos = await p.evaluate(() =>
  [...document.querySelectorAll('*')].filter((e) => {
    const cs = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    if (cs.opacity !== '0' || r.height < 60 || r.width < 60) return false;
    // Un carrusel apila sus diapositivas en el mismo hueco y solo enseña una:
    // están ocultas a propósito y no son un revelado a medias. Se reconocen por
    // ser tres o más hermanos con la misma clase.
    const iguales = [...(e.parentElement?.children ?? [])].filter(
      (h) => h.className === e.className
    );
    return iguales.length < 3;
  }).length
);
if (dormidos) console.warn(`AVISO: ${dormidos} elementos siguen a opacity 0; la captura tendrá huecos.`);

const alto = await p.evaluate(() => document.documentElement.scrollHeight);
await p.screenshot({ path: destino, fullPage: true });
console.log(`${destino}\nalto: ${alto}px  ->  pon alto: ${alto} en src/config/site.ts`);

await b.close();
