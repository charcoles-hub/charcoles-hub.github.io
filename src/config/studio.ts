import type { Lang } from './site';

/**
 * Textos de la portada. Los hechos comerciales son los de siempre: nada de
 * resultados, cifras ni recomendaciones inventadas. Los titulares marcan el
 * énfasis con asteriscos (ver `enfasis` en comun.ts).
 */
const es = {
  nav: [
    ['Trabajo', '#trabajo'],
    ['Servicios', '#servicios'],
    ['Sectores', '#sectores'],
    ['Reseñas', '#resenas'],
    ['Sobre mí', '#sobre-mi'],
  ],
  disponible: 'Disponible para nuevos proyectos',
  h1: 'Diseño webs para que *te elijan a ti*.',
  intro:
    'Soy Sergio García, diseñador web freelance en Barcelona. Hago webs a medida, rápidas y pensadas para el móvil, que explican lo que haces, transmiten confianza y ponen fácil dar el siguiente paso. Para negocios de toda España, con trato directo de principio a fin.',
  ctaPrincipal: 'Pide presupuesto sin compromiso',
  ctaSecundario: { texto: 'Revisión gratuita de tu web', href: '/revision-web-gratis/' },
  datos: ['Presupuesto por escrito en 24 h', 'Web y dominio a tu nombre', 'Sin intermediarios'],
  datosTitulo: 'Cómo trabajo',
  fondoPausar: 'Pausar el fondo animado',
  fondoReanudar: 'Reanudar el fondo animado',
  cursorVer: 'Ver',
  heroChip: 'Proyecto real',
  heroIdiomas: 'Castellano · Català',
  heroPie: ['Fisioymés', 'Clínica de fisioterapia en Sant Cugat del Vallès'],
  compromisos: [
    ['Trato directo', 'Hablas siempre con quien diseña y programa tu web.'],
    ['Todo por escrito', 'Alcance, calendario y precio claros antes de empezar.'],
    ['Pensada para móvil', 'Que se lea y se use bien donde más te buscan.'],
    ['Tuya de verdad', 'El dominio va a tu nombre y la web es tuya.'],
  ],

  trabajoEtiqueta: 'Trabajo',
  trabajoTitulo: 'El diseño *se demuestra*.',
  trabajoIntro:
    'Una web tiene que encajar con el negocio que hay detrás. Aquí tienes un proyecto real y varios conceptos por sector: puedes abrirlos y recorrerlos.',
  caso: {
    etiqueta: 'Proyecto real · Fisioterapia',
    titulo: 'Menos búsqueda. Más claridad para pedir cita.',
    intro:
      'La clínica necesitaba una web más cómoda de usar en el móvil. Organicé la información alrededor de lo que busca un paciente y mantuve su sistema de reservas.',
    pasos: [
      ['El punto de partida', 'Demasiado texto y un recorrido largo en móvil para encontrar la información.'],
      ['La decisión', 'Lesiones en una rejilla, tratamientos en fichas y contenido en castellano y catalán.'],
      ['Lo que puedes comprobar', 'Una estructura más fácil de explorar, con acceso al sistema de citas que la clínica ya utilizaba.'],
    ],
    verCaso: 'Leer el caso completo',
    verWeb: 'Ver la web publicada',
    pista: 'Pasa el ratón por la captura para recorrer la página entera.',
    alt: 'Captura de la web de Fisioymés, clínica de fisioterapia',
  },
  conceptos: {
    etiqueta: 'Conceptos por sector',
    titulo: 'Cada negocio tiene su carácter.',
    intro:
      'Propuestas de diseño propias para distintos sectores. Son conceptos, no encargos de clientes: muestran las decisiones que tomaría con un negocio como el tuyo.',
    marca: 'Concepto',
    todos: 'Ver todos los conceptos',
    mas: 'Más conceptos',
  },

  sectoresEtiqueta: 'Sectores',
  sectoresTitulo: 'Webs pensadas para *tu sector*.',
  sectoresIntro:
    'Una clínica dental no necesita lo mismo que una gestoría. Mira qué llevaría la web de tu negocio y un concepto de ejemplo.',
  sectoresVer: 'Ver cómo sería tu web',

  serviciosEtiqueta: 'Servicios',
  serviciosTitulo: 'De una buena idea a una web *lista para abrir*.',
  servicios: [
    ['Web nueva', 'Para explicar bien tu negocio desde el primer día. Diseño a medida, contenido ordenado y un camino claro hasta el contacto.', '/diseno-web/'],
    ['Rediseño web', 'Si tu web ya no te representa, reviso su estructura, diseño y experiencia móvil. Planificamos la transición con tus URLs y contenido actuales.', '/rediseno-web/'],
    ['Posicionamiento local', 'Que te encuentren cuando busquen tu servicio en tu zona: ficha de Google, la web preparada por dentro y los datos que Google necesita.', '/posicionamiento-google/'],
    ['Mantenimiento', 'Alojamiento, copias de seguridad y tus cambios hechos por mí, con un plan ajustado a lo que tu web necesita de verdad.', '/mantenimiento-web/'],
  ],
  serviciosVer: 'Más información',
  serviciosIdioma: '',

  revision: {
    etiqueta: 'Revisión gratuita',
    titulo: '¿Ya tienes web? Te digo *gratis* qué cambiaría.',
    texto:
      'Me pasas la dirección y te respondo por email con lo que funciona, lo que falla en el móvil y en Google, y qué arreglaría primero. Sin compromiso.',
    cta: 'Pedir la revisión gratuita',
  },

  procesoEtiqueta: 'Proceso',
  procesoTitulo: 'Claro desde el *primer mensaje*.',
  proceso: [
    ['Hablamos de tu negocio', 'Me cuentas qué haces, a quién te diriges y qué necesita conseguir tu web.'],
    ['Cerramos el plan', 'Recibes alcance, precio y plazo por escrito. Sabes qué incluye antes de empezar.'],
    ['Diseño y construyo', 'Ordeno el contenido, diseño la web y la preparo para móvil y escritorio. Revisamos el resultado juntos.'],
    ['Revisamos y publicamos', 'Comprobamos contenido, enlaces y contacto. La web se publica cuando está lista y tienes claro cómo seguir.'],
  ],

  precioEtiqueta: 'Presupuesto',
  precioTitulo: 'Un presupuesto que empieza *por escucharte*.',
  precioIntro:
    'Un cálculo automático no tiene sentido cuando cada negocio parte de un lugar distinto y necesita una combinación diferente de páginas, contenidos y funciones.',
  precioCaja: 'Propuesta a medida',
  precioNota: 'Primero hablamos; después recibes alcance, calendario y presupuesto por escrito.',
  precioIncluye: ['Las páginas que necesite tu proyecto', 'Diseño para móvil y escritorio', 'Una base preparada para crecer contigo', 'Formulario, WhatsApp y puesta en marcha'],
  precioCta: 'Cuéntame qué necesitas',
  precioPasos: [
    ['Primero, entender el proyecto', 'Hablamos de tu negocio, el punto de partida y lo que la web debe conseguir.'],
    ['Después, concretar el alcance', 'Páginas, idiomas, reservas, migración o visibilidad: solo incluimos lo que tu proyecto necesita.'],
    ['Por último, un presupuesto claro', 'Recibes alcance, calendario y coste por escrito antes de decidir, sin una cifra genérica que pueda llevar a error.'],
  ],

  sobreEtiqueta: 'Quién está detrás',
  sobreTitulo: 'Soy Sergio. Y tu proyecto *lo llevo yo*.',
  sobreTexto:
    'Diseño, desarrollo y hablo contigo. Una sola persona que conoce el proyecto de principio a fin, con comunicación directa y decisiones que puedes entender.',
  sobreFoto: 'Sergio García, diseñador web',
  credenciales: [
    ['Diseño y contenidos', 'Dos años en la web de la EEBE (UPC), con una beca de aprendizaje.'],
    ['Ciberseguridad', 'Un año en EY, trabajando en ciberseguridad.'],
    ['Ahora', 'Diseño web independiente para negocios y profesionales de toda España.'],
  ],
  tecnicaTitulo: 'Una base técnica que te simplifica las cosas.',
  tecnicaTexto:
    'Para webs corporativas, trabajo con páginas estáticas: carga ágil, menos mantenimiento y menos componentes expuestos. Las funciones externas, como formularios o reservas, se revisan aparte.',

  faqEtiqueta: 'Preguntas frecuentes',
  faqTitulo: 'Antes de *dar el paso*.',
  faqs: [
    ['¿Trabajas con negocios de cualquier parte de España?', 'Sí. Podemos definir el proyecto, revisar el diseño y preparar el lanzamiento a distancia. Trabajas directamente conmigo durante todo el proceso.'],
    ['¿Qué necesitas para empezar?', 'Una conversación para entender tu negocio y los textos, fotos o identidad que ya tengas. Si falta material, lo vemos antes de cerrar el alcance y el calendario.'],
    ['¿La web y el dominio son míos?', 'Sí. El dominio va a tu nombre y la web es tuya. Acordamos cómo administrarla y mantenerla cuando esté publicada.'],
    ['¿Qué ocurre si quiero cambiar algo después?', 'Puedes pedir cambios puntuales o un plan de mantenimiento. Te indico el alcance y el coste antes de hacerlos, porque no todos los cambios requieren el mismo trabajo.'],
    ['¿Puedes conservar mi dominio y mi web actual mientras trabajas?', 'Sí. La nueva web se prepara aparte. Revisamos el contenido, las direcciones y las redirecciones necesarias antes de sustituir la versión actual.'],
    ['¿Incluyes posicionamiento en Google?', 'La web se construye con una base técnica cuidada. La configuración de la ficha de Google y el servicio de posicionamiento se presupuestan aparte. No hay una garantía de posiciones: dependen también de la competencia y del contenido.'],
  ],
};

const en: typeof es = {
  nav: [
    ['Work', '#trabajo'],
    ['Services', '#servicios'],
    ['Reviews', '#resenas'],
    ['About', '#sobre-mi'],
  ],
  disponible: 'Available for new projects',
  h1: 'Websites that make customers *choose you*.',
  intro:
    'I’m Sergio García, a freelance web designer based in Barcelona. I build custom websites that are fast and made for mobile, that explain what you do, inspire confidence and make the next step easy. For businesses across Spain, working directly with me from start to finish.',
  ctaPrincipal: 'Get a quote, no obligation',
  ctaSecundario: { texto: 'See my work', href: '#trabajo' },
  datos: ['A written quote within 24 hours', 'Website and domain in your name', 'No middlemen'],
  datosTitulo: 'How I work',
  fondoPausar: 'Pause the animated background',
  fondoReanudar: 'Resume the animated background',
  cursorVer: 'View',
  heroChip: 'Client project',
  heroIdiomas: 'Spanish · Catalan',
  heroPie: ['Fisioymés', 'Physical therapy clinic in Sant Cugat del Vallès'],
  compromisos: [
    ['Direct contact', 'You always talk to the person who designs and builds your site.'],
    ['Everything in writing', 'Scope, schedule and price agreed before work begins.'],
    ['Built for mobile', 'Easy to read and use where people search for you most.'],
    ['Truly yours', 'The domain is registered in your name and the website is yours.'],
  ],

  trabajoEtiqueta: 'Work',
  trabajoTitulo: 'Let the design *do the talking*.',
  trabajoIntro:
    'A website should fit the business behind it. Here is a real client project and a few concepts: open them and look around.',
  caso: {
    etiqueta: 'Client project · Physical therapy',
    titulo: 'Less searching. A clearer path to booking.',
    intro:
      'The clinic needed a website that was easier to use on a phone. I organised the information around what patients look for and kept their existing booking system.',
    pasos: [
      ['The starting point', 'Too much text and a long mobile journey to find information.'],
      ['The decision', 'An injury grid, treatment cards and content in Spanish and Catalan.'],
      ['See for yourself', 'An easier structure to explore, with access to the booking system the clinic already used.'],
    ],
    verCaso: 'Read the case study (Spanish)',
    verWeb: 'Visit the live website',
    pista: 'Hover over the screenshot to scroll through the whole page.',
    alt: 'Screenshot of the Fisioymés physical therapy clinic website',
  },
  conceptos: {
    etiqueta: 'Design concepts',
    titulo: 'Every business has a character.',
    intro:
      'Independent concepts exploring different sectors. These are design proposals, not client commissions: they show the decisions I would make for a business like yours.',
    marca: 'Concept',
    todos: 'See all concepts',
    mas: 'More concepts',
  },

  sectoresEtiqueta: '',
  sectoresTitulo: '',
  sectoresIntro: '',
  sectoresVer: '',

  serviciosEtiqueta: 'Services',
  serviciosTitulo: 'From a good idea to a website *ready to open*.',
  servicios: [
    ['New website', 'Present your business clearly from day one. Custom design, organised content and a clear route to getting in touch.', '/diseno-web/'],
    ['Website redesign', 'If your website no longer represents you, I rethink its structure, design and mobile experience, and plan the transition around your current URLs and content.', '/rediseno-web/'],
    ['Local search', 'Get found when people search for your service nearby: Google Business Profile, a well-prepared website and the data Google needs.', '/posicionamiento-google/'],
    ['Maintenance', 'Hosting, backups and content changes made by me, with a plan that fits what your website actually needs.', '/mantenimiento-web/'],
  ],
  serviciosVer: 'More information (Spanish)',
  serviciosIdioma: 'in Spanish',

  revision: { etiqueta: '', titulo: '', texto: '', cta: '' },

  procesoEtiqueta: 'Process',
  procesoTitulo: 'Clear from the *first message*.',
  proceso: [
    ['We talk about your business', 'Tell me what you do, who you serve and what your website needs to achieve.'],
    ['We agree on a plan', 'You get the scope, price and timeline in writing before work begins.'],
    ['I design and build', 'I organise the content and build for mobile and desktop. We review the result together.'],
    ['We check and launch', 'We review content, links and contact options. The site goes live when it is ready and you know what comes next.'],
  ],

  precioEtiqueta: 'Your quote',
  precioTitulo: 'A quote that starts *by listening*.',
  precioIntro:
    'An automatic estimate makes little sense when every business starts somewhere different and needs its own mix of pages, content and features.',
  precioCaja: 'A tailored proposal',
  precioNota: 'We talk first; then you receive the scope, schedule and quote in writing.',
  precioIncluye: ['As many pages as your project needs', 'Mobile and desktop design', 'A foundation ready to grow with you', 'Contact form, WhatsApp and launch'],
  precioCta: 'Tell me what you need',
  precioPasos: [
    ['First, understand the project', 'We discuss your business, its starting point and what the website needs to achieve.'],
    ['Then, define the scope', 'Pages, languages, bookings, migration or visibility: we only include what your project needs.'],
    ['Finally, a clear quote', 'You receive scope, schedule and cost in writing before deciding, without a generic figure that could mislead you.'],
  ],

  sobreEtiqueta: 'The person behind it',
  sobreTitulo: 'I’m Sergio. *I take care* of your project.',
  sobreTexto:
    'I design, develop and talk with you. One person who knows your project from start to finish, with direct communication and decisions you can understand.',
  sobreFoto: 'Sergio García, web designer',
  credenciales: [
    ['Design & content', 'Two years working on the EEBE (UPC) website through a student traineeship.'],
    ['Cybersecurity', 'One year working in cybersecurity at EY.'],
    ['Today', 'Independent web design for businesses and professionals across Spain.'],
  ],
  tecnicaTitulo: 'A technical foundation that keeps things simple.',
  tecnicaTexto:
    'For business websites, I build static pages: fast loading, less maintenance and fewer exposed components. External features, such as forms and bookings, are reviewed separately.',

  faqEtiqueta: 'Common questions',
  faqTitulo: 'Before we *get started*.',
  faqs: [
    ['Do you work with businesses across Spain?', 'Yes. We can plan the project, review the design and prepare the launch remotely. You work directly with me throughout.'],
    ['What do you need to begin?', 'A conversation about your business and any text, photos or brand assets you have. We discuss missing materials before agreeing the scope and schedule.'],
    ['Will I own the website and domain?', 'Yes. The domain is registered in your name and the website is yours. We agree on administration and maintenance after launch.'],
    ['What if I need changes later?', 'You can request individual updates or a maintenance plan. I set out the scope and cost before making them, because not every change involves the same amount of work.'],
    ['Can I keep my domain and current website during the work?', 'Yes. The new site is built separately. We review content, URLs and any necessary redirects before replacing the current version.'],
    ['Is Google search optimisation included?', 'The site has a considered technical foundation. Google Business Profile setup and search optimisation are quoted separately. Rankings cannot be guaranteed; competition and content also matter.'],
  ],
};

const ca: typeof es = {
  nav: [
    ['Treballs', '#trabajo'],
    ['Serveis', '#servicios'],
    ['Sectors', '#sectores'],
    ['Ressenyes', '#resenas'],
    ['Qui soc', '#sobre-mi'],
  ],
  disponible: 'Disponible per a nous projectes',
  h1: 'Dissenyo webs perquè *et triïn a tu*.',
  intro:
    'Soc en Sergio García, dissenyador web freelance a Barcelona. Faig webs a mida, ràpides i pensades per al mòbil, que expliquen què fas, transmeten confiança i faciliten el següent pas. Per a negocis de tot Espanya, amb tracte directe de principi a fi.',
  ctaPrincipal: 'Demana pressupost sense compromís',
  ctaSecundario: { texto: 'Revisió gratuïta del teu web', href: '/revision-web-gratis/' },
  datos: ['Pressupost per escrit en 24 h', 'Web i domini al teu nom', 'Sense intermediaris'],
  datosTitulo: 'Com treballo',
  fondoPausar: 'Pausar el fons animat',
  fondoReanudar: 'Reprendre el fons animat',
  cursorVer: 'Veure',
  heroChip: 'Projecte real',
  heroIdiomas: 'Castellano · Català',
  heroPie: ['Fisioymés', 'Clínica de fisioteràpia a Sant Cugat del Vallès'],
  compromisos: [
    ['Tracte directe', 'Parles sempre amb qui dissenya i programa el teu web.'],
    ['Tot per escrit', 'Abast, calendari i preu clars abans de començar.'],
    ['Pensat per al mòbil', 'Que es llegeixi i es faci servir bé on més et busquen.'],
    ['Teu de veritat', 'El domini va al teu nom i el web és teu.'],
  ],

  trabajoEtiqueta: 'Treballs',
  trabajoTitulo: 'El disseny *es demostra*.',
  trabajoIntro:
    'Un web ha d’encaixar amb el negoci que hi ha al darrere. Aquí tens un projecte real i diversos conceptes per sector: els pots obrir i recórrer.',
  caso: {
    etiqueta: 'Projecte real · Fisioteràpia',
    titulo: 'Menys cerca. Més claredat per demanar cita.',
    intro:
      'La clínica necessitava un web més còmode d’utilitzar al mòbil. Vaig organitzar la informació al voltant del que busca un pacient i vaig mantenir el seu sistema de reserves.',
    pasos: [
      ['El punt de partida', 'Massa text i un recorregut llarg al mòbil per trobar la informació.'],
      ['La decisió', 'Lesions en una graella, tractaments en fitxes i contingut en castellà i català.'],
      ['El que pots comprovar', 'Una estructura més fàcil d’explorar, amb accés al sistema de cites que la clínica ja feia servir.'],
    ],
    verCaso: 'Llegir el cas complet (castellà)',
    verWeb: 'Veure el web publicat',
    pista: 'Passa el ratolí per la captura per recórrer la pàgina sencera.',
    alt: 'Captura del web de Fisioymés, clínica de fisioteràpia',
  },
  conceptos: {
    etiqueta: 'Conceptes per sector',
    titulo: 'Cada negoci té el seu caràcter.',
    intro:
      'Propostes de disseny pròpies per a diferents sectors. Són conceptes, no encàrrecs de clients: mostren les decisions que prendria amb un negoci com el teu.',
    marca: 'Concepte',
    todos: 'Veure tots els conceptes',
    mas: 'Més conceptes',
  },

  sectoresEtiqueta: 'Sectors',
  sectoresTitulo: 'Webs pensades per al *teu sector*.',
  sectoresIntro:
    'Una clínica dental no necessita el mateix que una gestoria. Mira què portaria el web del teu negoci i un concepte d’exemple (en castellà).',
  sectoresVer: 'Veure com seria el teu web',

  serviciosEtiqueta: 'Serveis',
  serviciosTitulo: 'D’una bona idea a un web *llest per obrir*.',
  servicios: [
    ['Web nou', 'Per explicar bé el teu negoci des del primer dia. Disseny a mida, contingut ordenat i un camí clar fins al contacte.', '/diseno-web/'],
    ['Redisseny web', 'Si el teu web ja no et representa, reviso l’estructura, el disseny i l’experiència mòbil. Planifiquem la transició amb els teus URL i continguts actuals.', '/rediseno-web/'],
    ['Posicionament local', 'Que et trobin quan busquin el teu servei a la teva zona: fitxa de Google, el web preparat per dins i les dades que Google necessita.', '/posicionamiento-google/'],
    ['Manteniment', 'Allotjament, còpies de seguretat i els teus canvis fets per mi, amb un pla ajustat al que el teu web necessita de debò.', '/mantenimiento-web/'],
  ],
  serviciosVer: 'Més informació (castellà)',
  serviciosIdioma: 'en castellà',

  revision: {
    etiqueta: 'Revisió gratuïta',
    titulo: 'Ja tens web? Et dic *gratis* què canviaria.',
    texto:
      'Em passes l’adreça i et responc per correu amb el que funciona, el que falla al mòbil i a Google, i què arreglaria primer. Sense compromís.',
    cta: 'Demanar la revisió gratuïta',
  },

  procesoEtiqueta: 'Procés',
  procesoTitulo: 'Clar des del *primer missatge*.',
  proceso: [
    ['Parlem del teu negoci', 'M’expliques què fas, a qui et dirigeixes i què ha d’aconseguir el teu web.'],
    ['Tanquem el pla', 'Reps l’abast, el preu i el termini per escrit. Saps què inclou abans de començar.'],
    ['Dissenyo i construeixo', 'Ordeno el contingut, dissenyo el web i el preparo per a mòbil i escriptori. Revisem el resultat junts.'],
    ['Revisem i publiquem', 'Comprovem contingut, enllaços i contacte. El web es publica quan està llest i tens clar com seguir.'],
  ],

  precioEtiqueta: 'Pressupost',
  precioTitulo: 'Un pressupost que comença *per escoltar-te*.',
  precioIntro:
    'Un càlcul automàtic no té sentit quan cada negoci parteix d’un lloc diferent i necessita una combinació pròpia de pàgines, continguts i funcions.',
  precioCaja: 'Proposta a mida',
  precioNota: 'Primer en parlem; després reps l’abast, el calendari i el pressupost per escrit.',
  precioIncluye: ['Les pàgines que necessiti el teu projecte', 'Disseny per a mòbil i escriptori', 'Una base preparada per créixer amb tu', 'Formulari, WhatsApp i posada en marxa'],
  precioCta: 'Explica’m què necessites',
  precioPasos: [
    ['Primer, entendre el projecte', 'Parlem del teu negoci, el punt de partida i el que ha d’aconseguir el web.'],
    ['Després, concretar l’abast', 'Pàgines, idiomes, reserves, migració o visibilitat: només incloem el que necessita el teu projecte.'],
    ['Finalment, un pressupost clar', 'Reps l’abast, el calendari i el cost per escrit abans de decidir, sense una xifra genèrica que et pugui portar a error.'],
  ],

  sobreEtiqueta: 'Qui hi ha al darrere',
  sobreTitulo: 'Soc en Sergio. I el teu projecte *el porto jo*.',
  sobreTexto:
    'Dissenyo, desenvolupo i parlo amb tu. Una sola persona que coneix el projecte de principi a fi, amb comunicació directa i decisions que pots entendre.',
  sobreFoto: 'Sergio García, dissenyador web',
  credenciales: [
    ['Disseny i continguts', 'Dos anys al web de l’EEBE (UPC), amb una beca d’aprenentatge.'],
    ['Ciberseguretat', 'Un any a EY, treballant en ciberseguretat.'],
    ['Ara', 'Disseny web independent per a negocis i professionals de tot Espanya.'],
  ],
  tecnicaTitulo: 'Una base tècnica que et simplifica les coses.',
  tecnicaTexto:
    'Per a webs corporatius, treballo amb pàgines estàtiques: càrrega àgil, menys manteniment i menys components exposats. Les funcions externes, com formularis o reserves, es revisen a part.',

  faqEtiqueta: 'Preguntes freqüents',
  faqTitulo: 'Abans de *fer el pas*.',
  faqs: [
    ['Treballes amb negocis de qualsevol lloc d’Espanya?', 'Sí. Podem definir el projecte, revisar el disseny i preparar el llançament a distància. Treballes directament amb mi durant tot el procés.'],
    ['Què necessites per començar?', 'Una conversa per entendre el teu negoci i els textos, fotos o identitat que ja tinguis. Si falta material, ho veiem abans de tancar l’abast i el calendari.'],
    ['El web i el domini són meus?', 'Sí. El domini va al teu nom i el web és teu. Acordem com administrar-lo i mantenir-lo quan estigui publicat.'],
    ['Què passa si vull canviar alguna cosa després?', 'Pots demanar canvis puntuals o un pla de manteniment. T’indico l’abast i el cost abans de fer-los, perquè no tots els canvis requereixen la mateixa feina.'],
    ['Pots conservar el meu domini i el meu web mentre treballes?', 'Sí. El web nou es prepara a part. Revisem el contingut, les adreces i les redireccions necessàries abans de substituir la versió actual.'],
    ['Inclous posicionament a Google?', 'El web es construeix amb una base tècnica cuidada. La configuració de la fitxa de Google i el servei de posicionament es pressuposten a part. No es poden garantir posicions: depenen també de la competència i del contingut.'],
  ],
};

export const studio: Record<Lang, typeof es> = { es, en, ca };
