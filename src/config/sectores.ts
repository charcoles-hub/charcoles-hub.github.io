import type { Faq } from './servicios';

/**
 * Páginas de diseño web por sector. Sirven para dos cosas: aparecer en
 * búsquedas como «diseño web para clínicas dentales» y tener un enlace a medida
 * que mandar a cada cliente potencial de ese sector.
 *
 * Cada página tiene contenido PROPIO (qué necesita la web de ese negocio, qué
 * suele fallar, preguntas del sector). Si fueran la misma plantilla con el
 * nombre cambiado, Google las trataría como páginas puerta.
 *
 * MISMAS REGLAS QUE EL RESTO DE LA WEB: la demo de cada sector es un CONCEPTO
 * y se dice; el único proyecto real es Fisioymés. Nada de cifras inventadas.
 */
export interface Sector {
  slug: string;
  /** Nombre corto: tarjetas, migas y pie. */
  nombre: string;
  /** Una línea para la tarjeta de la portada. */
  resumen: string;
  titulo: string;
  descripcion: string;
  h1: string;
  bajada: string;
  /** «Lo que necesita la web de…» */
  necesitaTitulo: string;
  necesita: { titulo: string; texto: string }[];
  fallos: string[];
  demo: { slug: string; nombre: string; texto: string };
  /** Enseña el caso real de Fisioymés en la página. */
  casoReal?: boolean;
  faq: Faq[];
  /** Público del Service en los datos estructurados. */
  publico: string;
  /** Cómo se llama el sitio del cliente: «Hablemos de la web de tu clínica». */
  local: string;
  waTexto: string;
}

export const SECTORES: Sector[] = [
  {
    slug: 'diseno-web-clinicas-dentales',
    nombre: 'Clínicas dentales',
    resumen: 'Tratamientos que se entienden y la cita a un toque.',
    titulo: 'Diseño web para clínicas dentales · Sergio García',
    descripcion:
      'Webs para clínicas dentales que transmiten confianza y facilitan pedir cita: tratamientos explicados sin tecnicismos, el equipo con nombre y cita a un toque.',
    h1: 'Diseño web para clínicas dentales',
    bajada:
      'Ir al dentista da respeto. Tu web puede quitarlo antes de la primera visita: tratamientos explicados sin tecnicismos, un equipo con cara y nombre, y la cita a un toque desde el móvil.',
    necesitaTitulo: 'Lo que necesita la web de una *clínica dental*.',
    necesita: [
      { titulo: 'La cita, siempre a mano', texto: 'Botón de cita, teléfono y WhatsApp visibles en el móvil sin tener que buscarlos. Si ya usas una agenda online, la web la enlaza o la integra.' },
      { titulo: 'Una página por tratamiento', texto: 'Implantes, ortodoncia, estética, odontopediatría… Cada tratamiento explicado en claro: en qué consiste, cuánto dura y qué esperar. Es también lo que Google necesita para enseñarte cuando alguien lo busca cerca.' },
      { titulo: 'El equipo, con cara y nombre', texto: 'Fotos reales de la clínica y del equipo, con su formación y número de colegiado. En salud, la confianza se construye con personas, no con fotos de banco de imágenes.' },
      { titulo: 'Primera visita y financiación claras', texto: 'Si ofreces primera visita gratuita o financiación, que se vea antes de llamar: es una de las primeras dudas de un paciente nuevo.' },
      { titulo: 'Urgencias sin rodeos', texto: 'Un dolor de muelas no espera. Horario, teléfono de urgencias y qué hacer fuera de horario, visibles desde el primer vistazo.' },
      { titulo: 'Reseñas y ficha de Google', texto: 'Tu ficha de Google conectada con la web y tus reseñas a la vista, para que quien busca dentista en su barrio te encuentre y compare con confianza.' },
    ],
    fallos: [
      'El teléfono y la cita, escondidos al final de la página.',
      'Tratamientos en una lista sin explicar, o con textos pensados para dentistas y no para pacientes.',
      'Fotos de banco de imágenes que no se parecen a tu clínica.',
      'Una web que en el móvil carga lenta o se ve descuadrada.',
    ],
    demo: {
      slug: 'demo-dental-sereno',
      nombre: 'Sereno',
      texto: 'Un concepto de clínica dental en petróleo y porcelana, lejos del cian de siempre: tratamientos explicados paso a paso, la confianza arriba del todo y la cita a un toque.',
    },
    faq: [
      { pregunta: '¿Puedo mantener mi sistema de citas actual?', respuesta: 'Sí. Si ya usas una agenda online o un programa de gestión con reservas, la web lo enlaza o lo integra para que no cambies tu forma de trabajar. Lo revisamos antes de cerrar el presupuesto.' },
      { pregunta: '¿Me ayudas con los textos de los tratamientos?', respuesta: 'Te ayudo a ordenarlos: me pasas la información de cada tratamiento y la estructuro para que un paciente la entienda en el móvil. Tú revisas y apruebas cada texto antes de publicar, porque la información clínica la firmas tú.' },
      { pregunta: '¿Aparecerá mi clínica en Google?', respuesta: 'La web se entrega preparada por dentro: títulos, descripciones, datos estructurados y velocidad. La ficha de Google y el posicionamiento local se presupuestan aparte. Nadie puede garantizarte una posición: depende también de la competencia de tu zona y de tus reseñas.' },
      { pregunta: '¿Cuánto cuesta la web de una clínica dental?', respuesta: 'Depende sobre todo de cuántos tratamientos quieras explicar, de si la necesitas en más de un idioma y de cómo se conecte tu sistema de citas. Primero hablamos y después recibes el alcance, el plazo y el precio por escrito.' },
    ],
    publico: 'Clínicas dentales',
    local: 'clínica',
    waTexto: 'Hola Sergio, tengo una clínica dental y me gustaría hablar contigo sobre nuestra web.',
  },
  {
    slug: 'diseno-web-fisioterapeutas',
    nombre: 'Fisioterapia',
    resumen: 'Que cada paciente encuentre su lesión y pida cita.',
    titulo: 'Diseño web para fisioterapeutas · Sergio García',
    descripcion:
      'Webs para fisioterapeutas: lesiones y tratamientos fáciles de encontrar en el móvil, cita a un toque y la web preparada para búsquedas locales.',
    h1: 'Diseño web para fisioterapeutas',
    bajada:
      'Quien busca fisio suele tener dolor y prisa. Tu web tiene que decirle en segundos si tratas lo suyo, dónde estás y cómo pedir cita. Es justo lo que trabajé con Fisioymés.',
    necesitaTitulo: 'Lo que necesita la web de una *clínica de fisioterapia*.',
    necesita: [
      { titulo: 'Lesiones fáciles de encontrar', texto: 'Cervicalgia, lumbalgia, esguinces, tendinopatías… Que cada paciente encuentre su problema en una rejilla clara, sin leer párrafos, y llegue a su tratamiento en un toque.' },
      { titulo: 'La cita en un toque', texto: 'Reserva online, WhatsApp y teléfono visibles en el móvil. Si ya usas un sistema de reservas, se mantiene: en Fisioymés lo conservé tal cual.' },
      { titulo: 'Tu equipo y tu forma de tratar', texto: 'Quién atiende, su formación y número de colegiado, y cómo es una primera sesión contigo.' },
      { titulo: 'Tarifas, bonos y mutuas', texto: 'Si trabajas con mutuas, tienes bonos o haces primera valoración, que se sepa antes de llamar.' },
      { titulo: 'Clases y grupos', texto: 'Pilates terapéutico, hipopresivos o grupos reducidos: horarios y plazas en una sección propia.' },
      { titulo: 'En tu idioma y en tu zona', texto: 'Castellano y catalán si los necesitas, y cada página preparada para búsquedas como «fisioterapeuta en» tu barrio o tu ciudad.' },
    ],
    fallos: [
      'Páginas con mucho texto y poco orden: el paciente no encuentra su lesión.',
      'Un recorrido largo en el móvil hasta llegar a la cita.',
      'Sin información de tarifas, bonos o mutuas, justo lo que muchos quieren saber antes de llamar.',
      'Una web lenta o anticuada que no transmite el cuidado que das en consulta.',
    ],
    demo: {
      slug: 'demo-fisio-vital',
      nombre: 'Fisio Vital',
      texto: 'Un concepto de clínica de fisioterapia con la primera valoración sin compromiso como puerta de entrada y cada lesión explicada en palabras sencillas.',
    },
    casoReal: true,
    faq: [
      { pregunta: '¿Has hecho webs para clínicas de fisioterapia?', respuesta: 'Sí. Fisioymés, una clínica de Sant Cugat del Vallès, es un proyecto real que puedes explorar: rehíce su web en castellano y catalán, con las lesiones en rejilla y los tratamientos en fichas, sin tocar el sistema de reservas que ya usaban.' },
      { pregunta: '¿Puedo seguir usando mi programa de reservas?', respuesta: 'Sí. La web lo enlaza o lo integra, como hice con Fisioymés. Lo comprobamos al principio para que no tengas que cambiar tu forma de trabajar.' },
      { pregunta: '¿La web puede estar en castellano y catalán?', respuesta: 'Sí. Cada idioma tiene sus propias páginas, bien marcadas para Google, y el paciente cambia de idioma con un toque.' },
      { pregunta: '¿Cuánto cuesta la web de una clínica de fisioterapia?', respuesta: 'Depende del número de lesiones y tratamientos que quieras explicar, de los idiomas y de las clases o reservas que haya que conectar. Primero hablamos y recibes el alcance, el plazo y el precio por escrito.' },
    ],
    publico: 'Fisioterapeutas y clínicas de fisioterapia',
    local: 'clínica',
    waTexto: 'Hola Sergio, tengo una clínica de fisioterapia y me gustaría hablar contigo sobre nuestra web.',
  },
  {
    slug: 'diseno-web-psicologos',
    nombre: 'Psicología',
    resumen: 'Un primer contacto fácil, discreto y sin presión.',
    titulo: 'Diseño web para psicólogos · Sergio García',
    descripcion:
      'Webs para psicólogos y centros de psicología: un tono cercano, tus áreas de trabajo explicadas con claridad y un primer contacto discreto, presencial u online.',
    h1: 'Diseño web para psicólogos',
    bajada:
      'Pedir ayuda cuesta. Tu web debería ponerlo fácil: un tono cercano, información clara sobre cómo trabajas y un primer contacto discreto, sin que nadie se sienta expuesto.',
    necesitaTitulo: 'Lo que necesita la web de una *consulta de psicología*.',
    necesita: [
      { titulo: 'Un tono que baje el pulso', texto: 'Colores, fotos y palabras que transmitan calma, lejos de la estética clínica fría y de las fotos de alguien mirando al horizonte.' },
      { titulo: 'En qué puedes ayudar', texto: 'Ansiedad, duelo, pareja, adolescentes… Cada área explicada con claridad para que la persona se reconozca y sepa que ha llegado al sitio adecuado.' },
      { titulo: 'La primera sesión, sin misterio', texto: 'Qué pasa en la primera sesión, cuánto dura, si es presencial u online y, si quieres, cuánto cuesta.' },
      { titulo: 'Un contacto discreto', texto: 'Formulario o WhatsApp que pidan solo lo imprescindible, con la privacidad explicada en claro. Los detalles se hablan en consulta, no en un formulario.' },
      { titulo: 'Tus credenciales, visibles', texto: 'Número de colegiado o colegiada, habilitación sanitaria y formación: transmiten seguridad sin necesidad de adornos.' },
      { titulo: 'Terapia online bien explicada', texto: 'Si atiendes a distancia, cómo funcionan las sesiones y desde dónde puede conectarse cada paciente.' },
    ],
    fallos: [
      'Textos fríos o demasiado técnicos que alejan a quien ya dudaba si pedir ayuda.',
      'Formularios que piden más datos de los necesarios.',
      'No saber cómo es la primera sesión ni cuánto cuesta, y dejarlo para otro día.',
      'Fotos de banco de imágenes que podrían ser de cualquier consulta.',
    ],
    demo: {
      slug: 'demo-psicologia-ancla',
      nombre: 'Ancla',
      texto: 'Un concepto de consulta de psicología donde todo baja el pulso: ciruela y malva, textos cercanos y la primera sesión explicada antes de pedirla.',
    },
    faq: [
      { pregunta: '¿Cómo se cuida la privacidad de quien me escribe?', respuesta: 'El formulario pide solo lo imprescindible para contactar y explica para qué se usan los datos. Recomiendo no pedir información clínica por la web: eso se habla en la primera sesión.' },
      { pregunta: '¿Debo mostrar mis precios?', respuesta: 'Lo decides tú. Mostrar el precio de la primera sesión resuelve una duda habitual antes del contacto, pero también se puede dejar para la conversación.' },
      { pregunta: '¿Me sirve si atiendo online a pacientes de toda España?', respuesta: 'Sí. La web se orienta a pacientes de cualquier lugar, con la terapia online explicada y el contacto adaptado a la distancia.' },
      { pregunta: '¿Cuánto cuesta la web de una consulta de psicología?', respuesta: 'Depende de las áreas que quieras explicar, de si necesitas agenda online y de los idiomas. Primero hablamos y recibes el alcance, el plazo y el precio por escrito.' },
    ],
    publico: 'Psicólogos y centros de psicología',
    local: 'consulta',
    waTexto: 'Hola Sergio, tengo una consulta de psicología y me gustaría hablar contigo sobre mi web.',
  },
  {
    slug: 'diseno-web-veterinarias',
    nombre: 'Veterinarias',
    resumen: 'Urgencias claras y la cita en un toque.',
    titulo: 'Diseño web para clínicas veterinarias · Sergio García',
    descripcion:
      'Webs para clínicas veterinarias: urgencias visibles sin dramatismo, servicios bien explicados, cita en un toque y tu clínica fácil de encontrar en el barrio.',
    h1: 'Diseño web para clínicas veterinarias',
    bajada:
      'Quien busca veterinario puede estar planificando una vacuna o en plena urgencia. Tu web tiene que servir a los dos: la cita en un toque y las urgencias claras, sin dramatismo.',
    necesitaTitulo: 'Lo que necesita la web de una *clínica veterinaria*.',
    necesita: [
      { titulo: 'Urgencias a la vista', texto: 'Horario de urgencias y teléfono visibles desde el primer vistazo en el móvil, con qué hacer fuera de horario.' },
      { titulo: 'Servicios explicados', texto: 'Medicina general, vacunas, cirugía, diagnóstico por imagen, peluquería o exóticos: cada servicio con lo que incluye y cómo pedirlo.' },
      { titulo: 'Cita online o por WhatsApp', texto: 'Reserva en un toque. Si tu programa de gestión tiene agenda online, la web la enlaza o la integra.' },
      { titulo: 'Instalaciones y equipo reales', texto: 'Quirófano, sala de espera y el equipo con sus pacientes de cuatro patas. Fotos reales que dan confianza.' },
      { titulo: 'Tu barrio en Google', texto: 'Ficha de Google con horarios, fotos y reseñas, conectada con la web, para que te encuentren cuando lo necesitan cerca.' },
      { titulo: 'Consejos que se agradecen', texto: 'Si quieres, una sección de consejos de temporada (golpes de calor, parásitos, viajes) que resuelve dudas de tus clientes y atrae búsquedas.' },
    ],
    fallos: [
      'El teléfono de urgencias, escondido en el pie de página.',
      'Servicios en una lista sin explicar.',
      'Horarios desactualizados o distintos a los de la ficha de Google.',
      'Una web que en el móvil cuesta usar justo cuando hay prisa.',
    ],
    demo: {
      slug: 'demo-veterinaria-manada',
      nombre: 'Manada',
      texto: 'Un concepto de clínica veterinaria «como en casa, con quirófano»: urgencias 24 h contadas sin dramatismo y la cita a un toque.',
    },
    faq: [
      { pregunta: '¿Puedo destacar el servicio de urgencias?', respuesta: 'Sí, y es de lo primero que se diseña: visible en el móvil, con el teléfono a un toque y las indicaciones para fuera de horario.' },
      { pregunta: '¿Se puede conectar mi programa de gestión veterinaria?', respuesta: 'Si tu programa ofrece reservas online, la web las enlaza o las integra. Lo revisamos al principio, antes de cerrar el presupuesto.' },
      { pregunta: '¿Quién actualiza los horarios y los avisos?', respuesta: 'Puedo hacerlo yo con un plan de mantenimiento o de forma puntual: me escribes el cambio y lo publico.' },
      { pregunta: '¿Cuánto cuesta la web de una clínica veterinaria?', respuesta: 'Depende de los servicios que quieras explicar, de las reservas y de si quieres sección de consejos. Primero hablamos y recibes el alcance, el plazo y el precio por escrito.' },
    ],
    publico: 'Clínicas veterinarias',
    local: 'clínica',
    waTexto: 'Hola Sergio, tengo una clínica veterinaria y me gustaría hablar contigo sobre nuestra web.',
  },
  {
    slug: 'diseno-web-gestorias',
    nombre: 'Gestorías y asesorías',
    resumen: 'Orden, cercanía y la primera consulta fácil.',
    titulo: 'Diseño web para gestorías y asesorías · Sergio García',
    descripcion:
      'Webs para gestorías y asesorías que transmiten orden y cercanía: servicios por tipo de cliente, primera consulta fácil y contenido útil que atrae búsquedas.',
    h1: 'Diseño web para gestorías y asesorías',
    bajada:
      'Tus clientes no buscan jerga: buscan a alguien que les quite el miedo al calendario fiscal. Tu web tiene que transmitir orden, cercanía y respuesta rápida desde el primer vistazo.',
    necesitaTitulo: 'Lo que necesita la web de una *gestoría*.',
    necesita: [
      { titulo: 'Servicios por tipo de cliente', texto: 'Autónomos, pymes y particulares encuentran lo suyo: fiscal, laboral, contable, altas, herencias… sin tener que descifrar un listado.' },
      { titulo: 'La primera consulta, fácil', texto: 'Formulario, WhatsApp o llamada, y qué documentación conviene tener a mano. Menos idas y venidas desde el primer contacto.' },
      { titulo: 'Confianza a primera vista', texto: 'El equipo con nombre, colegiaciones y la forma de trabajar: quién lleva los papeles de cada cliente y cómo le va a avisar.' },
      { titulo: 'Calendario fiscal y novedades', texto: 'Contenido útil (plazos de impuestos, cambios normativos) que tus clientes agradecen y que además atrae búsquedas.' },
      { titulo: 'Acceso a tu plataforma', texto: 'Si ya usas una plataforma para intercambiar documentos con tus clientes, un acceso visible desde la web.' },
      { titulo: 'Tu zona en Google', texto: 'Ficha de Google y páginas preparadas para búsquedas como «gestoría en» tu municipio.' },
    ],
    fallos: [
      'Webs anticuadas que transmiten lo contrario del orden que ofreces.',
      'Un listado de servicios sin explicar para quién es cada uno.',
      'Formularios que no dicen cuándo llegará la respuesta.',
      'Nada de contenido útil: la web no atrae visitas por sí sola.',
    ],
    demo: {
      slug: 'demo-gestoria-cauce',
      nombre: 'Cauce',
      texto: 'Un concepto de gestoría «fiscal, laboral y contable sin sustos ni jerga»: lo que una gestoría promete de palabra, puesto por escrito, con calendario fiscal incluido.',
    },
    faq: [
      { pregunta: '¿Puedo enlazar la plataforma que uso con mis clientes?', respuesta: 'Sí. La web enlaza de forma visible la plataforma que ya usas para intercambiar documentos, sin cambiar tu forma de trabajar.' },
      { pregunta: '¿Tendré que actualizar la web a menudo?', respuesta: 'No hace falta. Si quieres publicar novedades o cambios de horario, puedo hacerlo con un plan de mantenimiento o de forma puntual.' },
      { pregunta: '¿Me ayudas a que me encuentren en mi zona?', respuesta: 'La web se entrega preparada para búsquedas locales, y la ficha de Google se puede configurar como servicio aparte. Las posiciones no se pueden garantizar: dependen también de la competencia de tu zona.' },
      { pregunta: '¿Cuánto cuesta la web de una gestoría?', respuesta: 'Depende de los servicios y tipos de cliente que quieras explicar y de si quieres una sección de novedades. Primero hablamos y recibes el alcance, el plazo y el precio por escrito.' },
    ],
    publico: 'Gestorías y asesorías',
    local: 'gestoría',
    waTexto: 'Hola Sergio, tengo una gestoría y me gustaría hablar contigo sobre nuestra web.',
  },
  {
    slug: 'diseno-web-arquitectos',
    nombre: 'Arquitectura',
    resumen: 'Un portfolio que enseña obra, no palabrería.',
    titulo: 'Diseño web para arquitectos · Sergio García',
    descripcion:
      'Webs para arquitectos y estudios: proyectos con fotos grandes que cargan rápido, tu proceso explicado y un contacto que llega con la información necesaria.',
    h1: 'Diseño web para arquitectos',
    bajada:
      'En arquitectura, la web es el portfolio. Tiene que enseñar obra con fotos grandes y ordenadas, explicar cómo trabajas y facilitar que un cliente te cuente su proyecto.',
    necesitaTitulo: 'Lo que necesita la web de un *estudio de arquitectura*.',
    necesita: [
      { titulo: 'Proyectos que se lucen', texto: 'Fotos grandes y fichas de proyecto (ubicación, año, superficie, tipo), ordenadas por vivienda, reforma u obra nueva.' },
      { titulo: 'Rápida aunque tenga muchas fotos', texto: 'Imágenes convertidas a formatos modernos y servidas al tamaño de cada pantalla, para que el portfolio vuele también en el móvil.' },
      { titulo: 'Tu proceso, explicado', texto: 'De la primera visita a la dirección de obra: qué pasa en cada fase y qué necesitas del cliente.' },
      { titulo: 'Servicios claros', texto: 'Obra nueva, reforma integral, interiorismo, licencias o dirección de obra, cada uno con su página.' },
      { titulo: 'Un contacto que cualifica', texto: 'Un formulario que pregunta tipo de proyecto, ubicación y plazo, para llegar a la primera reunión con información.' },
      { titulo: 'Presencia en Google', texto: 'Páginas por servicio y zona y tu ficha de Google, para aparecer cuando alguien busca arquitecto cerca.' },
    ],
    fallos: [
      'Galerías pesadas que tardan en cargar, sobre todo en el móvil.',
      'Proyectos sin contexto: fotos bonitas sin saber qué se hizo ni dónde.',
      'Un único correo de contacto sin ninguna pista de qué contar.',
      'Plantillas genéricas que no transmiten el criterio de diseño del estudio.',
    ],
    demo: {
      slug: 'demo-arquitectos-traza',
      nombre: 'Traza',
      texto: 'Un concepto de estudio de arquitectura que enseña obra, no palabrería: vivienda, reforma integral y dirección de obra.',
    },
    faq: [
      { pregunta: '¿Puedo añadir proyectos nuevos yo mismo?', respuesta: 'La web no depende de un panel con plugins que actualizar. Cuando tengas un proyecto nuevo, me pasas fotos y datos y lo publico, de forma puntual o con un plan de mantenimiento.' },
      { pregunta: '¿Las fotos grandes harán que la web vaya lenta?', respuesta: 'No debería: las fotos se convierten a formatos modernos y se sirven al tamaño de cada pantalla. Es lo que hago también en esta web.' },
      { pregunta: '¿Puede estar en varios idiomas?', respuesta: 'Sí. Cada idioma tiene sus propias páginas, algo útil si trabajas con clientes internacionales.' },
      { pregunta: '¿Cuánto cuesta la web de un estudio de arquitectura?', respuesta: 'Depende sobre todo del número de proyectos y servicios, y de los idiomas. Primero hablamos y recibes el alcance, el plazo y el precio por escrito.' },
    ],
    publico: 'Arquitectos y estudios de arquitectura',
    local: 'estudio',
    waTexto: 'Hola Sergio, tengo un estudio de arquitectura y me gustaría hablar contigo sobre nuestra web.',
  },
];

/** Los tres pasos que se repiten en las páginas de sector (texto ya aprobado en /diseno-web/). */
export const PASOS_SECTOR = [
  { titulo: 'Lo aterrizamos', texto: 'Hablamos de tu negocio, de a quién quieres llegar y de lo que la web tiene que conseguir.' },
  { titulo: 'Te propongo un plan', texto: 'Recibes las páginas, el calendario y el presupuesto por escrito antes de decidir.' },
  { titulo: 'La construyo y publicamos', texto: 'Diseño, contenido, versión móvil y puesta en marcha; revisamos todo juntos antes de abrir.' },
];
