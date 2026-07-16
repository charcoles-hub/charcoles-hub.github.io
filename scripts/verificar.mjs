import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';

const URL = process.env.URL ?? 'http://localhost:4321/';
const CHROMIUM = process.env.CHROMIUM ?? '/usr/bin/chromium';

const fallos = [];
async function comprueba(nombre, fn) {
  try {
    await fn();
    console.log(`  ok  ${nombre}`);
  } catch (e) {
    fallos.push(nombre);
    console.error(`FALLO  ${nombre}\n       ${e.message}`);
  }
}

const browser = await puppeteer.launch({
  executablePath: CHROMIUM,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

async function abrir({ ancho = 390, alto = 844, movil = true, reducirMovimiento = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: ancho, height: alto, isMobile: movil, deviceScaleFactor: 2 });
  if (reducirMovimiento) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  }
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60_000 });
  return page;
}

console.log(`\nVerificando ${URL}\n`);

// Criterio 6 del spec: sin scroll horizontal a 390px.
// Gotcha: con overflow-x:hidden en <html> Y <body> a la vez (tema, Step 5),
// document.documentElement.scrollWidth se queda clavado en innerWidth y no
// ve el desbordamiento de los descendientes. Miramos también body.scrollWidth.
await comprueba('sin scroll horizontal a 390px', async () => {
  const page = await abrir({ ancho: 390 });
  const exceso = await page.evaluate(
    () =>
      Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
      window.innerWidth
  );
  assert.ok(exceso <= 0, `sobran ${exceso}px de ancho`);
  await page.close();
});

// Mismo criterio, en escritorio.
await comprueba('sin scroll horizontal a 1440px', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  const exceso = await page.evaluate(
    () =>
      Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
      window.innerWidth
  );
  assert.ok(exceso <= 0, `sobran ${exceso}px de ancho`);
  await page.close();
});

// Spec §5: las tres demos incrustadas y vivas.
await comprueba('los 3 iframes apuntan a las demos reales', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  const srcs = await page.$$eval('.marco iframe', (els) => els.map((e) => e.src));
  assert.equal(srcs.length, 3, `esperaba 3 iframes, hay ${srcs.length}`);
  for (const s of srcs) {
    assert.ok(
      s.startsWith('https://charcoles-hub.github.io/demo-'),
      `src inesperado: ${s}`
    );
  }
  await page.close();
});

// Spec §5: pointer-events:none — sin esto, trampa táctil en móvil.
await comprueba('los iframes no capturan el puntero', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  const valores = await page.$$eval('.marco iframe', (els) =>
    els.map((e) => getComputedStyle(e).pointerEvents)
  );
  assert.ok(valores.length > 0, 'no hay iframes que comprobar');
  for (const v of valores) assert.equal(v, 'none', `pointer-events es "${v}", debe ser "none"`);
  await page.close();
});

// Spec §2 y criterio 3: ningún concepto puede pasar por cliente.
await comprueba('los conceptos se declaran conceptos', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  const texto = await page.evaluate(() => document.body.innerText.toLowerCase());
  const conceptos = (texto.match(/concepto/g) ?? []).length;
  assert.ok(conceptos >= 3, `solo ${conceptos} menciones de "concepto", esperaba 3+`);
  assert.ok(!texto.includes('cliente satisfecho'), 'lenguaje de cliente en una demo inventada');
  await page.close();
});

// REGRESIÓN de un bug concreto, no completismo: el enfoque CSS original
// (scale con container queries) se descartaba entero en Firefox y dejaba el
// iframe a tamaño real. Si alguien "simplifica" el ResizeObserver de vuelta
// a CSS, esto lo caza. Ver la tabla de la Task 3 Step 1.
await comprueba('los iframes están escalados al marco', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  await page.waitForSelector('.marco[data-listo="si"]', { timeout: 10_000 });
  const medidas = await page.$$eval('.marco', (marcos) =>
    marcos.map((m) => {
      const ifr = m.querySelector('iframe');
      return {
        anchoMarco: m.getBoundingClientRect().width,
        anchoIframe: ifr ? ifr.getBoundingClientRect().width : 0,
      };
    })
  );
  assert.ok(medidas.length > 0, 'no hay marcos que medir');
  for (const { anchoMarco, anchoIframe } of medidas) {
    assert.ok(
      Math.abs(anchoIframe - anchoMarco) < 2,
      `iframe de ${Math.round(anchoIframe)}px en un marco de ${Math.round(anchoMarco)}px — no está escalado`
    );
  }
  await page.close();
});

// La opción C: la demo DEBE moverse por dentro al scrollear. Es el centro del sitio.
await comprueba('la demo se recorre al scrollear', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  await page.waitForSelector('.marco[data-listo="si"]', { timeout: 10_000 });
  const leerY = () =>
    page.$eval('.marco', (m) => m.style.getPropertyValue('--y') || '0px');

  const antes = await leerY();
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.2));
  await new Promise((r) => setTimeout(r, 400));
  const despues = await leerY();

  assert.notEqual(despues, antes, `--y no cambió al scrollear (sigue en ${antes})`);
  assert.ok(parseFloat(despues) < 0, `--y debería ser negativo, es ${despues}`);
  await page.close();
});

// Regla dura del spec §6: nada invisible si la animación no corre.
await comprueba('con prefers-reduced-motion todo sigue visible', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false, reducirMovimiento: true });
  const invisibles = await page.$$eval('[data-revela], .mascara > span', (els) =>
    els.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length
  );
  assert.equal(invisibles, 0, `${invisibles} elemento(s) invisibles con movimiento reducido`);
  await page.close();
});

await browser.close();

console.log('');
if (fallos.length) {
  console.error(`${fallos.length} fallo(s): ${fallos.join(', ')}\n`);
  process.exit(1);
}
console.log('Todo en verde.\n');
