export type Lang = 'es' | 'en';

/**
 * Rutas de cada idioma. El español vive en la RAÍZ y no se mueve: es lo que ya
 * está indexado. El inglés cuelga de /en/ como ruta estática de Astro — nada de
 * conmutar por JS ni de olfatear el idioma del navegador, porque las dos
 * versiones tienen que indexarse por separado.
 */
export const rutas: Record<Lang, string> = { es: '/', en: '/en/' };
export const ogLocale: Record<Lang, string> = { es: 'es_ES', en: 'en_US' };

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
   * (2026-07-16; las dos demos US, 2026-07-18. Ver `scripts/medir-demos.mjs`).
   * De aquí sale cuánto scroll necesita cada proyecto para recorrerse entero.
   * Si retocas una demo, vuelve a medir: un número obsoleto deja el recorrido
   * corto o pasado.
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

// --- Proyectos ---------------------------------------------------------------
// Los mismos negocios, contados en cada idioma. La ficha (slug, ruta, alto,
// etiqueta) es la misma; lo que cambia es el texto. La versión inglesa enseña
// las dos demos hechas para mercado US en vez de las tres españolas: el cliente
// real va primero en las dos, porque es la única prueba de trabajo pagado.

const fisioymesES: Proyecto = {
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
};

const proyectosES: Proyecto[] = [
  fisioymesES,
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

const proyectosEN: Proyecto[] = [
  {
    ...fisioymesES,
    rubro: 'Physical therapy · Barcelona, Spain',
    descripcion:
      'They came with one specific complaint: on a phone, their site was all text and endless scrolling. I rebuilt it from scratch in Catalan and Spanish, with injuries in a grid and treatments on cards — and without touching the booking system they already used.',
  },
  {
    n: '02',
    nombre: 'Ridgeline Family Dental',
    rubro: 'Dentistry · Boise, Idaho',
    descripcion:
      'Most dental sites hide the price. This one leads with it: a flat first visit, the insurance plans spelled out, and starting prices published on the page instead of behind a phone call.',
    slug: 'demo-dental-us',
    url: 'https://charcoles-hub.github.io/demo-dental-us/',
    ruta: '/demo-dental-us/',
    alto: 7354,
    etiqueta: 'concepto',
  },
  {
    n: '03',
    nombre: 'Hartwell & Vance',
    rubro: 'Injury law · Charlotte, North Carolina',
    descripcion:
      'A personal injury firm has seconds to be believed. Case results up front with the county and the year, practice areas that say what actually happens, and the disclaimers where a real firm has to put them.',
    slug: 'demo-lawfirm-us',
    url: 'https://charcoles-hub.github.io/demo-lawfirm-us/',
    ruta: '/demo-lawfirm-us/',
    alto: 7262,
    etiqueta: 'concepto',
  },
];

// --- Copy --------------------------------------------------------------------

export const contenido = {
  es: {
    site: {
      nombre: 'Sergio García Ortiz',
      rol: 'Diseñador web',
      lugar: 'Barcelona',
      titulo: 'Sergio García Ortiz — Diseñador web en Barcelona',
      descripcion:
        'Diseño y construyo webs a medida para negocios que están hartos de parecer una plantilla. Estáticas, rápidas y sin nada que se pueda romper.',
      email: 'scharcoles@gmail.com',
    },
    // La cuenta tiene que cuadrar con `proyectos`: decía "Tres" con cuatro
    // proyectos en la página.
    portadaPie: 'Cuatro proyectos · en vivo ↓',
    bio: {
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
    },
    metodo: {
      titular: 'Construyo webs que no se pueden romper.',
      parrafos: [
        // Sin "esta semana": las referencias temporales caducan y esta ya era falsa
        // (el hallazgo fue del 3 de julio, no de la semana en que se escribió).
        // Y era "apuestas", no "casino" — si afirmas algo concreto, que sea exacto.
        'Tu web actual es probablemente WordPress con veinte plugins que llevan meses sin actualizar. Cada uno es una puerta. Cuando una cede, tu dominio acaba redirigiendo a una web de apuestas y tus pacientes ven eso en vez de tu clínica. Le ha pasado a una clínica dental de aquí al lado.',
        'Yo entrego archivos estáticos. No hay base de datos que inyectar, ni plugins que actualizar, ni panel de administración que reventar. No es una promesa de marketing: es que no existe la puerta.',
        'De propina, va rápida. Un archivo estático se sirve desde el borde de la red y aparece antes de que tu visitante se plantee irse.',
      ],
    },
    contacto: {
      eyebrow: 'Hablamos',
      titular: '¿Tu web se parece a la de todos?',
      texto:
        'Cuéntame qué tienes y qué te gustaría. Te digo qué haría y cuánto cuesta, sin compromiso y sin rodeos.',
    },
    proyecto: {
      trabajo: 'El trabajo',
      concepto: (n: string) => `Proyecto ${n} — concepto`,
      cliente: 'Cliente',
      proyectoN: (n: string) => `Proyecto ${n}`,
      notaConcepto:
        'Negocio inventado, diseño real. Lo hice para enseñar cómo trabajo, no para un cliente.',
      notaCliente: 'Encargo real, en producción. Publicado aquí con su permiso.',
      abrir: 'Abrir de verdad ↗',
      envivo: 'EN VIVO',
    },
    proyectos: proyectosES,
  },

  en: {
    site: {
      nombre: 'Sergio García Ortiz',
      rol: 'Web designer',
      lugar: 'Barcelona, Spain',
      titulo: 'Sergio García Ortiz — Web designer in Barcelona',
      descripcion:
        'I design and build custom websites for businesses tired of looking like a template. Static, fast, and with nothing that can break.',
      email: 'scharcoles@gmail.com',
    },
    portadaPie: 'Three projects · live ↓',
    bio: {
      // Mismo argumento que en español, no un calco: lo que una agencia no puede
      // decir. Y las mismas reglas — ni una cifra ni una credencial que no esté
      // confirmada. Si en inglés falta un dato, se reformula sin él.
      titular: 'The person you talk to is the person who builds your site.',
      parrafos: [
        // "EEBE" y "UPC" no dicen nada fuera de España: hay que situar la escuela
        // sin inflarla. Sigue siendo una beca de aprendizaje, y se dice.
        'For two years I ran the design and content management for the website of EEBE, a large public engineering school in Barcelona, part of the Polytechnic University of Catalonia. It was a student traineeship. It was not one pretty screen and done: it was keeping something alive, every day, for a demanding institution.',
        'After that I spent a year in cybersecurity at EY. I learned how things break from the inside, and I came back to design because design is what I want to do.',
        'Now I work for myself. You email me, I answer. We get on a call, it is me on the call. There is no account manager in the middle, and no intern building your site while a salesperson shows you something else.',
      ],
    },
    metodo: {
      titular: 'I build websites with nothing to break into.',
      parrafos: [
        'Your current site is probably WordPress with twenty plugins nobody has updated in months. Every one of them is a door. When one gives, your domain ends up redirecting to a sports betting site, and your patients see that instead of your clinic. It happened to a dental practice down the street from me.',
        'I ship static files. There is no database to inject, no plugins to update, no admin panel to break into. That is not a marketing promise. The door simply does not exist.',
        'It is fast, too. A static file is served from the edge of the network and shows up before your visitor thinks about leaving.',
      ],
    },
    contacto: {
      eyebrow: "Let's talk",
      titular: "Does your website look like everyone else's?",
      texto:
        "Tell me what you have and what you want. I will tell you what I would do and what it costs. No obligation, no runaround.",
    },
    proyecto: {
      trabajo: 'The work',
      concepto: (n: string) => `Project ${n} — concept`,
      cliente: 'Client',
      proyectoN: (n: string) => `Project ${n}`,
      // Los negocios inventados siguen marcados como concepto en inglés. No se
      // presentan como clientes. Ver spec §2.
      notaConcepto:
        'Invented business, real design. I built it to show how I work, not for a client.',
      notaCliente: 'Real engagement, in production. Published here with their permission.',
      abrir: 'Open the real one ↗',
      envivo: 'LIVE',
    },
    proyectos: proyectosEN,
  },
} as const;

export type Contenido = (typeof contenido)[Lang];
