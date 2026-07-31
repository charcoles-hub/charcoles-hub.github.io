// El corazón del viaje: composición en curva, paradas encuadradas
// geométricamente y ritmo viaje/lectura gobernado por el scroll.
// Portado de la Fase 1 (galeria.astro, rama spike/galeria-3d) con tres
// cambios: la distancia de parada encuadra ANCHO y ALTO (en vertical la
// pantalla de 1440px se salía por los lados), hay paradas sin pantalla
// (héroe, bio, contacto), y el recorrido se puede reconstruir en vivo
// (cambio de idioma).
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
  { x: -420, y: 20, ry: 0.4 },   // bio
  { x: 400, y: -30, ry: -0.44 }, // contacto
];
const ESTABLISHING_MULT = 2.2; // cuánto más lejos que la parada arranca la cámara
const ESTABLISHING_Y = 220;
const VH_VIAJE = 130;        // alto de página (vh) por segmento de viaje
const VH_HERO = 80;          // héroe: presentación, se lee de un vistazo
const VH_BIO = 160;          // bio: 3 párrafos que se revelan dentro del segmento
const VH_CONTACTO = 110;     // contacto: CTA, sin más
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

export function crearRecorrido(proyectosIniciales, camera) {
  let stops, camStart, segmentos, limites, totalPx;
  const currentTarget = new THREE.Vector3();

  function construye(proyectos) {
    const aspect = innerWidth / innerHeight;
    const D = distanciaParada(aspect);
    // En vertical la curva se estrecha: con los X de escritorio las pantallas
    // quedarían fuera de plano al pasar de largo.
    const factorX = Math.min(1, aspect / 1.4);

    const paraStop = (stop) => {
      const n = normal(stop.ry);
      stop.camPos = new THREE.Vector3(stop.x + n.x * D, stop.y, stop.z + n.z * D);
      stop.target = new THREE.Vector3(stop.x, stop.y, stop.z);
      return stop;
    };

    stops = proyectos.map((p, i) =>
      paraStop({ tipo: 'proyecto', i, ruta: p.ruta, alto: p.alto, x: CURVA[i].x * factorX, y: CURVA[i].y, z: -i * SPACING_Z, ry: CURVA[i].ry })
    );
    // Bio y contacto: paradas sin pantalla, siguen la serpiente de la curva.
    const nProy = proyectos.length;
    for (const [k, tipo] of ['bio', 'contacto'].entries()) {
      const i = nProy + k;
      stops.push(paraStop({ tipo, i, x: CURVA[i].x * factorX, y: CURVA[i].y, z: -i * SPACING_Z, ry: CURVA[i].ry }));
    }

    const n0 = normal(stops[0].ry);
    camStart = {
      camPos: new THREE.Vector3(
        stops[0].x + n0.x * D * ESTABLISHING_MULT,
        stops[0].y + ESTABLISHING_Y,
        stops[0].z + n0.z * D * ESTABLISHING_MULT
      ),
      target: stops[0].target.clone(),
    };

    const idStop = (s) => (s.tipo === 'proyecto' ? `proyecto-${s.i}` : s.tipo);
    const vhDe = (s) =>
      s.tipo === 'proyecto' ? vhLectura(s.alto) : s.tipo === 'bio' ? VH_BIO : VH_CONTACTO;

    segmentos = [{ tipo: 'lectura', id: 'hero', fija: camStart, vh: VH_HERO }];
    stops.forEach((s, i) => {
      const from = i === 0 ? camStart : stops[i - 1];
      segmentos.push({ tipo: 'viaje', id: `viaje-a-${idStop(s)}`, from, to: s, vh: VH_VIAJE });
      segmentos.push({ tipo: 'lectura', id: idStop(s), stopIndex: i, vh: vhDe(s) });
    });

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

  construye(proyectosIniciales);
  camera.position.copy(camStart.camPos);
  currentTarget.copy(camStart.target);
  camera.lookAt(currentTarget);

  // Resize: solo se recalculan las alturas (vh → px); la geometría de las
  // paradas no cambia salvo que cambie el idioma (reconstruir).
  function recalcula() {
    let acc = 0;
    limites = limites.map((seg) => {
      const alturaPx = (seg.vh / 100) * innerHeight;
      const item = { ...seg, start: acc, end: acc + alturaPx };
      acc += alturaPx;
      return item;
    });
    totalPx = acc;
    document.body.style.height = `${totalPx + innerHeight}px`;
  }

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
      const parada = seg.fija ?? stops[seg.stopIndex];
      camera.position.copy(parada.camPos);
      currentTarget.copy(parada.target);
    }
    camera.lookAt(currentTarget);
    return { seg, t };
  }

  // Proyecta el alto real de la pantalla i a coordenadas de viewport, con la
  // cámara donde esté — el arnés lo usa para certificar encuadres.
  const v = new THREE.Vector3();
  function encuadreParada(i, cam) {
    const s = stops[i];
    const mitad = (IFRAME_H * SCALE) / 2;
    const top = v.set(s.x, s.y + mitad, s.z).project(cam).y;
    const bottom = v.set(s.x, s.y - mitad, s.z).project(cam).y;
    return Math.abs(top - bottom) / 2; // NDC → fracción del alto de viewport
  }

  return {
    get stops() { return stops; },     // cambian al reconstruir: getter, no copia
    get camStart() { return camStart; },
    aplicar,
    recalcula,
    reconstruir: (proyectos) => construye(proyectos),
    encuadreParada,
    totalPx: () => totalPx,
    limites: () => limites.map((l) => ({ tipo: l.tipo, id: l.id, stopIndex: l.stopIndex, start: l.start, end: l.end })),
    paradaMidY: (i) => {
      const seg = limites.find((l) => l.tipo === 'lectura' && l.stopIndex === i);
      return seg ? (seg.start + seg.end) / 2 : null;
    },
    segmentoMidY: (id) => {
      const seg = limites.find((l) => l.id === id);
      return seg ? (seg.start + seg.end) / 2 : null;
    },
    zMin: () => stops[stops.length - 1].z - 800,
    zMax: () => 800,
  };
}
