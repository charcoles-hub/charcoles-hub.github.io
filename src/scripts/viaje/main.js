// Guardián de la experiencia 3D. Decide si se arranca el viaje o se queda la
// web estática. Sin reduced-motion y con WebGL disponible, monta la escena.
export async function iniciar() {
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducir) return;
  const canvas = document.getElementById('webgl');
  if (!canvas) return;
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  if (!gl) return;
  const { montarViaje } = await import('./montar.js');
  window.__viaje = await montarViaje(window.__VIAJE_CONFIG);
}
