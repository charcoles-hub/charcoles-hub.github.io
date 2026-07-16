// Lanza contra `npm run servir` (dist/ + proxy de /demo-*), NO contra
// `npm run preview`: astro preview no aplica el proxy de Vite, así que no
// resuelve /demo-* y los iframes se quedarían cross-origin.
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

// Spec §8, plan B de rendimiento: al cargar solo va viva la primera demo (tres
// iframes a la vez hunden el LCP: 76 de rendimiento con las tres, 95 con una).
// Las otras dos esperan a ACERCARSE, no a que las toquen — ver PosterVivo.
// Este test vigila las dos mitades: que arranque con una, y que las tres acaben
// despertando. Si alguien las pone todas eagerly, cae el rendimiento y lo caza
// la primera aserción; si alguien rompe el despertar, muere el efecto en dos de
// los tres proyectos y lo caza la segunda.
await comprueba('arranca con 1 demo viva y las 3 despiertan al acercarse', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });

  const alCargar = await page.$$eval('.marco iframe', (els) => els.length);
  assert.equal(alCargar, 1, `al cargar esperaba 1 iframe, hay ${alCargar}`);
  const dormidas = await page.$$eval('[data-dormido]', (els) => els.length);
  assert.equal(dormidas, 2, `esperaba 2 demos dormidas, hay ${dormidas}`);

  // Recorrer la página entera: las tres deben acabar vivas, sin tocar nada.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await new Promise((r) => setTimeout(r, 1500));

  const srcs = await page.$$eval('.marco iframe', (els) => els.map((e) => e.src));
  assert.equal(srcs.length, 3, `tras recorrerla esperaba 3 iframes, hay ${srcs.length}`);

  // globalThis.URL, no URL a secas: la constante URL de este módulo (línea 6)
  // shadowea el constructor global, y "new URL(...)" rompería con
  // "URL is not a constructor".
  for (const s of srcs) {
    const u = new globalThis.URL(s);
    assert.equal(u.origin, new globalThis.URL(URL).origin, `el iframe no es del mismo origen: ${s}`);
    assert.ok(/^\/demo-/.test(u.pathname), `ruta inesperada: ${u.pathname}`);
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
  // Plan B (spec §8): solo el marco con iframe vivo tiene algo que medir aquí;
  // los otros dos siguen en captura hasta que alguien los toque.
  const medidas = await page.$$eval('.marco:has(iframe)', (marcos) =>
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
// Si el iframe fuera cross-origin, contentWindow.scrollY lanzaría y el test
// fallaría — que es exactamente lo que queremos que pase.
await comprueba('la demo se recorre al scrollear', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  await page.waitForSelector('.marco[data-listo="si"]', { timeout: 10_000 });
  await new Promise((r) => setTimeout(r, 800)); // que carguen los iframes

  const leerScroll = () =>
    page.$eval('.marco iframe', (f) => f.contentWindow.scrollY);

  const antes = await leerScroll();
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
  await new Promise((r) => setTimeout(r, 500));
  const despues = await leerScroll();

  assert.ok(despues > antes, `la demo no se movió por dentro (${antes} -> ${despues})`);
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

// Criterio 7: sin teléfono publicado en esta iteración (spec §7).
await comprueba('sin teléfono publicado', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  const html = await page.content();
  assert.ok(!/href=["']tel:/i.test(html), 'hay un enlace tel: en la página');
  assert.ok(
    !/\b(?:\+34[\s.-]?)?[6-7]\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}\b/.test(
      await page.evaluate(() => document.body.innerText)
    ),
    'hay algo con pinta de móvil español en el texto'
  );
  await page.close();
});

// Spec §3: sin formulario.
await comprueba('sin formulario de contacto', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  const forms = await page.$$eval('form, input[type="email"]', (e) => e.length);
  assert.equal(forms, 0, `hay ${forms} elemento(s) de formulario`);
  await page.close();
});

await browser.close();

console.log('');
if (fallos.length) {
  console.error(`${fallos.length} fallo(s): ${fallos.join(', ')}\n`);
  process.exit(1);
}
console.log('Todo en verde.\n');
