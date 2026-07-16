# Web personal de Sergio García Ortiz — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el one-pager personal de Sergio García Ortiz — dirección "galería oscura", tres demos como pósters vivos, animaciones como eje del wow — listo para publicar pero sin publicar.

**Architecture:** Sitio Astro estático de una sola página. `index.astro` compone cinco secciones; el componente `PosterVivo.astro` incrusta cada demo real en un `iframe` del mismo origen, escalado con `transform` y neutralizado con `pointer-events:none`. Las animaciones son CSS nativo (scroll-driven donde el navegador lo soporta, `position:sticky` para el fijado), con degradación explícita y respeto a `prefers-reduced-motion`. Cero librerías de animación.

**Tech Stack:** Astro 7, Tailwind 4 (`@tailwindcss/vite`, tema en `@theme`), Google Fonts (Archivo variable), `puppeteer-core` + chromium del sistema para verificación, GitHub Pages vía `withastro/action@v3`.

**Spec:** `docs/superpowers/specs/2026-07-16-web-personal-sergio-design.md` — léelo entero antes de empezar. Las restricciones de honestidad de su §2 mandan sobre cualquier decisión estética.

## Global Constraints

- **Node ≥ 22.12.0** (`engines` en package.json). Local hay Node 26.1.0; CI usa Node 22.
- **Astro `^7.0.3`, Tailwind `^4.3.1`** vía `@tailwindcss/vite` — mismas versiones que las demos existentes. No introducir otro motor de estilos.
- **`base: '/'` y `site: 'https://charcoles-hub.github.io'`.** Es un *sitio de usuario* (repo con el nombre exacto del usuario) → publica en raíz. **Nunca usar `BASE_URL` ni prefijos de subruta**: ese fue el infierno de Fisioymés y aquí no aplica.
- **Cero librerías de animación.** Ni GSAP, ni Framer, ni Lenis, ni AOS. Todo CSS nativo. Son kilobytes para lo que el navegador ya hace solo.
- **`prefers-reduced-motion: reduce` se respeta siempre.** Regla dura, no negociable. Toda animación va envuelta en `@media (prefers-reduced-motion: no-preference)`.
- **Nada puede quedar invisible si una animación no corre.** El estado por defecto de todo elemento es visible; las animaciones solo se activan bajo `@supports` + `@media`. Un `opacity:0` que dependa de un timeline no soportado deja la página en blanco.
- **Lighthouse móvil ≥ 90.** Criterio de aceptación, no aspiración.
- **Sin scroll horizontal a 390px.** Gotcha conocido de Fisioymés.
- **Textos en español.** Sin multiidioma.
- **Prohibido en esta iteración:** teléfono, formulario de contacto, Fisioymés, menú de navegación, modo claro, analytics, blog.
- **Las demos se etiquetan como CONCEPTO, visiblemente.** Ningún visitante puede confundirlas con clientes.
- **No se despliega sin OK explícito de Sergio** (Task 8 está bloqueada por diseño).

## Correcciones al spec (aplicadas aquí)

Dos desajustes detectados al cotejar el plan contra el spec. Se corrigen aquí y el spec se actualiza en la Task 7 Step 4.

**1. Fuera las `@view-transition` (spec §6 punto 6).** Inviable, no solo caro:
- Las transiciones entre documentos exigen que **ambas** páginas declaren `@view-transition { navigation: auto }`. Las tres demos son repos aparte y no lo declaran → habría que tocar tres repos ajenos a este trabajo.
- Las demos abren en pestaña nueva (`target="_blank"`), y **una pestaña nueva no tiene transición posible**. El propio diseño se contradecía.

**2. Se invierte el fijado (spec §6 punto 3).** El spec decía "el póster se queda fijo mientras su texto pasa al lado". Es al revés: **se fija el texto y el póster pasa**. Motivo físico, no de gusto: para que un elemento quede fijo, su columna tiene que ser más corta que la contraria, y aquí el texto de cada proyecto son cuatro líneas frente a un póster de 16/10 — el texto es lo corto. Con el póster fijo no habría nada que desplazar y el efecto no existiría. El resultado en pantalla es el mismo "flow" coreografiado, con los papeles cambiados.

El vocabulario de animación queda en los cinco puntos restantes (portada, revelado, fijado, latido, puntero).

---

## Estructura de archivos

| Archivo | Responsabilidad |
|---|---|
| `astro.config.mjs` | Config Astro: `site`, `base:'/'`, plugin Tailwind |
| `package.json` | Deps, `engines`, scripts (`dev`/`build`/`preview`/`verificar`) |
| `src/styles/global.css` | Tema `@theme` (paleta galería oscura, fuentes) + keyframes + reglas de movimiento |
| `src/config/site.ts` | Datos: identidad, bio, proyectos, contacto. **Única fuente de contenido** |
| `src/layouts/Layout.astro` | `<head>`, SEO, JSON-LD, fuentes, `<slot>` |
| `src/components/Portada.astro` | Sección 01 |
| `src/components/PosterVivo.astro` | Componente del iframe vivo. El corazón del sitio |
| `src/components/Trabajo.astro` | Sección 02: itera los proyectos con `PosterVivo` |
| `src/components/Bio.astro` | Sección 03: quién soy |
| `src/components/ComoTrabajo.astro` | Sección 04 |
| `src/components/Contacto.astro` | Sección 05 |
| `src/pages/index.astro` | Compone las cinco secciones |
| `scripts/verificar.mjs` | Comprobaciones automáticas (overflow, reduced-motion, iframes, etiquetas) |
| `.github/workflows/deploy.yml` | Deploy Pages (se añade en Task 8, no antes) |

---

## Task 1: Andamiaje, tema y arnés de verificación

Sin esto no hay nada que probar. Deja el proyecto arrancando y el script de verificación corriendo en verde contra una página mínima.

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css`, `src/config/site.ts`, `src/pages/index.astro`, `scripts/verificar.mjs`
- Modify: `.gitignore`

- [ ] **Step 1: Crear `package.json`**

```json
{
  "name": "charcoles-hub.github.io",
  "type": "module",
  "version": "0.0.1",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "verificar": "node scripts/verificar.mjs"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.3.1",
    "astro": "^7.0.3",
    "tailwindcss": "^4.3.1"
  },
  "devDependencies": {
    "puppeteer-core": "^25.3.0"
  }
}
```

- [ ] **Step 2: Crear `astro.config.mjs`**

Ojo con `base`: raíz, no subruta. Es la diferencia con todas las demás demos del catálogo.

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://charcoles-hub.github.io',
  base: '/',
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: Crear `tsconfig.json`**

```json
{ "extends": "astro/tsconfigs/strict" }
```

- [ ] **Step 4: Añadir a `.gitignore`**

El archivo ya existe con `.superpowers/`, `node_modules/` y `dist/`. Añade:

```
.astro/
```

- [ ] **Step 5: Crear `src/styles/global.css` con el tema**

Paleta de la dirección "galería oscura" validada por Sergio: casi negro, un único acento cálido. **Las demos son la única fuente de color de la página** — no añadas más colores de marca.

```css
@import "tailwindcss";

/* TEMA — Galería oscura. Las paredes son neutras para que los cuadros canten. */
@theme {
  --color-fondo:    #0a0b0d;
  --color-fondo-2:  #101216;
  --color-linea:    #1e2127;
  --color-tinta:    #f2f2f0;
  --color-tenue:    #6b6f76;
  --color-medio:    #8b9099;
  --color-acento:   #ff5c37;

  --font-display: "Archivo", ui-sans-serif, system-ui, sans-serif;
  --font-sans:    "Archivo", ui-sans-serif, system-ui, sans-serif;
}

html {
  background: var(--color-fondo);
  /* Gotcha Fisioymés: sin esto, cualquier elemento ancho provoca scroll lateral en móvil. */
  overflow-x: hidden;
}
body {
  overflow-x: hidden;
  font-family: var(--font-sans);
  color: var(--color-tinta);
  background: var(--color-fondo);
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 6: Crear `src/config/site.ts` — única fuente de contenido**

Los textos de bio salen del spec §3 y están verificados con Sergio. **No los reescribas ni los adornes**: "dos años" y "gestión de contenidos" son las palabras que sostienen su credibilidad.

```ts
export const site = {
  nombre: 'Sergio García Ortiz',
  rol: 'Diseñador web',
  lugar: 'Barcelona',
  titulo: 'Sergio García Ortiz — Diseñador web en Barcelona',
  descripcion:
    'Diseño y construyo webs a medida para negocios que están hartos de parecer una plantilla. Estáticas, rápidas y sin nada que se pueda romper.',
  email: 'scharcoles@gmail.com',
} as const;

export interface Proyecto {
  n: string;
  nombre: string;
  rubro: string;
  descripcion: string;
  url: string;
  /** SIEMPRE 'concepto' mientras el negocio sea inventado. Ver spec §2. */
  etiqueta: 'concepto' | 'cliente';
}

export const proyectos: Proyecto[] = [
  {
    n: '01',
    nombre: 'Navaja',
    rubro: 'Barbería',
    descripcion:
      'Una barbería de barrio con alma de taberna. La carta se lee como un menú, el poste gira de verdad y el latón pesa.',
    url: 'https://charcoles-hub.github.io/demo-barberia-navaja/',
    etiqueta: 'concepto',
  },
  {
    n: '02',
    nombre: 'Sereno',
    rubro: 'Clínica dental',
    descripcion:
      'Ir al dentista da respeto. La web no tenía por qué darlo también: petróleo y porcelana en vez del cian de siempre, y el tratamiento explicado como quien te lo cuenta sentado.',
    url: 'https://charcoles-hub.github.io/demo-dental-sereno/',
    etiqueta: 'concepto',
  },
  {
    n: '03',
    nombre: 'Ancla',
    rubro: 'Psicología',
    descripcion:
      'Pedir ayuda cuesta. Aquí todo baja el pulso: ciruela y malva, mucho aire, y ni una sola foto de alguien mirando al horizonte.',
    url: 'https://charcoles-hub.github.io/demo-psicologia-ancla/',
    etiqueta: 'concepto',
  },
];
```

- [ ] **Step 7: Crear `src/pages/index.astro` mínimo (andamio temporal)**

```astro
---
import '../styles/global.css';
import { site } from '../config/site';
---
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{site.titulo}</title>
  </head>
  <body>
    <h1 data-andamio>{site.nombre}</h1>
  </body>
</html>
```

- [ ] **Step 8: Crear `scripts/verificar.mjs` — el arnés**

Este script es la red de seguridad de todo el plan: comprueba los criterios de aceptación del spec §10 que se pueden automatizar. Usa el chromium del sistema (`/usr/bin/chromium`), así que `puppeteer-core` no descarga ningún navegador.

Arranca `npm run preview` en otra terminal antes de lanzarlo, o pásale una URL: `URL=http://localhost:4321/ npm run verificar`.

```js
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
await comprueba('sin scroll horizontal a 390px', async () => {
  const page = await abrir({ ancho: 390 });
  const exceso = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  assert.ok(exceso <= 0, `sobran ${exceso}px de ancho`);
  await page.close();
});

// Mismo criterio, en escritorio.
await comprueba('sin scroll horizontal a 1440px', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  const exceso = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  assert.ok(exceso <= 0, `sobran ${exceso}px de ancho`);
  await page.close();
});

await browser.close();

console.log('');
if (fallos.length) {
  console.error(`${fallos.length} fallo(s): ${fallos.join(', ')}\n`);
  process.exit(1);
}
console.log('Todo en verde.\n');
```

- [ ] **Step 9: Instalar y comprobar que el arnés falla o pasa de verdad**

```bash
cd ~/Proyectos/charcoles-hub.github.io
npm install
npm run build
```

Esperado: build OK, `dist/index.html` generado.

En una terminal: `npm run preview`. En otra:

```bash
npm run verificar
```

Esperado: `Todo en verde.` con las dos comprobaciones en `ok`.

- [ ] **Step 10: Comprobar que el arnés detecta un fallo real**

No te fíes de un test que nunca ha fallado. Mete un desbordamiento a propósito en `src/pages/index.astro`:

```astro
    <h1 data-andamio style="width: 3000px">{site.nombre}</h1>
```

Reconstruye (`npm run build`), relanza `npm run verificar`.
Esperado: **FALLA** con `sin scroll horizontal a 390px` y `sobran ~2610px de ancho`, y `exit 1`.

Quita el `style="width: 3000px"`, reconstruye, verifica que vuelve a verde. Ahora sabes que el arnés sirve.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: andamiaje Astro, tema galería oscura y arnés de verificación"
```

---

## Task 2: Layout, SEO y Portada

**Files:**
- Create: `src/layouts/Layout.astro`, `src/components/Portada.astro`
- Modify: `src/pages/index.astro`, `src/styles/global.css`

**Interfaces:**
- Consumes: `site` de `src/config/site.ts` (Task 1)
- Produces: `Layout.astro` con prop opcional `{ titulo?: string; descripcion?: string }` — lo usa `index.astro`. `Portada.astro` sin props.

- [ ] **Step 1: Crear `src/layouts/Layout.astro`**

Incluye el SEO gratuito del spec §1 (`title`, meta, Open Graph, JSON-LD `Person`) y nada más. Sin analytics.

La fuente es **Archivo variable**, con ejes de peso y anchura: el eje `wdth` en Expanded es lo que da presencia de cartel al nombre, que es justo lo que pide la dirección A.

```astro
---
import '../styles/global.css';
import { site } from '../config/site';

interface Props {
  titulo?: string;
  descripcion?: string;
}
const { titulo = site.titulo, descripcion = site.descripcion } = Astro.props;
const canonica = new URL(Astro.url.pathname, Astro.site).href;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.nombre,
  jobTitle: site.rol,
  email: `mailto:${site.email}`,
  url: canonica,
  address: { '@type': 'PostalAddress', addressLocality: site.lugar, addressCountry: 'ES' },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Universitat Politècnica de Catalunya — EEBE',
  },
};
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={descripcion} />
    <link rel="canonical" href={canonica} />
    <title>{titulo}</title>

    <meta property="og:type" content="website" />
    <meta property="og:title" content={titulo} />
    <meta property="og:description" content={descripcion} />
    <meta property="og:url" content={canonica} />
    <meta name="twitter:card" content="summary_large_image" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..125,400..900&display=swap"
      rel="stylesheet"
    />

    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Añadir a `src/styles/global.css` las animaciones de portada**

Fíjate en la estructura: el estado visible es el de por defecto. La animación solo entra si el usuario **no** ha pedido menos movimiento. Si esta `@media` no aplica, el texto simplemente está ahí, quieto y legible.

```css
/* ---- Portada: las líneas suben tras una máscara ---- */
@keyframes sube-linea {
  from { transform: translateY(110%); }
  to   { transform: translateY(0); }
}
@keyframes aparece {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.mascara { display: block; overflow: hidden; }

@media (prefers-reduced-motion: no-preference) {
  .mascara > span {
    display: block;
    animation: sube-linea 1s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--i, 0) * 110ms);
  }
  .entra {
    animation: aparece 0.9s ease both;
    animation-delay: calc(var(--i, 0) * 110ms);
  }
}
```

- [ ] **Step 3: Crear `src/components/Portada.astro`**

Del spec §3: nombre a tamaño de cartel, una frase, nada más. Sin foto de stock, sin "bienvenido".

`font-stretch: 115%` explota el eje `wdth` de Archivo — es lo que separa esto de un `font-size` grande y corriente.

```astro
---
import { site } from '../config/site';
---
<section class="min-h-[100svh] flex flex-col justify-between px-6 py-8 md:px-12 md:py-12">
  <p class="entra text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-acento" style="--i:0">
    {site.rol} · {site.lugar}
  </p>

  <h1
    class="font-display font-extrabold leading-[0.88] tracking-[-0.045em]
           text-[clamp(3rem,13vw,11rem)]"
    style="font-stretch:115%"
  >
    <span class="mascara"><span style="--i:1">Sergio</span></span>
    <span class="mascara"><span style="--i:2">García <em class="not-italic text-tenue">Ortiz</em></span></span>
  </h1>

  <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
    <p class="entra max-w-[42ch] text-balance text-medio text-base md:text-lg" style="--i:3">
      {site.descripcion}
    </p>
    <p class="entra text-[0.62rem] uppercase tracking-[0.12em] text-tenue" style="--i:4">
      Tres proyectos · en vivo ↓
    </p>
  </div>
</section>
```

- [ ] **Step 4: Reescribir `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Portada from '../components/Portada.astro';
---
<Layout>
  <Portada />
</Layout>
```

- [ ] **Step 5: Construir y verificar**

```bash
npm run build && npm run verificar
```
(con `npm run preview` corriendo). Esperado: `Todo en verde.`

- [ ] **Step 6: Validar visualmente — GATE DE SERGIO**

Metodología documentada de Sergio: dirección → generar → **validar con capturas** → iterar. No sigas sin esto.

```bash
npm run preview &
chromium --headless=new --virtual-time-budget=4000 \
  --window-size=1440,900 --screenshot=/tmp/portada-desktop.png http://localhost:4321/
chromium --headless=new --virtual-time-budget=4000 \
  --window-size=390,844 --screenshot=/tmp/portada-movil.png http://localhost:4321/
xdg-open /tmp/portada-desktop.png
```

(El `--virtual-time-budget` es obligatorio: sin él las capturas salen a media animación. Gotcha ya documentado.)

**Enseña ambas capturas a Sergio y pregunta explícitamente por la tipografía.** Archivo es una recomendación, no una decisión cerrada: es un grotesco variable cuyo eje de anchura da presencia de cartel, pero si a Sergio no le dice nada, se cambia aquí y ahora — no después, cuando ya haya cinco secciones montadas encima. Su preferencia manda sobre la mía.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: layout con SEO y portada animada"
```

---

## Task 3: PosterVivo — el componente central

El corazón del sitio. Un `iframe` con la demo real, escalado, vivo y neutralizado al tacto.

**Files:**
- Create: `src/components/PosterVivo.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: interfaz `Proyecto` de `src/config/site.ts` (Task 1)
- Produces: `PosterVivo.astro` con props `{ proyecto: Proyecto }`. Lo consume `Trabajo.astro` (Task 4).

- [ ] **Step 1: Añadir a `src/styles/global.css` la mecánica del marco**

El escalado es **CSS puro con container queries**, sin una línea de JavaScript. La cuenta: el marco declara `container-type:inline-size`; el iframe mide 1440×900 fijos y se escala por `100cqw / 1440`. Como el marco tiene `aspect-ratio:1440/900`, el iframe escalado encaja exacto a cualquier ancho. Responsive gratis.

```css
/* ---- Póster vivo ---- */
.marco {
  container-type: inline-size;
  position: relative;
  aspect-ratio: 1440 / 900;
  overflow: hidden;
  border-radius: 10px;
  background: var(--color-fondo-2);
  box-shadow: 0 30px 60px -20px rgb(0 0 0 / 0.8);
}
.marco::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.09);
  pointer-events: none;
}
.marco iframe {
  width: 1440px;
  height: 900px;
  border: 0;
  transform: scale(calc(100cqw / 1440));
  transform-origin: 0 0;
  /* LA LÍNEA CLAVE: póster vivo, no trampa táctil.
     Sin esto el iframe se traga el scroll del dedo en móvil. */
  pointer-events: none;
}

@keyframes late {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.25; }
}
@media (prefers-reduced-motion: no-preference) {
  .punto-vivo { animation: late 2s ease-in-out infinite; }
}
```

- [ ] **Step 2: Crear `src/components/PosterVivo.astro`**

```astro
---
import type { Proyecto } from '../config/site';

interface Props {
  proyecto: Proyecto;
}
const { proyecto } = Astro.props;
const esConcepto = proyecto.etiqueta === 'concepto';
---
<article class="grid gap-6 md:grid-cols-[1fr_1.15fr] md:gap-12 md:items-start">
  <div class="md:sticky md:top-[12vh] flex flex-col gap-4">
    <p class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-acento">
      Proyecto {proyecto.n} — {esConcepto ? 'concepto' : 'cliente'}
    </p>
    <h3 class="font-display text-5xl font-extrabold tracking-[-0.04em] md:text-6xl" style="font-stretch:110%">
      {proyecto.nombre}
    </h3>
    <p class="text-sm uppercase tracking-[0.1em] text-tenue">{proyecto.rubro}</p>
    <p class="max-w-[44ch] text-balance text-medio">{proyecto.descripcion}</p>

    {esConcepto && (
      <p class="max-w-[44ch] border-t border-linea pt-4 text-xs leading-relaxed text-tenue">
        Negocio inventado, diseño real. Lo hice para enseñar cómo trabajo, no para un cliente.
      </p>
    )}

    <a
      href={proyecto.url}
      target="_blank"
      rel="noopener"
      class="mt-2 w-fit rounded-full bg-tinta px-4 py-2.5 text-xs font-semibold text-fondo
             transition-transform hover:-translate-y-0.5"
    >
      Abrir de verdad ↗
    </a>
  </div>

  <div class="marco" data-marco>
    <div class="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full
                bg-fondo/80 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.1em] backdrop-blur-md">
      <span class="punto-vivo size-1.5 rounded-full bg-[#3fb950]"></span>EN VIVO
    </div>
    <iframe
      src={proyecto.url}
      title={`${proyecto.nombre} — ${proyecto.rubro}`}
      loading="lazy"
      tabindex="-1"
      aria-hidden="true"
    ></iframe>
  </div>
</article>
```

Nota sobre `tabindex="-1"` + `aria-hidden="true"`: el iframe es decorativo — es un póster. Sin esto, quien navegue con teclado cae dentro de la demo y se queda atrapado, y un lector de pantalla leería tres webs enteras incrustadas. El enlace "Abrir de verdad" es la vía accesible al mismo contenido.

- [ ] **Step 3: Añadir la reacción al puntero (spec §6 punto 5)**

El único trozo de JavaScript del sitio, y el más fácil de estropear: **si se nota, está mal calibrado.** El tope son 3 grados. Es un efecto que el visitante debe sentir sin saber que está ahí.

Añade al final de `src/components/PosterVivo.astro`:

```astro
<script>
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll<HTMLElement>('[data-marco]').forEach((marco) => {
    let raf = 0;

    marco.addEventListener('pointermove', (e) => {
      if (reduce.matches || e.pointerType !== 'mouse') return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = marco.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        marco.style.transform =
          `perspective(1200px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
      });
    });

    marco.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      marco.style.transform = '';
    });
  });
</script>
```

El `e.pointerType !== 'mouse'` importa: en táctil un `pointermove` es el dedo arrastrando para hacer scroll, y ahí inclinar el marco es mareante y absurdo. La guarda de `prefers-reduced-motion` va en JavaScript porque la animación también vive en JavaScript — la regla dura del spec §6 aplica igual aquí que en CSS.

Añade la transición de vuelta en `src/styles/global.css`, dentro del bloque `.marco` que creaste en el Step 1:

```css
.marco {
  /* …lo ya escrito… */
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: componente PosterVivo con iframe escalado por container query"
```

---

## Task 4: Sección El trabajo

**Files:**
- Create: `src/components/Trabajo.astro`
- Modify: `src/pages/index.astro`, `src/styles/global.css`

**Interfaces:**
- Consumes: `proyectos` de `src/config/site.ts` (Task 1), `PosterVivo.astro` (Task 3)
- Produces: `Trabajo.astro` sin props.

- [ ] **Step 1: Añadir a `src/styles/global.css` el revelado por scroll**

Aquí está la degradación crítica. `animation-timeline: view()` no está en todos los navegadores (Firefox aún no). La doble guarda `@supports` + `@media` significa que quien no lo soporte ve el contenido **visible y quieto**, nunca en blanco. Si inviertes esto y pones `opacity:0` por defecto, rompes la página entera en Firefox.

```css
/* ---- Revelado por scroll (progressive enhancement) ---- */
@keyframes revela {
  from { opacity: 0; transform: translateY(40px) scale(0.97); }
  to   { opacity: 1; transform: none; }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    [data-revela] {
      animation: revela linear both;
      animation-timeline: view();
      animation-range: entry 5% cover 30%;
    }
  }
}
```

- [ ] **Step 2: Crear `src/components/Trabajo.astro`**

```astro
---
import { proyectos } from '../config/site';
import PosterVivo from './PosterVivo.astro';
---
<section class="px-6 py-24 md:px-12 md:py-32">
  <h2 class="sr-only">El trabajo</h2>
  <div class="mx-auto flex max-w-6xl flex-col gap-28 md:gap-44">
    {proyectos.map((proyecto) => (
      <div data-revela>
        <PosterVivo proyecto={proyecto} />
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 3: Añadir a `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Portada from '../components/Portada.astro';
import Trabajo from '../components/Trabajo.astro';
---
<Layout>
  <Portada />
  <Trabajo />
</Layout>
```

- [ ] **Step 4: Ampliar `scripts/verificar.mjs` con las comprobaciones del póster**

Añade estos bloques **antes** de `await browser.close();`:

```js
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

// Regla dura del spec §6: nada invisible si la animación no corre.
await comprueba('con prefers-reduced-motion todo sigue visible', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false, reducirMovimiento: true });
  const invisibles = await page.$$eval('[data-revela], .mascara > span', (els) =>
    els.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length
  );
  assert.equal(invisibles, 0, `${invisibles} elemento(s) invisibles con movimiento reducido`);
  await page.close();
});
```

- [ ] **Step 5: Construir y verificar**

```bash
npm run build && npm run verificar
```
Esperado: seis comprobaciones en `ok`, `Todo en verde.`

Si falla `los iframes no capturan el puntero`, revisa que `pointer-events:none` esté en `.marco iframe` y no lo pise una utilidad de Tailwind.

- [ ] **Step 6: Validar visualmente el fijado y el scroll — GATE DE SERGIO**

Esto no lo puede juzgar una aserción: **el "flow" es exactamente lo que Sergio dijo que más wow le da.** Hay que verlo moverse.

```bash
npm run preview &
xdg-open http://localhost:4321/
```

Comprueba con tus propios ojos, y luego enséñaselo a Sergio:
1. Las tres demos cargan y se ven **animándose solas** dentro de sus marcos.
2. El texto de cada proyecto se queda **fijo** mientras el póster pasa al lado.
3. En móvil (DevTools a 390px) **el dedo no se queda atrapado** dentro de ninguna demo.
4. "Abrir de verdad" abre la demo real en pestaña nueva.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: sección El trabajo con los tres pósters vivos"
```

---

## Task 5: Quién soy y Cómo trabajo

**Files:**
- Create: `src/components/Bio.astro`, `src/components/ComoTrabajo.astro`
- Modify: `src/pages/index.astro`, `src/config/site.ts`

**Interfaces:**
- Consumes: `site` de `src/config/site.ts`
- Produces: `Bio.astro` y `ComoTrabajo.astro`, sin props. Añade `bio` y `metodo` a `src/config/site.ts`.

- [ ] **Step 1: Añadir el contenido a `src/config/site.ts`**

**Textos literales del spec §3, verificados con Sergio.** No los reescribas. La frase de la UPC tiene que aguantar que un cliente pregunte por ella en una llamada; la de EY está deliberadamente contenida porque un año de ciber no hace experto en seguridad (spec §2).

```ts
export const bio = {
  titular: 'Llevo diez años haciendo webs. Uno lo pasé rompiéndolas.',
  parrafos: [
    'Durante dos años llevé el diseño y la gestión de contenidos de la web de la EEBE, la escuela de ingeniería de la UPC, con una beca de aprendizaje. No fue una pantalla bonita y adiós: fue mantener algo vivo, todos los días, para una institución exigente.',
    'Después pasé un año en ciberseguridad en EY. Aprendí cómo se rompen las cosas por dentro, y volví al diseño porque es lo que quiero hacer.',
    'Ahora trabajo por mi cuenta. Cuando me escribes, te contesto yo. Cuando hacemos la llamada, estoy yo. No hay un gestor de cuentas en medio ni un becario montándote la web mientras el comercial te enseña otra cosa.',
  ],
} as const;

export const metodo = {
  titular: 'Construyo webs que no se pueden romper.',
  parrafos: [
    'Tu web actual es probablemente WordPress con veinte plugins que llevan meses sin actualizar. Cada uno es una puerta. Cuando una cede, tu dominio acaba redirigiendo a un casino y tus pacientes ven eso en vez de tu clínica. Lo he visto esta semana en una clínica dental de aquí al lado.',
    'Yo entrego archivos estáticos. No hay base de datos que inyectar, ni plugins que actualizar, ni panel de administración que reventar. No es una promesa de marketing: es que no existe la puerta.',
    'De propina, va rápida. Un archivo estático se sirve desde el borde de la red y aparece antes de que tu visitante se plantee irse.',
  ],
} as const;
```

- [ ] **Step 2: Crear `src/components/Bio.astro`**

```astro
---
import { bio } from '../config/site';
---
<section class="border-t border-linea px-6 py-24 md:px-12 md:py-32">
  <div class="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1.3fr] md:gap-16">
    <h2
      data-revela
      class="font-display text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] text-balance md:text-5xl"
      style="font-stretch:110%"
    >
      {bio.titular}
    </h2>
    <div data-revela class="flex flex-col gap-5 text-medio md:text-lg">
      {bio.parrafos.map((p) => <p class="max-w-[58ch] text-pretty">{p}</p>)}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Crear `src/components/ComoTrabajo.astro`**

```astro
---
import { metodo } from '../config/site';
---
<section class="border-t border-linea bg-fondo-2 px-6 py-24 md:px-12 md:py-32">
  <div class="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1.3fr] md:gap-16">
    <h2
      data-revela
      class="font-display text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] text-balance md:text-5xl"
      style="font-stretch:110%"
    >
      {metodo.titular}
    </h2>
    <div data-revela class="flex flex-col gap-5 text-medio md:text-lg">
      {metodo.parrafos.map((p) => <p class="max-w-[58ch] text-pretty">{p}</p>)}
    </div>
  </div>
</section>
```

- [ ] **Step 4: Añadir a `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Portada from '../components/Portada.astro';
import Trabajo from '../components/Trabajo.astro';
import Bio from '../components/Bio.astro';
import ComoTrabajo from '../components/ComoTrabajo.astro';
---
<Layout>
  <Portada />
  <Trabajo />
  <Bio />
  <ComoTrabajo />
</Layout>
```

- [ ] **Step 5: Construir y verificar**

```bash
npm run build && npm run verificar
```
Esperado: `Todo en verde.`

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: secciones Quién soy y Cómo trabajo"
```

---

## Task 6: Contacto

**Files:**
- Create: `src/components/Contacto.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `site` de `src/config/site.ts`
- Produces: `Contacto.astro`, sin props.

- [ ] **Step 1: Crear `src/components/Contacto.astro`**

Spec §3: email grande y clicable, **sin formulario y sin teléfono**. El hueco para WhatsApp está reservado en el comentario — no lo montes ahora, la decisión del número está aplazada a propósito (spec §7) y publicar un número es irreversible.

```astro
---
import { site } from '../config/site';
---
<section class="border-t border-linea px-6 py-24 md:px-12 md:py-32">
  <div class="mx-auto flex max-w-6xl flex-col gap-8">
    <p data-revela class="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-acento">
      Hablamos
    </p>
    <h2
      data-revela
      class="font-display text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] text-balance md:text-6xl"
      style="font-stretch:110%"
    >
      ¿Tu web se parece a la de todos?
    </h2>
    <p data-revela class="max-w-[46ch] text-balance text-medio md:text-lg">
      Cuéntame qué tienes y qué te gustaría. Te digo qué haría y cuánto cuesta, sin compromiso y sin rodeos.
    </p>

    <a
      data-revela
      href={`mailto:${site.email}`}
      class="group flex w-fit items-baseline gap-3 font-display text-2xl font-bold
             tracking-[-0.03em] text-tinta underline decoration-linea decoration-2
             underline-offset-8 transition-colors hover:decoration-acento md:text-4xl"
    >
      {site.email}
      <span class="text-acento transition-transform group-hover:translate-x-1">↗</span>
    </a>

    {/* Hueco reservado para el botón de WhatsApp. NO lo añadas sin decisión
        explícita de Sergio sobre qué número: publicar un teléfono es irreversible
        (los bots lo recogen en días y queda en cachés y listas de spam). Ver spec §7. */}
  </div>

  <footer class="mx-auto mt-24 flex max-w-6xl items-center justify-between border-t border-linea pt-8 text-xs text-tenue">
    <span>{site.nombre}</span>
    <span>{site.lugar}</span>
  </footer>
</section>
```

- [ ] **Step 2: Añadir a `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import Portada from '../components/Portada.astro';
import Trabajo from '../components/Trabajo.astro';
import Bio from '../components/Bio.astro';
import ComoTrabajo from '../components/ComoTrabajo.astro';
import Contacto from '../components/Contacto.astro';
---
<Layout>
  <Portada />
  <Trabajo />
  <Bio />
  <ComoTrabajo />
  <Contacto />
</Layout>
```

- [ ] **Step 3: Añadir a `scripts/verificar.mjs` la comprobación de datos personales**

Criterio 7 del spec: cero datos personales publicados sin decidirlo a conciencia. Añádelo antes de `await browser.close();`:

```js
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
```

- [ ] **Step 4: Construir y verificar**

```bash
npm run build && npm run verificar
```
Esperado: ocho comprobaciones, `Todo en verde.`

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: sección de contacto"
```

---

## Task 7: Rendimiento, plan B y cierre

El spec §8 fija un riesgo real: el prospecto típico abre esto **con el móvil, con 4G regular, en la sala de espera de su clínica**. Tres webs completas dentro de otra pesan. Si el wow se convierte en una rueda girando, la web hace lo contrario de lo que se le pide — y contradice el argumento de "Cómo trabajo".

**Files:**
- Modify: `src/components/PosterVivo.astro`, `src/config/site.ts`, `docs/superpowers/specs/2026-07-16-web-personal-sergio-design.md`

- [ ] **Step 1: Medir en serio**

```bash
npm run build
npm run preview &
npx lighthouse http://localhost:4321/ \
  --only-categories=performance,accessibility,best-practices,seo \
  --form-factor=mobile --throttling-method=simulate \
  --chrome-flags="--headless=new --no-sandbox" \
  --output=json --output=html --output-path=/tmp/lh
node -e "const r=require('/tmp/lh.report.json');for(const[k,v]of Object.entries(r.categories))console.log(k.padEnd(16),Math.round(v.score*100))"
```

Apunta los cuatro números. **El listón del spec es rendimiento ≥ 90 en móvil.** Accesibilidad debería salir en 100 o muy cerca; si no, arréglalo antes de seguir.

- [ ] **Step 2: Decidir según el resultado — sin improvisar**

**Si rendimiento ≥ 90:** no toques nada. Pasa al Step 4.

**Si rendimiento < 90:** aplica el plan B que ya está decidido en el spec §8 — *solo el primer proyecto va vivo, los otros dos son capturas que despiertan al clicar*. No inventes otra solución ni negocies el listón a la baja: es el listón que Sergio vende.

- [ ] **Step 3: Plan B (solo si el Step 2 lo exige)**

Genera las capturas de los proyectos 2 y 3:

```bash
mkdir -p public/posters
for d in demo-dental-sereno demo-psicologia-ancla; do
  chromium --headless=new --virtual-time-budget=5000 --window-size=1440,900 \
    --screenshot=public/posters/$d.png "https://charcoles-hub.github.io/$d/"
done
```

Añade `vivo: boolean` y `poster?: string` a la interfaz `Proyecto` en `src/config/site.ts`: `vivo: true` solo en Navaja; los otros dos con `vivo: false` y su `poster`.

En `PosterVivo.astro`, sustituye el bloque del iframe por:

```astro
  <div class="marco" data-marco>
    <div class="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full
                bg-fondo/80 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.1em] backdrop-blur-md">
      <span class:list={['size-1.5 rounded-full bg-[#3fb950]', proyecto.vivo && 'punto-vivo']}></span>
      {proyecto.vivo ? 'EN VIVO' : 'DESPIERTA AL TOCAR'}
    </div>

    {proyecto.vivo ? (
      <iframe
        src={proyecto.url}
        title={`${proyecto.nombre} — ${proyecto.rubro}`}
        loading="lazy"
        tabindex="-1"
        aria-hidden="true"
      ></iframe>
    ) : (
      <button
        type="button"
        class="absolute inset-0 h-full w-full cursor-pointer border-0 p-0"
        data-despierta={proyecto.url}
        aria-label={`Cargar ${proyecto.nombre} en vivo`}
      >
        <img src={proyecto.poster} alt="" width="1440" height="900" loading="lazy" class="h-full w-full object-cover" />
      </button>
    )}
  </div>
```

Y al final del componente, el script que lo despierta:

```astro
<script>
  document.querySelectorAll('[data-despierta]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-despierta');
      if (!url) return;
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.tabIndex = -1;
      iframe.setAttribute('aria-hidden', 'true');
      btn.replaceWith(iframe);
    }, { once: true });
  });
</script>
```

Si aplicas el plan B, **relaja la aserción de los 3 iframes** en `scripts/verificar.mjs`: pasa a comprobar que hay `1` iframe y `2` botones `[data-despierta]`. Un test que miente es peor que no tenerlo.

Vuelve al Step 1 y remide.

- [ ] **Step 4: Actualizar el spec**

Dos ediciones en `docs/superpowers/specs/2026-07-16-web-personal-sergio-design.md`:
1. Borra el punto 6 de §6 (las `@view-transition`) y anota por qué: exigen que ambos documentos se adhieran, y las demos abren en pestaña nueva, donde no hay transición posible.
2. En §8, escribe los números reales de Lighthouse y si se aplicó el plan B.

- [ ] **Step 5: Verificación final completa**

```bash
npm run build && npm run verificar
```
Esperado: todas en verde.

Y las capturas para Sergio:

```bash
npm run preview &
chromium --headless=new --virtual-time-budget=6000 --window-size=1440,900 \
  --screenshot=/tmp/final-desktop.png http://localhost:4321/
chromium --headless=new --virtual-time-budget=6000 --window-size=390,844 \
  --screenshot=/tmp/final-movil.png http://localhost:4321/
xdg-open /tmp/final-desktop.png
```

- [ ] **Step 6: Repasar los criterios de aceptación del spec §10 uno a uno**

No los des por buenos de memoria. Los siete, con la página delante:

1. Un desconocido entiende en cinco segundos quién es Sergio y qué hace.
2. Las tres demos se ven vivas y se abren de verdad.
3. Ningún visitante puede confundir un concepto con un cliente.
4. Lighthouse móvil ≥ 90, o plan B aplicado.
5. `prefers-reduced-motion` respetado (compruébalo de verdad: DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`, y recarga).
6. Sin scroll horizontal a 390px.
7. Cero datos personales publicados sin decidirlos.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "perf: medición Lighthouse y cierre del spec"
```

---

## Task 8: Despliegue — BLOQUEADA

**No ejecutes esta tarea sin un "sí, publica" explícito de Sergio en la conversación.** Un sitio de usuario de GitHub Pages es público desde el primer push: no hay marcha atrás discreta. Sergio dijo que de momento la web solo la ve él.

Cuando dé el OK:

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Confirmar que Fisioymés no aparece**

```bash
grep -ri "fisioymes\|fisioymés\|llongueras\|evangelisti" src/ public/ 2>/dev/null
```

Esperado: **sin resultados**. Si aparece algo, para: el spec §2 prohíbe publicar su marca sin permiso del cliente, y ese permiso no está.

- [ ] **Step 2: Crear `.github/workflows/deploy.yml`**

Copiado del patrón que ya funciona en las demos. `node-version: 22` es obligatorio (Astro exige ≥22), y es un gotcha ya documentado.

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
        with:
          node-version: 22
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Crear el repo y publicar**

El nombre del repo debe ser **exactamente** `charcoles-hub.github.io` — de ahí sale la publicación en raíz, y de ahí que `base:'/'` funcione.

```bash
gh repo create charcoles-hub.github.io --public --source=. --remote=origin
git push -u origin main
gh api -X POST repos/charcoles-hub/charcoles-hub.github.io/pages -f build_type=workflow
```

- [ ] **Step 4: Verificar en producción**

Espera a que el workflow termine (`gh run watch`) y luego:

```bash
URL=https://charcoles-hub.github.io/ npm run verificar
```

Esperado: todas en verde contra el sitio real. No des por desplegado nada que no haya pasado esto.

- [ ] **Step 5: Commit y cierre**

```bash
git add -A && git commit -m "ci: deploy a GitHub Pages" && git push
```

Actualiza la memoria de Sergio (`negocio_ia_autonomo.md`) con la URL viva.
