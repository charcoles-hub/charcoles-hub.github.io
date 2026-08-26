// Lanza contra `npm run servir` (dist/ + proxy de /demo-*), NO contra
// `npm run preview`. Arnés de la página estática: sin 3D, sin iframes.
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

async function abrir({ ancho = 390, alto = 844, movil = true, reducirMovimiento = false, ruta = '' } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: ancho, height: alto, isMobile: movil, deviceScaleFactor: 2 });
  if (reducirMovimiento) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  }
  page.errores = [];
  page.on('requestfailed', (r) => page.errores.push(`${r.url()} falló`));
  page.on('response', (r) => {
    if (r.status() >= 400) page.errores.push(`${r.status()} en ${r.url()}`);
  });
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) page.errores.push(m.text());
  });
  page.on('pageerror', (e) => page.errores.push(String(e)));
  await page.goto(URL + ruta, { waitUntil: 'networkidle2', timeout: 60_000 });
  return page;
}

console.log(`\nVerificando ${URL}\n`);

await comprueba('sin errores de consola recorriendo la página entera', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  assert.deepEqual(page.errores, [], `errores:\n       ${page.errores.join('\n       ')}`);
  await page.close();
});

for (const ancho of [390, 1440]) {
  await comprueba(`sin scroll horizontal a ${ancho}px`, async () => {
    const page = await abrir({ ancho, alto: ancho === 390 ? 844 : 900, movil: ancho === 390 });
    const sobra = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    assert.equal(sobra, 0, `sobran ${sobra}px de ancho`);
    await page.close();
  });
}

await comprueba('en 3 segundos: quién, qué, dónde, cuánto y cómo contactar', async () => {
  const page = await abrir();
  const primera = await page.evaluate(() => {
    const enPantalla = (el) => {
      const r = el.getBoundingClientRect();
      return r.top < innerHeight && r.bottom > 0;
    };
    const links = [...document.querySelectorAll('a')].filter(enPantalla).map((a) => a.href);
    return { texto: document.body.innerText.slice(0, 1500), links };
  });
  assert.ok(/Sergio/.test(primera.texto), 'falta el nombre');
  assert.ok(/Cornellà/i.test(primera.texto), 'falta Cornellà');
  assert.ok(/500\s?€/.test(primera.texto), 'falta el precio');
  assert.ok(/7 días/i.test(primera.texto), 'falta el plazo');
  assert.ok(primera.links.some((h) => h.startsWith('https://wa.me/34620650597')), 'falta WhatsApp a un toque');
  assert.ok(primera.links.some((h) => h.startsWith('tel:+34620650597')), 'falta llamada a un toque');
  await page.close();
});

await comprueba('el cliente real se distingue y los conceptos se declaran', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  const datos = await page.evaluate(() => ({
    chapasCliente: [...document.querySelectorAll('.bg-acento')].filter((e) => /cliente/i.test(e.textContent)).length,
    texto: document.body.innerText,
    conceptos: document.querySelectorAll('.tarjeta').length,
  }));
  assert.equal(datos.chapasCliente, 1, `debe haber exactamente 1 chapa de cliente, hay ${datos.chapasCliente}`);
  assert.ok(/inventad/i.test(datos.texto), 'falta la nota de que los conceptos son inventados');
  assert.equal(datos.conceptos, 10, `deben verse 10 conceptos, hay ${datos.conceptos}`);
  await page.close();
});

await comprueba('el scrub del destacado recorre la captura (CSS puro)', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  const medida = await page.evaluate(async () => {
    const seccion = document.querySelector('.proyecto');
    const img = document.querySelector('.marco__scroll');
    const y0 = seccion.getBoundingClientRect().top + scrollY;
    const leer = () => new DOMMatrixReadOnly(getComputedStyle(img).transform).m42;
    window.scrollTo(0, y0);
    await new Promise((r) => setTimeout(r, 300));
    const inicio = leer();
    window.scrollTo(0, y0 + (seccion.offsetHeight - innerHeight) * 0.8);
    await new Promise((r) => setTimeout(r, 300));
    return { inicio, luego: leer() };
  });
  assert.ok(medida.luego < medida.inicio - 500, `la captura no se recorre: ${JSON.stringify(medida)}`);
  await page.close();
});

await comprueba('con prefers-reduced-motion todo visible y quieto', async () => {
  const page = await abrir({ reducirMovimiento: true });
  const datos = await page.evaluate(() => {
    const ocultos = [...document.querySelectorAll('[data-revela], h1 span')].filter(
      (e) => getComputedStyle(e).opacity === '0'
    ).length;
    const img = document.querySelector('.marco__scroll');
    return { ocultos, animada: getComputedStyle(img).animationName !== 'none' };
  });
  assert.equal(datos.ocultos, 0, `${datos.ocultos} elementos quedan invisibles`);
  assert.ok(!datos.animada, 'el scrub debería estar quieto con reduced-motion');
  await page.close();
});

await comprueba('sin JS la página está entera', async () => {
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60_000 });
  // textContent, no innerText: content-visibility:auto deja las secciones lejanas
  // sin render y su innerText sale vacío aunque el contenido esté ahí.
  const texto = await page.evaluate(() => document.body.textContent);
  for (const clave of ['Fisioymés', '500', 'Cornellà', 'scharcoles@gmail.com']) {
    assert.ok(texto.includes(clave), `sin JS falta "${clave}"`);
  }
  await page.close();
});

await comprueba('hreflang recíprocos y lang correcto', async () => {
  for (const [ruta, lang] of [['', 'es'], ['en/', 'en']]) {
    const page = await abrir({ ruta });
    const datos = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      alternas: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => l.hreflang).sort(),
    }));
    assert.equal(datos.lang, lang);
    assert.deepEqual(datos.alternas, ['en', 'es', 'x-default'], `hreflang en /${ruta}`);
    await page.close();
  }
});

await comprueba('la calculadora está enlazada', async () => {
  const page = await abrir();
  const hay = await page.evaluate(
    () => [...document.querySelectorAll('a')].some((a) => a.href.includes('/presupuesto-web/'))
  );
  assert.ok(hay, 'falta el enlace a la calculadora');
  await page.close();
});

await browser.close();

if (fallos.length) {
  console.error(`\n${fallos.length} comprobación(es) han fallado.`);
  process.exit(1);
}
console.log('\nTodo en orden.');
