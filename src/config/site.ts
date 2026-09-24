export type Lang = 'es' | 'en' | 'ca';

/**
 * Rutas de cada idioma. El español vive en la RAÍZ y no se mueve: es lo que ya
 * está indexado. El inglés cuelga de /en/ como ruta estática de Astro — nada de
 * conmutar por JS ni de olfatear el idioma del navegador, porque las dos
 * versiones tienen que indexarse por separado.
 */
export const rutas: Record<Lang, string> = { es: '/', en: '/en/', ca: '/ca/' };
export const ogLocale: Record<Lang, string> = { es: 'es_ES', en: 'en_US', ca: 'ca_ES' };

/** Contacto real. El wa.me lleva el prefijo, el tel: también. */
export const TELEFONO = { humano: '620 650 597', tel: 'tel:+34620650597', wa: 'https://wa.me/34620650597' };

export interface Proyecto {
  nombre: string;
  rubro: string;
  descripcion: string;
  url: string;
  /** Slug del repo. Nombra la captura en `src/assets/posters/<slug>.png`. */
  slug: string;
}

// --- Proyectos ---------------------------------------------------------------

// EL ÚNICO CLIENTE REAL. Va primero, destacado y con chapa de cliente.
// Sergio confirmó el 2026-07-16 que Fisioymés dio permiso para publicarla.
// Sin ese permiso, esto NO puede llevar su marca: se anonimiza o se saca.
// Todo lo demás son conceptos y se declaran conceptos. Esta regla no se toca.
const fisioymes: Proyecto = {
  nombre: 'Fisioymés',
  rubro: 'Fisioterapia · Sant Cugat del Vallès',
  descripcion:
    'Vinieron con una queja concreta: en el móvil su web era todo letra y scroll sin fin. La rehíce entera en catalán y castellano, con las lesiones en rejilla y los tratamientos en fichas — y sin tocarles el sistema de reservas que ya usaban.',
  slug: 'fisioymes',
  url: '/proyectos/fisioymes/',
};

const demo = (slug: string, nombre: string, rubro: string, descripcion: string): Proyecto => ({
  nombre,
  rubro,
  descripcion,
  slug,
  url: `https://sergiogarciaweb.com/${slug}/`,
});

const demosES: Proyecto[] = [
  demo('demo-barberia-navaja', 'Navaja', 'Barbería',
    'Una barbería de barrio con alma de taberna: la carta se lee como un menú y el latón pesa.'),
  demo('demo-dental-sereno', 'Sereno', 'Clínica dental',
    'Ir al dentista da respeto. La web no tenía por qué darlo también: petróleo y porcelana en vez del cian de siempre.'),
  demo('demo-veterinaria-manada', 'Manada', 'Veterinaria · Esplugues',
    'Como en casa, con quirófano: urgencias 24 h contadas sin dramatismo y la cita a un toque.'),
  demo('demo-fisio-vital', 'Fisio Vital', 'Fisioterapia · Valencia',
    'La primera valoración sin compromiso como puerta de entrada, y cada lesión explicada en cristiano.'),
  demo('demo-gestoria-cauce', 'Cauce', 'Gestoría · Sant Joan Despí',
    'Fiscal, laboral y contable sin sustos ni jerga: lo que una gestoría promete de palabra, puesto por escrito.'),
  demo('demo-psicologia-ancla', 'Ancla', 'Psicología',
    'Pedir ayuda cuesta. Aquí todo baja el pulso: ciruela, malva y ni una foto de alguien mirando al horizonte.'),
  demo('demo-cafe-aurora', 'Aurora', 'Cafetería · Sevilla',
    'Tu café de cada mañana, hecho con calma. Una carta corta que apetece leer entera.'),
  demo('demo-gimnasio-pulso', 'Pulso', 'Gimnasio · Bilbao',
    'Entrenar con propósito, sin fotos de stock sudando: horarios claros y precios a la vista.'),
  demo('demo-arquitectos-traza', 'Traza', 'Arquitectura · Sant Just Desvern',
    'Un estudio que enseña obra, no palabrería: vivienda, reforma integral y dirección de obra.'),
  demo('demo-autoescuela-traza', 'Traza', 'Autoescuela · Sant Just Desvern',
    'El mismo profesor de principio a fin, y la primera clase reservada desde la propia web.'),
];

const demosEN: Proyecto[] = [
  demo('demo-dental-us', 'Ridgeline Family Dental', 'Dentistry · Boise, Idaho',
    'Most dental sites hide the price. This one leads with it: a flat first visit and starting prices on the page.'),
  demo('demo-lawfirm-us', 'Hartwell & Vance', 'Injury law · Charlotte, NC',
    'A personal injury firm has seconds to be believed: case results up front, with the county and the year.'),
];


const TRADUCCIONES_CA: Record<string, { rubro: string; descripcion: string }> =
  {
    "demo-barberia-navaja": {
      "rubro": "Barberia",
      "descripcion": "Una barberia de barri amb ànima de taverna: la carta es llegeix com un menú i el llautó pesa."
    },
    "demo-dental-sereno": {
      "rubro": "Clínica dental",
      "descripcion": "Anar al dentista fa respecte. El web no havia de fer-ne també: petroli i porcellana en lloc del cian de sempre."
    },
    "demo-veterinaria-manada": {
      "rubro": "Veterinària · Esplugues",
      "descripcion": "Com a casa, amb quiròfan: urgències 24 h explicades sense dramatisme i la cita a un toc."
    },
    "demo-fisio-vital": {
      "rubro": "Fisioteràpia · València",
      "descripcion": "La primera valoració sense compromís com a porta d'entrada, i cada lesió explicada en cristià."
    },
    "demo-gestoria-cauce": {
      "rubro": "Gestoria · Sant Joan Despí",
      "descripcion": "Fiscal, laboral i comptable sense ensurts ni argot: el que una gestoria promet de paraula, posat per escrit."
    },
    "demo-psicologia-ancla": {
      "rubro": "Psicologia",
      "descripcion": "Demanar ajuda costa. Aquí tot baixa el pols: pruna, malva i ni una foto d'algú mirant l'horitzó."
    },
    "demo-cafe-aurora": {
      "rubro": "Cafeteria · Sevilla",
      "descripcion": "El teu cafè de cada matí, fet amb calma. Una carta curta que ve de gust llegir sencera."
    },
    "demo-gimnasio-pulso": {
      "rubro": "Gimnàs · Bilbao",
      "descripcion": "Entrenar amb propòsit, sense fotos d'estoc suant: horaris clars i preus a la vista."
    },
    "demo-arquitectos-traza": {
      "rubro": "Arquitectura · Sant Just Desvern",
      "descripcion": "Un estudi que ensenya obra, no paraules: habitatge, reforma integral i direcció d'obra."
    },
    "demo-autoescuela-traza": {
      "rubro": "Autoescola · Sant Just Desvern",
      "descripcion": "El mateix professor de principi a fi, i la primera classe reservada des del mateix web."
    }
  };

const demosCA: Proyecto[] = demosES.map((p) => ({ ...p, ...TRADUCCIONES_CA[p.slug] }));
const fisioymesCA: Proyecto = { ...fisioymes, ...({"rubro": "Fisioteràpia · Sant Cugat del Vallès", "descripcion": "Van venir amb una queixa concreta: al mòbil el seu web era tot lletra i scroll sense fi. El vaig refer sencer en català i castellà, amb les lesions en graella i els tractaments en fitxes — i sense tocar-los el sistema de reserves que ja feien servir."}) };

// --- Reseñas -----------------------------------------------------------------

export interface Resena {
  texto: string;
  /** Traducción para /en/. Si falta, en inglés se muestra el original. */
  textoEn?: string;
  autor: string;
  cargo: string;
  estrellas: 1 | 2 | 3 | 4 | 5;
  url?: string;
  /** ISO (YYYY-MM-DD). Se muestra como «mes año». */
  fecha: string;
}

// MISMA REGLA QUE LOS PROYECTOS: aquí solo entran reseñas REALES, con permiso
// explícito de quien las escribe. Nada inventado, ni «de ejemplo». Mientras
// esté vacío, la sección enseña la invitación a escribir y ninguna tarjeta.
export const RESENAS: Resena[] = [];

// Web3Forms y NO FormSubmit: Protección Digital de Movistar bloquea
// formsubmit.co como phishing (verificado el 13-09-2026 desde la línea de
// Sergio), así que a cualquier cliente con Movistar le salía una pantalla de
// aviso al enviar. La clave es pública a propósito: identifica el buzón de
// destino, no da acceso a nada.
export const RESENA_FORM = {
  destino: 'https://api.web3forms.com/submit',
  clave: '5a2a409b-c60a-49a7-8f70-4a1282a1c1ab',
  gracias: { es: '/gracias/', en: '/en/thanks/', ca: '/ca/gracies/' },
} as const;

/** Revisión gratuita de una web: mismo buzón de Web3Forms, otra página de gracias. */
export const REVISION_FORM = {
  destino: RESENA_FORM.destino,
  clave: RESENA_FORM.clave,
  gracias: '/gracias-revision/',
} as const;

// --- Copy --------------------------------------------------------------------

export const contenido = {
  es: {
    site: {
      nombre: 'Sergio García Ortiz',
      rol: 'Diseñador web',
      lugar: 'Cornellà de Llobregat · Barcelona',
      titulo: 'Diseñador web freelance en Barcelona · Sergio García',
      descripcion:
        'Webs a medida, rápidas y pensadas para el móvil, para negocios de Barcelona y toda España. Trato directo, presupuesto en 24 h y revisión gratis de tu web.',
      email: 'info@sergiogarciaweb.com',
    },
    resenas: {
      eyebrow: 'Reseñas',
      titular: 'Lo que dicen los que ya la tienen.',
      texto: 'Escritas por ellos, publicadas tal cual. Ni retocadas ni resumidas.',
      titularVacio: 'Aquí todavía no hay ninguna reseña.',
      textoVacio:
        'Esta parte prefiero que la escriban ellos, así que de momento está vacía. Si hemos trabajado juntos, cuéntalo en dos líneas: la publico tal cual, con tu nombre y el de tu negocio.',
      nota: 'La escribes tú, la publico yo sin tocar una coma. Solo sale si me das permiso, y la quito el día que me lo pidas.',
      cta: 'Escribir una reseña',
      href: '/resena/',
      traducida: 'traducida del español',
      deCinco: (n: number) => `${n} de 5 estrellas`,
    },
    formulario: {
      titulo: 'Escribe una reseña — Sergio García Ortiz',
      descripcion: 'Cuenta cómo fue trabajar conmigo. Se publica tal cual en la web, solo con tu permiso.',
      volver: 'Volver al portfolio',
      eyebrow: 'Reseñas',
      titular: 'Cuéntalo con tus palabras.',
      texto:
        'Dos líneas bastan. Me llega a mí, la publico tal cual — sin retocar nada — y si algún día quieres que la quite, me lo dices y la quito.',
      nombre: 'Tu nombre',
      nombrePista: 'El que quieras que aparezca.',
      negocio: 'Tu negocio y a qué se dedica',
      negocioPista: 'Por ejemplo: Fisioymés · Fisioterapia en Sant Cugat.',
      enlace: 'Tu web o Instagram',
      enlacePista: 'Opcional. Si lo pones, enlazo tu nombre ahí.',
      email: 'Tu email',
      emailPista: 'Opcional y no se publica. Solo por si necesito confirmarte algo.',
      puntuacion: 'Puntuación',
      puntuacionPista: 'De 1 a 5.',
      resena: 'Tu reseña',
      resenaPista: 'Qué necesitabas, cómo fue y qué tal el resultado.',
      permiso: 'Doy permiso para publicar esta reseña en la web con mi nombre y el de mi negocio.',
      enviar: 'Enviar la reseña',
      legal: 'Lo que escribas me llega por correo. No se publica nada hasta que yo lo suba, y lo quito el día que me lo pidas.',
    },
    gracias: {
      titulo: 'Reseña recibida — Sergio García Ortiz',
      titular: 'Recibida. Gracias de verdad.',
      texto:
        'La leo hoy mismo y la subo a la web tal cual me la has escrito. Si quieres cambiar algo o que la quite, escríbeme y ya está.',
      volver: 'Volver al portfolio',
    },
    proyectos: demosES,
    destacado: fisioymes,
  },

  en: {
    site: {
      nombre: 'Sergio García Ortiz',
      rol: 'Web designer',
      lugar: 'Barcelona, Spain',
      titulo: 'Freelance web designer in Barcelona · Sergio García',
      descripcion:
        'Fast, clear, mobile-first custom websites for businesses in Barcelona and across Spain. Work directly with me and get a written quote within 24 hours.',
      email: 'info@sergiogarciaweb.com',
    },
    resenas: {
      eyebrow: 'Reviews',
      titular: 'What the people who already have one say.',
      texto: 'Written by them, published word for word. Not polished, not trimmed.',
      titularVacio: 'No reviews here yet.',
      textoVacio:
        'I would rather my clients wrote this part, so for now it is empty. If we have worked together, say it in two lines: I publish it as it is, with your name and your business.',
      nota: 'You write it, I publish it without touching a comma. It only goes up with your permission, and it comes down the day you ask.',
      cta: 'Write a review',
      href: '/en/review/',
      traducida: 'translated from Spanish',
      deCinco: (n: number) => `${n} out of 5 stars`,
    },
    formulario: {
      titulo: 'Write a review — Sergio García Ortiz',
      descripcion: 'Tell people what it was like to work with me. Published as it is, only with your permission.',
      volver: 'Back to the portfolio',
      eyebrow: 'Reviews',
      titular: 'Say it in your own words.',
      texto:
        'Two lines are enough. It comes straight to me, I publish it as it is — nothing rewritten — and if you ever want it gone, tell me and it is gone.',
      nombre: 'Your name',
      nombrePista: 'However you want it to appear.',
      negocio: 'Your business and what it does',
      negocioPista: 'For example: Ridgeline Family Dental · Dentistry in Boise.',
      enlace: 'Your website or Instagram',
      enlacePista: 'Optional. If you add it, I link your name to it.',
      email: 'Your email',
      emailPista: 'Optional and never published. Only in case I need to check something with you.',
      puntuacion: 'Rating',
      puntuacionPista: 'From 1 to 5.',
      resena: 'Your review',
      resenaPista: 'What you needed, how it went and how the result turned out.',
      permiso: 'I give permission to publish this review on the site with my name and my business name.',
      enviar: 'Send the review',
      legal: 'What you write reaches me by email. Nothing is published until I put it up, and it comes down the day you ask.',
    },
    gracias: {
      titulo: 'Review received — Sergio García Ortiz',
      titular: 'Got it. Thank you, really.',
      texto:
        'I will read it today and put it on the site exactly as you wrote it. If you want to change anything, or have it taken down, just write to me.',
      volver: 'Back to the portfolio',
    },
    proyectos: demosEN,
    destacado: {
      ...fisioymes,
      rubro: 'Physical therapy · Barcelona, Spain',
      descripcion:
        'They came with one specific complaint: on a phone, their site was all text and endless scrolling. I rebuilt it from scratch in Catalan and Spanish, with injuries in a grid and treatments on cards — and without touching the booking system they already used.',
    },
  },

  ca: {
    "site": {
      "nombre": "Sergio García Ortiz",
      "rol": "Dissenyador web",
      "lugar": "Cornellà de Llobregat · Barcelona",
      "titulo": "Dissenyador web freelance a Barcelona · Sergio García",
      "descripcion": "Webs a mida, ràpides i pensades per al mòbil, per a negocis de Barcelona i tot Espanya. Tracte directe, pressupost en 24 h i revisió gratuïta del teu web.",
      "email": "info@sergiogarciaweb.com"
    },
    "resenas": {
      "eyebrow": "Ressenyes",
      "titular": "Què diuen els qui ja la tenen.",
      "texto": "Escrites per ells, publicades tal qual. Ni retocades ni resumides.",
      "titularVacio": "Aquí encara no hi ha cap ressenya.",
      "textoVacio": "Aquesta part prefereixo que l'escriguin ells, així que de moment està buida. Si hem treballat junts, explica-ho en dues línies: la publico tal qual, amb el teu nom i el del teu negoci.",
      "nota": "L'escrius tu, la publico jo sense tocar-ne una coma. Només surt si em dones permís, i la trec el dia que m'ho demanis.",
      "cta": "Escriure una ressenya",
      "href": "/ca/ressenya/",
      "traducida": "traduïda del castellà",
      deCinco: (n: number) => `${n} de 5 estrelles`
    },
    "formulario": {
      "titulo": "Escriu una ressenya — Sergio García Ortiz",
      "descripcion": "Explica com va ser treballar amb mi. Es publica tal qual al web, només amb el teu permís.",
      "volver": "Tornar al portfoli",
      "eyebrow": "Ressenyes",
      "titular": "Explica-ho amb les teves paraules.",
      "texto": "Dues línies n'hi ha prou. M'arriba a mi, la publico tal qual — sense retocar res — i si algun dia vols que la tregui, m'ho dius i la trec.",
      "nombre": "El teu nom",
      "nombrePista": "El que vulguis que aparegui.",
      "negocio": "El teu negoci i a què es dedica",
      "negocioPista": "Per exemple: Fisioymés · Fisioteràpia a Sant Cugat.",
      "enlace": "El teu web o Instagram",
      "enlacePista": "Opcional. Si el poses, enllaço el teu nom allà.",
      "email": "El teu correu",
      "emailPista": "Opcional i no es publica. Només per si necessito confirmar-te alguna cosa.",
      "puntuacion": "Puntuació",
      "puntuacionPista": "De 1 a 5.",
      "resena": "La teva ressenya",
      "resenaPista": "Què necessitaves, com va anar i què tal el resultat.",
      "permiso": "Dono permís per publicar aquesta ressenya al web amb el meu nom i el del meu negoci.",
      "enviar": "Enviar la ressenya",
      "legal": "El que escriguis m'arriba per correu. No es publica res fins que jo ho pujo, i ho trec el dia que m'ho demanis."
    },
    "gracias": {
      "titulo": "Ressenya rebuda — Sergio García Ortiz",
      "titular": "Rebuda. Gràcies de veritat.",
      "texto": "La llegeixo avui mateix i la pujo al web tal com me l'has escrit. Si vols canviar alguna cosa o que la tregui, escriu-me i ja està.",
      "volver": "Tornar al portfoli"
    },
    proyectos: demosCA,
    destacado: fisioymesCA,
  },
} as const;

export type Contenido = (typeof contenido)[Lang];

