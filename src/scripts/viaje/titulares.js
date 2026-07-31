// Titulares de sección flotando en la escena (la mitad "teatro" del híbrido
// del spec §2). Son CSS3D: DOM de verdad proyectado en el espacio, mismo
// pipeline que las pantallas.
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { IFRAME_H, SCALE } from './pantallas.js';

const ALTO_PANTALLA_MUNDO = IFRAME_H * SCALE;

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

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
