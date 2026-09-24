import puppeteer from 'puppeteer-core';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Uso: node scripts/generar-imagenes.mjs
// Genera desde public/favicon.svg y las fuentes de public/fonts:
//   - public/og.jpg            (1200×630, la imagen al compartir la web)
//   - public/apple-touch-icon.png (180×180)
//   - public/favicon.ico       (32×32, PNG dentro de un contenedor ICO)
// Si cambia el titular de la portada o la marca, se vuelve a ejecutar.

const raiz = fileURLToPath(new URL('..', import.meta.url));
const publico = `${raiz}public/`;

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

// Todo va incrustado como data: URI: una página creada con setContent no puede
// cargar file:// y, sin esto, salen las fuentes del sistema y la captura vacía.
const datos = (ruta, tipo) => `data:${tipo};base64,${readFileSync(ruta).toString('base64')}`;
const fuentes = `
  @font-face { font-family: 'Inter'; font-weight: 100 900; src: url('${datos(`${publico}fonts/inter-latin-wght.woff2`, 'font/woff2')}') format('woff2'); }
  @font-face { font-family: 'Instrument Serif'; src: url('${datos(`${publico}fonts/instrument-serif-latin.woff2`, 'font/woff2')}') format('woff2'); }
  @font-face { font-family: 'Instrument Serif'; font-style: italic; src: url('${datos(`${publico}fonts/instrument-serif-latin-italic.woff2`, 'font/woff2')}') format('woff2'); }
`;
const captura = datos(`${raiz}src/assets/posters/fisioymes-full.png`, 'image/png');

const og = `<!doctype html><html><head><meta charset="utf-8"><style>
  ${fuentes}
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #f6f5ef; color: #1a2927; font-family: 'Inter', sans-serif; }
  .fondo { position: absolute; right: -120px; top: -140px; width: 720px; height: 720px; border-radius: 50%; background: radial-gradient(closest-side, #e1e5d7, transparent); }
  .texto { position: absolute; left: 72px; top: 64px; width: 640px; }
  .disponible { display: inline-flex; align-items: center; gap: 10px; padding: 8px 16px; border: 1px solid #d9ddd1; border-radius: 999px; background: #fdfdfb; font-size: 20px; font-weight: 500; }
  .disponible i { width: 10px; height: 10px; border-radius: 50%; background: #5f8f2e; }
  h1 { margin-top: 30px; font-family: 'Instrument Serif', serif; font-weight: 400; font-size: 104px; line-height: 0.95; letter-spacing: -0.02em; }
  h1 em { color: #4f6b22; }
  .pie { position: absolute; left: 72px; bottom: 58px; display: flex; align-items: baseline; gap: 18px; }
  .pie strong { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: 44px; letter-spacing: -0.01em; }
  .pie span { font-size: 22px; color: #56615d; }
  .marco { position: absolute; right: -40px; top: 120px; width: 520px; border: 1px solid #b8c1b0; border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 0 40px 80px -40px rgba(26,41,39,.5); transform: rotate(-2deg); }
  .barra { height: 34px; display: flex; align-items: center; gap: 7px; padding: 0 14px; border-bottom: 1px solid #e6e9e1; background: #fbfbf8; }
  .barra i { width: 10px; height: 10px; border-radius: 50%; background: #dfe3da; }
  .marco img { display: block; width: 100%; height: 340px; object-fit: cover; object-position: top; }
  .chip { position: absolute; right: 330px; top: 96px; z-index: 2; padding: 8px 16px; border-radius: 999px; background: #1a2927; color: #d4ef6a; font-size: 18px; font-weight: 600; }
  .dominio { position: absolute; right: 72px; bottom: 62px; font-size: 22px; font-weight: 600; color: #1a2927; }
</style></head><body>
  <div class="fondo"></div>
  <div class="marco"><div class="barra"><i></i><i></i><i></i></div><img src="${captura}"></div>
  <span class="chip">Proyecto real</span>
  <div class="texto">
    <span class="disponible"><i></i>Diseñador web freelance · Barcelona</span>
    <h1>Diseño webs para que <em>te elijan a ti</em>.</h1>
  </div>
  <div class="pie"><strong>Sergio García</strong><span>Diseño y desarrollo web a medida</span></div>
  <div class="dominio">sergiogarciaweb.com</div>
</body></html>`;

const svg = readFileSync(`${publico}favicon.svg`, 'utf8');
// El icono de iOS va a sangre: iOS ya le pone las esquinas redondeadas.
const svgCuadrado = svg.replace(/rx="[\d.]+"/, 'rx="0"');
const icono = (s, tam) => `<!doctype html><html><head><style>*{margin:0}body{width:${tam}px;height:${tam}px;background:transparent}svg{display:block;width:${tam}px;height:${tam}px}</style></head><body>${s}</body></html>`;

const b = await puppeteer.launch({ executablePath: navegador, headless: true, args: ['--no-sandbox'] });
const p = await b.newPage();

await p.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await p.setContent(og, { waitUntil: 'load' });
await p.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
await p.evaluate(async () => { await document.fonts.ready; });
// JPEG y no PNG: WhatsApp no siempre enseña la vista previa si pasa de ~300 KB.
await p.screenshot({ path: `${publico}og.jpg`, type: 'jpeg', quality: 86 });

await p.setViewport({ width: 180, height: 180, deviceScaleFactor: 1 });
await p.setContent(icono(svgCuadrado, 180));
await p.screenshot({ path: `${publico}apple-touch-icon.png`, type: 'png' });

await p.setViewport({ width: 32, height: 32, deviceScaleFactor: 1 });
await p.setContent(icono(svg, 32));
const png32 = await p.screenshot({ type: 'png', omitBackground: true });
await b.close();

// Contenedor ICO con un único PNG de 32×32 (formato admitido desde Windows Vista).
const cabecera = Buffer.alloc(22);
cabecera.writeUInt16LE(0, 0); // reservado
cabecera.writeUInt16LE(1, 2); // tipo: icono
cabecera.writeUInt16LE(1, 4); // número de imágenes
cabecera.writeUInt8(32, 6); // ancho
cabecera.writeUInt8(32, 7); // alto
cabecera.writeUInt8(0, 8); // paleta
cabecera.writeUInt8(0, 9); // reservado
cabecera.writeUInt16LE(1, 10); // planos
cabecera.writeUInt16LE(32, 12); // bits por píxel
cabecera.writeUInt32LE(png32.length, 14); // tamaño de la imagen
cabecera.writeUInt32LE(22, 18); // desplazamiento
writeFileSync(`${publico}favicon.ico`, Buffer.concat([cabecera, png32]));

console.log('Listo: og.jpg, apple-touch-icon.png y favicon.ico en public/.');
