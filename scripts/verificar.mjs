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

async function abrir({ ancho = 390, alto = 844, movil = true, reducirMovimiento = false, romperWebGL = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: ancho, height: alto, isMobile: movil, deviceScaleFactor: 2 });
  if (reducirMovimiento) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  }
  if (romperWebGL) {
    // Simula un dispositivo sin WebGL2 usable (GPU capada por el driver):
    // getContext LANZA, que es el caso peor — devolver null sería más amable.
    await page.evaluateOnNewDocument(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (tipo, ...resto) {
        if (tipo === 'webgl2') throw new Error('WebGL2 bloqueado (simulado por el arnés)');
        return original.call(this, tipo, ...resto);
      };
    });
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
// Va con reduced-motion como los checks de contenido: los iframes nacen por
// IntersectionObserver dentro de #estatico, y con el 3D activo #estatico está
// oculto y el observador no interseca — hay carrera entre el boot del 3D y el
// despertar de las demos. En el fallback (lo que toca de verdad un dedo) los
// iframes existen siempre y la regla se mide donde importa.
await comprueba('los iframes no capturan el puntero', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false, reducirMovimiento: true });
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

// Recorrido 3D, Task 2 (fix de revisión): si WebGL2 no se puede crear — el
// guardián o el renderer lanzan — la home se queda estática, completa y sin
// errores. Es la restricción "sin WebGL → fallback estático completo".
await comprueba('si WebGL2 falla la home queda estática y sin errores', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false, romperWebGL: true });
  await new Promise((r) => setTimeout(r, 2000));
  const estado = await page.evaluate(() => ({
    viaje3d: document.documentElement.classList.contains('viaje3d'),
    estaticoVisible: getComputedStyle(document.getElementById('estatico')).display !== 'none',
  }));
  assert.equal(estado.viaje3d, false, 'con WebGL2 roto no debe arrancar el 3D');
  assert.ok(estado.estaticoVisible, '#estatico debe seguir visible');
  assert.deepEqual(page.errores, [], `errores en consola:\n       ${page.errores.join('\n       ')}`);
  await page.close();
});

// Recorrido 3D, Task 3: las demos del idioma activo son pantallas CSS3D vivas.
await comprueba('las demos cuelgan de pantallas CSS3D del mismo origen', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  await page.waitForFunction(() => window.__viaje?.pantallas, { timeout: 15_000 });
  await page.waitForFunction(() => window.__viaje.pantallas.cargadas(), { timeout: 30_000 });
  const datos = await page.evaluate(() => {
    const { iframes } = window.__viaje.pantallas;
    return {
      rims: document.querySelectorAll('#css3d-container .pantalla-rim').length,
      srcs: iframes.map((f) => f.src),
      pe: iframes.map((f) => getComputedStyle(f).pointerEvents),
    };
  });
  assert.equal(datos.rims, 4, `ES debe tener 4 pantallas, hay ${datos.rims}`);
  for (const [i, s] of datos.srcs.entries()) {
    const u = new globalThis.URL(s);
    assert.equal(u.origin, new globalThis.URL(URL).origin, `iframe ${i} no es del mismo origen`);
    assert.ok(/^\/(demo-|fisioymes)/.test(u.pathname), `ruta inesperada: ${u.pathname}`);
  }
  for (const v of datos.pe) assert.equal(v, 'none', 'el iframe debe tener pointer-events:none');
  assert.deepEqual(page.errores, [], `errores en consola:\n       ${page.errores.join('\n       ')}`);
  await page.close();
});

// Recorrido 3D, Task 4: el scroll gobierna la cámara y la lectura scrollea la demo.
await comprueba('el recorrido viaje/lectura funciona', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  await page.waitForFunction(() => window.__galeria?.demosLoaded?.(), { timeout: 30_000 });
  const limites = await page.evaluate(() => window.__galeria.limites());
  const lecturasProyecto = limites.filter((l) => l.tipo === 'lectura' && l.id?.startsWith('proyecto'));
  assert.equal(lecturasProyecto.length, 4, `ES debe tener 4 lecturas de proyecto, hay ${lecturasProyecto.length}`);

  // Cámara en movimiento: al principio y a mitad de la primera parada difiere.
  const camAlInicio = await page.evaluate(() => window.__galeria.camPos());
  await page.evaluate((y) => window.__galeria.setScroll(y), await page.evaluate(() => window.__galeria.paradaMidY(0)));
  await new Promise((r) => setTimeout(r, 1500)); // el lerp tarda unos frames
  const camEnParada = await page.evaluate(() => window.__galeria.camPos());
  assert.notDeepEqual(camEnParada, camAlInicio, 'la cámara no se movió con el scroll');

  // Lectura: la demo scrollea por dentro en su parada.
  const scrollDemo = await page.evaluate(() => window.__galeria.getDemoScrollY(0));
  assert.ok(scrollDemo > 200, `la demo 0 debería ir scrolleada por dentro, va por ${scrollDemo}`);
  assert.deepEqual(page.errores, [], `errores en consola:\n       ${page.errores.join('\n       ')}`);
  await page.close();
});

// Recorrido 3D, Task 5: el viaje termina en bio y contacto, con ids estables.
await comprueba('el recorrido tiene paradas de héroe, bio y contacto', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  await page.waitForFunction(() => window.__galeria?.limites, { timeout: 15_000 });
  const ids = await page.evaluate(() => window.__galeria.limites().map((l) => l.id));
  assert.deepEqual(ids, [
    'hero',
    'viaje-a-proyecto-0', 'proyecto-0',
    'viaje-a-proyecto-1', 'proyecto-1',
    'viaje-a-proyecto-2', 'proyecto-2',
    'viaje-a-proyecto-3', 'proyecto-3',
    'viaje-a-bio', 'bio',
    'viaje-a-contacto', 'contacto',
  ], `secuencia de segmentos inesperada: ${ids.join(', ')}`);

  // Al final del todo, la cámara está en la parada de contacto (z ≈ -5*SPACING).
  await page.evaluate(() => window.__galeria.setScroll(window.__galeria.totalPx()));
  await new Promise((r) => setTimeout(r, 1500));
  const cam = await page.evaluate(() => window.__galeria.camPos());
  assert.ok(cam.z < -6000, `la cámara debería estar al fondo del recorrido, z=${Math.round(cam.z)}`);
  assert.deepEqual(page.errores, [], `errores en consola:\n       ${page.errores.join('\n       ')}`);
  await page.close();
});

// Recorrido 3D, Task 6: la carga muestra progreso real y desemboca en el viaje.
await comprueba('la pantalla de carga monta la escena con progreso real', async () => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  page.errores = [];
  page.on('pageerror', (e) => page.errores.push(String(e)));
  // domcontentloaded, no networkidle: hay que pillar la carga EN CURSO.
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });

  await page.waitForFunction(
    () => document.getElementById('carga') && getComputedStyle(document.getElementById('carga')).display !== 'none',
    { timeout: 15_000 }
  );
  const textoDurante = await page.evaluate(() => document.getElementById('carga-texto').textContent);
  assert.ok(/montando/i.test(textoDurante), `el indicador no muestra montaje: "${textoDurante}"`);

  await page.waitForFunction(() => window.__viaje?.cargaCompleta?.(), { timeout: 30_000 });
  const estadoFinal = await page.evaluate(() => ({
    oculta: document.getElementById('carga').getAttribute('aria-hidden') === 'true',
    montadas: document.querySelectorAll('.pantalla-rim.montada').length,
    scrollLibre: getComputedStyle(document.documentElement).overflow !== 'hidden',
  }));
  assert.ok(estadoFinal.oculta, 'la capa de carga debe quedar aria-hidden al terminar');
  assert.equal(estadoFinal.montadas, 4, `las 4 pantallas deben quedar montadas, hay ${estadoFinal.montadas}`);
  assert.ok(estadoFinal.scrollLibre, 'el scroll sigue bloqueado tras la carga');
  assert.deepEqual(page.errores, [], `errores en consola:\n       ${page.errores.join('\n       ')}`);
  await page.close();
});

// Recorrido 3D, Task 7: el HUD cuenta cada parada y la bio se revela por tramos.
await comprueba('el HUD muestra el texto de cada parada', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  await page.waitForFunction(() => window.__viaje?.cargaCompleta?.(), { timeout: 30_000 });

  const panel = () =>
    page.evaluate(() => {
      const p = document.querySelector('.hud-panel.visible');
      return p ? p.innerText : '';
    });

  // Héroe: subtítulo y la pista de scroll.
  const hero = await panel();
  assert.ok(hero.includes('Estáticas, rápidas'), `el héroe no muestra el subtítulo: "${hero}"`);

  // Parada de proyecto: ficha de Fisioymés con su nota de cliente y el enlace.
  await page.evaluate(() => window.__galeria.setScroll(window.__galeria.segmentoMidY('proyecto-0')));
  await new Promise((r) => setTimeout(r, 1500));
  const p0 = await panel();
  assert.ok(p0.includes('Fisioymés'), `falta el nombre del proyecto: "${p0}"`);
  assert.ok(p0.includes('Encargo real, en producción'), `falta la nota de cliente: "${p0}"`);
  const enlace = await page.$eval('.hud-panel.visible a', (a) => a.href);
  assert.ok(enlace.includes('/fisioymes/'), `el enlace debería abrir la demo real: ${enlace}`);

  // Bio: empieza con 1 párrafo visible y acaba con 3.
  const bioVisibles = async (frac) => {
    await page.evaluate((f) => {
      const l = window.__galeria.limites().find((s) => s.id === 'bio');
      window.__galeria.setScroll(l.start + (l.end - l.start) * f);
    }, frac);
    await new Promise((r) => setTimeout(r, 1500));
    return page.$$eval('.hud-panel.visible [data-parrafo].visible', (e) => e.length);
  };
  assert.equal(await bioVisibles(0.05), 1, 'al entrar en bio solo se ve el primer párrafo');
  assert.equal(await bioVisibles(0.95), 3, 'al salir de bio se ven los tres párrafos');

  // Contacto: el email como CTA.
  await page.evaluate(() => window.__galeria.setScroll(window.__galeria.totalPx()));
  await new Promise((r) => setTimeout(r, 1500));
  const mail = await page.$eval('.hud-panel.visible a', (a) => a.href);
  assert.ok(mail.startsWith('mailto:scharcoles@gmail.com'), `CTA inesperado: ${mail}`);

  // Barra superior con el toggle.
  const botones = await page.$$eval('.hud-top button[data-idioma]', (b) => b.map((x) => x.dataset.idioma));
  assert.deepEqual(botones.sort(), ['en', 'es']);
  assert.deepEqual(page.errores, [], `errores en consola:\n       ${page.errores.join('\n       ')}`);
  await page.close();
});

// Recorrido 3D, Task 8: los titulares de sección flotan en la escena.
await comprueba('los titulares flotan en CSS3D', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  await page.waitForFunction(() => window.__viaje?.cargaCompleta?.(), { timeout: 30_000 });
  const titulares = await page.$$eval('#css3d-container .titular3d', (els) =>
    els.map((e) => e.textContent.trim())
  );
  assert.equal(titulares.length, 7, `ES: hero + 4 proyectos + bio + contacto = 7, hay ${titulares.length}`);
  assert.ok(titulares.some((t) => t.includes('Diseño y construyo webs a medida')), 'falta el titular del héroe');
  assert.ok(titulares.some((t) => t.includes('Fisioterapia')), 'falta el titular de Fisioymés');
  assert.ok(titulares.some((t) => t.includes('quien está hablando contigo')), 'falta el titular de bio');
  assert.deepEqual(page.errores, [], `errores en consola:\n       ${page.errores.join('\n       ')}`);
  await page.close();
});

// Recorrido 3D, Task 9: el toggle cambia textos y demos sin recargar.
await comprueba('el toggle ES/EN reconstruye el viaje en vivo', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  await page.waitForFunction(() => window.__viaje?.cargaCompleta?.(), { timeout: 30_000 });

  // Marcador anti-recarga: si la página navegara, esto desaparecería.
  await page.evaluate(() => { window.__marcaAntiRecarga = 1; });
  await page.evaluate(() => window.__galeria.setScroll(window.__galeria.segmentoMidY('proyecto-1')));
  await new Promise((r) => setTimeout(r, 1200));
  const fracAntes = await page.evaluate(() => scrollY / window.__galeria.totalPx());

  await page.click('button[data-idioma="en"]');
  await page.waitForFunction(() => window.__viaje.pantallas.iframes.length === 3, { timeout: 10_000 });
  await new Promise((r) => setTimeout(r, 1200));

  const estado = await page.evaluate(() => ({
    marca: window.__marcaAntiRecarga,
    lang: document.documentElement.lang,
    titulo: document.title,
    rutas: window.__viaje.pantallas.iframes.map((f) => new URL(f.src).pathname),
    fracDespues: scrollY / window.__galeria.totalPx(),
    titulares: document.querySelectorAll('#css3d-container .titular3d').length,
  }));
  assert.equal(estado.marca, 1, 'la página se recargó al cambiar de idioma');
  assert.equal(estado.lang, 'en');
  assert.ok(estado.titulo.includes('Web designer'), `el <title> no cambió: ${estado.titulo}`);
  assert.deepEqual(estado.rutas, ['/fisioymes/', '/demo-dental-us/', '/demo-lawfirm-us/']);
  assert.equal(estado.titulares, 6, `EN: hero + 3 proyectos + bio + contacto = 6, hay ${estado.titulares}`);
  assert.ok(
    Math.abs(estado.fracDespues - fracAntes) < 0.05,
    `el progreso saltó: ${fracAntes.toFixed(3)} -> ${estado.fracDespues.toFixed(3)}`
  );

  // El panel repinta en inglés: nos anclamos a la parada de proyecto 1 (EN:
  // dental US), porque el progreso fraccional NO garantiza caer en el mismo
  // tipo de segmento — los totales en vh difieren entre idiomas.
  await page.evaluate(() => window.__galeria.setScroll(window.__galeria.segmentoMidY('proyecto-1')));
  await new Promise((r) => setTimeout(r, 1500));
  const panel = await page.evaluate(() => document.querySelector('.hud-panel.visible')?.innerText ?? '');
  assert.ok(/dental|Dental/.test(panel), `el panel no está en inglés: "${panel}"`);

  // Y vuelta: ES recupera sus 4 pantallas sin errores.
  await page.click('button[data-idioma="es"]');
  await page.waitForFunction(() => window.__viaje.pantallas.iframes.length === 4, { timeout: 10_000 });
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
