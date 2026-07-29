# Recorrido 3D Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir la home en un viaje 3D continuo gobernado por scroll (héroe → demos vivas → bio → contacto), con pantalla de carga de montaje, toggle ES/EN en vivo que cambia textos y demos, y fallback estático.

**Architecture:** Astro + three.js vanilla. Dos renderers: `CSS3DRenderer` (pantallas con iframes de las demos + titulares flotantes) sobre `WebGLRenderer` (partículas). El contenido estático actual se queda en el DOM como fallback (`#estatico`) y solo se oculta cuando el 3D arranca. Código cliente en módulos bajo `src/scripts/viaje/` portados desde `src/pages/galeria.astro` (Fase 1). `/en/` sirve la misma experiencia arrancada en inglés.

**Tech Stack:** Astro 7, three 0.185 (ya instalado), Tailwind 4, Puppeteer-core + `scripts/verificar.mjs` como arnés.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-29-recorrido-3d-design.md`. Léelo antes de tocar nada.
- **Sin React ni capas extra.** Astro + three.js vanilla, igual que los specs anteriores.
- **Textos: única fuente `src/config/site.ts`.** Ni un string de contenido hardcodeado en los módulos JS.
- **ES = 4 paradas de proyecto** (fisioymes, demo-barberia-navaja, demo-dental-sereno, demo-psicologia-ancla); **EN = 3** (fisioymes, demo-dental-us, demo-lawfirm-us). Nunca mezcles los conjuntos.
- Iframes de demos: `pointer-events: none` SIEMPRE (si no, se comen la rueda y el scroll muere). Rutas relativas (`/demo-…/`), nunca absolutas (mismo origen o no se puede scrollear por dentro).
- El rim naranja de las pantallas es un `border`, no `box-shadow` (box-shadow no pinta su color a través del pipeline CSS3D — comprobado a pixel en el spike).
- Los estilos de DOM creado en runtime (pantallas, titulares) van en `global.css`, no en estilos scopeados de Astro (el scope necesita el data-astro-cid que los nodos creados con `document.createElement` no tienen).
- `prefers-reduced-motion: reduce` o sin WebGL → fallback estático completo, sin canvas, sin errores.
- Cero errores de consola en todos los checks. El 404 de `/favicon.ico` ya está filtrado en el arnés; no añadas un favicon para callarlo.
- Contenido prohibido (del spec de la web): sin teléfono, sin formulario, los conceptos siempre etiquetados como concepto, Fisioymés es el único cliente.
- Comentarios de código en español, estilo del repo (explican el PORQUÉ, no el qué).
- **Cómo verificar** (lo usa cada task): la verificación corre contra `dist/` + proxy de demos, así que hay que buildear primero:
  ```bash
  cd ~/Proyectos/charcoles-hub.github.io
  npm run build && node scripts/servir.mjs & sleep 2
  node scripts/verificar.mjs; FALLO=$?
  kill %1 2>/dev/null; exit $FALLO
  ```
  En los steps se abrevia como **"Run: verificar"**.

---

### Task 1: Andamiaje — página 3D con fallback estático y config bilingüe

**Files:**
- Create: `src/components/Recorrido3D.astro`
- Create: `src/scripts/viaje/main.js`
- Modify: `src/pages/index.astro` (reemplazo completo)
- Modify: `src/pages/en/index.astro` (reemplazo completo)
- Modify: `src/styles/global.css` (añadir capa 3D al final)
- Modify: `scripts/verificar.mjs`

**Interfaces:**
- Consumes: `contenido` de `src/config/site.ts`, componentes existentes `Portada/Trabajo/Bio/ComoTrabajo/Contacto`.
- Produces: `window.__VIAJE_CONFIG = { datos: { es: DatosLang, en: DatosLang }, lang: 'es'|'en' }` donde `DatosLang = { site, portadaPie, bio, metodo, contacto, proyecto: { trabajo, cliente, notaConcepto, notaCliente, abrir, envivo }, proyectos: Proyecto[] & { tituloFicha: string } }`. Todos los tasks posteriores leen de aquí. Clase `html.viaje3d` = el 3D ha arrancado (CSS: oculta `#estatico`, muestra las capas 3D).

- [ ] **Step 1: Podar el arnés y escribir el test que falla**

En `scripts/verificar.mjs`:
- **Elimina** estos checks enteros (miden la mecánica de la web vieja, que deja de ser la home): `'ninguna demo bloquea el pintado y todas despiertan solas'`, `'los iframes están escalados al marco'`, `'la demo se recorre al scrollear'`.
- En los checks `'el cliente real se distingue de los conceptos'`, `'los conceptos se declaran conceptos'`, `'sin teléfono publicado'` y `'sin formulario de contacto'`, cambia la llamada `abrir({ ancho: 1440, alto: 900, movil: false })` por `abrir({ ancho: 1440, alto: 900, movil: false, reducirMovimiento: true })`. Motivo: leen `document.body.innerText`, que ignora subárboles con `display:none` — con el 3D activo el contenido estático está oculto; con reduced-motion se prueba el fallback, que es justo lo que indexa Google y leen los lectores de pantalla.
- Añade al final, antes de `await browser.close()`:

```js
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
```

- [ ] **Step 2: Run verificar — los dos checks nuevos fallan**

Expected: FALLO en ambos (`__VIAJE_CONFIG` no existe; `getElementById('estatico')` es null → TypeError). Los checks de contenido pasados a reduced-motion siguen en verde porque la home actual ya cumple ese comportamiento.

- [ ] **Step 3: Crear `src/components/Recorrido3D.astro`**

```astro
---
// La home como viaje 3D (spec 2026-07-29-recorrido-3d-design.md).
// Estático primero: #estatico trae el contenido de verdad (SEO, lectores de
// pantalla, reduced-motion, no-WebGL). El 3D es una capa que se añade con la
// clase html.viaje3d cuando main.js da el visto bueno.
import Portada from './Portada.astro';
import Trabajo from './Trabajo.astro';
import Bio from './Bio.astro';
import ComoTrabajo from './ComoTrabajo.astro';
import Contacto from './Contacto.astro';
import { contenido, type Lang } from '../config/site';

interface Props { lang: Lang }
const { lang } = Astro.props;

// Los formatters de site.ts (concepto(n), proyectoN(n)) son funciones y no
// cruzan define:vars — se pre-calculan aquí por proyecto.
function datosLang(l: Lang) {
  const C = contenido[l];
  return {
    site: C.site,
    portadaPie: C.portadaPie,
    bio: C.bio,
    metodo: C.metodo,
    contacto: C.contacto,
    proyecto: {
      trabajo: C.proyecto.trabajo,
      cliente: C.proyecto.cliente,
      notaConcepto: C.proyecto.notaConcepto,
      notaCliente: C.proyecto.notaCliente,
      abrir: C.proyecto.abrir,
      envivo: C.proyecto.envivo,
    },
    proyectos: C.proyectos.map((p) => ({
      ...p,
      tituloFicha: p.etiqueta === 'cliente' ? C.proyecto.cliente : C.proyecto.concepto(p.n),
    })),
  };
}
const datos = { es: datosLang('es'), en: datosLang('en') };
---

<div id="estatico">
  <Portada lang={lang} />
  <Trabajo lang={lang} />
  <Bio lang={lang} />
  <ComoTrabajo lang={lang} />
  <Contacto lang={lang} />
</div>

<canvas id="webgl" aria-hidden="true"></canvas>
<div id="css3d-container" aria-hidden="true"></div>
<div id="carga" aria-hidden="true"><span id="carga-texto"></span></div>
<div id="hud"></div>

<script define:vars={{ datos, langInicial: lang }}>
  window.__VIAJE_CONFIG = { datos, lang: langInicial };
</script>
<script>
  import { iniciar } from '../scripts/viaje/main.js';
  iniciar();
</script>
```

- [ ] **Step 4: Reemplazar las dos páginas**

`src/pages/index.astro` entero:

```astro
---
// Español, en la RAÍZ: es lo indexado y no se mueve. La experiencia 3D con
// fallback estático vive en Recorrido3D; /en/ es la misma arrancada en inglés.
import Layout from '../layouts/Layout.astro';
import Recorrido3D from '../components/Recorrido3D.astro';
---
<Layout lang="es">
  <Recorrido3D lang="es" />
</Layout>
```

`src/pages/en/index.astro` entero: igual con `lang="en"` en ambos.

- [ ] **Step 5: CSS de la capa 3D en `src/styles/global.css`** (al final del archivo)

```css
/* ---- Recorrido 3D ----
   Estático primero: las capas 3D nacen ocultas y es html.viaje3d quien las
   enseña y apaga #estatico. Si el JS no corre o no da el visto bueno
   (reduced-motion, sin WebGL), la página es la web estática de siempre. */
#webgl, #css3d-container, #carga, #hud { display: none; }

html.viaje3d #estatico { display: none; }
html.viaje3d #webgl { display: block; position: fixed; inset: 0; z-index: 1; }
html.viaje3d #css3d-container {
  display: block; position: fixed; inset: 0; z-index: 2;
  overflow: hidden; pointer-events: none;
}
html.viaje3d #carga {
  display: grid; place-items: end center;
  position: fixed; inset: 0; z-index: 20;
  padding-bottom: 12vh;
  color: var(--color-tenue);
  font: 500 0.85rem/1.4 var(--font-sans);
  letter-spacing: 0.08em; text-transform: uppercase;
  pointer-events: none;
  transition: opacity 0.6s ease;
}
html.viaje3d #carga[aria-hidden="true"] { opacity: 0; }
html.viaje3d #hud { display: block; position: fixed; inset: 0; z-index: 10; pointer-events: none; }

/* Rim naranja de acento: es un border, NO un box-shadow — box-shadow no
   pinta su color a través del pipeline 3D de CSS3DRenderer (sale gris). */
.pantalla-rim {
  box-sizing: content-box;
  border-radius: 6px;
  overflow: hidden;
  background: var(--color-fondo);
  border: 4px solid rgb(255 92 55 / 0.75);
}
iframe.demo3d { border: 0; display: block; background: #fff; pointer-events: none; }
```

- [ ] **Step 6: Crear `src/scripts/viaje/main.js` (solo el guardián, sin boot)**

```js
// Guardián de la experiencia 3D. Decide si se arranca el viaje o se queda la
// web estática. En Task 1 todavía no arranca nada: solo deja la decisión
// tomada para el test del fallback. El boot llega en la Task 2.
export async function iniciar() {
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducir) return;
  const canvas = document.getElementById('webgl');
  if (!canvas) return;
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  if (!gl) return;
  // Task 2: aquí va el import dinámico de montar.js y html.viaje3d.
}
```

- [ ] **Step 7: Run verificar — todo en verde**

Expected: los dos checks nuevos pasan; el resto sigue pasando (la home estática no ha cambiado funcionalmente).

- [ ] **Step 8: Commit**

```bash
git add src/components/Recorrido3D.astro src/scripts/viaje/main.js \
  src/pages/index.astro src/pages/en/index.astro src/styles/global.css scripts/verificar.mjs
git commit -m "feat: andamiaje del recorrido 3D — fallback estático primero, config bilingüe inyectada"
```

---

### Task 2: Escena base — renderers, partículas y loop

**Files:**
- Create: `src/scripts/viaje/escena.js`
- Create: `src/scripts/viaje/montar.js`
- Modify: `src/scripts/viaje/main.js`
- Modify: `scripts/verificar.mjs`

**Interfaces:**
- Consumes: Task 1 (`window.__VIAJE_CONFIG`, capas `#webgl`/`#css3d-container`).
- Produces:
  ```js
  // escena.js
  export function crearEscena(canvas, contenedorCSS) -> Escena
  // Escena = { camera: THREE.PerspectiveCamera (FOV 50), escenaGL, escenaCSS,
  //   enCadaFrame(cb: (dtMs: number) => void), setPuntos(zMin: number, zMax: number),
  //   render(): void }
  // window.__fps: number — instrumentación compartida con el arnés.
  ```
  `montar.js` exporta `montarViaje(cfg)`; tasks posteriores lo van engordando.

- [ ] **Step 1: Test que falla**

Añade a `scripts/verificar.mjs` antes de `await browser.close()`:

```js
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
```

- [ ] **Step 2: Run verificar — falla** (`viaje3d` false, `__fps` 0).

- [ ] **Step 3: Crear `src/scripts/viaje/escena.js`**

```js
// Renderers, cámara, partículas y loop. Portado de la Fase 1
// (src/pages/galeria.astro, commits del spike/galeria-3d) con dos cambios:
// las partículas son reconstruibles (el rango en Z cambia al cambiar de
// idioma) y el loop se pausa con la pestaña oculta (lección del fondo 3D).
import * as THREE from 'three';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';

export const FOV = 50; // vertical, grados — menos distorsión que los 70 del spike
const N_PARTICULAS = 600;

export function crearEscena(canvas, contenedorCSS) {
  const escenaGL = new THREE.Scene();
  const escenaCSS = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, 1, 10000);

  const cssRenderer = new CSS3DRenderer();
  cssRenderer.setSize(innerWidth, innerHeight);
  contenedorCSS.appendChild(cssRenderer.domElement);

  const glRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  glRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  glRenderer.setSize(innerWidth, innerHeight);

  // Capa WebGL: partículas tenues al fondo. SIEMPRE detrás del CSS3D — no
  // comparten depth buffer, la mezcla es binaria por z-index.
  const geo = new THREE.BufferGeometry();
  const mat = new THREE.PointsMaterial({
    color: 0x5f7f92, size: 3, sizeAttenuation: true, transparent: true, opacity: 0.35,
  });
  const puntos = new THREE.Points(geo, mat);
  escenaGL.add(puntos);

  function setPuntos(zMin, zMax) {
    const pos = new Float32Array(N_PARTICULAS * 3);
    for (let i = 0; i < N_PARTICULAS; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2800;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1400;
      pos[i * 3 + 2] = zMin + Math.random() * (zMax - zMin);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  }

  const callbacks = new Set();
  function enCadaFrame(cb) { callbacks.add(cb); }

  let pausado = false;
  document.addEventListener('visibilitychange', () => { pausado = document.hidden; });

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    cssRenderer.setSize(innerWidth, innerHeight);
    glRenderer.setSize(innerWidth, innerHeight);
  });

  window.__fps = 0;
  let frames = 0;
  let marcador = performance.now();
  let ultimo = marcador;

  function render() {
    glRenderer.render(escenaGL, camera);
    cssRenderer.render(escenaCSS, camera);
  }

  function loop() {
    requestAnimationFrame(loop);
    const ahora = performance.now();
    frames++;
    if (ahora - marcador >= 500) {
      window.__fps = Math.round((frames * 1000) / (ahora - marcador));
      frames = 0;
      marcador = ahora;
    }
    if (pausado) { ultimo = ahora; return; }
    const dt = ahora - ultimo;
    ultimo = ahora;
    puntos.rotation.y += 0.0006; // muy sutil, es atmósfera
    for (const cb of callbacks) cb(dt);
    render();
  }
  loop();

  return { camera, escenaGL, escenaCSS, enCadaFrame, setPuntos, render };
}
```

- [ ] **Step 4: Crear `src/scripts/viaje/montar.js`**

```js
// Orquestador del viaje. Lo carga main.js con import dinámico SOLO cuando el
// guardián da el visto bueno: three.js no pesa en el primer pintado del
// fallback estático. Las tasks siguientes van añadiendo piezas aquí.
import { crearEscena } from './escena.js';

export async function montarViaje(cfg) {
  document.documentElement.classList.add('viaje3d');
  const escena = crearEscena(
    document.getElementById('webgl'),
    document.getElementById('css3d-container')
  );
  escena.setPuntos(-6000, 800); // rango provisional; la Task 4 lo calcula de verdad
  return { escena, cfg };
}
```

- [ ] **Step 5: Completar `main.js`**

Reemplaza el comentario `// Task 2: …` por:

```js
  const { montarViaje } = await import('./montar.js');
  window.__viaje = await montarViaje(window.__VIAJE_CONFIG);
```

- [ ] **Step 6: Run verificar — verde.** Luego commit:

```bash
git add src/scripts/viaje/escena.js src/scripts/viaje/montar.js src/scripts/viaje/main.js scripts/verificar.mjs
git commit -m "feat: escena base del recorrido (renderers, partículas, loop con pausa y __fps)"
```

---

### Task 3: Pantallas CSS3D con las demos vivas

**Files:**
- Create: `src/scripts/viaje/pantallas.js`
- Modify: `src/scripts/viaje/montar.js`
- Modify: `scripts/verificar.mjs`

**Interfaces:**
- Consumes: `Escena.escenaCSS` (Task 2); posiciones provisionales propias (la Task 4 las sustituye por las del recorrido).
- Produces:
  ```js
  // pantallas.js
  export function crearPantallas(escenaCSS, proyectos) -> ManejadorPantallas
  // ManejadorPantallas = {
  //   iframes: HTMLIFrameElement[], objetos: CSS3DObject[],
  //   colocar(stops: {x:number, y:number, z:number, ry:number}[]): void,
  //   esperarCarga(timeoutMs: number): Promise<void>,  // resuelve aunque alguna falle
  //   cargadas(): boolean, destruir(): void }
  // CSS3DObject lleva wrap.pantallaRim como .element; el iframe lleva dataset.cargado = 'si' al cargar.
  ```

- [ ] **Step 1: Test que falla**

```js
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
```

- [ ] **Step 2: Run verificar — falla** (`__viaje.pantallas` undefined).

- [ ] **Step 3: Crear `src/scripts/viaje/pantallas.js`**

```js
// Las demos reales como pantallas flotantes. Portado de creaPantalla() de la
// Fase 1 (galeria.astro:187-219) con tres añadidos: colocar() para recolocar
// cuando el recorrido calcula las paradas, esperarCarga() para la pantalla
// de carga, y destruir() para el cambio de idioma.
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

export const IFRAME_W = 1440;
export const IFRAME_H = 900; // mismo viewport de diseño que las demos
export const SCALE = 0.45;

export function crearPantallas(escenaCSS, proyectos) {
  const iframes = [];
  const objetos = [];

  for (const [i, p] of proyectos.entries()) {
    const wrap = document.createElement('div');
    wrap.className = 'pantalla-rim';
    wrap.style.width = `${IFRAME_W}px`;
    wrap.style.height = `${IFRAME_H}px`;

    const iframe = document.createElement('iframe');
    iframe.className = 'demo3d';
    iframe.style.width = `${IFRAME_W}px`;
    iframe.style.height = `${IFRAME_H}px`;
    iframe.title = p.nombre;
    iframe.addEventListener('load', () => {
      try {
        // Sin esto contentWindow.scrollTo() anima en vez de saltar (las demos
        // llevan scroll-behavior:smooth).
        iframe.contentDocument.documentElement.style.scrollBehavior = 'auto';
      } catch { /* mismo origen: no debería pasar */ }
      iframe.dataset.cargado = 'si';
    });
    iframe.src = p.ruta; // relativa SIEMPRE: mismo origen o no hay scroll interno
    wrap.appendChild(iframe);

    const obj = new CSS3DObject(wrap);
    obj.scale.set(SCALE, SCALE, SCALE);
    // Posición provisional en fila; la Task 4 la sustituye por la curva.
    obj.position.set(0, 0, -i * 1450);
    escenaCSS.add(obj);
    iframes.push(iframe);
    objetos.push(obj);
  }

  function colocar(stops) {
    for (const [i, s] of stops.entries()) {
      objetos[i].position.set(s.x, s.y, s.z);
      objetos[i].rotation.y = s.ry;
    }
  }

  function esperarCarga(timeoutMs) {
    const todas = Promise.all(
      iframes.map(
        (f) =>
          f.dataset.cargado === 'si' ||
          new Promise((r) => f.addEventListener('load', r, { once: true }))
      )
    );
    // La carga no puede atracar el viaje: pasado el tope se arranca igual y la
    // demo rezagada aparece cuando llegue.
    return Promise.race([todas, new Promise((r) => setTimeout(r, timeoutMs))]);
  }

  function cargadas() {
    return iframes.every((f) => f.dataset.cargado === 'si');
  }

  function destruir() {
    for (const o of objetos) {
      escenaCSS.remove(o);
      o.element.remove();
    }
    iframes.length = 0;
    objetos.length = 0;
  }

  return { iframes, objetos, colocar, esperarCarga, cargadas, destruir };
}
```

- [ ] **Step 4: Enganchar en `montar.js`**

Dentro de `montarViaje`, tras `escena.setPuntos(...)`:

```js
  const { crearPantallas } = await import('./pantallas.js');
  const pantallas = crearPantallas(escena.escenaCSS, cfg.datos[cfg.lang].proyectos);
  pantallas.esperarCarga(7000); // sin await: la Task 6 gobierna la espera
  return { escena, cfg, pantallas };
```

- [ ] **Step 5: Run verificar — verde.** Commit:

```bash
git add src/scripts/viaje/pantallas.js src/scripts/viaje/montar.js scripts/verificar.mjs
git commit -m "feat: pantallas CSS3D con las demos vivas del idioma activo"
```

---

### Task 4: Recorrido viaje/lectura por los proyectos

**Files:**
- Create: `src/scripts/viaje/recorrido.js`
- Modify: `src/scripts/viaje/montar.js`
- Modify: `scripts/verificar.mjs`

**Interfaces:**
- Consumes: `Escena` (Task 2), `ManejadorPantallas` (Task 3: `colocar`, `iframes`).
- Produces:
  ```js
  // recorrido.js
  export function crearRecorrido(proyectos, camera) -> Recorrido
  // proyectos: [{ ruta: string, alto: number }] — los de __VIAJE_CONFIG.datos[lang].proyectos
  // Recorrido = {
  //   stops: Stop[],               // Task 4: solo proyectos. Task 5 añade bio/contacto.
  //   camStart: { camPos: Vector3, target: Vector3 },
  //   aplicar(ySuavizado: number): { seg: Segmento, t: number },  // mueve la cámara
  //   recalcula(): void,           // resize
  //   totalPx(): number, limites(): Segmento[], paradaMidY(i): number,
  //   zMin(): number, zMax(): number }
  // Stop = { tipo: 'proyecto', i, ruta, alto, x, y, z, ry, camPos: Vector3, target: Vector3 }
  // Segmento = { tipo: 'viaje'|'lectura', stopIndex?: number, start, end }
  ```
  `montar.js` pasa a exponer `window.__galeria` (API de arnés, misma forma que en la Fase 1): `{ limites, paradaMidY, totalPx, getDemoScrollY, demosLoaded, fps, setScroll }`.

- [ ] **Step 1: Test que falla**

```js
// Recorrido 3D, Task 4: el scroll gobierna la cámara y la lectura scrollea la demo.
await comprueba('el recorrido viaje/lectura funciona', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  await page.waitForFunction(() => window.__galeria?.demosLoaded?.(), { timeout: 30_000 });
  const limites = await page.evaluate(() => window.__galeria.limites());
  // ES: viaje(camStart→p0) + (lectura + viaje) por proyecto, sin viaje tras la última = 1 + 4 + 3
  assert.equal(limites.length, 8, `ES debe tener 8 segmentos, hay ${limites.length}`);
  assert.equal(limites[0].tipo, 'viaje');
  assert.equal(limites[1].tipo, 'lectura');

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
```

- [ ] **Step 2: Run verificar — falla** (`__galeria` undefined).

- [ ] **Step 3: Crear `src/scripts/viaje/recorrido.js`**

Portado de la Fase 1 (`galeria.astro:67-165`, constantes y funciones de ritmo), con la distancia de parada calculada para encuadrar ANCHO y ALTO (la Fase 1 solo encuadraba el alto; en vertical la pantalla de 1440px se sale por los lados):

```js
// El corazón del viaje: composición en curva, paradas encuadradas
// geométricamente y ritmo viaje/lectura gobernado por el scroll.
import * as THREE from 'three';
import { IFRAME_W, IFRAME_H, SCALE } from './pantallas.js';
import { FOV } from './escena.js';

const FOV_RAD = (FOV * Math.PI) / 180;
const LLENADO_PARADA = 0.75; // fracción del encuadre que ocupa la pantalla en su parada
const SPACING_Z = 1450;      // separación entre paradas consecutivas en -Z
const CURVA = [
  { x: -420, y: 30, ry: 0.42 },
  { x: 480, y: -25, ry: -0.5 },
  { x: -380, y: 55, ry: 0.34 },
  { x: 440, y: -40, ry: -0.46 },
];
const ESTABLISHING_MULT = 2.2; // cuánto más lejos que la parada arranca la cámara
const ESTABLISHING_Y = 220;
const VH_VIAJE = 130;        // alto de página (vh) por segmento de viaje
const VELOCIDAD_LECTURA = 3; // mismo concepto que VELOCIDAD en site.ts

// D: distancia cámara↔pantalla para que la pantalla llene LLENADO_PARADA del
// encuadre EN LOS DOS EJES. En aspect vertical manda el ancho: sin este max
// la pantalla de 1440px desborda los lados del móvil.
export function distanciaParada(aspect) {
  const dAlto = (IFRAME_H * SCALE / LLENADO_PARADA) / (2 * Math.tan(FOV_RAD / 2));
  const fovH = 2 * Math.atan(Math.tan(FOV_RAD / 2) * aspect);
  const dAncho = (IFRAME_W * SCALE / LLENADO_PARADA) / (2 * Math.tan(fovH / 2));
  return Math.max(dAlto, dAncho);
}

function normal(ry) {
  return { x: Math.sin(ry), z: Math.cos(ry) };
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function vhLectura(alto) {
  return Math.max(50, ((alto - IFRAME_H) / IFRAME_H) * 100 / VELOCIDAD_LECTURA);
}

export function crearRecorrido(proyectos, camera) {
  const aspect = innerWidth / innerHeight;
  const D = distanciaParada(aspect);
  // En vertical la curva se estrecha: con los X de escritorio las pantallas
  // quedarían fuera de plano al pasar de largo.
  const factorX = Math.min(1, aspect / 1.4);

  const stops = proyectos.map((p, i) => {
    const c = CURVA[i];
    const stop = { tipo: 'proyecto', i, ruta: p.ruta, alto: p.alto, x: c.x * factorX, y: c.y, z: -i * SPACING_Z, ry: c.ry };
    const n = normal(stop.ry);
    stop.camPos = new THREE.Vector3(stop.x + n.x * D, stop.y, stop.z + n.z * D);
    stop.target = new THREE.Vector3(stop.x, stop.y, stop.z);
    return stop;
  });

  const n0 = normal(stops[0].ry);
  const camStart = {
    camPos: new THREE.Vector3(
      stops[0].x + n0.x * D * ESTABLISHING_MULT,
      stops[0].y + ESTABLISHING_Y,
      stops[0].z + n0.z * D * ESTABLISHING_MULT
    ),
    target: stops[0].target.clone(),
  };

  const segmentos = [{ tipo: 'viaje', from: camStart, to: stops[0], vh: VH_VIAJE }];
  stops.forEach((s, i) => {
    segmentos.push({ tipo: 'lectura', stopIndex: i, vh: vhLectura(s.alto) });
    if (i < stops.length - 1) segmentos.push({ tipo: 'viaje', from: stops[i], to: stops[i + 1], vh: VH_VIAJE });
  });

  let limites = [];
  let totalPx = 0;
  function recalcula() {
    let acc = 0;
    limites = segmentos.map((seg) => {
      const alturaPx = (seg.vh / 100) * innerHeight;
      const item = { ...seg, start: acc, end: acc + alturaPx };
      acc += alturaPx;
      return item;
    });
    totalPx = acc;
    document.body.style.height = `${totalPx + innerHeight}px`;
  }
  recalcula();

  const currentTarget = camStart.target.clone();
  camera.position.copy(camStart.camPos);
  camera.lookAt(currentTarget);

  function segmentoActivo(y) {
    for (let i = 0; i < limites.length; i++) {
      const seg = limites[i];
      if (y <= seg.end || i === limites.length - 1) {
        const t = seg.end > seg.start ? Math.min(1, Math.max(0, (y - seg.start) / (seg.end - seg.start))) : 1;
        return { seg, t };
      }
    }
  }

  function aplicar(y) {
    const { seg, t } = segmentoActivo(y);
    if (seg.tipo === 'viaje') {
      const te = easeInOutCubic(t);
      camera.position.lerpVectors(seg.from.camPos, seg.to.camPos, te);
      currentTarget.lerpVectors(seg.from.target, seg.to.target, te);
    } else {
      const parada = stops[seg.stopIndex];
      camera.position.copy(parada.camPos);
      currentTarget.copy(parada.target);
    }
    camera.lookAt(currentTarget);
    return { seg, t };
  }

  return {
    stops,
    camStart,
    aplicar,
    recalcula,
    totalPx: () => totalPx,
    limites: () => limites.map((l) => ({ tipo: l.tipo, stopIndex: l.stopIndex, start: l.start, end: l.end })),
    paradaMidY: (i) => {
      const seg = limites.find((l) => l.tipo === 'lectura' && l.stopIndex === i);
      return seg ? (seg.start + seg.end) / 2 : null;
    },
    zMin: () => stops[stops.length - 1].z - 800,
    zMax: () => 800,
  };
}
```

- [ ] **Step 4: Enganchar en `montar.js`**

Sustituye el cuerpo de `montarViaje` por:

```js
import { crearEscena } from './escena.js';
import { crearPantallas, IFRAME_H } from './pantallas.js';
import { crearRecorrido } from './recorrido.js';

const LERP_SCROLL = 0.12; // suavizado del seguimiento de scroll por frame

export async function montarViaje(cfg) {
  document.documentElement.classList.add('viaje3d');
  const escena = crearEscena(
    document.getElementById('webgl'),
    document.getElementById('css3d-container')
  );
  const proyectos = cfg.datos[cfg.lang].proyectos;
  const recorrido = crearRecorrido(proyectos, escena.camera);
  const pantallas = crearPantallas(escena.escenaCSS, proyectos);
  pantallas.colocar(recorrido.stops);
  escena.setPuntos(recorrido.zMin(), recorrido.zMax());

  let scrollTarget = 0;
  let scrollSmooth = 0;
  addEventListener(
    'scroll',
    () => { scrollTarget = Math.min(recorrido.totalPx(), Math.max(0, scrollY)); },
    { passive: true }
  );
  addEventListener('resize', () => {
    recorrido.recalcula();
    scrollTarget = Math.min(recorrido.totalPx(), scrollTarget);
  });

  escena.enCadaFrame(() => {
    scrollSmooth += (scrollTarget - scrollSmooth) * LERP_SCROLL;
    const { seg, t } = recorrido.aplicar(scrollSmooth);
    if (seg.tipo === 'lectura' && seg.stopIndex !== undefined) {
      const stop = recorrido.stops[seg.stopIndex];
      const sobra = Math.max(0, stop.alto - IFRAME_H);
      try {
        pantallas.iframes[seg.stopIndex].contentWindow.scrollTo(0, t * sobra);
      } catch { /* mismo origen: no debería pasar */ }
    }
  });

  // API para el arnés (misma forma que la de la Fase 1, más camPos).
  window.__galeria = {
    limites: () => recorrido.limites(),
    paradaMidY: (i) => recorrido.paradaMidY(i),
    totalPx: () => recorrido.totalPx(),
    getDemoScrollY: (i) => { try { return pantallas.iframes[i].contentWindow.scrollY; } catch { return null; } },
    demosLoaded: () => pantallas.cargadas(),
    fps: () => window.__fps,
    setScroll: (y) => scrollTo(0, y),
    camPos: () => ({ x: escena.camera.position.x, y: escena.camera.position.y, z: escena.camera.position.z }),
  };

  pantallas.esperarCarga(7000); // sin await: la Task 6 gobierna la espera
  return { escena, cfg, pantallas, recorrido };
}
```

- [ ] **Step 5: Run verificar — verde.** Ojo: el check `'sin errores de consola'` ahora recorre ~2600vh de página; si se hace lento, sube el paso del bucle de scroll de ese test a `window.innerHeight * 2`. Commit:

```bash
git add src/scripts/viaje/recorrido.js src/scripts/viaje/montar.js scripts/verificar.mjs
git commit -m "feat: recorrido viaje/lectura — curva, paradas encuadradas en los dos ejes, lectura con scroll interno"
```

---

### Task 5: Paradas de héroe, bio y contacto

**Files:**
- Modify: `src/scripts/viaje/recorrido.js`
- Modify: `scripts/verificar.mjs`

**Interfaces:**
- Consumes: Task 4.
- Produces: `Stop` gana `tipo: 'proyecto'|'bio'|'contacto'`; `Segmento` gana `id: string` (`'hero'`, `'proyecto-0'`…, `'bio'`, `'contacto'`, `'viaje-a-<id>'`); los segmentos de lectura de bio/contacto NO llevan `stopIndex` de iframe — llevan `stopIndex` global en `stops` (bio y contacto no tienen pantalla). Nueva entrada en la API: `__galeria.segmentoMidY(id)`. Todo lo que consume `limites()` (Task 7 HUD) usa `id`.

- [ ] **Step 1: Test que falla**

```js
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
```

- [ ] **Step 2: Run verificar — falla** (los segmentos no tienen `id`).

- [ ] **Step 3: Extender `recorrido.js`**

Cambios concretos sobre el archivo de la Task 4:

a) Añade dos entradas a `CURVA` (bio y contacto, siguen la serpiente):

```js
  { x: -420, y: 20, ry: 0.4 },   // bio
  { x: 400, y: -30, ry: -0.44 }, // contacto
```

b) Añade constantes de ritmo junto a `VH_VIAJE`:

```js
const VH_HERO = 80;      // héroe: presentación, se lee de un vistazo
const VH_BIO = 160;      // bio: 3 párrafos que se revelan dentro del segmento
const VH_CONTACTO = 110; // contacto: CTA, sin más
```

c) En `crearRecorrido`, tras mapear los proyectos a stops, añade las dos paradas sin pantalla y renumera: bio y contacto usan las entradas `CURVA[nProy]` y `CURVA[nProy+1]`, con `z = -(nProy) * SPACING_Z` y `z = -(nProy+1) * SPACING_Z` respectivamente, mismo cálculo de `camPos`/`target` con `normal()` y `D`:

```js
  const nProy = proyectos.length;
  for (const [k, tipo] of ['bio', 'contacto'].entries()) {
    const i = nProy + k;
    const c = CURVA[i];
    const stop = { tipo, i, x: c.x * factorX, y: c.y, z: -i * SPACING_Z, ry: c.ry };
    const n = normal(stop.ry);
    stop.camPos = new THREE.Vector3(stop.x + n.x * D, stop.y, stop.z + n.z * D);
    stop.target = new THREE.Vector3(stop.x, stop.y, stop.z);
    stops.push(stop);
  }
```

d) Reconstruye `segmentos` con ids y con el héroe como primera lectura (cámara fija en `camStart`):

```js
  const idStop = (s) => (s.tipo === 'proyecto' ? `proyecto-${s.i}` : s.tipo);
  const vhDe = (s) =>
    s.tipo === 'proyecto' ? vhLectura(s.alto) : s.tipo === 'bio' ? VH_BIO : VH_CONTACTO;

  const segmentos = [{ tipo: 'lectura', id: 'hero', fija: camStart, vh: VH_HERO }];
  stops.forEach((s, i) => {
    const from = i === 0 ? camStart : stops[i - 1];
    segmentos.push({ tipo: 'viaje', id: `viaje-a-${idStop(s)}`, from, to: s, vh: VH_VIAJE });
    segmentos.push({ tipo: 'lectura', id: idStop(s), stopIndex: i, vh: vhDe(s) });
  });
```

e) En `aplicar()`, el caso `lectura` tiene que resolver la parada por segmento: si `seg.fija` existe usa `seg.fija`; si no, `stops[seg.stopIndex]`:

```js
    } else {
      const parada = seg.fija ?? stops[seg.stopIndex];
      camera.position.copy(parada.camPos);
      currentTarget.copy(parada.target);
    }
```

f) `limites()` expone también `id`; añade `segmentoMidY`:

```js
    limites: () => limites.map((l) => ({ tipo: l.tipo, id: l.id, stopIndex: l.stopIndex, start: l.start, end: l.end })),
    segmentoMidY: (id) => {
      const seg = limites.find((l) => l.id === id);
      return seg ? (seg.start + seg.end) / 2 : null;
    },
```

g) En `montar.js` hay dos retoques. Uno: el scroll interno de las demos solo aplica a paradas de proyecto — cambia la guarda del frame:

```js
    if (seg.tipo === 'lectura' && seg.stopIndex !== undefined && recorrido.stops[seg.stopIndex].tipo === 'proyecto') {
```

Dos, y esto es un bug si se deja: `stops` ahora tiene 6 entradas (4 proyectos + bio + contacto) y `ManejadorPantallas.colocar()` itera por `stops.entries()` — con `objetos` de longitud 4, `objetos[4]` es undefined y revienta. Cambia la llamada a:

```js
  pantallas.colocar(recorrido.stops.filter((s) => s.tipo === 'proyecto'));
```

Y añade a `window.__galeria`: `segmentoMidY: (id) => recorrido.segmentoMidY(id),`.

- [ ] **Step 4: Run verificar — verde.** El check de la Task 4 sigue pasando excepto un assert: `limites.length` ya no es 8. Reemplaza en ese test las dos primeras aserciones por:

```js
  const lecturasProyecto = limites.filter((l) => l.tipo === 'lectura' && l.id?.startsWith('proyecto'));
  assert.equal(lecturasProyecto.length, 4, `ES debe tener 4 lecturas de proyecto, hay ${lecturasProyecto.length}`);
```

Commit:

```bash
git add src/scripts/viaje/recorrido.js src/scripts/viaje/montar.js scripts/verificar.mjs
git commit -m "feat: paradas de héroe, bio y contacto en el recorrido, con ids de segmento"
```

---

### Task 6: Pantalla de carga — la escena se ensambla ante ti

**Files:**
- Create: `src/scripts/viaje/carga.js`
- Modify: `src/scripts/viaje/montar.js`
- Modify: `scripts/verificar.mjs`

**Interfaces:**
- Consumes: `Escena.enCadaFrame`, `ManejadorPantallas` (`objetos`, `iframes`, `esperarCarga`).
- Produces:
  ```js
  // carga.js
  export async function montarEscena({ escena, pantallas, nTotal }): Promise<void>
  ```
  Efectos laterales: `#carga-texto` muestra progreso real durante el montaje; al terminar, `#carga` queda `aria-hidden="true"`, cada `.pantalla-rim` gana la clase `montada`, el scroll se desbloquea y `window.__viaje.cargaCompleta()` pasa a `true`.

- [ ] **Step 1: Test que falla**

```js
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
```

- [ ] **Step 2: Run verificar — falla** (`cargaCompleta` undefined).

- [ ] **Step 3: Crear `src/scripts/viaje/carga.js`**

```js
// La carga ES la primera escena (spec §3): la cámara ya está en el plano de
// apertura y el usuario ve cómo las pantallas entran volando a la curva.
// El progreso es real: cuenta iframes cargados, no un temporizador disfrazado.
const DUR_ENTRADA = 520;  // ms por pantalla
const PASO_ENTRADA = 260; // ms de escalonado entre pantallas
const MIN_MONTAJE = 1800; // la secuencia tiene que lucirse aunque todo vuele
const MAX_ESPERA = 7000;  // una demo lenta no atraca el viaje

export async function montarEscena({ escena, pantallas, nTotal }) {
  const capa = document.getElementById('carga');
  const texto = document.getElementById('carga-texto');
  const t0 = performance.now();
  // Scroll bloqueado durante el montaje: el viaje no empieza hasta el final.
  document.documentElement.style.overflow = 'hidden';

  let cargadas = 0;
  for (const f of pantallas.iframes) {
    if (f.dataset.cargado === 'si') cargadas++;
    else f.addEventListener('load', () => cargadas++, { once: true });
  }

  // Las pantallas nacen desplazadas (más cerca de cámara y más altas) y
  // transparentes; cada una entra a su posición de la curva con easing.
  const objetos = pantallas.objetos;
  const finales = objetos.map((o) => o.position.clone());
  const origenes = finales.map((p) => p.clone().setZ(p.z + 1200).setY(p.y + 300));
  for (const o of objetos) o.element.style.opacity = '0';

  let fin = false;
  escena.enCadaFrame(() => {
    if (fin) return;
    const t = performance.now() - t0;
    objetos.forEach((o, i) => {
      const k = Math.min(1, Math.max(0, (t - i * PASO_ENTRADA) / DUR_ENTRADA));
      const e = 1 - Math.pow(1 - k, 3); // easeOutCubic
      o.position.lerpVectors(origenes[i], finales[i], e);
      o.element.style.opacity = String(e);
    });
    texto.textContent = `Montando ${Math.min(cargadas, nTotal)}/${nTotal}`;
  });

  await pantallas.esperarCarga(MAX_ESPERA);
  const restante = MIN_MONTAJE - (performance.now() - t0);
  if (restante > 0) await new Promise((r) => setTimeout(r, restante));

  fin = true;
  for (const o of objetos) o.element.classList.add('montada');
  capa.setAttribute('aria-hidden', 'true'); // el CSS la desvanece
  document.documentElement.style.overflow = '';
}
```

- [ ] **Step 4: Enganchar en `montar.js`**

En `montarViaje`, reemplaza la línea `pantallas.esperarCarga(7000); // sin await…` y el `return` por:

```js
  const { montarEscena } = await import('./carga.js');
  let completa = false;
  montarEscena({ escena, pantallas, nTotal: proyectos.length }).then(() => { completa = true; });

  return { escena, cfg, pantallas, recorrido, cargaCompleta: () => completa };
```

- [ ] **Step 5: Run verificar — verde.** Commit:

```bash
git add src/scripts/viaje/carga.js src/scripts/viaje/montar.js scripts/verificar.mjs
git commit -m "feat: pantalla de carga — la escena se ensambla con progreso real y tiempos del spec"
```

---

### Task 7: HUD — textos del recorrido y barra superior

**Files:**
- Create: `src/scripts/viaje/hud.js`
- Modify: `src/scripts/viaje/montar.js`
- Modify: `src/styles/global.css`
- Modify: `scripts/verificar.mjs`

**Interfaces:**
- Consumes: `__VIAJE_CONFIG.datos[lang]`, segmentos con `id` (Task 5), `escena.enCadaFrame`.
- Produces:
  ```js
  // hud.js
  export function crearHud({ root, datos, langInicial, onCambiarIdioma }): Hud
  // Hud = { setIdioma(lang: 'es'|'en'), actualizar(seg: Segmento, t: number), lang(): string }
  ```
  DOM creado dentro de `#hud`: `.hud-top` (marca + botones `button[data-idioma="es"|"en"]`) y `.hud-panel` (contenido del segmento activo; visible solo con clase `visible`). Los párrafos de la bio llevan `data-parrafo="0|1|2"` y se revelan por `t`.

- [ ] **Step 1: Test que falla**

```js
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
```

- [ ] **Step 2: Run verificar — falla** (`.hud-panel` no existe).

- [ ] **Step 3: Crear `src/scripts/viaje/hud.js`**

```js
// El HUD es DOM normal superpuesto a la escena (decisión híbrida del spec §2:
// titulares flotan en 3D, el texto de lectura va aquí). Al ser HTML de verdad,
// los enlaces son enlaces, el texto se selecciona y el toggle ES/EN es trivial.
// Durante los segmentos de viaje el panel se retira: en movimiento no se lee.

function esc(s) {
  // Todo lo que se pinta viene de site.ts (contenido propio), pero el HUD usa
  // innerHTML para los enlaces y esto cuesta un if — higiene básica.
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function htmlPanel(id, C) {
  if (id === 'hero') {
    return `<p class="hud-sub">${esc(C.site.descripcion.split('. ')[1])}</p>
            <p class="hud-pista">${esc(C.portadaPie)}</p>`;
  }
  if (id.startsWith('proyecto-')) {
    const p = C.proyectos[Number(id.split('-')[1])];
    const nota = p.etiqueta === 'cliente' ? C.proyecto.notaCliente : C.proyecto.notaConcepto;
    return `<p class="hud-ficha">${esc(p.tituloFicha)} <span class="hud-vivo">${esc(C.proyecto.envivo)}</span></p>
            <h2 class="hud-nombre">${esc(p.nombre)}</h2>
            <p class="hud-rubro">${esc(p.rubro)}</p>
            <p class="hud-desc">${esc(p.descripcion)}</p>
            <p class="hud-nota">${esc(nota)}</p>
            <a class="hud-abrir" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(C.proyecto.abrir)}</a>`;
  }
  if (id === 'bio') {
    return `<h2 class="hud-nombre">${esc(C.bio.titular)}</h2>` +
      C.bio.parrafos.map((t, i) => `<p class="hud-desc" data-parrafo="${i}">${esc(t)}</p>`).join('');
  }
  if (id === 'contacto') {
    return `<p class="hud-ficha">${esc(C.contacto.eyebrow)}</p>
            <h2 class="hud-nombre">${esc(C.contacto.titular)}</h2>
            <p class="hud-desc">${esc(C.contacto.texto)}</p>
            <a class="hud-abrir" href="mailto:${esc(C.site.email)}">${esc(C.site.email)} ↗</a>`;
  }
  return '';
}

export function crearHud({ root, datos, langInicial, onCambiarIdioma }) {
  let lang = langInicial;
  let panelActual = null;

  root.innerHTML = `
    <div class="hud-top">
      <span class="hud-marca"></span>
      <div class="hud-idiomas">
        <button type="button" data-idioma="es">ES</button>
        <button type="button" data-idioma="en">EN</button>
      </div>
    </div>
    <div class="hud-panel"></div>`;

  const marca = root.querySelector('.hud-marca');
  const panel = root.querySelector('.hud-panel');
  const botones = [...root.querySelectorAll('button[data-idioma]')];

  for (const b of botones) {
    b.addEventListener('click', () => onCambiarIdioma(b.dataset.idioma));
  }

  function pintaIdioma() {
    marca.textContent = `${datos[lang].site.nombre} — ${datos[lang].site.rol}`;
    for (const b of botones) b.toggleAttribute('data-activo', b.dataset.idioma === lang);
    panelActual = null; // fuerza repintado del panel en el próximo frame
  }
  pintaIdioma();

  function actualizar(seg, t) {
    if (seg.tipo === 'viaje') {
      panel.classList.remove('visible');
      panelActual = null;
      return;
    }
    if (panelActual !== seg.id) {
      panelActual = seg.id;
      panel.innerHTML = htmlPanel(seg.id, datos[lang]);
      panel.classList.add('visible');
    }
    if (seg.id === 'bio') {
      for (const p of panel.querySelectorAll('[data-parrafo]')) {
        p.classList.toggle('visible', t >= Number(p.dataset.parrafo) / 3);
      }
    }
  }

  return {
    setIdioma(nuevo) { lang = nuevo; pintaIdioma(); },
    actualizar,
    lang: () => lang,
  };
}
```

- [ ] **Step 4: CSS del HUD en `global.css`** (al final)

```css
/* ---- HUD del recorrido ---- */
.hud-top {
  position: absolute; top: 0; left: 0; right: 0;
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.1rem 1.4rem;
  pointer-events: none;
}
.hud-marca { color: var(--color-tenue); font-size: 0.85rem; letter-spacing: 0.04em; }
.hud-idiomas { display: flex; gap: 0.35rem; pointer-events: auto; }
.hud-idiomas button {
  background: none; border: 1px solid var(--color-linea); border-radius: 4px;
  color: var(--color-tenue); font: 600 0.8rem/1 var(--font-sans);
  padding: 0.45rem 0.6rem; cursor: pointer;
}
.hud-idiomas button[data-activo] { color: var(--color-tinta); border-color: var(--color-acento); }

.hud-panel {
  position: absolute; left: 1.4rem; bottom: 1.6rem;
  max-width: min(30rem, calc(100vw - 2.8rem));
  opacity: 0; transform: translateY(12px);
  transition: opacity 0.45s ease, transform 0.45s ease;
  pointer-events: none;
}
.hud-panel.visible { opacity: 1; transform: none; pointer-events: auto; }
.hud-ficha { color: var(--color-acento); font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; }
.hud-vivo { color: var(--color-tenue); margin-left: 0.5em; }
.hud-nombre { font-size: clamp(1.6rem, 4vw, 2.6rem); font-weight: 800; letter-spacing: -0.02em; line-height: 1.05; }
.hud-rubro { color: var(--color-medio); margin-top: 0.2rem; }
.hud-desc { color: var(--color-tinta); margin-top: 0.7rem; max-width: 42ch; }
.hud-nota { color: var(--color-tenue); font-size: 0.85rem; margin-top: 0.7rem; }
.hud-pista { color: var(--color-tenue); margin-top: 0.7rem; }
.hud-sub { font-size: 1.1rem; max-width: 34ch; }
.hud-abrir {
  display: inline-block; margin-top: 1rem; color: var(--color-acento);
  font-weight: 600; text-decoration: none; border-bottom: 1px solid currentColor;
}
.hud-panel [data-parrafo] { opacity: 0; transform: translateY(10px); transition: opacity 0.5s ease, transform 0.5s ease; }
.hud-panel [data-parrafo].visible { opacity: 1; transform: none; }

@media (max-width: 700px) {
  .hud-panel { left: 1rem; right: 1rem; bottom: 1.2rem; max-width: none; }
  .hud-desc { max-width: none; }
}
```

- [ ] **Step 5: Enganchar en `montar.js`**

En `montarViaje`, tras crear el recorrido:

```js
  const { crearHud } = await import('./hud.js');
  const hud = crearHud({
    root: document.getElementById('hud'),
    datos: cfg.datos,
    langInicial: cfg.lang,
    onCambiarIdioma: () => {}, // la Task 9 conecta el intercambio de demos
  });
```

y dentro del callback de `escena.enCadaFrame`, al final: `hud.actualizar(seg, t);`. Añade `hud` al objeto devuelto.

- [ ] **Step 6: Run verificar — verde.** Commit:

```bash
git add src/scripts/viaje/hud.js src/scripts/viaje/montar.js src/styles/global.css scripts/verificar.mjs
git commit -m "feat: HUD del recorrido — textos por parada, bio por tramos, barra con toggle ES/EN"
```

---

### Task 8: Titulares flotantes en la escena

**Files:**
- Create: `src/scripts/viaje/titulares.js`
- Modify: `src/components/Recorrido3D.astro` (añadir `titularHero`/`subHero` a `datosLang`)
- Modify: `src/scripts/viaje/montar.js`
- Modify: `src/styles/global.css`
- Modify: `scripts/verificar.mjs`

**Interfaces:**
- Consumes: `stops` y `camStart` del recorrido (Task 5), `Escena.escenaCSS`.
- Produces:
  ```js
  // titulares.js
  export function crearTitulares(escenaCSS, recorrido, datosLang): { destruir(): void }
  // Un div.titular3d por parada: hero (en camStart.target), proyecto (sobre su
  // pantalla), bio y contacto (en su punto de parada).
  ```
  `DatosLang` gana `titularHero: string` y `subHero: string` (las dos frases de `site.descripcion` separadas).

- [ ] **Step 1: Test que falla**

```js
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
```

- [ ] **Step 2: Run verificar — falla.**

- [ ] **Step 3: Añadir `titularHero`/`subHero` en `Recorrido3D.astro`**

En `datosLang`, antes del `return`:

```js
  // El héroe flotante lleva la primera frase del pitch; el HUD, la segunda.
  // Si algún día site.descripcion cambia de forma, esto revienta aquí y no en
  // el navegador — es a propósito.
  const [titularHero, subHero] = C.site.descripcion.split('. ');
  if (!subHero) throw new Error(`site.descripcion (${l}) necesita dos frases: titular flotante + subtítulo HUD`);
```

y en el objeto devuelto añade `titularHero: titularHero + '.'` y `subHero` (sin el punto, ya lo pone el texto original). En `hud.js` (Task 7), cambia `C.site.descripcion.split('. ')[1]` por `C.subHero`.

- [ ] **Step 4: Crear `src/scripts/viaje/titulares.js`**

```js
// Titulares de sección flotando en la escena (la mitad "teatro" del híbrido
// del spec §2). Son CSS3D: DOM de verdad proyectado en el espacio, mismo
// pipeline que las pantallas.
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { IFRAME_H, SCALE } from './pantallas.js';

const ALTO_PANTALLA_MUNDO = IFRAME_H * SCALE;

export function crearTitulares(escenaCSS, recorrido, datosLang) {
  const objetos = [];

  function pon(html, pos, claseExtra = '') {
    const div = document.createElement('div');
    div.className = `titular3d ${claseExtra}`.trim();
    div.innerHTML = html;
    const obj = new CSS3DObject(div);
    obj.position.copy(pos);
    escenaCSS.add(obj);
    objetos.push(obj);
  }

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Héroe: en el punto de mira del plano de apertura.
  pon(`<h1>${esc(datosLang.titularHero)}</h1>`, recorrido.camStart.target, 'titular3d--hero');

  for (const stop of recorrido.stops) {
    if (stop.tipo === 'proyecto') {
      const p = datosLang.proyectos[stop.i];
      // Encima de su pantalla: media altura de pantalla en mundo + aire.
      const pos = stop.target.clone().setY(stop.target.y + ALTO_PANTALLA_MUNDO / 2 + 120);
      pon(`<strong>${esc(p.nombre)}</strong><span>${esc(p.rubro)}</span>`, pos, 'titular3d--proyecto');
    } else if (stop.tipo === 'bio') {
      pon(`<h2>${esc(datosLang.bio.titular)}</h2>`, stop.target);
    } else {
      pon(`<h2>${esc(datosLang.contacto.titular)}</h2>`, stop.target);
    }
  }

  function destruir() {
    for (const o of objetos) {
      escenaCSS.remove(o);
      o.element.remove();
    }
    objetos.length = 0;
  }

  return { destruir };
}
```

- [ ] **Step 5: CSS en `global.css`** (al final)

```css
/* ---- Titulares flotantes (CSS3D) ----
   Ancho fijo en px de mundo: es lo que CSS3D proyecta; con porcentajes el
   texto se escapa de la composición. */
.titular3d {
  width: 760px;
  color: var(--color-tinta);
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 64px;
  line-height: 0.98;
  letter-spacing: -0.02em;
  pointer-events: none;
}
.titular3d--hero { width: 900px; font-size: 88px; text-align: center; }
.titular3d--proyecto { text-align: center; }
.titular3d--proyecto strong { display: block; font-size: 44px; }
.titular3d--proyecto span {
  display: block; margin-top: 8px;
  color: var(--color-medio); font-size: 24px; font-weight: 500; letter-spacing: 0;
}
```

- [ ] **Step 6: Enganchar en `montar.js`**

Tras crear el HUD:

```js
  const { crearTitulares } = await import('./titulares.js');
  const titulares = crearTitulares(escena.escenaCSS, recorrido, cfg.datos[cfg.lang]);
```

Añade `titulares` al objeto devuelto.

- [ ] **Step 7: Run verificar — verde.** Commit:

```bash
git add src/scripts/viaje/titulares.js src/components/Recorrido3D.astro \
  src/scripts/viaje/montar.js src/scripts/viaje/hud.js src/styles/global.css scripts/verificar.mjs
git commit -m "feat: titulares de sección flotando en CSS3D (héroe, proyectos, bio, contacto)"
```

---

### Task 9: Toggle ES/EN en vivo — cambia textos Y demos

**Files:**
- Modify: `src/scripts/viaje/recorrido.js` (`reconstruir`)
- Modify: `src/scripts/viaje/montar.js` (`cambiarIdioma`)
- Modify: `scripts/verificar.mjs`

**Interfaces:**
- Consumes: todo lo anterior.
- Produces:
  ```js
  // recorrido.js
  Recorrido.reconstruir(proyectos): void  // recalcula stops, segmentos, alturas y cámara
  // montar.js
  window.__viaje.cambiarIdioma(lang: 'es'|'en'): Promise<void>
  ```
  Tras el cambio: pantallas y titulares del idioma nuevo, HUD repintado, `document.documentElement.lang` y `document.title` actualizados, progreso fraccional del scroll conservado.

- [ ] **Step 1: Test que falla**

```js
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
```

- [ ] **Step 2: Run verificar — falla** (`cambiarIdioma` es un stub).

- [ ] **Step 3: `reconstruir` en `recorrido.js`**

El cuerpo actual de `crearRecorrido` (cálculo de stops, camStart, segmentos, alturas, cámara) pasa a una función interna `construye(proyectos)`; `crearRecorrido` la llama una vez y expone `reconstruir`. Estructura:

```js
export function crearRecorrido(proyectosIniciales, camera) {
  let stops, camStart, segmentos, limites, totalPx;
  const currentTarget = new THREE.Vector3();

  function construye(proyectos) {
    // …todo el cálculo actual de stops/camStart/segmentos/recalcula…
    // (incluye paradas bio/contacto y recalcula() al final)
  }

  construye(proyectosIniciales);
  camera.position.copy(camStart.camPos);
  currentTarget.copy(camStart.target);
  camera.lookAt(currentTarget);

  // aplicar(), recalcula(), totalPx(), limites(), paradaMidY(), segmentoMidY(),
  // zMin(), zMax() leen las variables de arriba — no cambian.

  return {
    // …todo lo anterior…
    reconstruir: (proyectos) => construye(proyectos),
    get stops() { return stops; },   // los stops cambian al reconstruir: getter, no copia
    get camStart() { return camStart; },
  };
}
```

Ojo con dos detalles: (1) los que guardaron `recorrido.stops` en una variable local (montar.js) deben leer `recorrido.stops` fresco en cada frame — revisa el frame hook y usa `recorrido.stops[seg.stopIndex]` dentro, no una copia; (2) `aplicar` con `seg.fija` lee el `camStart` capturado en el segmento — como `construye` regenera `segmentos` y `limites`, no hay referencias viejas.

- [ ] **Step 4: `cambiarIdioma` en `montar.js`**

Reemplaza el `onCambiarIdioma: () => {}` por `onCambiarIdioma: cambiarIdioma` y añade dentro de `montarViaje`:

```js
  let lang = cfg.lang;
  let pantallasActual = pantallas;
  let titularesActual = titulares;

  async function cambiarIdioma(nuevo) {
    if (nuevo === lang) return;
    const frac = recorrido.totalPx() ? scrollY / recorrido.totalPx() : 0;
    lang = nuevo;
    cfg = { ...cfg, lang };
    document.documentElement.lang = lang;
    document.title = cfg.datos[lang].site.titulo;

    titularesActual.destruir();
    pantallasActual.destruir();

    const proyectosNuevos = cfg.datos[lang].proyectos;
    recorrido.reconstruir(proyectosNuevos);
    escena.setPuntos(recorrido.zMin(), recorrido.zMax());

    const { crearPantallas } = await import('./pantallas.js');
    const { crearTitulares } = await import('./titulares.js');
    pantallasActual = crearPantallas(escena.escenaCSS, proyectosNuevos);
    pantallasActual.colocar(recorrido.stops.filter((s) => s.tipo === 'proyecto'));
    titularesActual = crearTitulares(escena.escenaCSS, recorrido, cfg.datos[lang]);

    hud.setIdioma(lang);
    // Conserva el progreso fraccional: mismo punto del viaje, otra longitud.
    scrollTo(0, frac * recorrido.totalPx());
    scrollTarget = scrollY;
    // Las demos nuevas cargan en segundo plano; si una parada llega antes que
    // su demo, la pantalla espera en negro con el rim, igual que en el montaje.
    pantallasActual.esperarCarga(7000);
  }
```

Y actualiza el frame hook y `__galeria`/`__viaje` para que lean `pantallasActual` (no la `pantallas` original). El objeto devuelto gana `cambiarIdioma` y getters: `get pantallas() { return pantallasActual; }`. `window.__galeria.getDemoScrollY` y `demosLoaded` también pasan a leer `pantallasActual`.

- [ ] **Step 5: Run verificar — verde.** Commit:

```bash
git add src/scripts/viaje/recorrido.js src/scripts/viaje/montar.js scripts/verificar.mjs
git commit -m "feat: toggle ES/EN en vivo — reconstruye paradas, pantallas, titulares y HUD conservando el progreso"
```

---

### Task 10: `/en/` arrancada en inglés

**Files:**
- Modify: `scripts/verificar.mjs`

**Interfaces:**
- Consumes: todo (la página `/en/` ya pasa `lang="en"` desde la Task 1).
- Produces: nada nuevo; solo arnés.

- [ ] **Step 1: Test que falla/pasa**

```js
// Recorrido 3D, Task 10: /en/ es la misma experiencia arrancada en inglés.
await comprueba('/en/ arranca en inglés con sus 3 demos', async () => {
  const res = await fetch(new globalThis.URL('en/', URL));
  assert.equal(res.status, 200, '/en/ debería responder 200');

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  page.errores = [];
  page.on('pageerror', (e) => page.errores.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) page.errores.push(m.text());
  });
  await page.goto(new globalThis.URL('en/', URL).href, { waitUntil: 'networkidle2', timeout: 60_000 });
  await page.waitForFunction(() => window.__viaje?.cargaCompleta?.(), { timeout: 30_000 });

  const estado = await page.evaluate(() => ({
    langCfg: window.__VIAJE_CONFIG.lang,
    langHtml: document.documentElement.lang,
    titulo: document.title,
    rims: document.querySelectorAll('#css3d-container .pantalla-rim').length,
    hero: document.querySelector('.hud-panel.visible')?.innerText ?? '',
  }));
  assert.equal(estado.langCfg, 'en');
  assert.equal(estado.langHtml, 'en');
  assert.ok(estado.titulo.includes('Web designer'), `título inesperado: ${estado.titulo}`);
  assert.equal(estado.rims, 3, `EN debe tener 3 pantallas, hay ${estado.rims}`);
  assert.ok(estado.hero.includes('Static, fast'), `el héroe debería estar en inglés: "${estado.hero}"`);
  assert.deepEqual(page.errores, [], `errores en consola:\n       ${page.errores.join('\n       ')}`);
  await page.close();
});
```

- [ ] **Step 2: Run verificar — verde sin tocar nada más** (la Task 1 ya dejó `/en/` montada con `lang="en"`; este check lo certifica, junto al de hreflang que sigue vivo). Si falla, lo más probable es que `Recorrido3D.astro` no esté pasando el `lang` a `__VIAJE_CONFIG` o que `Layout` reciba otro — corrige la página, no el test. Commit:

```bash
git add scripts/verificar.mjs
git commit -m "test: /en/ sirve la experiencia 3D arrancada en inglés con sus 3 demos"
```

---

### Task 11: Móvil, limpieza y cierre

**Files:**
- Modify: `src/scripts/viaje/recorrido.js` (helper `encuadreParada`)
- Modify: `src/scripts/viaje/montar.js` (exponer helper)
- Delete: `src/pages/spike.astro`, `src/pages/galeria.astro`
- Modify: `scripts/verificar.mjs`

**Interfaces:**
- Consumes: todo.
- Produces:
  ```js
  // recorrido.js — fracción del alto de viewport que ocupa la pantalla i con
  // la cámara ACTUAL (para verificar encuadres en cualquier aspect ratio).
  Recorrido.encuadreParada(i, camera): number
  ```

- [ ] **Step 1: Test que falla**

```js
// Recorrido 3D, Task 11: las pantallas encuadran en móvil y en escritorio.
// Ojo con los umbrales: en vertical la parada encuadra por ANCHO (una pantalla
// 1440×900 en un viewport 390×844 no puede llenar también el alto — es
// geometría, no un defecto), así que el mínimo de alto es menor en móvil.
for (const vp of [
  { nombre: 'móvil', ancho: 390, alto: 844, movil: true, min: 0.15 },
  { nombre: 'escritorio', ancho: 1440, alto: 900, movil: false, min: 0.5 },
]) {
  await comprueba(`encuadre de paradas en ${vp.nombre}`, async () => {
    const page = await abrir(vp);
    await page.waitForFunction(() => window.__viaje?.cargaCompleta?.(), { timeout: 30_000 });
    const n = await page.evaluate(() => window.__viaje.pantallas.iframes.length);
    for (let i = 0; i < n; i++) {
      await page.evaluate((k) => window.__galeria.setScroll(window.__galeria.paradaMidY(k)), i);
      await new Promise((r) => setTimeout(r, 1500));
      const frac = await page.evaluate((k) => window.__galeria.encuadreParada(k), i);
      assert.ok(
        frac > vp.min && frac < 1.15,
        `parada ${i}: la pantalla ocupa el ${(frac * 100).toFixed(0)}% del alto — fuera de encuadre`
      );
    }
    assert.deepEqual(page.errores, [], `errores en consola:\n       ${page.errores.join('\n       ')}`);
    await page.close();
  });
}
```

- [ ] **Step 2: Run verificar — falla** (`encuadreParada` undefined). Es probable que el móvil ya encuadre (la Task 4 introdujo `distanciaParada` de dos ejes); el test lo certifica, y si alguna parada se sale, se ajusta `LLENADO_PARADA` o `CURVA`, no el test.

- [ ] **Step 3: `encuadreParada` en `recorrido.js`**

```js
  // Proyecta el alto real de la pantalla i a coordenadas de viewport.
  const v = new THREE.Vector3();
  function encuadreParada(i, camera) {
    const s = stops[i];
    const mitad = (IFRAME_H * SCALE) / 2;
    const top = v.set(s.x, s.y + mitad, s.z).project(camera).y;
    const bottom = v.set(s.x, s.y - mitad, s.z).project(camera).y;
    return Math.abs(top - bottom) / 2; // NDC → fracción del alto de viewport
  }
```

Expónlo en el return y en `__galeria` de `montar.js`: `encuadreParada: (i) => recorrido.encuadreParada(i, escena.camera),`.

- [ ] **Step 4: Borrar las páginas del spike**

```bash
git rm src/pages/spike.astro src/pages/galeria.astro
```

Su código vive ahora en `src/scripts/viaje/`; el historial de git conserva la Fase 1 si hiciera falta consultarla.

- [ ] **Step 5: Run verificar — todo en verde.** Si el check `'sin errores de consola'` (que hace scroll por toda la página con viewport de escritorio) tarda demasiado, sube su paso a `window.innerHeight * 2` como ya se indicó en la Task 4.

- [ ] **Step 6: Medición manual de FPS (criterio del spec §5)**

Con `npm run dev`, recorre el viaje entero en: (a) tu desktop, (b) emulación móvil de Chrome con CPU throttling ×4. Lee `window.__fps` en consola durante el viaje. Objetivo: ≥50 en ambos. Si el móvil se queda corto, en este orden: baja `setPixelRatio` a `Math.min(devicePixelRatio, 1.5)` en `escena.js`, luego baja `N_PARTICULAS` a 300, y vuelve a medir. Anota el resultado en `docs/superpowers/notas/2026-07-29-fps-recorrido.md` (2-3 líneas: dispositivo, throttling, fps medio).

- [ ] **Step 7: Commit**

```bash
git add src/scripts/viaje/recorrido.js src/scripts/viaje/montar.js scripts/verificar.mjs \
  docs/superpowers/notas/2026-07-29-fps-recorrido.md
git commit -m "feat: encuadre certificado en móvil y escritorio; retiradas las páginas del spike"
```

---

## Cierre (fuera de tasks)

Cuando las 11 tasks estén en verde: merge de `spike/galeria-3d` a `main` y push — GitHub Actions despliega solo (`.github/` ya tiene el workflow del deploy). Antes del push, pasada manual completa del recorrido en desktop y móvil real: pantalla de carga, las paradas, el toggle ES/EN a mitad de viaje, y `/en/`.
