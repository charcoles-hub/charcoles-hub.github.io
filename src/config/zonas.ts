import type { Servicio } from './servicios';

/**
 * Páginas de zona. Cada una tiene contenido PROPIO: si fueran la misma
 * plantilla con el nombre del municipio cambiado, Google las trata como
 * páginas-puerta y penaliza el sitio entero. Lo que cambia de verdad en cada
 * una es el argumento, no el topónimo.
 */
export const ZONAS: Servicio[] = [
  {
    slug: 'diseno-web-cornella',
    nombre: 'Cornellà de Llobregat',
    titulo: 'Diseño web en Cornellà de Llobregat — Sergio García Ortiz',
    descripcion:
      'Hago webs para negocios de Cornellà desde 500 €, publicadas en 7 días. Trabajo por mi cuenta: cuando llamas, te contesto yo.',
    h1: 'Diseño web en Cornellà de Llobregat',
    bajada:
      'Soy de aquí. Hago la web de tu negocio desde cero, desde 500 € y publicada en 7 días, y cuando llamas te contesto yo y no un comercial.',
    resumen: 'Webs para negocios de Cornellà, desde 500 €.',
    incluyeTitular: 'Por qué te interesa que sea de aquí',
    incluye: [
      'Hablas conmigo directamente, en el mismo horario y sin intermediarios.',
      'Conozco el tipo de negocio que hay aquí: comercio de barrio, clínicas, gestorías y talleres.',
      'La web se hace por teléfono y WhatsApp, sin que tengas que cerrar el local para reuniones.',
      'Presupuesto cerrado antes de empezar, sin cuotas escondidas.',
      'Si algún día quieres cambios, me escribes y te los hago yo.',
    ],
    datos: [
      { cifra: '500 €', texto: 'la web entera, con presupuesto cerrado antes de empezar' },
      { cifra: '7 días', texto: 'de empezar a estar publicada' },
      { cifra: '24 h', texto: 'para tener tu presupuesto por escrito, sin compromiso' },
    ],
    faq: [
      {
        pregunta: '¿Trabajas solo con negocios de Cornellà?',
        respuesta:
          'No, trabajo con quien me llame de donde sea. Pero los de aquí los llevo con más gusto, y se nota en la atención.',
      },
      {
        pregunta: '¿Hace falta que nos veamos en persona?',
        respuesta:
          'No. Todo se hace por teléfono y WhatsApp, que es más rápido para los dos y no te obliga a cerrar el local.',
      },
      {
        pregunta: '¿Cuánto cuesta y cuánto tarda?',
        respuesta:
          'Desde 500 € la web entera y siete días desde que empezamos. El presupuesto por escrito lo tienes en 24 horas.',
      },
    ],
  },
  {
    slug: 'diseno-web-baix-llobregat',
    nombre: 'Baix Llobregat',
    titulo: 'Diseño web en el Baix Llobregat — Sergio García Ortiz',
    descripcion:
      'Webs para negocios del Baix Llobregat: Cornellà, Esplugues, Sant Joan Despí, Sant Just, Sant Boi, El Prat, Viladecans. Desde 500 €.',
    h1: 'Diseño web en el Baix Llobregat',
    bajada:
      'Trabajo con negocios de toda la comarca: Cornellà, Esplugues, Sant Joan Despí, Sant Just Desvern, Sant Boi, El Prat, Viladecans, Gavà y Castelldefels.',
    resumen: 'Webs para negocios de toda la comarca.',
    incluyeTitular: 'Qué tipo de negocios llevo por aquí',
    incluye: [
      'Clínicas y centros de salud: fisioterapia, dental, psicología y veterinaria.',
      'Servicios profesionales: gestorías, estudios de arquitectura y autoescuelas.',
      'Comercio y hostelería de barrio: barberías, cafeterías y gimnasios.',
      'Puedes ver una web de ejemplo de cada uno de esos rubros antes de decidir nada.',
      'Mismo precio y mismo plazo en cualquier municipio de la comarca.',
    ],
    datos: [
      { cifra: '500 €', texto: 'la web entera, igual en cualquier municipio de la comarca' },
      { cifra: '7 días', texto: 'de empezar a estar publicada' },
      { cifra: '10', texto: 'webs de ejemplo por rubro que puedes abrir y recorrer' },
    ],
    faq: [
      {
        pregunta: '¿Cobras más si mi negocio está lejos de Cornellà?',
        respuesta:
          'No. El trabajo es el mismo y se hace en remoto, así que el precio no cambia por el municipio.',
      },
      {
        pregunta: '¿Tienes algún ejemplo de mi sector?',
        respuesta:
          'Probablemente sí: hay ejemplos de barbería, clínica dental, veterinaria, fisioterapia, gestoría, psicología, cafetería, gimnasio, arquitectura y autoescuela. Todos se pueden abrir y recorrer.',
      },
      {
        pregunta: '¿Trabajas con negocios que ya tienen web?',
        respuesta:
          'Sí, es la mitad de lo que hago: rehago webs antiguas que van lentas o no funcionan en el móvil, sin perder lo que ya tienen en Google.',
      },
    ],
  },
  {
    slug: 'diseno-web-barcelona',
    nombre: 'Barcelona',
    titulo: 'Diseño web en Barcelona — Sergio García Ortiz',
    descripcion:
      'Webs a medida para negocios de Barcelona desde 500 €, publicadas en 7 días. Sin agencia en medio: hablas siempre con quien la construye.',
    h1: 'Diseño web en Barcelona',
    bajada:
      'Lo mismo que te cobraría una agencia de Barcelona, hecho por la persona con la que hablas y por bastante menos dinero.',
    resumen: 'Webs a medida sin precio de agencia.',
    incluyeTitular: 'La diferencia con una agencia',
    incluye: [
      'No hay comercial, ni jefe de proyecto, ni becario construyendo tu web mientras otro te la vende.',
      'El presupuesto se cierra antes de empezar y no se mueve por el camino.',
      'Entrego archivos estáticos: no hay panel ni plugins que se rompan o se hackeen.',
      'La web va rápida, que es de lo poco que Google mide y compara de verdad.',
      'Y si dentro de un año quieres cambios, sigues hablando con la misma persona.',
    ],
    datos: [
      { cifra: '500 €', texto: 'la web entera, con presupuesto cerrado antes de empezar' },
      { cifra: '7 días', texto: 'de empezar a estar publicada' },
      { cifra: '1', texto: 'persona de principio a fin: la que te coge el teléfono' },
    ],
    faq: [
      {
        pregunta: '¿Por qué cuesta tanto menos que en una agencia?',
        respuesta:
          'Porque en el precio de una agencia estás pagando su estructura: oficina, comerciales y gestores de proyecto. Aquí pagas el trabajo.',
      },
      {
        pregunta: '¿Y si mi negocio necesita algo más complejo?',
        respuesta:
          'Lo que haga falta de más (citas online, dos idiomas, tienda) se añade con su precio a la vista antes de empezar. Si es algo que no puedo hacer bien, te lo digo.',
      },
      {
        pregunta: '¿Trabajas con negocios de toda Barcelona?',
        respuesta:
          'Sí, de la ciudad y del área metropolitana. Todo se hace por teléfono y WhatsApp, así que la distancia no cambia nada.',
      },
    ],
  },
];
