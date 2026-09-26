# Rediseño «El Eixample de noche» (septiembre 2026)

Tercera vuelta al diseño: de «correcto» a «de otra liga». El sistema completo está en `DESIGN.md`. Se hizo con la skill `estudio-web`.

## Qué cambia

- **Concepto.** La cuadrícula de Cerdà de noche, dibujada en tiempo real con WebGL (`src/scripts/noche.ts`):
  - manzanas con chaflán y ventanas encendidas;
  - calles de luz ámbar con tráfico;
  - la Diagonal y un horizonte cálido.

  La cámara avanza con el scroll y sigue al ratón. El fondo tiene botón de pausa.
- **Sistema visual:**
  - tema nocturno en todas las páginas;
  - Archivo variable (peso y anchura) para todo, y Newsreader cursiva solo para citas;
  - un único acento: el ámbar de farola;
  - chaflán en botones y marcos, y grano de película.

  Las fuentes se sirven desde `public/fonts/`. Inter e Instrument Serif se quedan solo para `npm run imagenes`.
- **Portada:**
  - titular enorme que entra por líneas;
  - caso real anclado, con la web de Fisioymés recorriéndose dentro de un portátil y un teléfono y los tres pasos iluminándose;
  - reseña que se enciende palabra a palabra;
  - galería horizontal de conceptos por sector;
  - índice de servicios, proceso en tarjetas apiladas, sobre mí y contacto en ámbar a sangre.
- **Movimiento:** GSAP (ScrollTrigger y SplitText) + Lenis en `src/scripts/premium.ts`, cargado desde `Layout.astro`, con unos 54 KB gzip en total.
- **Captura móvil real de Fisioymés:** `src/assets/posters/fisioymes-movil.png`, sin banner de cookies.

## Decisiones que conviene conocer

- **Portada con JavaScript, con mejora progresiva.** Todo el contenido está en el HTML y se ve sin script:
  - un script en línea marca `html.mov` solo si va a haber movimiento, y lo quita a los 2,5 s si el módulo no arranca;
  - con `prefers-reduced-motion` no hay scroll suave ni anclajes, y el fondo es un fotograma fijo;
  - en táctil, el scroll es el nativo.

  `scripts/check-build.mjs` ya no exige cero scripts. Ahora exige solo datos estructurados, módulos diferidos y el marcador en línea, y además que no haya contenido oculto en el HTML.
- **Galería sin movimiento:** es un scroll horizontal nativo. Solo con movimiento se ancla.
- **Honestidad:** Fisioymés es el único cliente real; los sectores se etiquetan como concepto en cada tarjeta.

## Verificación

- `npm run build && node scripts/check-build.mjs`: 25 páginas, PASS.
- Las 25 páginas a 390 y 1440 px pasadas por `inspeccionar.mjs` (Edge):
  - sin scroll horizontal, sin textos bajo contraste AA medible, sin errores de consola ni peticiones fallidas;
  - la acción principal se ve sin scroll en las portadas (castellano, catalán e inglés).
- Revisado con y sin movimiento.

## Pendiente

- `og.jpg` sigue con el diseño anterior: actualizar `scripts/generar-imagenes.mjs` al tema nocturno.
- Algunas páginas interiores tienen etiquetas propias en mayúsculas (`proyectos/fisioymes`, `PaginaDecision`).
- Las demos de concepto muestran cifras y reseñas de ejemplo que parecen reales.
