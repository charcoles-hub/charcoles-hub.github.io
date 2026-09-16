export interface Faq {
  pregunta: string;
  respuesta: string;
}

export interface Servicio {
  slug: string;
  /** Migas y navegación: corto. */
  nombre: string;
  titulo: string;
  descripcion: string;
  h1: string;
  bajada: string;
  incluyeTitular: string;
  incluye: string[];
  datos: { cifra: string; texto: string }[];
  faq: Faq[];
}

// Cada texto de aquí lo ha aprobado Sergio antes de escribirse. Ver
// feedback_copy_web_no_reciclar: nada de traer frases de la plantilla del
// mailing ni de la ficha de Google por iniciativa propia.
export const SERVICIOS: Servicio[] = [
  {
    slug: 'diseno-web',
    nombre: 'Diseño de web nueva',
    titulo: 'Diseño de páginas web para negocios — Sergio García Ortiz',
    descripcion:
      'Tu web hecha desde cero, no una plantilla con tu logo encima. Desde 500 €, publicada en 7 días.',
    h1: 'Diseño de páginas web para negocios',
    bajada:
      'Tu web hecha desde cero, no una plantilla con tu logo encima. Desde 500 €, publicada en 7 días.',
    incluyeTitular: 'Qué incluye',
    incluye: [
      'Hasta 5 páginas diseñadas a medida de tu negocio.',
      'Se ve perfecta en el móvil, que es por donde te va a entrar casi todo el mundo.',
      'Tu dominio pagado el primer año y la web puesta en marcha.',
      'Formulario de contacto, botón de WhatsApp y mapa para llegar a tu local.',
      'Tú no tocas nada: me encargo yo de todo.',
    ],
    datos: [
      { cifra: '500 €', texto: 'la web entera, con presupuesto cerrado antes de empezar' },
      { cifra: '7 días', texto: 'de empezar a estar publicada' },
      { cifra: '24 h', texto: 'para tener tu presupuesto por escrito, sin compromiso' },
    ],
    faq: [
      {
        pregunta: '¿Cuánto tarda?',
        respuesta: 'Siete días desde que empezamos. El presupuesto por escrito lo tienes en 24 horas.',
      },
      {
        pregunta: '¿Qué necesitas de mí?',
        respuesta:
          'Los textos si los tienes, las fotos si las tienes, y una llamada de diez minutos para entender el negocio.',
      },
      {
        pregunta: '¿La web es mía?',
        respuesta:
          'Sí. El dominio va a tu nombre y la web es tuya; yo solo la administro mientras quieras.',
      },
      {
        pregunta: '¿Y si luego quiero cambiar cosas?',
        respuesta:
          'Me lo dices y te lo cambio yo: 25 € una tanda de textos y fotos, 50 € una página nueva. Con mantenimiento los cambios van incluidos y las páginas nuevas salen a mitad de precio.',
      },
      {
        pregunta: '¿Por qué es más barato que una agencia?',
        respuesta:
          'Porque trabajo por mi cuenta: no hay comercial, ni jefe de proyecto, ni becario haciendo tu web mientras otro te la vende.',
      },
    ],
  },
];

export const porSlug = (slug: string) => SERVICIOS.find((s) => s.slug === slug);
