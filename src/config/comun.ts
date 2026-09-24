import { TELEFONO, type Lang } from './site';

/**
 * Textos de las piezas que comparten todas las páginas: cabecera, contacto,
 * pie y barra fija del móvil. Los de cada página viven en su propio config.
 */
export const COMUN = {
  es: {
    saltar: 'Saltar al contenido',
    rol: 'Diseño y desarrollo web',
    navPrincipal: 'Navegación principal',
    idioma: 'Idioma',
    hablemos: 'Hablemos',
    whatsapp: 'WhatsApp',
    llamar: 'Llamar',
    migas: 'Estás aquí',
    rapido: 'Contacto rápido',
    inicio: 'Inicio',
    contacto: {
      etiqueta: 'El siguiente paso',
      titulo: 'Hagamos que tu web *esté a tu altura*.',
      texto:
        'Cuéntame a qué te dedicas, qué necesitas y si ya tienes web. Te respondo con una propuesta y un presupuesto por escrito, sin compromiso.',
      whatsapp: 'Hablemos por WhatsApp',
      email: 'Prefiero escribir un email',
      llamar: 'Prefiero llamar',
      revision: '¿Ya tienes web?',
      revisionTexto: 'Pide una revisión gratuita',
      nota: 'Presupuesto por escrito en 24 h. Hablas siempre conmigo.',
    },
    pie: {
      lema: 'Diseño y desarrollo web a medida para negocios de toda España. Trato directo, de la primera idea a la última página.',
      servicios: 'Servicios',
      sectores: 'Sectores',
      zonas: 'Zonas',
      contacto: 'Contacto',
      resena: '¿Hemos trabajado juntos? Escribe una reseña',
      arriba: 'Volver arriba',
      lugar: 'Cornellà de Llobregat, Barcelona',
    },
    waTexto: 'Hola Sergio, me gustaría hablar contigo sobre una web para mi negocio.',
  },
  en: {
    saltar: 'Skip to content',
    rol: 'Web design & development',
    navPrincipal: 'Main navigation',
    idioma: 'Language',
    hablemos: 'Let’s talk',
    whatsapp: 'WhatsApp',
    llamar: 'Call',
    migas: 'You are here',
    rapido: 'Quick contact',
    inicio: 'Home',
    contacto: {
      etiqueta: 'Your next step',
      titulo: 'Let’s build a website *that does you justice*.',
      texto:
        'Tell me what you do, what you need and whether you already have a website. I’ll reply with a proposal and a written quote, without obligation.',
      whatsapp: 'Let’s talk on WhatsApp',
      email: 'I’d rather send an email',
      llamar: 'I’d rather call',
      revision: '',
      revisionTexto: '',
      nota: 'A written quote within 24 hours. You always deal with me.',
    },
    pie: {
      lema: 'Custom web design and development for businesses across Spain. Direct communication, from the first idea to the final page.',
      servicios: 'Services (in Spanish)',
      sectores: 'Industries (in Spanish)',
      zonas: 'Areas',
      contacto: 'Contact',
      resena: 'Have we worked together? Write a review',
      arriba: 'Back to top',
      lugar: 'Cornellà de Llobregat, Barcelona, Spain',
    },
    waTexto: 'Hi Sergio, I would like to talk about a website for my business.',
  },
  ca: {
    saltar: 'Saltar al contingut',
    rol: 'Disseny i desenvolupament web',
    navPrincipal: 'Navegació principal',
    idioma: 'Idioma',
    hablemos: 'En parlem',
    whatsapp: 'WhatsApp',
    llamar: 'Trucar',
    migas: 'Ets aquí',
    rapido: 'Contacte ràpid',
    inicio: 'Inici',
    contacto: {
      etiqueta: 'El següent pas',
      titulo: 'Fem que el teu web *estigui a la teva altura*.',
      texto:
        'Explica’m a què et dediques, què necessites i si ja tens web. Et responc amb una proposta i un pressupost per escrit, sense compromís.',
      whatsapp: 'Parlem per WhatsApp',
      email: 'Prefereixo escriure un correu',
      llamar: 'Prefereixo trucar',
      revision: 'Ja tens web?',
      revisionTexto: 'Demana una revisió gratuïta (en castellà)',
      nota: 'Pressupost per escrit en 24 h. Parles sempre amb mi.',
    },
    pie: {
      lema: 'Disseny i desenvolupament web a mida per a negocis de tot Espanya. Tracte directe, de la primera idea a l’última pàgina.',
      servicios: 'Serveis (en castellà)',
      sectores: 'Sectors (en castellà)',
      zonas: 'Zones',
      contacto: 'Contacte',
      resena: 'Hem treballat junts? Escriu una ressenya',
      arriba: 'Tornar a dalt',
      lugar: 'Cornellà de Llobregat, Barcelona',
    },
    waTexto: 'Hola Sergio, m’agradaria parlar amb tu d’un web per al meu negoci.',
  },
} as const satisfies Record<Lang, unknown>;

/** Enlace de WhatsApp con el mensaje ya escrito. */
export const whatsapp = (texto: string) => `${TELEFONO.wa}?text=${encodeURIComponent(texto)}`;

const escapar = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Los titulares marcan el énfasis con asteriscos: «Tu web *a tu altura*».
 * Devuelve HTML seguro (el texto se escapa) con el tramo marcado en <em>.
 */
export const enfasis = (texto: string) => escapar(texto).replace(/\*([^*]+)\*/g, '<em>$1</em>');

/** El mismo texto sin los asteriscos, para <title>, alt o aria-label. */
export const plano = (texto: string) => texto.replace(/\*/g, '');
