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

// Spec §8, rendimiento: NINGUNA demo carga antes de `load` — con una sola
// cargando de salida el LCP se iba a 4,6s (rendimiento 83). Todas despiertan
// después, al acercarse su sección. Este test vigila las dos mitades: que el
// primer pintado no arrastre ningún iframe, y que las cuatro acaben vivas sin
// que nadie toque nada. Si alguien las pone eager, cae el rendimiento y lo caza
// la primera aserción; si alguien rompe el despertar, muere el efecto entero y
// lo caza la segunda.
await comprueba('ninguna demo bloquea el pintado y todas despiertan solas', async () => {
  // El HTML servido, sin navegador de por medio: mirar el DOM tras
  // `domcontentloaded` era una carrera — `load` podía dispararse en el hueco
  // entre que puppeteer resuelve y nosotros consultamos, y el test fallaba solo.
  // El invariante de verdad es que el HTML no traiga ningún iframe.
  const html = await (await fetch(URL)).text();
  const enHtml = (html.match(/<iframe/g) ?? []).length;
  assert.equal(enHtml, 0, `el HTML servido trae ${enHtml} iframe(s); deben crearse tras load`);

  // También en el HTML: TODAS nacen dormidas. En el DOM ya no sirve contarlas —
  // para cuando puppeteer devuelve el control, `load` ha corrido y la primera ya
  // despertó (está a la vista, y eso es lo correcto).
  const dormidas = (html.match(/data-dormido=/g) ?? []).length;

  const page = await abrir({ ancho: 1440, alto: 900, movil: false });

  // El número sale de la propia página, no de una constante: /en/ enseña otros
  // proyectos que la raíz, y un número fijo obligaba a tocar el test por idioma.
  // Contado en el DOM, no con una regex sobre el HTML: "data-proyecto" aparece
  // también en el selector del script y salía uno de más.
  const n = await page.$$eval('[data-proyecto]', (e) => e.length);
  assert.ok(n >= 3, `esperaba 3+ proyectos en la página, hay ${n}`);
  assert.equal(dormidas, n, `el HTML debería traer ${n} demos dormidas, trae ${dormidas}`);

  // Recorrer la página entera: todas deben acabar vivas, sin tocar nada.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await new Promise((r) => setTimeout(r, 2000));

  const srcs = await page.$$eval('.marco iframe', (els) => els.map((e) => e.src));
  assert.equal(srcs.length, n, `tras recorrerla esperaba ${n} iframes, hay ${srcs.length}`);

  // globalThis.URL, no URL a secas: la constante URL de este módulo shadowea el
  // constructor global y "new URL(...)" rompería con "URL is not a constructor".
  for (const s of srcs) {
    const u = new globalThis.URL(s);
    assert.equal(u.origin, new globalThis.URL(URL).origin, `el iframe no es del mismo origen: ${s}`);
    assert.ok(/^\/(demo-|fisioymes)/.test(u.pathname), `ruta inesperada: ${u.pathname}`);
  }
  await page.close();
});

// El cliente real no puede confundirse con los conceptos inventados (spec §2).
await comprueba('el cliente real se distingue de los conceptos', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
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
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  const texto = await page.evaluate(() => document.body.innerText.toLowerCase());
  // /concept/ casa con "concepto" y con "concept": vale para los dos idiomas.
  const conceptos = (texto.match(/concept/g) ?? []).length;
  assert.ok(conceptos >= 2, `solo ${conceptos} menciones de "concepto", esperaba 2+`);
  assert.ok(!texto.includes('cliente satisfecho'), 'lenguaje de cliente en una demo inventada');
  assert.ok(!texto.includes('happy client'), 'lenguaje de cliente en una demo inventada');
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
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await new Promise((r) => setTimeout(r, 2500)); // que despierten y carguen

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
