export const site = {
  nombre: 'Sergio García Ortiz',
  rol: 'Diseñador web',
  lugar: 'Barcelona',
  titulo: 'Sergio García Ortiz — Diseñador web en Barcelona',
  descripcion:
    'Diseño y construyo webs a medida para negocios que están hartos de parecer una plantilla. Estáticas, rápidas y sin nada que se pueda romper.',
  email: 'scharcoles@gmail.com',
} as const;

export const bio = {
  // El titular lleva el ARGUMENTO; los párrafos llevan las credenciales. No los
  // dupliques: la versión anterior repetía los "dos años" que el primer párrafo
  // ya cuenta, y encima abría por el eje donde Sergio pierde (una agencia siempre
  // pondrá un número mayor). Esto es lo único que una agencia no puede decir.
  // OJO: aquí NO va ninguna cifra que Sergio no haya confirmado. Hubo un titular
  // con "llevo diez años haciendo webs" que era inventado. Ver spec §2.
  titular: 'Tu web la va a hacer quien está hablando contigo.',
  parrafos: [
    'Durante dos años llevé el diseño y la gestión de contenidos de la web de la EEBE, la escuela de ingeniería de la UPC, con una beca de aprendizaje. No fue una pantalla bonita y adiós: fue mantener algo vivo, todos los días, para una institución exigente.',
    'Después pasé un año en ciberseguridad en EY. Aprendí cómo se rompen las cosas por dentro, y volví al diseño porque es lo que quiero hacer.',
    'Ahora trabajo por mi cuenta. Cuando me escribes, te contesto yo. Cuando hacemos la llamada, estoy yo. No hay un gestor de cuentas en medio ni un becario montándote la web mientras el comercial te enseña otra cosa.',
  ],
} as const;

export const metodo = {
  titular: 'Construyo webs que no se pueden romper.',
  parrafos: [
    // Sin "esta semana": las referencias temporales caducan y esta ya era falsa
    // (el hallazgo fue del 3 de julio, no de la semana en que se escribió).
    // Y era "apuestas", no "casino" — si afirmas algo concreto, que sea exacto.
    'Tu web actual es probablemente WordPress con veinte plugins que llevan meses sin actualizar. Cada uno es una puerta. Cuando una cede, tu dominio acaba redirigiendo a una web de apuestas y tus pacientes ven eso en vez de tu clínica. Le ha pasado a una clínica dental de aquí al lado.',
    'Yo entrego archivos estáticos. No hay base de datos que inyectar, ni plugins que actualizar, ni panel de administración que reventar. No es una promesa de marketing: es que no existe la puerta.',
    'De propina, va rápida. Un archivo estático se sirve desde el borde de la red y aparece antes de que tu visitante se plantee irse.',
  ],
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
    // EL ÚNICO CLIENTE REAL. Va primero y con etiqueta 'cliente' — ver spec §2.
    // Sergio confirmó el 2026-07-16 que Fisioymés dio permiso para publicarla.
    // Sin ese permiso, esto NO puede llevar su marca: se anonimiza o se saca.
    n: '01',
    nombre: 'Fisioymés',
    rubro: 'Fisioterapia · Sant Cugat del Vallès',
    descripcion:
      'Vinieron con una queja concreta: en el móvil su web era todo letra y scroll sin fin. La rehíce entera en catalán y castellano, con las lesiones en rejilla y los tratamientos en fichas — y sin tocarles el sistema de reservas que ya usaban.',
    slug: 'fisioymes',
    url: 'https://charcoles-hub.github.io/fisioymes/',
    ruta: '/fisioymes/',
    alto: 4687,
    etiqueta: 'cliente',
  },
  {
    n: '02',
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
    n: '03',
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
    n: '04',
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
