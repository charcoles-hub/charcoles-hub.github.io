// Orquestador del viaje. Lo carga main.js con import dinámico SOLO cuando el
// guardián da el visto bueno: three.js no pesa en el primer pintado del
// fallback estático. Las tasks siguientes van añadiendo piezas aquí.
import { crearEscena } from './escena.js';
import { IFRAME_H } from './pantallas.js';

const LERP_SCROLL = 0.12; // suavizado del seguimiento de scroll por frame

export async function montarViaje(cfg) {
  try {
    const escena = crearEscena(
      document.getElementById('webgl'),
      document.getElementById('css3d-container')
    );
    const { crearPantallas } = await import('./pantallas.js');
    const { crearRecorrido } = await import('./recorrido.js');

    const proyectos = cfg.datos[cfg.lang].proyectos;
    const recorrido = crearRecorrido(proyectos, escena.camera);
    const pantallas = crearPantallas(escena.escenaCSS, proyectos);
    // stops trae también bio y contacto (sin pantalla): se filtra o colocar
    // escribe más allá del array de objetos.
    pantallas.colocar(recorrido.stops.filter((s) => s.tipo === 'proyecto'));
    escena.setPuntos(recorrido.zMin(), recorrido.zMax());

    // La clase va DESPUÉS de construir la escena: es la señal que oculta el
    // contenido estático, así que solo puede ponerse cuando el 3D ya existe.
    document.documentElement.classList.add('viaje3d');

    let scrollTarget = 0;
    let scrollSmooth = 0;
    addEventListener(
      'scroll',
      () => { scrollTarget = Math.min(recorrido.totalPx(), Math.max(0, scrollY)); },
      { passive: true }
    );
    addEventListener('resize', () => {
      recorrido.recalcula();
      scrollTarget = Math.min(recorrido.totalPx(), scrollTarget);
    });

    escena.enCadaFrame(() => {
      scrollSmooth += (scrollTarget - scrollSmooth) * LERP_SCROLL;
      const { seg, t } = recorrido.aplicar(scrollSmooth);
      // Lectura: la demo scrollea por dentro. Solo en paradas de proyecto —
      // bio y contacto no tienen iframe.
      if (seg.tipo === 'lectura' && seg.stopIndex !== undefined && recorrido.stops[seg.stopIndex].tipo === 'proyecto') {
        const stop = recorrido.stops[seg.stopIndex];
        const sobra = Math.max(0, stop.alto - IFRAME_H);
        try {
          pantallas.iframes[seg.stopIndex].contentWindow.scrollTo(0, t * sobra);
        } catch { /* fisioymes es cross-origin en producción: se degrada sin scroll interno */ }
      }
    });

    // API para el arnés de verificación.
    window.__galeria = {
      limites: () => recorrido.limites(),
      paradaMidY: (i) => recorrido.paradaMidY(i),
      segmentoMidY: (id) => recorrido.segmentoMidY(id),
      totalPx: () => recorrido.totalPx(),
      getDemoScrollY: (i) => { try { return pantallas.iframes[i].contentWindow.scrollY; } catch { return null; } },
      demosLoaded: () => pantallas.cargadas(),
      fps: () => window.__fps,
      setScroll: (y) => scrollTo(0, y),
      camPos: () => ({ x: escena.camera.position.x, y: escena.camera.position.y, z: escena.camera.position.z }),
      encuadreParada: (i) => recorrido.encuadreParada(i, escena.camera),
    };

    const { montarEscena } = await import('./carga.js');
    let completa = false;
    montarEscena({ escena, pantallas, nTotal: proyectos.length }).then(() => { completa = true; });

    return { escena, cfg, pantallas, recorrido, cargaCompleta: () => completa };
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
