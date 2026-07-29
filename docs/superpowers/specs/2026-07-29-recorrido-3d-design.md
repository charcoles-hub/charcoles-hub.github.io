# Portfolio como viaje 3D ("el recorrido") — diseño

**Fecha:** 2026-07-29
**Estado:** diseño validado con Sergio, pendiente de plan de implementación
**Repo destino:** `charcoles-hub/charcoles-hub.github.io`, rama `spike/galeria-3d` (se renombrará a algo como `feature/recorrido-3d` al formalizarse)
**Predecesores:** [spec web personal](2026-07-16-web-personal-sergio-design.md), [spec fondo 3D portada](2026-07-28-fondo-3d-portada-design.md), spike y Fase 1 de la galería 3D (`src/pages/spike.astro`, `src/pages/galeria.astro`)

---

## 1. Qué es esto y para qué

La home deja de ser una página con secciones apiladas y se convierte en un **viaje continuo por un espacio 3D**, gobernado por el scroll, que reemplaza por completo a la web actual en `charcoles-hub.github.io`. El mecanismo central ya está resuelto y medido en `galeria.astro` (Fase 1): `CSS3DRenderer` con las 4 demos reales como pantallas vivas en una composición en curva, cámara dirigida con paradas encuadradas geométricamente y ritmo viaje/lectura. Este spec convierte esa Fase 1 en el portfolio completo: contenido, pantalla de carga, bilingüe en vivo, móvil, accesibilidad y despliegue.

La razón de ser es la misma que la del fondo 3D de la Portada, llevada al todo: el argumento comercial de Sergio es "construyo cosas técnicamente vivas", y el portfolio es la prueba, no la promesa.

Decisiones ya tomadas con Sergio (no reabrir sin motivo):

- **Scroll narrativo 3D** (no fondo vivo, no mundo navegable libre).
- **Reemplaza a la web actual** como portfolio principal.
- **3D completo en PC y móvil**, con pantalla de carga cuidada de unos segundos que absorba la descarga.
- **Se continúa desde `spike/galeria-3d`**, no se empieza de cero.
- **Todo el recorrido es 3D**: héroe, demos, bio y contacto son paradas del viaje.
- **Bilingüe ES/EN con toggle en vivo** que cambia textos **y demos**: ES tiene 4 paradas de proyecto (fisio + barbería + dental + psicología), EN tiene 3 (fisio + dental US + law firm US), como hoy. La escena se reconfigura al cambiar de idioma, sin recarga, conservando el progreso fraccional del scroll.
- **`/en/` sirve la misma experiencia 3D arrancada en inglés** (no redirige): las dos rutas quedan indexables con hreflang, y el fallback estático de cada ruta va en su idioma.
- **Textos en híbrido**: titulares de sección flotando en 3D (CSS3D), texto de lectura en HUD fijo (DOM normal superpuesto).
- **Pantalla de carga = la escena se ensambla ante ti**, con progreso real.

## 2. El recorrido

Fondo oscuro coherente con la identidad actual (casi negro, un solo acento cálido). El scroll alterna **viaje** (la cámara se mueve entre paradas, easing cúbico) y **lectura** (cámara quieta, el contenido se despliega), con el mismo modelo de segmentos y `LERP_SCROLL` de la Fase 1. Paradas:

1. **Héroe** — la cámara arranca en plano general (establishing, como en la Fase 1). Titular flotante en 3D: "Diseño y construyo webs a medida para negocios que están hartos de parecer una plantilla". En HUD: subtítulo ("Estáticas, rápidas y sin nada que se pueda romper") y pista de scroll ("baja para empezar").
2. **Las demos** — cada una es una pantalla viva (iframe real, `pointer-events: none` para no robar la rueda — lección del spike) en la composición en curva existente. **ES tiene 4 paradas de proyecto** (Fisioymés, Navaja/barbería, Sereno/dental, Ancla/psicología); **EN tiene 3** (Fisioymés, dental US, law firm US) — es la oferta curada que ya existe en `site.ts`. Titular de proyecto flotante junto a su pantalla (nombre y rubro). En HUD durante su parada: descripción completa, badge EN VIVO / concepto y enlace "Abrir de verdad ↗". En su segmento de lectura, la demo scrollea por dentro (mecanismo ya implementado).
3. **Bio** — parada con titular flotante ("Quién soy" o similar). Los tres bloques actuales (EEBE/UPC, EY ciberseguridad, freelance) aparecen sucesivamente en HUD conforme avanza el scroll dentro del segmento.
4. **Contacto** — parada final: "Hablamos" flotante grande; en HUD el texto de cierre y el email `scharcoles@gmail.com` como CTA.

**HUD fijo siempre visible**: marca + toggle ES/EN arriba. El HUD es DOM normal (no canvas), así que los enlaces son enlaces de verdad, seleccionables y accesibles.

## 3. Pantalla de carga: la escena se ensambla ante ti

No es una cortinilla: es la primera escena. Al entrar, fondo negro y empieza el montaje en este orden:

1. Aparecen las partículas de fondo (fade-in).
2. Las pantallas del idioma activo (4 en ES, 3 en EN) entran volando una a una desde fuera de campo a sus posiciones de la curva.
3. Un indicador discreto muestra **progreso real**: módulo de three.js cargado + cada demo que termina de cargar su iframe (p. ej. "montando 3/4").

Reglas de tiempo:

- **Mínimo ~1,5-2 s** de montaje aunque todo cargue instantáneo — la secuencia tiene que lucirse.
- **Máximo ~6-8 s** de espera por las demos: si alguna no ha cargado, el viaje arranca igualmente y esa pantalla aparece en su sitio cuando su iframe termine (sin bloquear el recorrido).
- Al completarse, la cámara ya está colocada en el plano de apertura del héroe: no hay corte ni salto, la carga desemboca en el viaje.

## 4. Arquitectura técnica

- **Astro + three.js vanilla**, sin React ni react-three-fiber (decisión heredada de los specs anteriores). Dos renderers como en la Fase 1: `CSS3DRenderer` (pantallas + titulares flotantes) encima, `WebGLRenderer` (partículas/atmósfera) detrás — no comparten depth buffer, la mezcla es binaria por z-index (limitación conocida del spike, se acepta).
- El script inline de `galeria.astro` se refactoriza a módulos importables bajo `src/scripts/viaje/`:
  - `escena.js` — renderers, cámara, resize, loop, pausa por `visibilitychange`.
  - `recorrido.js` — definición de paradas, segmentos viaje/lectura, easing, mapeo scroll→cámara.
  - `pantallas.js` — creación de las pantallas CSS3D con sus iframes, rim de acento (border, no box-shadow — gotcha documentado en el spike), scroll interno de lectura.
  - `titulares.js` — titulares flotantes como objetos CSS3D (héroe, proyectos, bio, contacto).
  - `carga.js` — secuencia de montaje + progreso real + reglas de tiempo de §3.
  - `hud.js` — textos DOM superpuestos, visibilidad por segmento, toggle ES/EN en vivo.
- `src/pages/index.astro` pasa a ser la experiencia 3D arrancada en español y `src/pages/en/index.astro` la misma experiencia arrancada en inglés (mismo componente de página, distinto idioma por defecto). Las dos rutas se generan como HTML estático, conservan los hreflang recíprocos y su contenido de fallback va en su idioma. Ya no hay redirección de `/en/` a `/`.
- **Textos: única fuente `src/config/site.ts`** (ya bilingüe). El toggle ES/EN en vivo re-renderiza los textos del HUD y los titulares flotantes **y reconstruye las paradas de proyecto**: se retiran las pantallas del idioma saliente y se crean las del entrante (ES 4 / EN 3, con sus iframes), se recalculan los segmentos viaje/lectura y se conserva el progreso fraccional del scroll (`scrollY / totalPx` antes = después), sin recargar la página. Las demos nuevas cargan en segundo plano; si el usuario llega a una parada cuya demo aún no ha cargado, la pantalla muestra su estado de carga (mismo tratamiento que en el montaje inicial).
- **SEO/accesibilidad**: todo el contenido textual existe en el DOM real (el HUD). Los iframes llevan `title`. `<noscript>` con el contenido en texto plano.

## 5. Móvil, rendimiento y accesibilidad

- **Misma escena completa en móvil** (decisión de Sergio). La curva, distancias de parada y encuadres se recalculan según el aspect ratio del viewport (la fórmula `D_PARADA` de la Fase 1 ya es geométrica; hay que parametrizar la curva para aspect vertical). `devicePixelRatio` con tope 1.5-2.
- Pausa del render loop con `visibilitychange` (heredado del fondo 3D). Si el loop completo está quieto (scroll estable), los renders de CSS3D/WebGL siguen corriendo por las partículas — se evalúa congelar también ese micro-movimiento si el FPS móvil lo pide.
- **`prefers-reduced-motion: reduce` o WebGL no disponible → versión estática** del contenido (texto sobre fondo oscuro, equivalente en contenido a la web actual), sin errores visibles. Es la misma filosofía del fallback del spec del fondo 3D, pero aquí el fallback es toda la página.
- **Expectativa honesta sobre Lighthouse móvil:** con 4 demos vivas en iframes + WebGL continuo, el ≥90 defendido en specs anteriores **no es realista y se abandona como criterio** para esta versión. La pantalla de carga absorbe el coste percibido. El criterio de rendimiento pasa a ser: **FPS ≥ 50 durante el viaje en un móvil de gama media** (medido con la instrumentación `__fps` que ya existe) y tiempo hasta pantalla de carga visible < 1 s.

## 6. Verificación

Se extiende `scripts/verificar.mjs` (Puppeteer contra `npm run servir`, ya arnesado) con:

1. El canvas WebGL y el contenedor CSS3D existen en el DOM tras cargar.
2. Cero errores de consola con la escena activa.
3. Las demos del idioma activo cargan (`__galeria.demosLoaded()`): 4 en ES, 3 en EN.
4. La API `__galeria` (ya existente, se mantiene) expone las paradas; el scroll de lectura mueve el scroll interno de la demo (`getDemoScrollY`).
5. El toggle ES/EN, sin recargar la página: cambia los textos del HUD y los titulares, reconstruye las paradas (EN deja 3 pantallas, con `demo-dental-us` y `demo-lawfirm-us`) y conserva el progreso fraccional del scroll.
6. Con `prefers-reduced-motion: reduce` emulado, se sirve el fallback estático (sin canvas, sin errores, contenido completo visible).
7. La pantalla de carga aparece primero, muestra progreso y desemboca en el héroe sin salto de cámara.
8. `/en/` sirve la experiencia 3D arrancada en inglés (textos en inglés, 3 demos) y los hreflang recíprocos siguen apuntando a rutas reales que responden 200.

Medición manual antes de publicar: FPS en móvil real o emulado exigente, y pasada completa del recorrido en desktop y móvil.

## 7. Fuera de alcance

- Controles orbitales o cualquier manipulación directa de la escena (heredado).
- Post-procesado (bloom, etc.), sonido, modelos GLTF.
- Interactuar *dentro* de las demos (clicks, formularios) desde el recorrido — para eso está "Abrir de verdad ↗".
- Contenido nuevo: textos, proyectos y demos son los actuales.
- Migrar el resto de páginas del sitio a 3D.

## 8. Criterios de aceptación

1. La home es un viaje 3D continuo con las 5 paradas de §2, ritmo viaje/lectura y demos vivas scrolleando por dentro en su parada.
2. Pantalla de carga con montaje de la escena y progreso real, respetando los tiempos de §3.
3. Toggle ES/EN en vivo funcional en todos los textos (HUD + titulares flotantes), sin recarga.
4. Misma experiencia en móvil y desktop, con encuadres correctos en ambos y FPS ≥ 50 en móvil de gama media.
5. `prefers-reduced-motion` y ausencia de WebGL sirven el fallback estático completo, sin errores.
6. Todos los checks de `scripts/verificar.mjs` en verde.
7. `/en/` sirve la misma experiencia 3D arrancada en inglés (3 demos, textos EN), con hreflang recíprocos válidos.
