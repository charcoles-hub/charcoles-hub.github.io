# Fondo 3D en la Portada Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir una escena three.js de fondo a la sección Portada de `charcoles-hub.github.io` — una malla que respira y rota, en la paleta del sitio — sin tocar el resto de secciones ni bajar el Lighthouse móvil por debajo de 90.

**Architecture:** Un componente Astro nuevo (`Fondo3D.astro`) con un `<canvas>` y un `<script type="module">` vanilla que monta una escena three.js mínima (un `THREE.Group` con dos mallas compartiendo la misma `IcosahedronGeometry`: relleno translúcido con rim-light por fresnel, y wireframe fino). Se inyecta solo dentro de `Portada.astro`. Toda la lógica de resiliencia (reduced-motion, sin WebGL, fuera de viewport, pestaña oculta) vive en el mismo script, sin frameworks ni dependencias de estado.

**Tech Stack:** Astro 7, Tailwind 4, `three` (dependencia nueva), Puppeteer (arnés existente en `scripts/verificar.mjs`).

## Global Constraints

- Solo la sección Portada lleva 3D — ninguna otra sección se toca (spec §1).
- `prefers-reduced-motion: reduce` → un único frame estático, sin desplazamiento de vértices, sin rotación, sin `requestAnimationFrame` (spec §4, no negociable).
- Sin WebGL disponible, la Portada se degrada a su estado actual (solo tipografía), sin errores visibles (spec §4, criterio 5).
- Sin dependencias nuevas aparte de `three` — nada de react-three-fiber ni librerías de animación (spec §5).
- El `<canvas>` lleva `pointer-events: none` — no puede robar clics ni scroll (spec §5).
- Lighthouse móvil se mantiene ≥ 90 con la escena activa (spec §8, criterio 3) — se mide a mano, no hay gate automático.
- Verificación vía `scripts/verificar.mjs` (Puppeteer contra `npm run servir`, **no** `npm run preview`), extendiendo los casos existentes con el mismo estilo (comentarios que explican el porqué, nombres de test en español).

---

### Task 1: Escena base — dependencia, malla, reduced-motion, degradación sin WebGL

**Files:**
- Modify: `package.json`
- Create: `src/components/Fondo3D.astro`
- Modify: `src/components/Portada.astro`
- Modify: `scripts/verificar.mjs`

**Interfaces:**
- Produces: un `<canvas id="fondo-3d">` montado dentro de la `<section>` de Portada, con `pointer-events-none absolute inset-0 -z-10`. Ningún otro archivo lo consume directamente — Task 2 modifica el mismo componente.

- [ ] **Step 1: Instalar three.js**

```bash
npm install three
```

- [ ] **Step 2: Escribir el test en rojo**

Añadir en `scripts/verificar.mjs`, justo antes de `await browser.close();`:

```js
// Fondo 3D de la Portada (spec 2026-07-28): tiene que montarse sin reventar
// la consola, tanto animado como en el frame estático de reduced-motion.
await comprueba('fondo 3D: sin errores de consola', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false });
  await new Promise((r) => setTimeout(r, 800)); // deja correr varios frames de rAF
  const canvas = await page.$('#fondo-3d');
  assert.ok(canvas, 'no existe el <canvas id="fondo-3d">');
  assert.deepEqual(page.errores, [], `errores en consola:\n       ${page.errores.join('\n       ')}`);
  await page.close();
});

await comprueba('fondo 3D: frame estático con prefers-reduced-motion', async () => {
  const page = await abrir({ ancho: 1440, alto: 900, movil: false, reducirMovimiento: true });
  await new Promise((r) => setTimeout(r, 400));
  assert.deepEqual(page.errores, [], `errores en consola:\n       ${page.errores.join('\n       ')}`);
  await page.close();
});

// Spec §4, criterio 5: sin WebGL, la Portada no puede romperse.
await comprueba('fondo 3D: se degrada sin romper si no hay WebGL', async () => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, isMobile: false, deviceScaleFactor: 1 });
  page.errores = [];
  page.on('pageerror', (e) => page.errores.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && page.errores.push(m.text()));
  // Se engancha ANTES de navegar: WebGLRenderer intenta crear el contexto en
  // el primer script que corre tras el DOM, no hay margen para hacerlo después.
  await page.evaluateOnNewDocument(() => {
    HTMLCanvasElement.prototype.getContext = function (tipo, ...resto) {
      if (String(tipo).includes('webgl')) return null;
      return null;
    };
  });
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60_000 });
  await new Promise((r) => setTimeout(r, 400));
  assert.deepEqual(page.errores, [], `errores en consola:\n       ${page.errores.join('\n       ')}`);
  const h1Visible = await page.$eval('h1', (e) => getComputedStyle(e).opacity !== '0');
  assert.ok(h1Visible, 'el nombre no es visible cuando no hay WebGL');
  await page.close();
});
```

Run: `npm run build && npm run servir & sleep 1 && npm run verificar; kill %1`
Expected: FAIL en los tres casos nuevos — `Fondo3D.astro` todavía no existe, así que no hay `<canvas id="fondo-3d">` en el HTML.

- [ ] **Step 3: Crear `src/components/Fondo3D.astro`**

```astro
---
---
<canvas id="fondo-3d" class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true"></canvas>

<script>
  import * as THREE from 'three';

  // Ruido simplex 3D — Ian McEwan / Ashima Arts (webgl-noise, MIT). Desplaza
  // los vértices para que la malla "respire" en vez de ser estática.
  const VERTICES = `
    uniform float uTiempo;
    uniform float uIntensidad;
    varying vec3 vNormal;

    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){
      const vec2 C=vec2(1.0/6.0,1.0/3.0);
      const vec4 D=vec4(0.0,0.5,1.0,2.0);
      vec3 i=floor(v+dot(v,C.yyy));
      vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);
      vec3 l=1.0-g;
      vec3 i1=min(g.xyz,l.zxy);
      vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;
      vec3 x2=x0-i2+C.yyy;
      vec3 x3=x0-D.yyy;
      i=mod(i,289.0);
      vec4 p=permute(permute(permute(
          i.z+vec4(0.0,i1.z,i2.z,1.0))
        + i.y+vec4(0.0,i1.y,i2.y,1.0))
        + i.x+vec4(0.0,i1.x,i2.x,1.0));
      float n_=1.0/7.0;
      vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.0*floor(p*ns.z*ns.z);
      vec4 x_=floor(j*ns.z);
      vec4 y_=floor(j-7.0*x_);
      vec4 x=x_*ns.x+ns.yyyy;
      vec4 y=y_*ns.x+ns.yyyy;
      vec4 h=1.0-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);
      vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.0+1.0;
      vec4 s1=floor(b1)*2.0+1.0;
      vec4 sh=-step(h,vec4(0.0));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
      vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);
      vec3 p1=vec3(a0.zw,h.y);
      vec3 p2=vec3(a1.xy,h.z);
      vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
      vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
      m=m*m;
      return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }

    void main(){
      float ruido = snoise(position * 1.6 + uTiempo * 0.35) * uIntensidad;
      vec3 desplazado = position + normal * ruido * 0.18;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(desplazado, 1.0);
    }
  `;

  // Relleno: casi transparente, con un rim-light que solo se insinúa en los
  // bordes (fresnel). El color es una mezcla entre tenue y acento, nunca acento
  // puro — spec: "un solo acento cálido", no un objeto entero naranja.
  const FRAGMENTO_RELLENO = `
    uniform vec3 uColorTenue;
    uniform vec3 uColorAcento;
    varying vec3 vNormal;
    void main(){
      float fresnel = pow(1.0 - abs(vNormal.z), 2.5);
      vec3 color = mix(uColorTenue, uColorAcento, fresnel);
      gl_FragColor = vec4(color, 0.08 + fresnel * 0.5);
    }
  `;

  const FRAGMENTO_HILO = `
    uniform vec3 uColorTenue;
    void main(){
      gl_FragColor = vec4(uColorTenue, 0.35);
    }
  `;

  function iniciarFondo3D() {
    const canvas = document.getElementById('fondo-3d');
    if (!(canvas instanceof HTMLCanvasElement)) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return; // sin WebGL: la Portada se queda solo con tipografía (spec §4)
    }

    const seccion = canvas.closest('section');
    const prefiereReducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Los tokens de color viven en un solo sitio: el @theme de global.css.
    // Leerlos de ahí evita una segunda fuente de verdad con los mismos hex.
    const raiz = getComputedStyle(document.documentElement);
    const colorTenue = new THREE.Color(raiz.getPropertyValue('--color-tenue').trim());
    const colorAcento = new THREE.Color(raiz.getPropertyValue('--color-acento').trim());

    const escena = new THREE.Scene();
    const camara = new THREE.PerspectiveCamera(45, 1, 0.1, 10);
    camara.position.z = 3.4;

    const geometria = new THREE.IcosahedronGeometry(1.4, 3); // ~1280 triángulos
    const uniforms = {
      uTiempo: { value: 0 },
      uIntensidad: { value: prefiereReducido ? 0 : 1 },
      uColorTenue: { value: colorTenue },
      uColorAcento: { value: colorAcento },
    };

    const relleno = new THREE.Mesh(
      geometria,
      new THREE.ShaderMaterial({
        vertexShader: VERTICES,
        fragmentShader: FRAGMENTO_RELLENO,
        uniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );
    const hilo = new THREE.Mesh(
      geometria,
      new THREE.ShaderMaterial({
        vertexShader: VERTICES,
        fragmentShader: FRAGMENTO_HILO,
        uniforms,
        transparent: true,
        wireframe: true,
      })
    );

    const grupo = new THREE.Group();
    grupo.add(relleno, hilo);
    escena.add(grupo);

    function ajustarTamano() {
      const ancho = canvas.clientWidth || 1;
      const alto = canvas.clientHeight || 1;
      renderer.setSize(ancho, alto, false);
      camara.aspect = ancho / alto;
      camara.updateProjectionMatrix();
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    ajustarTamano();
    addEventListener('resize', ajustarTamano);

    const reloj = new THREE.Clock();
    function pintar() {
      uniforms.uTiempo.value = reloj.getElapsedTime();
      grupo.rotation.y += 0.0015;
      grupo.rotation.x += 0.0007;
      renderer.render(escena, camara);
    }

    pintar(); // primer frame — también el único frame en reduced-motion

    if (prefiereReducido) return; // spec §4: nada de rAF en este modo

    (function ciclo() {
      pintar();
      requestAnimationFrame(ciclo);
    })();
  }

  // Diferido tras el primer pintado: no debe competir con el LCP del <h1>.
  function diferir(fn) {
    if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 1000 });
    else setTimeout(fn, 200);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => diferir(iniciarFondo3D));
  } else {
    diferir(iniciarFondo3D);
  }
</script>
```

- [ ] **Step 4: Montar el componente en la Portada**

En `src/components/Portada.astro`, añadir el import y el componente, y dar posicionamiento relativo a la sección:

```diff
 import { contenido, rutas, type Lang } from '../config/site';
+import Fondo3D from './Fondo3D.astro';
```

```diff
-<section class="min-h-[100svh] flex flex-col justify-between px-6 py-8 md:px-12 md:py-12">
+<section class="relative min-h-[100svh] flex flex-col justify-between px-6 py-8 md:px-12 md:py-12">
+  <Fondo3D />
   <div class="entra flex items-center justify-between gap-4" style="--i:0">
```

- [ ] **Step 5: Ejecutar el arnés y confirmar verde**

Run:
```bash
npm run build
npm run servir &
sleep 1
npm run verificar
kill %1
```
Expected: PASS en los tres casos nuevos, y el resto de la suite sigue en verde (nada de lo tocado afecta a Trabajo/Bio/Contacto).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/components/Fondo3D.astro src/components/Portada.astro scripts/verificar.mjs
git commit -m "feat: fondo 3D en la Portada con three.js, reduced-motion y fallback sin WebGL"
```

---

### Task 2: Interacción — parallax de ratón, pausa fuera de viewport y con la pestaña oculta

**Files:**
- Modify: `src/components/Fondo3D.astro`
- Modify: `scripts/verificar.mjs`

**Interfaces:**
- Consumes: la escena, `uniforms`, `grupo`, `camara`, `canvas`, `seccion` y el bucle `pintar()`/`ciclo()` definidos dentro de `iniciarFondo3D()` en la Task 1 (mismo scope de función, no hay export/import entre archivos).
- Produces: nada que otro archivo consuma — es la pieza final del componente.

- [ ] **Step 1: Escribir el test en rojo**

Añadir en `scripts/verificar.mjs`, junto a los otros casos de `fondo 3D`:

```js
// Spec §3: pausa al salir del viewport y en móvil sin parallax de puntero
// (no hay ratón). Si algo revienta al hacerlo, este test lo caza.
await comprueba('fondo 3D: pausa al scrollear y no rompe en móvil', async () => {
  const escritorio = await abrir({ ancho: 1440, alto: 900, movil: false });
  await escritorio.mouse.move(700, 300);
  await escritorio.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await new Promise((r) => setTimeout(r, 500));
  assert.deepEqual(escritorio.errores, [], `errores en escritorio:\n       ${escritorio.errores.join('\n       ')}`);
  await escritorio.close();

  const movil = await abrir(); // 390×844, isMobile: true — sin puntero fino
  await new Promise((r) => setTimeout(r, 800));
  assert.deepEqual(movil.errores, [], `errores en móvil:\n       ${movil.errores.join('\n       ')}`);
  await movil.close();
});
```

Run: `npm run build && npm run servir & sleep 1 && npm run verificar; kill %1`
Expected: este caso ya PASA con el código de la Task 1 (no hay parallax ni observers todavía, así que nada revienta) — sirve como red antes de tocar nada. Confírmalo antes de seguir.

- [ ] **Step 2: Añadir parallax de ratón, pausa por `IntersectionObserver` y por `visibilitychange`**

En `src/components/Fondo3D.astro`, dentro de `iniciarFondo3D()`, sustituir desde la línea `const reloj = new THREE.Clock();` hasta la línea `})();` que cierra `ciclo()` (ambas incluidas) por el bloque siguiente. La llave `}` que cierra `iniciarFondo3D()` va justo después, sin tocarla:

```js
    // Parallax de cámara, solo con puntero fino (desktop). En táctil un
    // pointermove es el dedo haciendo scroll, no un gesto de apuntar.
    const tienePuntero = matchMedia('(pointer: fine)').matches;
    let objetivoX = 0;
    let objetivoY = 0;
    if (tienePuntero && seccion) {
      seccion.addEventListener('pointermove', (e) => {
        const r = seccion.getBoundingClientRect();
        objetivoX = ((e.clientX - r.left) / r.width - 0.5) * 2;
        objetivoY = ((e.clientY - r.top) / r.height - 0.5) * 2;
      });
    }

    let dentroDelViewport = true;
    let pestanaVisible = true;
    if (seccion) {
      canvas.style.transition = prefiereReducido ? '' : 'opacity 0.6s ease';
      new IntersectionObserver(
        ([entrada]) => {
          dentroDelViewport = entrada.isIntersecting;
          canvas.style.opacity = dentroDelViewport ? '1' : '0';
        },
        { threshold: 0 }
      ).observe(seccion);
    }
    document.addEventListener('visibilitychange', () => {
      pestanaVisible = document.visibilityState === 'visible';
    });

    const reloj = new THREE.Clock();
    function pintar() {
      uniforms.uTiempo.value = reloj.getElapsedTime();
      grupo.rotation.y += 0.0015;
      grupo.rotation.x += 0.0007;
      camara.position.x += (objetivoX * 0.3 - camara.position.x) * 0.04;
      camara.position.y += (-objetivoY * 0.3 - camara.position.y) * 0.04;
      camara.lookAt(grupo.position);
      renderer.render(escena, camara);
    }

    pintar(); // primer frame — también el único frame en reduced-motion

    if (prefiereReducido) return; // spec §4: nada de rAF en este modo

    (function ciclo() {
      if (dentroDelViewport && pestanaVisible) pintar();
      requestAnimationFrame(ciclo);
    })();
```

- [ ] **Step 3: Ejecutar el arnés y confirmar verde**

Run:
```bash
npm run build
npm run servir &
sleep 1
npm run verificar
kill %1
```
Expected: PASS, todos los casos de `fondo 3D` incluidos.

- [ ] **Step 4: Commit**

```bash
git add src/components/Fondo3D.astro scripts/verificar.mjs
git commit -m "feat: parallax de ratón y pausa del fondo 3D fuera de viewport/pestaña"
```

---

### Task 3: Verificación de rendimiento (Lighthouse móvil ≥ 90)

**Files:** ninguno (solo medición manual, sin cambios de código salvo que la medición obligue a ajustar algo — ver Step 3).

**Interfaces:** ninguna — tarea de cierre.

- [ ] **Step 1: Levantar el sitio en modo producción**

```bash
npm run build
npm run servir &
sleep 1
```

- [ ] **Step 2: Medir Lighthouse móvil**

```bash
npx lighthouse http://localhost:4321/ --preset=desktop=false --output=json --output-path=/tmp/lh-fondo3d.json --chrome-flags="--headless --no-sandbox"
node -e "const r=require('/tmp/lh-fondo3d.json').categories; console.log(Object.entries(r).map(([k,v])=>k+': '+Math.round(v.score*100)).join('  '))"
kill %1
```
Expected: `performance` ≥ 90. Si baja de 90, comparar contra la medición base del 2026-07-16 (95/100/96/100, ver spec de la web personal §8) para aislar cuánto resta el fondo 3D.

- [ ] **Step 3 (solo si performance < 90): reducir coste de la escena**

En `src/components/Fondo3D.astro`, en este orden (parar en cuanto vuelva a pasar el listón):
1. Bajar el detalle de la geometría: `new THREE.IcosahedronGeometry(1.4, 2)` (320 triángulos en vez de 1280).
2. Bajar el tope de `devicePixelRatio`: `Math.min(devicePixelRatio, 1.5)`.
3. Aumentar el `timeout` de `requestIdleCallback` a `2000` para retrasar más la inicialización.

Repetir Step 2 tras cada cambio.

- [ ] **Step 4: Dejar constancia en el spec**

Añadir al final de `docs/superpowers/specs/2026-07-28-fondo-3d-portada-design.md` una sección `## Medición real (fecha)` con la tabla de puntuaciones, igual que hace el spec del 2026-07-16 en su §8 — para que quien lo lea después no tenga que remedir para saber si el criterio de aceptación 3 se cumplió.

- [ ] **Step 5: Commit y push**

```bash
git add docs/superpowers/specs/2026-07-28-fondo-3d-portada-design.md
git commit -m "docs: medición de Lighthouse móvil con el fondo 3D activo"
git push
```
