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
      'Trabajo con negocios de Cornellà y de toda España. La web se diseña desde cero, con trato directo y un presupuesto claro antes de empezar.',
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
          'No. Trabajo con negocios de toda España. En Cornellà conozco de cerca el tejido local y podemos hablar con la misma cercanía, pero el proceso también funciona a distancia.',
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
      'Diseño y desarrollo a medida, con una persona responsable del proyecto de principio a fin y un presupuesto claro antes de empezar.',
    resumen: 'Webs a medida sin precio de agencia.',
    incluyeTitular: 'La diferencia con una agencia',
    incluye: [
      'Hablas directamente con la persona que diseña y desarrolla tu web.',
      'El presupuesto se cierra antes de empezar y no se mueve por el camino.',
      'Para webs corporativas, trabajo con una base estática que reduce el mantenimiento y los componentes expuestos.',
      'La base técnica se prepara para cargar con agilidad y para que los buscadores puedan entender el contenido.',
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
          'Trabajo de forma independiente. Eso permite concentrar el presupuesto en el alcance del proyecto y mantener una comunicación directa.',
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

