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
export const CALCULADORA = 'https://sergiogarciaweb.com/presupuesto-web/';

export interface Proyecto {
  nombre: string;
  rubro: string;
  descripcion: string;
  url: string;
  /** Slug del repo. Nombra la captura en `src/assets/posters/<slug>.png`. */
  slug: string;
}

/**
 * El destacado lleva además el alto real de su captura a página completa
 * (`src/assets/posters/fisioymes-full.png`, 1440px de ancho): de ahí sale
 * cuánto recorrido tiene el scrub del marco. Si se recaptura, se re-mide.
 */
export interface Destacado extends Proyecto {
  alto: number;
}

// --- Proyectos ---------------------------------------------------------------

// EL ÚNICO CLIENTE REAL. Va primero, destacado y con chapa de cliente.
// Sergio confirmó el 2026-07-16 que Fisioymés dio permiso para publicarla.
// Sin ese permiso, esto NO puede llevar su marca: se anonimiza o se saca.
// Todo lo demás son conceptos y se declaran conceptos. Esta regla no se toca.
const fisioymes: Destacado = {
  nombre: 'Fisioymés',
  rubro: 'Fisioterapia · Sant Cugat del Vallès',
  descripcion:
    'Vinieron con una queja concreta: en el móvil su web era todo letra y scroll sin fin. La rehíce entera en catalán y castellano, con las lesiones en rejilla y los tratamientos en fichas — y sin tocarles el sistema de reservas que ya usaban.',
  slug: 'fisioymes',
  url: 'https://sergiogarciaweb.com/fisioymes/',
  alto: 4939,
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
const fisioymesCA: Destacado = { ...fisioymes, ...({"rubro": "Fisioteràpia · Sant Cugat del Vallès", "descripcion": "Van venir amb una queixa concreta: al mòbil el seu web era tot lletra i scroll sense fi. El vaig refer sencer en català i castellà, amb les lesions en graella i els tractaments en fitxes — i sense tocar-los el sistema de reserves que ja feien servir."}) };

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
  gracias: { es: '/gracias/', en: '/en/thanks/' },
} as const;

// --- Copy --------------------------------------------------------------------

export const contenido = {
  es: {
    site: {
      nombre: 'Sergio García Ortiz',
      rol: 'Diseñador web',
      lugar: 'Cornellà de Llobregat · Barcelona',
      titulo: 'Sergio García Ortiz — Diseñador web en Cornellà de Llobregat, Barcelona',
      descripcion:
        'Diseño y construyo webs a medida para negocios que están hartos de parecer una plantilla. Estáticas, rápidas y sin nada que se pueda romper.',
      email: 'info@sergiogarciaweb.com',
    },
    portada: {
      titular: ['Diseño webs', 'a medida'],
      bajada:
        'Sencillas, rápidas y que se ven bien en el móvil. Las hago yo de principio a fin.',
      // El dato que el visitante viene a comprobar: cuánto y cuándo. Los números
      // salen de la calculadora pública y tienen que cuadrar con ella SIEMPRE.
      dato: 'Desde 500 € · publicada en 7 días',
      ctaPresupuesto: 'Pedir presupuesto',
      ctaWhatsapp: 'WhatsApp',
      ctaLlamar: 'Llamar',
      ctaTrabajo: 'Ver trabajos ↓',
      nav: [
        { texto: 'Servicios', href: '#servicios' },
        { texto: 'Trabajos', href: '#trabajo' },
        { texto: 'Precio', href: '#precio' },
        { texto: 'Cómo trabajo', href: '#metodo' },
        { texto: 'Contacto', href: '#contacto' },
      ],
    },
    trabajo: {
      titular: 'El trabajo',
      cliente: 'Cliente real',
      clienteNota: 'Encargo real, en producción. Publicado aquí con su permiso.',
      conceptosTitular: 'Conceptos',
      // La honestidad es el argumento: se dice claro que son inventados, ANTES
      // de que nadie lo pregunte. Ver spec §2: jamás presentar demo como cliente.
      conceptosNota:
        'Negocios inventados, diseño real. Los hago para enseñar cómo trabajo — ninguno es un cliente.',
      concepto: 'Concepto',
      abrir: 'Abrir de verdad ↗',
    },
    precio: {
      eyebrow: 'Precio y plazo',
      titular: 'Presupuesto cerrado antes de empezar.',
      datos: [
        { cifra: '500 €', texto: 'la web entera: hasta 5 páginas a medida, dominio el primer año y puesta en marcha' },
        { cifra: '7 días', texto: 'de empezar a estar publicada' },
        { cifra: '24 h', texto: 'para tener tu presupuesto por escrito, sin compromiso' },
      ],
      texto:
        'Lo que necesite tu negocio de más — citas online, dos idiomas, salir en Google — se añade con su precio a la vista. Sin cuotas escondidas ni letra pequeña.',
      cta: 'Calcula tu presupuesto en 2 minutos ↗',
    },
    bio: {
      // El titular lleva el ARGUMENTO; los párrafos llevan las credenciales.
      // OJO: aquí NO va ninguna cifra que Sergio no haya confirmado. Hubo un
      // titular con "llevo diez años haciendo webs" que era inventado. Ver spec §2.
      titular: 'Tu web la va a hacer quien está hablando contigo.',
      parrafos: [
        'Durante dos años llevé el diseño y la gestión de contenidos de la web de la EEBE, la escuela de ingeniería de la UPC, con una beca de aprendizaje. No fue una pantalla bonita y adiós: fue mantener algo vivo, todos los días, para una institución exigente.',
        'Después pasé un año en ciberseguridad en EY. Aprendí cómo se rompen las cosas por dentro, y volví al diseño porque es lo que quiero hacer.',
        'Ahora trabajo por mi cuenta desde Cornellà de Llobregat. Cuando me escribes, te contesto yo. Cuando hacemos la llamada, estoy yo.',
      ],
    },
    metodo: {
      titular: 'Construyo webs que no se pueden romper.',
      parrafos: [
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
      whatsapp: 'Escríbeme por WhatsApp',
      llamar: 'Llámame',
    },
    resenas: {
      eyebrow: 'Reseñas',
      titular: 'Lo que dicen los que ya la tienen.',
      texto: 'Escritas por ellos, publicadas tal cual. Ni retocadas ni resumidas.',
      titularVacio: 'Aquí todavía no hay ninguna reseña.',
      textoVacio:
        'Esta parte prefiero que la escriban ellos, así que de momento está vacía. Si hemos trabajado juntos, cuéntalo en dos líneas: la publico tal cual, con tu nombre y el de tu negocio.',
      nota: 'La escribes tú, la publico yo sin tocar una coma. Solo sale si me das permiso, y la quito el día que me lo pidas.',
      cta: 'Escribir una reseña ↗',
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
      titulo: 'Sergio García Ortiz — Web designer in Barcelona',
      descripcion:
        'I design and build custom websites for businesses tired of looking like a template. Static, fast, and with nothing that can break.',
      email: 'info@sergiogarciaweb.com',
    },
    portada: {
      titular: ['Custom', 'websites'],
      bajada:
        'Simple, fast, and good-looking on a phone. I build them end to end.',
      dato: 'From €500 · live in 7 days',
      ctaPresupuesto: 'Get a quote',
      ctaWhatsapp: 'WhatsApp',
      ctaLlamar: 'Call',
      ctaTrabajo: 'See the work ↓',
      nav: [
        { texto: 'Work', href: '#trabajo' },
        { texto: 'Pricing', href: '#precio' },
        { texto: 'How I work', href: '#metodo' },
        { texto: 'Contact', href: '#contacto' },
      ],
    },
    trabajo: {
      titular: 'The work',
      cliente: 'Real client',
      clienteNota: 'Real engagement, in production. Published here with their permission.',
      conceptosTitular: 'Concepts',
      conceptosNota:
        'Invented businesses, real design. I build them to show how I work — none of them is a client.',
      concepto: 'Concept',
      abrir: 'Open the real one ↗',
    },
    precio: {
      eyebrow: 'Price and timeline',
      titular: 'A fixed quote before we start.',
      datos: [
        { cifra: '€500', texto: 'the whole site: up to 5 custom pages, your domain for the first year, fully launched' },
        { cifra: '7 days', texto: 'from kickoff to published' },
        { cifra: '24 h', texto: 'to get your written quote, no strings attached' },
      ],
      texto:
        'Anything extra your business needs — online booking, two languages, local Google presence — is added with its price in plain sight. No hidden fees, no fine print.',
      cta: 'Get an instant estimate ↗',
    },
    bio: {
      titular: 'The person you talk to is the person who builds your site.',
      parrafos: [
        'For two years I ran the design and content management for the website of EEBE, a large public engineering school in Barcelona, part of the Polytechnic University of Catalonia. It was a student traineeship. It was not one pretty screen and done: it was keeping something alive, every day, for a demanding institution.',
        'After that I spent a year in cybersecurity at EY. I learned how things break from the inside, and I came back to design because design is what I want to do.',
        'Now I work for myself from Cornellà de Llobregat, just outside Barcelona. You email me, I answer. We get on a call, it is me on the call. There is no account manager in the middle, and no intern building your site while a salesperson shows you something else.',
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
        'Tell me what you have and what you want. I will tell you what I would do and what it costs. No obligation, no runaround.',
      whatsapp: 'Message me on WhatsApp',
      llamar: 'Call me',
    },
    resenas: {
      eyebrow: 'Reviews',
      titular: 'What the people who already have one say.',
      texto: 'Written by them, published word for word. Not polished, not trimmed.',
      titularVacio: 'No reviews here yet.',
      textoVacio:
        'I would rather my clients wrote this part, so for now it is empty. If we have worked together, say it in two lines: I publish it as it is, with your name and your business.',
      nota: 'You write it, I publish it without touching a comma. It only goes up with your permission, and it comes down the day you ask.',
      cta: 'Write a review ↗',
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
      "titulo": "Sergio García Ortiz — Dissenyador web a Cornellà de Llobregat, Barcelona",
      "descripcion": "Dissenyo i construeixo webs a mida per a negocis que estan tips de semblar una plantilla. Estàtiques, ràpides i sense res que es pugui trencar.",
      "email": "info@sergiogarciaweb.com"
    },
    "portada": {
      "titular": [
        "Dissenyo webs",
        "a mida"
      ],
      "bajada": "Senzilles, ràpides i que es veuen bé al mòbil. Les faig jo de principi a fi.",
      "dato": "Des de 500 € · publicada en 7 dies",
      "ctaPresupuesto": "Demanar pressupost",
      "ctaWhatsapp": "WhatsApp",
      "ctaLlamar": "Trucar",
      "ctaTrabajo": "Veure treballs ↓",
      "nav": [
        {
          "texto": "Serveis",
          "href": "#servicios"
        },
        {
          "texto": "Treballs",
          "href": "#trabajo"
        },
        {
          "texto": "Preu",
          "href": "#precio"
        },
        {
          "texto": "Com treballo",
          "href": "#metodo"
        },
        {
          "texto": "Contacte",
          "href": "#contacto"
        }
      ]
    },
    "trabajo": {
      "titular": "La feina",
      "cliente": "Client real",
      "clienteNota": "Encàrrec real, en producció. Publicat aquí amb el seu permís.",
      "conceptosTitular": "Conceptes",
      "conceptosNota": "Negocis inventats, disseny real. Els faig per ensenyar com treballo — cap no és un client.",
      "concepto": "Concepte",
      "abrir": "Obrir de debò ↗"
    },
    "precio": {
      "eyebrow": "Preu i termini",
      "titular": "Pressupost tancat abans de començar.",
      "datos": [
        {
          "cifra": "500 €",
          "texto": "la web sencera: fins a 5 pàgines a mida, domini el primer any i posada en marxa"
        },
        {
          "cifra": "7 dies",
          "texto": "de començar a estar publicada"
        },
        {
          "cifra": "24 h",
          "texto": "per tenir el pressupost per escrit, sense compromís"
        }
      ],
      "texto": "El que el teu negoci necessiti de més — cites en línia, dos idiomes, sortir a Google — s'afegeix amb el seu preu a la vista. Sense quotes amagades ni lletra petita.",
      "cta": "Calcula el teu pressupost en 2 minuts ↗"
    },
    "bio": {
      "titular": "La teva web la farà qui està parlant amb tu.",
      "parrafos": [
        "Durant dos anys vaig portar el disseny i la gestió de continguts del web de l'EEBE, l'escola d'enginyeria de la UPC, amb una beca d'aprenentatge. No va ser una pantalla bonica i adéu: va ser mantenir una cosa viva, cada dia, per a una institució exigent.",
        "Després vaig passar un any a ciberseguretat a EY. Vaig aprendre com es trenquen les coses per dins, i vaig tornar al disseny perquè és el que vull fer.",
        "Ara treballo pel meu compte des de Cornellà de Llobregat. Quan m'escrius, et contesto jo. Quan fem la trucada, hi sóc jo."
      ]
    },
    "metodo": {
      "titular": "Faig webs que no es poden trencar.",
      "parrafos": [
        "La teva web actual és probablement WordPress amb vint connectors que fa mesos que no s'actualitzen. Cadascun és una porta. Quan una cedeix, el teu domini acaba redirigint a una web d'apostes i els teus pacients veuen això en lloc de la teva clínica. Li ha passat a una clínica dental d'aquí al costat.",
        "Jo entrego arxius estàtics. No hi ha base de dades per injectar, ni connectors per actualitzar, ni tauler d'administració per rebentar. No és una promesa de màrqueting: és que la porta no existeix.",
        "De propina, va ràpida. Un arxiu estàtic se serveix des de la vora de la xarxa i apareix abans que el visitant es plantegi marxar."
      ]
    },
    "contacto": {
      "eyebrow": "En parlem",
      "titular": "La teva web s'assembla a la de tothom?",
      "texto": "Explica'm què tens i què t'agradaria. Et dic què faria i quant costa, sense compromís i sense voltes.",
      "whatsapp": "Escriu-me per WhatsApp",
      "llamar": "Truca'm"
    },
    "resenas": {
      "eyebrow": "Ressenyes",
      "titular": "Què diuen els qui ja la tenen.",
      "texto": "Escrites per ells, publicades tal qual. Ni retocades ni resumides.",
      "titularVacio": "Aquí encara no hi ha cap ressenya.",
      "textoVacio": "Aquesta part prefereixo que l'escriguin ells, així que de moment està buida. Si hem treballat junts, explica-ho en dues línies: la publico tal qual, amb el teu nom i el del teu negoci.",
      "nota": "L'escrius tu, la publico jo sense tocar-ne una coma. Només surt si em dones permís, i la trec el dia que m'ho demanis.",
      "cta": "Escriure una ressenya ↗",
      "href": "/resena/",
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
