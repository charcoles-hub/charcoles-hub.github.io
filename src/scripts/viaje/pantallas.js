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
