# Arreglo: el iframe alto estira las demos — pasar a mismo origen + scroll interno

## El bug

`PosterVivo.astro` monta el iframe con `width: 1440px` y `height: <alto real de la demo>`
(4229 / 6601 / 5224 px), y lo desplaza con `--y` para simular el recorrido.

**Eso rompe la maquetación de las demos.** Dentro de un iframe de 4229px de alto,
`100vh` vale 4229px. Las demos usan unidades de viewport, así que se estiran:

| Demo | Alto con viewport de 900px | Alto dentro del iframe alto | Deriva |
|---|---|---|---|
| demo-barberia-navaja | 4229px | **7159px** | +69% |
| demo-dental-sereno | 6601px | 7036px | +7% |
| demo-psicologia-ancla | 5224px | 5224px | 0% |

Medido el 2026-07-16 con puppeteer. Consecuencias reales, visibles en
`/tmp/task4-project-top.png`: el hero de Navaja pasa a medir ~3700px, el marco
(que enseña 900px) muestra solo su franja superior y **sale casi vacío**; además
el recorrido se queda corto, porque `alto` se midió a 900px de viewport y la
realidad dentro del iframe es otra.

## La solución (verificada, no propuesta)

El iframe debe medir **1440×900** — un viewport de verdad, con lo que la demo se
maqueta exactamente igual que en su captura. Para recorrerla hay que scrollearla
**por dentro**, lo que exige mismo origen.

Se consigue apuntando el iframe a una **ruta relativa** (`/demo-barberia-navaja/`)
en vez de a la URL absoluta:

- **En producción:** el sitio vive en `charcoles-hub.github.io` y las demos son
  *project pages* del mismo usuario, servidas en `charcoles-hub.github.io/demo-x/`.
  Misma ruta, mismo origen, sin hacer nada.
- **En desarrollo:** un proxy de Vite trae `/demo-*` desde GitHub Pages, así que
  también es mismo origen (localhost).
- **Si Sergio compra dominio:** GitHub Pages sirve las project pages bajo el dominio
  del user site (`tudominio.com/demo-x/`), así que la ruta relativa **sigue valiendo
  sin tocar nada**. Con URLs absolutas se habría roto. La ruta relativa es la opción
  que sobrevive a la decisión aplazada del dominio.

Verificado el 2026-07-16 contra el proxy real:
```
{ "ok": true, "mismoOrigen": true, "altoReal": 4229, "scrollY": 1200 }
```

**Gotcha ya cazado:** las demos llevan `html { scroll-behavior: smooth }`. Con eso,
`scrollTo(0, y)` **anima** en vez de saltar, y el recorrido va con retraso y a
tirones. Hay que forzar `scrollBehavior = 'auto'` en el documento del iframe.

Los `alto` de `site.ts` (4229/6601/5224) **siguen siendo correctos**: se midieron a
900px de viewport, que es justo lo que ahora tendrá el iframe.

---

## Cambios

### 1. `astro.config.mjs` — proxy de desarrollo

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://charcoles-hub.github.io',
  base: '/',
  vite: {
    plugins: [tailwindcss()],
    server: {
      // En producción /demo-* son project pages del mismo origen y esto no hace
      // falta. En local hay que traerlas para que el iframe sea del mismo origen
      // y se pueda scrollear por dentro.
      proxy: {
        '/demo-': { target: 'https://charcoles-hub.github.io', changeOrigin: true },
      },
    },
  },
});
```

### 2. `src/config/site.ts` — añadir la ruta relativa

En la interfaz `Proyecto`, junto a `url`:

```ts
  /**
   * Ruta relativa a la demo. ES LO QUE USA EL IFRAME, y tiene que ser relativa:
   * en producción y bajo un dominio propio resuelve al mismo origen, que es lo
   * que permite scrollear la demo por dentro. Con la URL absoluta se rompería.
   */
  ruta: string;
```

Y en cada proyecto, debajo de su `url`:

```ts
    ruta: '/demo-barberia-navaja/',
    ruta: '/demo-dental-sereno/',
    ruta: '/demo-psicologia-ancla/',
```

(`url` se conserva: es la que usa el enlace "Abrir de verdad ↗", que sí debe ser
absoluta para abrir en pestaña nueva.)

### 3. `src/styles/global.css` — el iframe es un viewport, no una tira larga

Sustituye el bloque `.marco iframe` entero por:

```css
/* El iframe: encima, oculto hasta que esté escalado Y cargado.
   Mide 1440×900 = un viewport de verdad. Si se le da el alto real de la demo,
   dentro de él 100vh pasa a valer ese alto y la demo se estira (Navaja: +69%).
   El recorrido NO se hace moviendo el iframe, sino scrolleando su documento. */
.marco iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 1440px;
  height: 900px;
  border: 0;
  transform-origin: 0 0;
  /* --s lo fija el script. Arranca oculto: sin escala se vería a tamaño real. */
  transform: scale(var(--s, 1));
  opacity: 0;
  transition: opacity 0.5s ease;
  /* LA LÍNEA CLAVE: póster vivo, no trampa táctil.
     Sin esto el iframe se traga el scroll del dedo en móvil. */
  pointer-events: none;
}
.marco[data-listo="si"] iframe { opacity: 1; }
```

### 4. `src/components/PosterVivo.astro` — el iframe

`src` pasa a `proyecto.ruta`, y desaparece el `height` dinámico:

```astro
    <iframe
      src={proyecto.ruta}
      title={`${proyecto.nombre} — ${proyecto.rubro}`}
      loading="lazy"
      tabindex="-1"
      aria-hidden="true"
    ></iframe>
```

`data-alto={proyecto.alto}` **se mantiene** en `.marco`: sigue siendo la distancia
de recorrido.

### 5. `src/components/PosterVivo.astro` — el script

El escalado no cambia (salvo que ya no fija el alto del iframe). El recorrido pasa
de mover el iframe a scrollear su documento:

```astro
<script>
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const marcos = document.querySelectorAll<HTMLElement>('[data-marco]');

  // --- Escalado: lo que en CSS puro no funciona en Firefox ---
  const ro = new ResizeObserver((entradas) => {
    for (const e of entradas) {
      const marco = e.target as HTMLElement;
      marco.style.setProperty('--s', String(e.contentRect.width / 1440));
      marco.dataset.listo = 'si';
    }
  });
  marcos.forEach((m) => ro.observe(m));

  // Las demos llevan `html { scroll-behavior: smooth }`: sin esto, cada scrollTo
  // se ANIMA y el recorrido va a tirones y con retraso. Hay que matarlo en cuanto
  // el documento del iframe exista.
  function preparaDemo(marco: HTMLElement) {
    const ifr = marco.querySelector('iframe');
    try {
      const doc = ifr?.contentDocument;
      if (!doc) return null;
      doc.documentElement.style.scrollBehavior = 'auto';
      return ifr;
    } catch {
      // Cross-origin: no debería pasar (la ruta es relativa), pero si pasa el
      // póster estático sigue debajo y la página no se rompe.
      return null;
    }
  }
  marcos.forEach((m) => m.querySelector('iframe')?.addEventListener('load', () => preparaDemo(m)));

  // --- Recorrido: la demo se scrollea por dentro (opción C) ---
  function recorre() {
    document.querySelectorAll<HTMLElement>('[data-proyecto]').forEach((seccion) => {
      const marco = seccion.querySelector<HTMLElement>('[data-marco]');
      const barra = seccion.querySelector<HTMLElement>('[data-barra]');
      if (!marco) return;

      const r = seccion.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;

      // El marco enseña siempre 900px de demo; lo que sobra es el recorrido.
      const sobra = Math.max(0, (Number(marco.dataset.alto) || 900) - 900);
      const ifr = marco.querySelector('iframe');
      try {
        ifr?.contentWindow?.scrollTo(0, reduce.matches ? 0 : p * sobra);
      } catch { /* cross-origin: el póster aguanta */ }
      if (barra) barra.style.width = `${(p * 100).toFixed(1)}%`;
    });
  }

  let pendiente = false;
  addEventListener('scroll', () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => { recorre(); pendiente = false; });
  }, { passive: true });
  addEventListener('resize', recorre);
  recorre();

  // --- Inclinación al puntero (spec §6 punto 5) ---
  // Si se nota, está mal calibrado. El tope son 3 grados.
  marcos.forEach((marco) => {
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

### 6. `scripts/servir.mjs` — servidor local con proxy (NUEVO)

`astro preview` **no aplica el proxy de Vite**, así que sin esto no se puede
verificar ni medir la pieza central contra el build real. Sirve `dist/` y hace de
proxy de `/demo-*`, replicando lo que GitHub Pages hace en producción.

```js
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const PUERTO = Number(process.env.PUERTO ?? 4321);
const RAIZ = new URL('../dist/', import.meta.url).pathname;
const ORIGEN_DEMOS = 'https://charcoles-hub.github.io';

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

createServer(async (req, res) => {
  const ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);

  // Las demos: igual que en producción, mismo origen.
  if (ruta.startsWith('/demo-')) {
    const upstream = await fetch(ORIGEN_DEMOS + ruta, { redirect: 'follow' });
    res.writeHead(upstream.status, {
      'content-type': upstream.headers.get('content-type') ?? 'application/octet-stream',
    });
    res.end(Buffer.from(await upstream.arrayBuffer()));
    return;
  }

  // El sitio: estático desde dist/.
  // normalize() corta los ../ antes de tocar el disco.
  const rel = normalize(ruta).replace(/^(\.\.[/\\])+/, '');
  const archivo = join(RAIZ, rel.endsWith('/') ? rel + 'index.html' : rel);
  try {
    const cuerpo = await readFile(archivo);
    res.writeHead(200, { 'content-type': TIPOS[extname(archivo)] ?? 'application/octet-stream' });
    res.end(cuerpo);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('404');
  }
}).listen(PUERTO, () => console.log(`dist/ + proxy de demos en http://localhost:${PUERTO}/`));
```

Y en `package.json`, junto a los demás scripts:

```json
    "servir": "node scripts/servir.mjs",
```

**A partir de aquí, el arnés se lanza contra `npm run servir`, no contra
`npm run preview`.** `astro preview` deja de servir para este proyecto porque no
resuelve `/demo-*`. Actualiza el comentario de cabecera de `scripts/verificar.mjs`
para que lo diga.

### 7. `scripts/verificar.mjs` — dos tests que ya no dicen la verdad

**`los 3 iframes apuntan a las demos reales`**: ahora los `src` son rutas relativas
que el navegador resuelve a absolutas del mismo origen. Sustituye la aserción por:

```js
  for (const s of srcs) {
    const u = new URL(s);
    assert.equal(u.origin, new URL(URL_BASE).origin, `el iframe no es del mismo origen: ${s}`);
    assert.ok(/^\/demo-/.test(u.pathname), `ruta inesperada: ${u.pathname}`);
  }
```
(define `const URL_BASE = URL;` junto a la constante existente, o reutiliza la que
ya hay — no dupliques la cadena.)

**`la demo se recorre al scrollear`**: ya no existe `--y`. Ahora hay que comprobar
lo que de verdad importa — que el documento *dentro* del iframe se ha movido:

```js
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
```

Este test es el que prueba que la pieza central funciona. Si el iframe fuera
cross-origin, `contentWindow.scrollY` lanzaría y el test fallaría — que es
exactamente lo que queremos que pase.

---

## Verificación obligatoria

No basta con que el arnés dé verde. Hay que **mirarlo**:

1. `npm run build && (npm run servir &)` y luego `npm run verificar` — los 8 checks.
2. Captura a 1440×900 en lo alto de la sección de Navaja y otra tras scrollear
   dentro. **En la primera el marco debe enseñar la portada de Navaja bien
   maquetada** ("Afeitarse no debería tener prisa" visible), NO un marco casi vacío
   con solo la barra de navegación. Ese era el síntoma del bug.
3. Comprueba que la demo se ha movido entre ambas.
4. Sin scroll horizontal a 390px.

Reporta lo que veas de verdad en cada imagen, no lo que esperes ver.
