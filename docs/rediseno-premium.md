# Rediseño premium y SEO (septiembre 2026)

Segunda vuelta sobre el rediseño de julio. Tres objetivos: un aspecto más cuidado, más páginas que puedan aparecer en Google y un gancho claro para los correos a clientes potenciales.

## Qué cambia

- **Sistema visual.** Titulares en Instrument Serif (con cursiva para el énfasis) y texto en Inter. Las fuentes se sirven desde `public/fonts/`, sin Google Fonts: es más rápido y no se pasan datos a Google. Se mantienen los colores: marfil, verde tinta y los acentos oliva y lima. Ningún texto baja de 12 px.
- **Piezas compartidas.** `Cabecera`, `Pie`, `Contacto`, `BarraMovil`, `Migas`, `Preguntas`, `CasoReal` y `Relacionados` sustituyen a las copias que tenía cada página. Los estilos comunes viven en `src/styles/global.css`.
- **Portada.** Titular con palabra clave («Diseño webs para que te elijan a ti»), bloque de compromisos, caso real con recorrido de la captura al pasar el ratón, conceptos, sectores, servicios, revisión gratuita, proceso, presupuesto, sobre mí, preguntas y contacto.
- **Reseñas.** Mientras `RESENAS` esté vacío, la portada no enseña la sección: antes anunciaba en grande que no había ninguna. El formulario sigue en `/resena/`, enlazado desde el pie. En cuanto se añada una reseña real en `src/config/site.ts`, la sección vuelve sola.
- **Páginas nuevas.**
  - `/revision-web-gratis/`: formulario (mismo buzón de Web3Forms que las reseñas) y alternativa por WhatsApp. Gracias en `/gracias-revision/` (noindex).
  - Seis páginas por sector en `src/config/sectores.ts`: clínicas dentales, fisioterapia, psicología, veterinarias, gestorías y arquitectura. Cada una tiene contenido propio y su demo, que se presenta como concepto.
- **Barra fija en móvil y tablet** con WhatsApp y llamada. En escritorio, la cabecera se queda fija arriba.
- **SEO técnico.** Un solo grafo JSON-LD (`WebSite`, `ProfessionalService`, `Person`, `WebPage`) con `@id` estables, `BreadcrumbList` en las páginas interiores, un solo `<main>` por página (antes había dos anidados) y nuevos títulos y descripciones en las portadas. Las páginas de reseñas y de gracias llevan noindex y no salen en el sitemap.
- **Imágenes de marca.** `public/og.jpg` (la vista previa al compartir), `favicon.svg`/`.ico` y `apple-touch-icon.png`. Se generan con `npm run imagenes`. La imagen anterior era del diseño oscuro y anunciaba «desde 500 €».
- **Foto opcional.** Si se añade `src/assets/sergio.jpg`, aparece en «Sobre mí» sin tocar código.
- **Limpieza.** Fuera Tailwind y once componentes del diseño antiguo que ya no se usaban.

## Pendiente de revisar por Sergio antes de publicar

1. **Textos nuevos de las páginas por sector** (`src/config/sectores.ts`): qué necesita cada web, qué suele fallar y las preguntas frecuentes. Son consejos generales del sector, sin cifras ni resultados inventados, pero conviene leerlos con calma.
2. **Compromisos nuevos:** «revisión en un máximo de 48 horas laborables» (constante `PLAZO` en `src/pages/revision-web-gratis.astro` y texto de `/gracias-revision/`) y «Disponible para nuevos proyectos» en la portada.
3. **Aviso legal y política de privacidad.** La web tiene formularios y no tiene todavía estas páginas. Para el aviso legal (LSSI) hacen falta el NIF y el domicilio.

## Verificación

- `npm run build && npm run verificar`: 25 páginas. Comprueba enlaces internos y anclas, un `h1` y un `main` por página, imágenes, canonical, hreflang, JSON-LD, formularios, noindex, sitemap, que las fuentes no vengan de Google y que `og.jpg` pese menos de 300 KB.
- `npm run servir` y, en otra terminal, `npm run desbordes`: ninguna página tiene scroll horizontal a 360, 390, 768, 1024 y 1440 px.
- Lighthouse móvil (portada, página de sector y revisión): rendimiento 99–100, accesibilidad 100, buenas prácticas 100, SEO 100 y CLS 0.
- `astro check`: 0 errores.
