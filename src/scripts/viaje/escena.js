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
