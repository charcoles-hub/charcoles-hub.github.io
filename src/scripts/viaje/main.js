// Guardián de la experiencia 3D. Decide si se arranca el viaje o se queda la
// web estática. En Task 1 todavía no arranca nada: solo deja la decisión
// tomada para el test del fallback. El boot llega en la Task 2.
export async function iniciar() {
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducir) return;
  const canvas = document.getElementById('webgl');
  if (!canvas) return;
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  if (!gl) return;
  // Task 2: aquí va el import dinámico de montar.js y html.viaje3d.
}
