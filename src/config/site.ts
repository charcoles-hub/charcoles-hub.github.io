export const site = {
  nombre: 'Sergio García Ortiz',
  rol: 'Diseñador web',
  lugar: 'Barcelona',
  titulo: 'Sergio García Ortiz — Diseñador web en Barcelona',
  descripcion:
    'Diseño y construyo webs a medida para negocios que están hartos de parecer una plantilla. Estáticas, rápidas y sin nada que se pueda romper.',
  email: 'scharcoles@gmail.com',
} as const;

export interface Proyecto {
  n: string;
  nombre: string;
  rubro: string;
  descripcion: string;
  url: string;
  /**
   * Ruta relativa a la demo. ES LO QUE USA EL IFRAME, y tiene que ser relativa:
   * en producción y bajo un dominio propio resuelve al mismo origen, que es lo
   * que permite scrollear la demo por dentro. Con la URL absoluta se rompería.
   */
  ruta: string;
  /** SIEMPRE 'concepto' mientras el negocio sea inventado. Ver spec §2. */
  etiqueta: 'concepto' | 'cliente';
  /** Slug del repo. Nombra la captura en `src/assets/posters/<slug>.png`. */
  slug: string;
  /**
   * Alto real de la demo renderizada a 1440px de ancho. MEDIDO, no estimado
   * (2026-07-16, ver `scripts/medir-demos.mjs`). De aquí sale cuánto scroll
   * necesita cada proyecto para recorrerse entero. Si retocas una demo,
   * vuelve a medir: un número obsoleto deja el recorrido corto o pasado.
   */
  alto: number;
}

/**
 * Cuántos píxeles de demo avanzan por cada píxel de scroll de la página.
 * ESTE ES EL MANDO DE CALIBRACIÓN del efecto: más alto = recorrido más
 * rápido y página más corta; más bajo = más pausado y página más larga.
 * 3 es el punto de partida, no un valor sagrado. Se ajusta MIRÁNDOLO
 * (Task 4 Step 6), que es la única forma de saber si el ritmo funciona.
 */
export const VELOCIDAD = 3;

export const proyectos: Proyecto[] = [
  {
    n: '01',
    nombre: 'Navaja',
    rubro: 'Barbería',
    descripcion:
      'Una barbería de barrio con alma de taberna. La carta se lee como un menú, el poste gira de verdad y el latón pesa.',
    slug: 'demo-barberia-navaja',
    url: 'https://charcoles-hub.github.io/demo-barberia-navaja/',
    ruta: '/demo-barberia-navaja/',
    alto: 4229,
    etiqueta: 'concepto',
  },
  {
    n: '02',
    nombre: 'Sereno',
    rubro: 'Clínica dental',
    descripcion:
      'Ir al dentista da respeto. La web no tenía por qué darlo también: petróleo y porcelana en vez del cian de siempre, y el tratamiento explicado como quien te lo cuenta sentado.',
    slug: 'demo-dental-sereno',
    url: 'https://charcoles-hub.github.io/demo-dental-sereno/',
    ruta: '/demo-dental-sereno/',
    alto: 6601,
    etiqueta: 'concepto',
  },
  {
    n: '03',
    nombre: 'Ancla',
    rubro: 'Psicología',
    descripcion:
      'Pedir ayuda cuesta. Aquí todo baja el pulso: ciruela y malva, mucho aire, y ni una sola foto de alguien mirando al horizonte.',
    slug: 'demo-psicologia-ancla',
    url: 'https://charcoles-hub.github.io/demo-psicologia-ancla/',
    ruta: '/demo-psicologia-ancla/',
    alto: 5224,
    etiqueta: 'concepto',
  },
];
