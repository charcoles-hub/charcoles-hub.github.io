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
  // Se engancha ANTES de navegar: un error durante el primer pintado no se
  // recupera después.
  page.errores = [];
  // El 404 de /favicon.ico no lo pide la página: lo pide el navegador solo, en
  // cualquier sitio sin favicon. No es un error nuestro y taparía los que sí.
  // Si algún día se añade un favicon, este filtro sobra.
  page.on(
    'requestfailed',
    (r) => !/favicon\.ico$/.test(r.url()) && page.errores.push(`${r.url()} falló`)
  );
  page.on('response', (r) => {
    if (r.status() >= 400 && !/favicon\.ico$/.test(r.url())) {
      page.errores.push(`${r.status()} en ${r.url()}`);
    }
  });
  page.on('console', (m) => {
    // El mensaje genérico del 404 del favicon no trae URL; se descarta por el
    // listener de `response`, que sí la tiene.
    if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) {
      page.errores.push(m.text());
    }
  });
  page.on('pageerror', (e) => page.errores.push(String(e)));
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60_000 });
  return page;
}

console.log(`\nVerificando ${URL}\n`);

// Cero errores de consola, recorriendo la página entera (las demos despiertan
// al scrollear, así que un error suyo no aparece hasta que se las visita).
await comprueba('sin errores de consola', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await new Promise((r) => setTimeout(r, 2000));
  assert.deepEqual(page.errores, [], `errores en consola:\n       ${page.errores.join('\n       ')}`);
  await page.close();
});

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

// El cliente real no puede confundirse con los conceptos inventados (spec §2).
// Estos checks de contenido van con reduced-motion: leen body.innerText, que
// ignora subárboles con display:none — con el 3D activo el estático está oculto;
// con reduced-motion se prueba el fallback, que es lo que indexa Google y leen
// los lectores de pantalla.
await comprueba('el cliente real se distingue de los conceptos', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false, reducirMovimiento: true });
  const texto = await page.evaluate(() => document.body.innerText);
  // Sin la /i esto falla: innerText devuelve el texto RENDERIZADO y la chapa
  // lleva `uppercase`, así que en pantalla pone "CLIENTE".
  const lang = await page.evaluate(() => document.documentElement.lang);
  assert.ok(/cliente|client/i.test(texto), 'no aparece la etiqueta Cliente/Client por ningún lado');
  assert.ok(
    texto.includes(
      lang === 'en'
        ? 'Real engagement, in production. Published here with their permission.'
        : 'Encargo real, en producción. Publicado aquí con su permiso.'
    ),
    'falta la nota de encargo real con permiso'
  );
  // "concept" casa también con "concepto": una sola expresión para los dos idiomas.
  const conceptos = (texto.match(/— concept/gi) ?? []).length;
  const proyectos = await page.$$eval('[data-proyecto]', (e) => e.length);
  assert.equal(
    conceptos,
    proyectos - 1,
    `${proyectos} proyectos y ${conceptos} conceptos: solo Fisioymés puede ir sin etiqueta de concepto`
  );
  await page.close();
});

// Las dos versiones tienen que ser rutas reales, indexables por separado, y
// declararse la una a la otra. Si alguien convierte esto en un conmutador por JS
// o deja un hreflang apuntando a una URL que no existe, cae aquí.
await comprueba('hreflang recíprocos y lang correcto', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  const { lang, alternas } = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    alternas: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map((l) => ({
      hreflang: l.hreflang,
      href: l.href,
    })),
  }));
  assert.ok(['es', 'en'].includes(lang), `lang del <html> inesperado: "${lang}"`);
  for (const codigo of ['es', 'en', 'x-default']) {
    assert.ok(
      alternas.some((a) => a.hreflang === codigo),
      `falta el hreflang "${codigo}"`
    );
  }
  // Cada alterna tiene que existir de verdad, en el origen que se está probando.
  const origen = new globalThis.URL(URL).origin;
  for (const a of alternas) {
    const destino = origen + new globalThis.URL(a.href).pathname;
    const res = await fetch(destino);
    assert.equal(res.status, 200, `hreflang ${a.hreflang} apunta a ${destino} y da ${res.status}`);
  }
  // Y el selector de idioma tiene que ser un enlace real, no un botón con JS.
  const enlaces = await page.$$eval('nav a[hreflang]', (els) =>
    els.map((e) => new URL(e.href).pathname)
  );
  assert.deepEqual(enlaces.sort(), ['/', '/en/'], `selector de idioma inesperado: ${enlaces}`);
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
  const page = await abrir({ ancho: 1440, alto: 900, movil: false, reducirMovimiento: true });
  const texto = await page.evaluate(() => document.body.innerText.toLowerCase());
  // /concept/ casa con "concepto" y con "concept": vale para los dos idiomas.
  const conceptos = (texto.match(/concept/g) ?? []).length;
  assert.ok(conceptos >= 2, `solo ${conceptos} menciones de "concepto", esperaba 2+`);
  assert.ok(!texto.includes('cliente satisfecho'), 'lenguaje de cliente en una demo inventada');
  assert.ok(!texto.includes('happy client'), 'lenguaje de cliente en una demo inventada');
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
  const page = await abrir({ ancho: 1440, alto: 900, movil: false, reducirMovimiento: true });
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
  const page = await abrir({ ancho: 1440, alto: 900, movil: false, reducirMovimiento: true });
  const forms = await page.$$eval('form, input[type="email"]', (e) => e.length);
  assert.equal(forms, 0, `hay ${forms} elemento(s) de formulario`);
  await page.close();
});

// Recorrido 3D, Task 1: la config bilingüe está inyectada y es completa.
await comprueba('la config 3D trae los dos idiomas con sus demos', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  const cfg = await page.evaluate(() => {
    const c = window.__VIAJE_CONFIG;
    if (!c) return null;
    return {
      lang: c.lang,
      es: c.datos?.es?.proyectos?.map((p) => p.ruta),
      en: c.datos?.en?.proyectos?.map((p) => p.ruta),
      bioEs: c.datos?.es?.bio?.parrafos?.length,
    };
  });
  assert.ok(cfg, 'no existe window.__VIAJE_CONFIG');
  assert.equal(cfg.lang, 'es');
  assert.deepEqual(cfg.es, [
    '/fisioymes/', '/demo-barberia-navaja/', '/demo-dental-sereno/', '/demo-psicologia-ancla/',
  ]);
  assert.deepEqual(cfg.en, ['/fisioymes/', '/demo-dental-us/', '/demo-lawfirm-us/']);
  assert.equal(cfg.bioEs, 3);
  await page.close();
});

// Recorrido 3D, Task 1: sin permiso para el 3D, la home es la web estática.
await comprueba('con reduced-motion la home es el fallback estático', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false, reducirMovimiento: true });
  await new Promise((r) => setTimeout(r, 1500));
  const estado = await page.evaluate(() => ({
    viaje3d: document.documentElement.classList.contains('viaje3d'),
    estaticoVisible: getComputedStyle(document.getElementById('estatico')).display !== 'none',
    texto: document.body.innerText,
  }));
  assert.equal(estado.viaje3d, false, 'con reduced-motion no debe arrancar el 3D');
  assert.ok(estado.estaticoVisible, '#estatico debe seguir visible');
  assert.ok(estado.texto.includes('Diseño y construyo webs a medida'), 'falta el titular de la portada');
  assert.ok(estado.texto.includes('scharcoles@gmail.com'), 'falta el email de contacto');
  await page.close();
});

// Recorrido 3D, Task 2: la escena arranca, pinta y no ensucia la consola.
await comprueba('el 3D arranca y el estático se retira', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  await new Promise((r) => setTimeout(r, 2500));
  const estado = await page.evaluate(() => ({
    viaje3d: document.documentElement.classList.contains('viaje3d'),
    estaticoOculto: getComputedStyle(document.getElementById('estatico')).display === 'none',
    canvasVisible: getComputedStyle(document.getElementById('webgl')).display !== 'none',
    fps: window.__fps ?? 0,
  }));
  assert.ok(estado.viaje3d, 'falta la clase viaje3d — el 3D no arrancó');
  assert.ok(estado.estaticoOculto, '#estatico debe ocultarse con el 3D activo');
  assert.ok(estado.canvasVisible, 'el canvas WebGL debe estar visible');
  assert.ok(estado.fps > 0, `__fps es ${estado.fps}: el loop no corre`);
  assert.deepEqual(page.errores, [], `errores en consola:\n       ${page.errores.join('\n       ')}`);
  await page.close();
});

await browser.close();

console.log('');
if (fallos.length) {
  console.error(`${fallos.length} fallo(s): ${fallos.join(', ')}\n`);
  process.exit(1);
}
console.log('Todo en verde.\n');
