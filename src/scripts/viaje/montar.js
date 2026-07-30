// Orquestador del viaje. Lo carga main.js con import dinámico SOLO cuando el
// guardián da el visto bueno: three.js no pesa en el primer pintado del
// fallback estático. Las tasks siguientes van añadiendo piezas aquí.
import { crearEscena } from './escena.js';

export async function montarViaje(cfg) {
  try {
    const escena = crearEscena(
      document.getElementById('webgl'),
      document.getElementById('css3d-container')
    );
    escena.setPuntos(-6000, 800); // rango provisional; la Task 4 lo calcula de verdad
    // La clase va DESPUÉS de construir la escena: es la señal que oculta el
    // contenido estático, así que solo puede ponerse cuando el 3D ya existe.
    document.documentElement.classList.add('viaje3d');
    return { escena, cfg };
  } catch (error) {
    // Si el renderer no se puede crear pese al sondeo del guardián (contexto
    // perdido, límite de contextos, driver caprichoso), la página se queda
    // estática: se retira la clase por si acaso y NO se re-lanza el error —
    // la regla es "fallback estático completo, sin errores en consola".
    document.documentElement.classList.remove('viaje3d');
    window.__viajeError = error; // inspeccionable a mano, sin ensuciar la consola
    return null;
  }
}
