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
  gracias: { es: '/gracias/', en: '/en/thanks/', ca: '/ca/gracies/' },
} as const;

// --- Copy --------------------------------------------------------------------

export const contenido = {
  es: {
    site: {
      nombre: 'Sergio García Ortiz',
      rol: 'Diseñador web',
      lugar: 'Cornellà de Llobregat · Barcelona',
      titulo: 'Diseño web a medida para negocios en España — Sergio García',
      descripcion:
        'Diseño y desarrollo web a medida para negocios y profesionales de toda España. Trato directo, webs rápidas y presupuesto personalizado.',
      email: 'info@sergiogarciaweb.com',
    },
    portada: {
      titular: ['Webs a medida', 'que no parecen plantilla'],
      bajada:
        'Claras, rápidas y pensadas para leerse bien en el móvil. Las hago yo de principio a fin.',
      dato: 'Presupuesto a medida · todo por escrito',
      ctaPresupuesto: 'Pedir presupuesto',
      ctaWhatsapp: 'WhatsApp',
      ctaLlamar: 'Llamar',
      ctaTrabajo: 'Ver trabajos ↓',
      nav: [
        { texto: 'Servicios', href: '#servicios' },
        { texto: 'Trabajos', href: '#trabajo' },
        { texto: 'Presupuesto', href: '#presupuesto' },
        { texto: 'Cómo trabajo', href: '#metodo' },
        { texto: 'Contacto', href: '#contacto' },
      ],
    },
    trabajo: {
      titular: 'El trabajo',
      cliente: 'Cliente real',
      clienteNota: 'Encargo real, en producción. Publicado aquí con su permiso.',
      conceptosTitular: 'Diseños por sector',
      // La honestidad es el argumento: se dice claro que son inventados, ANTES
      // de que nadie lo pregunte. Ver spec §2: jamás presentar demo como cliente.
      conceptosNota:
        'Ejemplos de cómo podría verse un negocio como el tuyo. Son conceptos, no clientes, y muestran el tipo de decisiones que tomo en cada sector.',
      concepto: 'Concepto',
      abrir: 'Abrir de verdad ↗',
    },
    precio: {
      eyebrow: 'Presupuesto personalizado',
      titular: 'Cada web necesita algo distinto.',
      datos: [
        { cifra: 'A medida', texto: 'según las páginas, contenidos y funciones que realmente necesita tu negocio' },
        { cifra: 'Por escrito', texto: 'con el alcance, el calendario y el coste claros antes de empezar' },
        { cifra: 'Sin compromiso', texto: 'primero hablamos y después decides con toda la información' },
      ],
      texto:
        'Un presupuesto automático no tiene sentido: cada negocio parte de un lugar distinto y necesita una combinación diferente de páginas, contenidos y funciones.',
      cta: 'Cuéntame qué necesitas ↗',
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
      titular: 'Webs rápidas, sencillas y con menos puntos débiles.',
      parrafos: [
        'Muchas webs dependen de un gestor y de plugins que hay que actualizar. Cuantas más piezas tienen, más mantenimiento y más puntos que vigilar.',
        'Para una web corporativa, entrego archivos estáticos: sin base de datos pública, sin plugins y sin un panel de administración expuesto. Eso reduce el mantenimiento y la superficie de ataque.',
        'Además, carga rápido. Una web estática se sirve desde una red distribuida y aparece antes de que el visitante se plantee irse.',
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
      titulo: 'Custom web design for businesses in Spain — Sergio García',
      descripcion:
        'Custom web design and development for businesses and professionals across Spain. Direct communication, fast websites and a tailored quote.',
      email: 'info@sergiogarciaweb.com',
    },
    portada: {
      titular: ['Custom websites', 'that do not look templated'],
      bajada:
        'Clear, fast, and designed to read well on a phone. I build them end to end.',
      dato: 'A tailored quote · everything in writing',
      ctaPresupuesto: 'Get a quote',
      ctaWhatsapp: 'WhatsApp',
      ctaLlamar: 'Call',
      ctaTrabajo: 'See the work ↓',
      nav: [
        { texto: 'Work', href: '#trabajo' },
        { texto: 'Quote', href: '#presupuesto' },
        { texto: 'How I work', href: '#metodo' },
        { texto: 'Contact', href: '#contacto' },
      ],
    },
    trabajo: {
      titular: 'The work',
      cliente: 'Real client',
      clienteNota: 'Real engagement, in production. Published here with their permission.',
      conceptosTitular: 'Design directions by sector',
      conceptosNota:
        'Examples of how a business like yours could look. They are concepts, not clients, and show the decisions I make for each sector.',
      concepto: 'Concept',
      abrir: 'Open the real one ↗',
    },
    precio: {
      eyebrow: 'A tailored quote',
      titular: 'Every website needs something different.',
      datos: [
        { cifra: 'Tailored', texto: 'to the pages, content and features your business actually needs' },
        { cifra: 'In writing', texto: 'with scope, schedule and cost made clear before work begins' },
        { cifra: 'No obligation', texto: 'we talk first, then you decide with all the information' },
      ],
      texto:
        'An automatic estimate makes little sense: every business starts somewhere different and needs its own mix of pages, content and features.',
      cta: 'Tell me what you need ↗',
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
      titular: 'Fast websites with fewer moving parts.',
      parrafos: [
        'Many websites depend on a CMS and plugins that need updating. The more moving parts there are, the more maintenance and potential weak points they create.',
        'For a business website, I ship static files: no public database, no plugins and no exposed admin panel. That reduces maintenance and the attack surface.',
        'It is fast, too. A static website is served from a distributed network and shows up before a visitor thinks about leaving.',
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
      "titulo": "Disseny web a mida per a negocis a Espanya — Sergio García",
      "descripcion": "Disseny i desenvolupament web a mida per a negocis i professionals de tot Espanya. Tracte directe, webs ràpides i pressupost personalitzat.",
      "email": "info@sergiogarciaweb.com"
    },
    "portada": {
      "titular": [
        "Webs a mida",
        "que no semblen una plantilla"
      ],
      "bajada": "Clares, ràpides i pensades per llegir-se bé al mòbil. Les faig jo de principi a fi.",
      "dato": "Pressupost a mida · tot per escrit",
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
          "texto": "Pressupost",
          "href": "#presupuesto"
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
      "conceptosTitular": "Dissenys per sector",
      "conceptosNota": "Exemples de com podria veure's un negoci com el teu. Són conceptes, no clients, i mostren les decisions que prenc a cada sector.",
      "concepto": "Concepte",
      "abrir": "Obrir de debò ↗"
    },
    "precio": {
      "eyebrow": "Pressupost personalitzat",
      "titular": "Cada web necessita una cosa diferent.",
      "datos": [
        {
          "cifra": "A mida",
          "texto": "segons les pàgines, els continguts i les funcions que realment necessita el teu negoci"
        },
        {
          "cifra": "Per escrit",
          "texto": "amb l'abast, el calendari i el cost clars abans de començar"
        },
        {
          "cifra": "Sense compromís",
          "texto": "primer en parlem i després decideixes amb tota la informació"
        }
      ],
      "texto": "Un pressupost automàtic no té sentit: cada negoci parteix d'un lloc diferent i necessita una combinació pròpia de pàgines, continguts i funcions.",
      "cta": "Explica'm què necessites ↗"
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
      "titular": "Webs ràpides, senzilles i amb menys punts febles.",
      "parrafos": [
        "Molts webs depenen d'un gestor i de connectors que cal actualitzar. Com més peces tenen, més manteniment i més punts per vigilar.",
        "Per a un web corporatiu, entrego arxius estàtics: sense base de dades pública, sense connectors i sense un tauler d'administració exposat. Això redueix el manteniment i la superfície d'atac.",
        "A més, carrega ràpid. Un web estàtic se serveix des d'una xarxa distribuïda i apareix abans que el visitant es plantegi marxar."
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

