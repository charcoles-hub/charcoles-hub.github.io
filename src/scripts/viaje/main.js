// Guardián de la experiencia 3D. Decide si se arranca el viaje o se queda la
// web estática. Sin reduced-motion y con WebGL2 disponible, monta la escena.
export async function iniciar() {
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducir) return;
  const canvas = document.getElementById('webgl');
  if (!canvas) return;
  // Se sondea SOLO webgl2 porque three (r163+) lo exige: aceptar webgl v1
  // dejaría pasar dispositivos donde WebGLRenderer lanza después. Y se sondea
  // con un canvas DESECHABLE, no con #webgl: getContext fija los atributos del
  // contexto en la primera llamada, y es el renderer quien debe crear el
  // contexto del canvas visible con los suyos ({ alpha, antialias }).
  let gl = null;
  try {
    gl = document.createElement('canvas').getContext('webgl2');
  } catch {
    // getContext también puede LANZAR (GPU capada por el driver), no solo
    // devolver null. Sin WebGL2 la home se queda estática, sin errores.
  }
  if (!gl) return;
  const { montarViaje } = await import('./montar.js');
  window.__viaje = await montarViaje(window.__VIAJE_CONFIG);
}
