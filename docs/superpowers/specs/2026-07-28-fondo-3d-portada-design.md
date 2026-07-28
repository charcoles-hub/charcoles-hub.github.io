# Fondo 3D en la Portada — diseño

**Fecha:** 2026-07-28
**Estado:** diseño validado, pendiente de plan de implementación
**Repo destino:** `charcoles-hub/charcoles-hub.github.io`

---

## 1. Qué es esto y para qué

La Portada (`Portada.astro`) es hoy solo tipografía sobre fondo casi negro. Se añade una escena three.js de fondo, contenida en esa sección, para dar un momento "wow" al entrar en la web sin tocar la tipografía que ya está afinada (ver [spec de la web personal](2026-07-16-web-personal-sergio-design.md)). Encaja con el argumento de "Cómo trabajo": Sergio construye cosas técnicamente vivas, y esta es una prueba más, no una promesa.

**Alcance: solo la sección Portada.** El resto de secciones (Trabajo, Bio, Cómo trabajo, Contacto) no llevan 3D — necesitan fondo sólido y legible para el póster vivo de las demos, que ya es la pieza central del sitio.

## 2. La escena

- Un icosaedro de subdivisión baja (~1-2k triángulos tras subdividir), con `ShaderMaterial` propio: ruido simplex desplazando los vértices en el vertex shader a lo largo del tiempo, para que la superficie "respire" en vez de ser una malla estática.
- Wireframe fino en `--color-tenue`, relleno casi transparente, con un rim light insinuado en `--color-acento` en los bordes (fresnel simple en el fragment shader). Nada de color plano ni de degradados — coherente con "un solo acento cálido, el resto casi negro" del spec de la web.
- Rotación lenta y constante en dos ejes.
- Cámara fija, sin controles orbitales — esto no es una demo interactiva de manipular, es atmósfera.

## 3. Interacción

- **Desktop:** parallax mínimo de cámara según la posición del ratón dentro de la sección (unos pocos grados de desplazamiento, tope bajo — igual que el tope de 3° del póster vivo, este efecto se nota mal si se pasa).
- **Móvil/táctil:** sin parallax de puntero (no hay ratón). Solo la respiración del shader y la rotación constante.
- **Scroll:** al salir la Portada del viewport, la escena se atenúa (opacity) y el render loop se pausa — ver §4.

## 4. Rendimiento y accesibilidad

El sitio tiene un listón ya medido y defendido: Lighthouse móvil ≥ 90 (criterio de aceptación del spec de la web personal). Este componente no puede tirarlo abajo:

- **`prefers-reduced-motion: reduce`** → se pinta un único frame estático (sin desplazamiento de vértices, sin rotación, sin rAF). No es opcional.
- **`IntersectionObserver`** sobre la sección Portada: fuera de vista, el `requestAnimationFrame` se detiene. No sigue girando gratis mientras alguien lee "Cómo trabajo".
- **`visibilitychange`**: pestaña oculta → loop pausado.
- Malla ligera de sobra para gama baja; sin post-procesado (bloom, etc.) que dispare el coste de fill-rate en móvil.
- Inicialización de three.js diferida hasta después del primer pintado (no bloquea el LCP del `<h1>`, que ya tiene su propia animación de entrada).
- Si WebGL no está disponible, la sección se queda como está hoy (solo tipografía) — sin mensaje de error visible, sin romper nada.

## 5. Arquitectura

- Una única dependencia nueva: `three` (no se añade react-three-fiber ni ninguna capa: el sitio es Astro puro, sin React, y es un solo componente).
- Componente `Fondo3D.astro`: `<canvas>` posicionado en la sección Portada (detrás del contenido, `pointer-events: none` igual que el póster vivo — no debe robar clics ni scroll), con un `<script type="module">` que monta la escena, el loop y los observers descritos arriba.
- Nada de esto toca `Trabajo.astro`, `Bio.astro`, `ComoTrabajo.astro` ni `Contacto.astro`.

## 6. Verificación

Se extiende `scripts/verificar.mjs` (Puppeteer, ya arnesado contra `npm run servir`) con un caso más, en línea con los que ya existen:

- El `<canvas>` de `Fondo3D` existe en el DOM tras cargar.
- Cero errores de consola con la escena activa (viewport normal).
- Cero errores de consola con `prefers-reduced-motion: reduce` emulado, y el frame se queda estático (no hace falta medir píxeles, basta con que no haya errores del shader/loop en ese modo).

No se mide Lighthouse en este spec de forma automática — se mide a mano antes de publicar, igual que se hizo el 2026-07-16, comprobando que el número no baja de 90.

## 7. Fuera de alcance

3D en cualquier otra sección. Controles orbitales o cualquier manipulación directa de la escena. Post-procesado. Múltiples formas o escenas alternativas. Sonido.

## 8. Criterios de aceptación

1. Al entrar en la Portada, la escena 3D es visible y se nota "viva" (respiración + rotación), sin competir con la tipografía.
2. `prefers-reduced-motion` respetado: frame estático, sin animación.
3. Lighthouse móvil se mantiene ≥ 90 con la escena activa.
4. El resto de secciones no llevan 3D y no cambian.
5. Sin WebGL disponible, la Portada se degrada a su estado actual (solo texto), sin errores visibles.
