// Orquestador del viaje. Lo carga main.js con import dinámico SOLO cuando el
// guardián da el visto bueno: three.js no pesa en el primer pintado del
// fallback estático. Las tasks siguientes van añadiendo piezas aquí.
import { crearEscena } from './escena.js';

export async function montarViaje(cfg) {
  document.documentElement.classList.add('viaje3d');
  const escena = crearEscena(
    document.getElementById('webgl'),
    document.getElementById('css3d-container')
  );
  escena.setPuntos(-6000, 800); // rango provisional; la Task 4 lo calcula de verdad
  return { escena, cfg };
}
