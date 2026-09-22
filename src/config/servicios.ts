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
  /** Una linea para el bloque de la portada. */
  resumen: string;
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
      'Tu web hecha desde cero, no una plantilla con tu logo encima. Presupuesto personalizado y todo por escrito antes de empezar.',
    h1: 'Diseño de páginas web para negocios',
    bajada:
      'Tu web hecha desde cero, no una plantilla con tu logo encima. Primero definimos lo que necesita tu negocio y después recibes un presupuesto personalizado.',
    resumen:
      'Tu web desde cero, con alcance y presupuesto a medida antes de empezar.',
    incluyeTitular: 'Qué incluye',
    incluye: [
      'Las páginas que necesite tu proyecto, diseñadas a medida de tu negocio.',
      'Diseñada para que se lea y se use con comodidad en móvil.',
      'Tu dominio pagado el primer año y la web puesta en marcha.',
      'Formulario de contacto, botón de WhatsApp y mapa para llegar a tu local.',
      'Te acompaño en la puesta en marcha y me ocupo de los ajustes acordados.',
    ],
    datos: [
      { cifra: 'A medida', texto: 'un presupuesto según las páginas, contenidos y funciones que necesitas' },
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
          'Me lo dices y valoramos el cambio. Te explico el alcance y el coste antes de hacerlo, porque una corrección de texto y una página nueva requieren trabajos distintos.',
      },
      {
        pregunta: '¿Por qué es más barato que una agencia?',
        respuesta:
          'Porque trabajo de forma independiente y directa. El presupuesto cubre el trabajo del proyecto, sin estructura de agencia de por medio.',
      },
    ],
  },
  {
    slug: 'rediseno-web',
    nombre: 'Rediseño de web antigua',
    titulo: 'Rediseño de webs antiguas — Sergio García Ortiz',
    descripcion:
      'Si tu web va lenta, no se ve bien en el móvil o te da vergüenza enseñarla, la rehago desde cero sin perder lo que ya tienes en Google.',
    h1: 'Rediseño de webs antiguas',
    bajada:
      'Si tu web va lenta, no se ve bien en el móvil o te da vergüenza enseñarla, la rehago desde cero sin perder lo que ya tienes en Google.',
    resumen:
      'Tu web actual rehecha sin perder lo que ya tienes en Google.',
    incluyeTitular: 'Qué incluye',
    incluye: [
      'La web rehecha desde cero, no un parche encima de la que tienes.',
      'Te quedas con tu dominio y con las direcciones que ya estaban en Google.',
      'Traslado de tus textos y fotos a la web nueva.',
      'Una experiencia móvil clara, revisada desde el principio.',
      'Tu web actual sigue funcionando hasta el día que publicamos la nueva.',
    ],
    datos: [
      { cifra: 'A medida', texto: 'el rediseño según el estado de tu web y lo que haya que conservar o rehacer' },
      { cifra: 'Planificado', texto: 'el traslado de contenidos y direcciones se define antes de empezar' },
      { cifra: '7 días', texto: 'de empezar a estar publicada' },
    ],
    faq: [
      {
        pregunta: '¿Pierdo el posicionamiento que tengo?',
        respuesta:
          'No. Se mantienen las direcciones que Google ya conoce, y las que cambien se redirigen a la página nueva que les corresponde.',
      },
      {
        pregunta: '¿Me quedo con mi dominio?',
        respuesta:
          'Sí, el dominio es tuyo y sigue a tu nombre. Yo solo lo administro mientras quieras.',
      },
      {
        pregunta: '¿Mi web actual se cae mientras trabajas?',
        respuesta:
          'No. La nueva se construye aparte y tu web de siempre sigue en pie; solo se cambia el día que publicamos, y eso son minutos.',
      },
      {
        pregunta: '¿Y si luego quiero cambiar cosas?',
        respuesta:
          'Me lo dices y valoramos el cambio. Recibes el alcance y el coste por escrito antes de hacerlo, porque no todos los cambios requieren el mismo trabajo.',
      },
    ],
  },
  {
    slug: 'mantenimiento-web',
    nombre: 'Mantenimiento',
    titulo: 'Mantenimiento de páginas web — Sergio García Ortiz',
    descripcion:
      'Alojamiento, copias de seguridad y cambios de contenido con un plan adaptado a la frecuencia y las necesidades de tu web.',
    h1: 'Mantenimiento de páginas web',
    bajada:
      'Alojamiento, copias de seguridad y tus cambios hechos por mí, con un plan ajustado a lo que tu web necesita de verdad.',
    resumen:
      'Alojamiento, copias y cambios con un plan de mantenimiento a medida.',
    incluyeTitular: 'Qué incluye',
    incluye: [
      'Alojamiento y copias de seguridad de tu web.',
      'Los cambios de texto y fotos que necesites, hechos por mí.',
      'Las páginas nuevas se valoran por separado antes de construirlas.',
      'Actualizaciones y vigilancia de que todo sigue funcionando.',
      'Con el plan Prioritario, además, un repaso cada mes de cómo va la web.',
    ],
    datos: [
      { cifra: 'A medida', texto: 'según la frecuencia y el tipo de cambios que necesite tu web' },
      { cifra: 'Prioridad', texto: 'acordamos los tiempos de respuesta que necesita tu negocio' },
      { cifra: 'Por escrito', texto: 'sabes qué incluye el mantenimiento antes de contratarlo' },
    ],
    faq: [
      {
        pregunta: '¿Qué cuenta como cambio?',
        respuesta:
          'Textos y fotos: cambiar precios, horarios, servicios o añadir imágenes nuevas. Una página completa se valora aparte porque implica diseño, contenido y comprobaciones adicionales.',
      },
      {
        pregunta: '¿Tengo que atarme un año?',
        respuesta:
          'No. Las condiciones y la duración se acuerdan contigo antes de empezar y quedan por escrito, sin letra pequeña.',
      },
      {
        pregunta: '¿Y si no quiero mantenimiento?',
        respuesta:
          'No hace falta: la web funciona sin plugins que tengas que actualizar. Si algún día quieres cambios, los valoramos de forma puntual antes de hacerlos.',
      },
    ],
  },
  {
    slug: 'posicionamiento-google',
    nombre: 'Posicionamiento en Google',
    titulo: 'Posicionamiento en Google para negocios locales — Sergio García Ortiz',
    descripcion:
      'Que te encuentren cuando busquen tu servicio en tu zona: ficha de Google, la web preparada por dentro y los datos que Google necesita.',
    h1: 'Posicionamiento en Google para negocios locales',
    bajada:
      'Que te encuentren cuando busquen tu servicio en tu zona: ficha de Google, la web preparada por dentro y los datos que Google necesita.',
    resumen:
      'Que te encuentren en Google cuando busquen tu servicio en tu zona.',
    incluyeTitular: 'Qué incluye',
    incluye: [
      'Tu ficha de Google creada y rellenada: servicios, zonas, horario y fotos.',
      'La web preparada por dentro: títulos, descripciones y los datos que Google lee.',
      'El sitio declarado a Google para que sepa qué páginas tienes.',
      'Una web rápida, que es de lo poco que Google mide y compara de verdad.',
      'Te explico cómo pedir reseñas, que es lo que más mueve en las búsquedas de tu barrio.',
    ],
    datos: [
      { cifra: 'A medida', texto: 'según el punto de partida de tu web y de tu ficha de Google' },
      { cifra: '2 días', texto: 'de trabajo añadidos al plazo de la web' },
      { cifra: 'Sin cuota', texto: 'es un trabajo puntual, no una suscripción automática' },
    ],
    faq: [
      {
        pregunta: '¿Cuánto tardo en aparecer?',
        respuesta:
          'La ficha, en cuanto Google la verifica: unos días. En los resultados de búsqueda va más despacio, semanas, y depende de la competencia que tengas en tu zona.',
      },
      {
        pregunta: '¿Qué es la ficha de Google y por qué importa?',
        respuesta:
          'Es la ficha con tu nombre, teléfono, horario y reseñas que puede aparecer en el mapa y en los resultados locales. Ayuda a que Google entienda y muestre tu negocio.',
      },
      {
        pregunta: '¿Me garantizas el primer puesto?',
        respuesta:
          'No, y quien te lo garantice te está engañando. Lo que hago es que Google tenga toda la información para encontrarte y entenderte; el puesto depende de la competencia que tengas en tu zona.',
      },
    ],
  },
];

export const porSlug = (slug: string) => SERVICIOS.find((s) => s.slug === slug);

