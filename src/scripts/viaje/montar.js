// Orquestador del viaje. Lo carga main.js con import dinámico SOLO cuando el
// guardián da el visto bueno: three.js no pesa en el primer pintado del
// fallback estático.
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
    const { crearHud } = await import('./hud.js');
    const { crearTitulares } = await import('./titulares.js');
    const { montarEscena } = await import('./carga.js');

    let lang = cfg.lang;
    const recorrido = crearRecorrido(cfg.datos[lang].proyectos, escena.camera);
    // stops trae también bio y contacto (sin pantalla): se filtra o colocar
    // escribe más allá del array de objetos.
    let pantallas = crearPantallas(escena.escenaCSS, cfg.datos[lang].proyectos);
    pantallas.colocar(recorrido.stops.filter((s) => s.tipo === 'proyecto'));
    let titulares = crearTitulares(escena.escenaCSS, recorrido, cfg.datos[lang]);
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

    const hud = crearHud({
      root: document.getElementById('hud'),
      datos: cfg.datos,
      langInicial: lang,
      onCambiarIdioma: cambiarIdioma,
    });

    // Toggle ES/EN en vivo: reconstruye paradas, pantallas, titulares y HUD
    // conservando el progreso fraccional del scroll (spec §4).
    async function cambiarIdioma(nuevo) {
      // Durante el montaje inicial el toggle se ignora: montarEscena ya capturó
      // los iframes viejos y destruirlos aplazaría el fin de la carga al
      // timeout, con el scroll bloqueado (hallazgo de la revisión final).
      if (nuevo === lang || !completa) return;
      const frac = recorrido.totalPx() ? scrollY / recorrido.totalPx() : 0;
      lang = nuevo;
      document.documentElement.lang = lang;
      document.title = cfg.datos[lang].site.titulo;

      titulares.destruir();
      pantallas.destruir();

      recorrido.reconstruir(cfg.datos[lang].proyectos);
      escena.setPuntos(recorrido.zMin(), recorrido.zMax());

      pantallas = crearPantallas(escena.escenaCSS, cfg.datos[lang].proyectos);
      pantallas.colocar(recorrido.stops.filter((s) => s.tipo === 'proyecto'));
      titulares = crearTitulares(escena.escenaCSS, recorrido, cfg.datos[lang]);

      hud.setIdioma(lang);
      // Conserva el progreso fraccional: mismo punto del viaje, otra longitud.
      scrollTo(0, frac * recorrido.totalPx());
      scrollTarget = scrollY;
      // Las demos nuevas cargan en segundo plano; si una parada llega antes que
      // su demo, la pantalla espera en negro con el rim, igual que en el montaje.
      pantallas.esperarCarga(7000);
    }

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
      hud.actualizar(seg, t);
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

    let completa = false;
    montarEscena({ escena, pantallas, nTotal: cfg.datos[lang].proyectos.length })
      .then(() => { completa = true; })
      // Hoy no hay camino de rechazo, pero si algún día lo hubiera, la regla es
      // "sin errores en consola": se degrada a viaje sin montaje, no a unhandled.
      .catch((e) => { completa = true; window.__viajeError = e; });

    return {
      escena,
      cfg,
      recorrido,
      hud,
      cambiarIdioma,
      cargaCompleta: () => completa,
      get pantallas() { return pantallas; },
      get titulares() { return titulares; },
    };
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
