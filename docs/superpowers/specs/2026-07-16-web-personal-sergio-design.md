# Web personal de Sergio García Ortiz — diseño

**Fecha:** 2026-07-16
**Estado:** diseño validado, pendiente de plan de implementación
**Repo destino:** `charcoles-hub/charcoles-hub.github.io` (GitHub Pages, sitio de usuario → raíz)

---

## 1. Qué es esto y para qué

One-pager personal de Sergio García Ortiz como diseñador web freelance. Dos trabajos, decididos explícitamente:

- **Cerrar.** El prospecto recibe un email frío de la campaña de captación, busca a Sergio, y necesita comprobar que existe y es real antes de contestar. La web es la prueba de legitimidad.
- **Concentrar.** Un único destino al que apuntar desde Workana, Fiverr, email e Instagram, en lugar de repartir enlaces sueltos a demos.

**No es objetivo: captar por SEO.** Descartado explícitamente. Posicionar "diseñador web Barcelona" exige contenido sostenido durante meses contra agencias con presupuesto, y el motor de captación actual (email frío, 700+ leads) ya funciona. Se aplica solo el SEO gratuito de una página bien hecha —`title`, meta description, `h1` honesto, Open Graph, JSON-LD `Person`— y nada más. Sin blog, sin landings por ciudad. Si dentro de seis meses el email frío se agota, el SEO será otro proyecto con su propio brainstorming.

## 2. Restricciones de honestidad (las decisiones que mandan)

Estas no son preferencias estéticas. Son el contrato de la web, y cualquier decisión posterior se subordina a ellas.

- **Las demos son conceptos, y se dicen conceptos.** Navaja, Sereno y Ancla son negocios inventados. Se etiquetan como proyectos de concepto, visiblemente, sin letra pequeña. El trabajo especulativo es normal en diseño; lo que quema la credibilidad es fingir que fue un encargo.
- **Fisioymés no aparece hasta que cierre.** Hoy es un prospecto avanzado (web construida y desplegada, pendiente de que el cliente confirme), no un cliente. Cuando cierre entra como *cliente*; si no cierra, o entra como concepto anonimizado ("clínica de fisioterapia en Sant Cugat", sin marca ni capturas identificables) o no entra.
- **No se publica sin permiso de Fisioymés** si aparece con su marca. El permiso hace falta al desplegar, no al diseñar.
- **EY no se vende como servicio.** Un año de ciberseguridad no hace experto en seguridad. Aparece como recorrido, en una línea. El argumento técnico vive en *cómo* construye Sergio, nunca en el menú de servicios.
- **Sergio es una persona, no un estudio.** Primera persona, "yo". Nada de "nosotros" ni marca de agencia: se cae en la primera videollamada, y además ser una persona es la ventaja competitiva frente a agencias con gestor de cuentas de por medio.

## 3. Contenido

### Portada
Nombre a tamaño de cartel. Una frase de lo que hace. Sin foto de stock, sin "bienvenido".

### El trabajo — tres proyectos
| Proyecto | Rubro | Paleta propia | Por qué está |
|---|---|---|---|
| Navaja | Barbería | Oxblood + latón | El listón premium del catálogo |
| Sereno | Dental | Petróleo + porcelana + arcilla | Apunta al segmento mayor: 27 de las clínicas del CSV son dentales |
| Ancla | Psicología | Ciruela + malva | Tercera vertical, demuestra rango |

Tres, no once. Once demos se leen como catálogo de plantillas; tres bien elegidas se leen como criterio. Cada una con dos líneas sobre el problema resuelto, no sobre la tecnología.

### Quién soy
Hechos verificados con Sergio, redactados sin inflar:

- **UPC EEBE, dos años, beca de aprendizaje:** llevó el diseño y la gestión de contenidos de la web de la escuela. Es el activo fuerte de la bio: encargo real, institucional, sostenido en el tiempo. "Dos años" y "gestión de contenidos" son las palabras que importan — dicen que mantuvo algo vivo, no que entregó un pantallazo.
- **EY, un año, ciberseguridad pura, cero web.** Una línea. Justifica el hueco entre la UPC y el freelance y aporta señal de entorno profesional serio.

### Cómo trabajo
Donde aterriza el argumento de EY sin venderlo: construcción estática (Astro), sin base de datos, sin plugins, sin panel de administración que reventar. El contraste es real y comprobable — `clinicadentalciurana.es`, del propio CSV de leads, tiene el dominio secuestrado redirigiendo a apuestas. No es marketing, es arquitectura.

### Hablamos
`scharcoles@gmail.com`, grande y clicable. **Sin formulario** (fricción y una pieza que se rompe en silencio; el único inbound real llegó por WhatsApp, no por formulario). **Sin teléfono en esta iteración** — ver §7.

## 4. Dirección visual: galería oscura

Elegida por Sergio sobre "cabina técnica" (monoespaciada; memorable pero grita *programador* y pierde a la fisio de Sant Cugat) y "editorial claro" (elegante pero mundano, y crema+serif está en la lista propia de defaults de IA a evitar).

**El problema de diseño que la justifica:** las tres demos ya traen paletas fuertes y muy distintas. Si la web personal añade una cuarta gritando, la página son cuatro identidades peleándose y no gana ninguna. Las galerías pintan las paredes neutras para que los cuadros canten.

- Casi negro (`~#0a0b0d`), tipografía grande de palo seco con tracking negativo, **un solo acento cálido**.
- **Las demos son la única fuente de color de la página.**
- El wow viene del movimiento, la tipografía y el oficio. Nunca de un color más.
- Anti-slop heredado del proyecto: nada de crema+serif+terracota, negro+verde ácido, cian clínico, eyebrows en cada sección, ni tarjetas idénticas en rejilla.

## 5. El póster vivo (la jugada central)

Las demos **no son capturas: son las webs reales, incrustadas y funcionando**. Están desplegadas y son de Sergio. Un pantallazo dice "hice esto"; una web latiendo lo demuestra. Encaja con el eje de honestidad: pruebas en vez de afirmaciones.

**Verificado (2026-07-16):** las tres devuelven `200` y **no mandan `X-Frame-Options` ni CSP `frame-ancestors`** → se dejan incrustar. Además, con la web en la raíz de `charcoles-hub.github.io`, los iframes son **mismo origen**: cero restricciones.

Mecánica, en capas de abajo arriba:
- **La captura `.webp` es la base, no el rescate.** Siempre presente, se ve al instante, y es lo que queda si el iframe no llega o si no hay JavaScript. El marco nunca está vacío ni roto.
- **El iframe se funde encima** cuando está escalado y cargado (`loading="lazy"`). Arranca oculto a propósito: sin el escalado aplicado se vería a tamaño real, que es la versión rota.
- **Escalado con `ResizeObserver`**, no con CSS — ver los aprendizajes caros de §6.
- **`pointer-events:none`** — es un póster *vivo*: se ve la web real animándose, pero no atrapa el scroll ni secuestra el dedo en móvil. Sin esto, incrustar webs es infumable en táctil.
- **El iframe mide 1440×900: un viewport de verdad.** No el alto de la demo — ver el aprendizaje caro de §6. El recorrido de §6 punto 3 se hace **scrolleando el documento de dentro** (`contentWindow.scrollTo`), no moviendo el iframe.
- **El `src` del iframe es una ruta relativa** (`/demo-barberia-navaja/`), nunca la URL absoluta. De ahí sale el mismo origen que permite scrollearlo: en producción las demos son *project pages* del mismo usuario y GitHub Pages las sirve en `/demo-x/` del propio dominio. En local lo replica el proxy de `scripts/servir.mjs`. **Bonus: cuando Sergio compre dominio, las project pages pasan a servirse bajo él también, así que la ruta relativa sigue valiendo sin tocar nada** — con URLs absolutas se habría roto.
- Indicador "EN VIVO" con punto pulsante, y una barra fina de progreso del recorrido.
- El iframe va con `tabindex="-1"` y `aria-hidden="true"`: es decorativo. Sin eso, quien navegue con teclado queda atrapado dentro de la demo y un lector de pantalla leería tres webs enteras. La vía accesible al mismo contenido es el botón.
- Botón **"Abrir de verdad ↗"** → la web real en pestaña nueva. Ahí sí se toca.
- Todo acceso a `contentWindow`/`contentDocument` va en `try/catch`: si algún día quedara cross-origin, el póster estático aguanta y la página no se rompe.

## 6. Animaciones (el eje del wow)

Sergio: *"las animaciones son lo que más efecto wow da"*. Vocabulario cerrado, para que no se improvise:

1. **Entrada de portada** — el nombre se compone al cargar: líneas subiendo tras una máscara con desfase, no un fade genérico.
2. **Revelado por scroll** — las secciones de texto entran con desplazamiento y escala sutil, vía `IntersectionObserver` (el patrón que ya usa `demo-barberia-navaja`). No se usa `animation-timeline: view()`: Firefox no lo soporta y dejaría esas secciones quietas.
3. **Recorrido fijado** — *el corazón del sitio.* El bloque de cada proyecto (texto + póster) se queda fijo mientras su sección pasa, y **la demo se recorre por dentro del marco** al scrollear. No se enseña una portada: se enseña la web entera sin que nadie haga clic. Elegido por Sergio el 2026-07-16 sobre la alternativa sin fijado, viendo las dos funcionando.
   - Ritmo controlado por la constante `VELOCIDAD` en `src/config/site.ts` (píxeles de demo por píxel de scroll). Es un mando de calibración: se ajusta mirándolo, con Sergio.
   - Alturas reales de las demos a 1440px, medidas con `scripts/medir-demos.mjs` (2026-07-16): Navaja 4229px, Sereno 6601px, Ancla 5224px. Si una demo cambia, hay que remedir.
4. **Latido "EN VIVO"** — punto pulsante, el detalle que dice "esto no es una imagen".
5. **Reacción al puntero** — el marco responde al ratón con inclinación mínima (3 grados como tope). Sutil: si se nota el efecto, está mal calibrado. Solo con ratón: en táctil un `pointermove` es el dedo haciendo scroll.

**Descartado: transiciones `@view-transition`.** Exigen que ambos documentos se adhieran (las demos son repos aparte y no lo hacen) y las demos abren en pestaña nueva, donde no hay transición posible. El propio diseño se contradecía.

**Reglas duras:**
- **`prefers-reduced-motion: reduce` se respeta siempre.** No es opcional ni negociable: hay gente a la que el movimiento le produce mareo real. Con la preferencia activada, todo aparece sin desplazamiento y la demo se queda fija en su portada.
- **Nada puede quedar invisible si una animación no corre.** Los estados iniciales ocultos se activan con una clase que pone el propio JavaScript (`.js-anima`); si el script no corre, no se oculta nada. Un `opacity:0` que dependa de algo no soportado deja la página en blanco.
- Animación por composición (`transform`/`opacity`), nunca por propiedades que fuercen relayout.
- **Sin librerías de animación.** JavaScript propio donde haga falta (el escalado y el recorrido lo necesitan), CSS donde alcance.

## Aprendizajes caros (2026-07-16) — no los reintentes

Cada uno costó una sesión de depuración y ninguno se ve leyendo el código. Están aquí para que la próxima vez que alguien piense "esto se simplifica", lea esto primero.

1. **Escalar el iframe con container queries no vale.** `transform: scale(calc(100cqw / 1440px))` funciona en Chromium (`matrix(0.5,…)`) y devuelve **`none` en Firefox 152**: no divide longitud entre longitud dentro de `calc()` y descarta la declaración entera, así que el iframe se queda a tamaño real y se ve una esquina ampliada. Sin la unidad `px` falla en los dos. Por eso el escalado va con `ResizeObserver`.

2. **El iframe NO puede medir el alto de la demo.** Fue el diseño original y estira las demos: dentro de un iframe de 4229px de alto, `100vh` vale 4229px, y las demos usan unidades de viewport. Medido: Navaja 4229px → **7159px (+69%)**, Sereno 6601 → 7036, Ancla 5224 → 5224. El síntoma visible era el marco de Navaja casi vacío (se veía la franja superior de un hero de ~3700px). El iframe mide 1440×900 y la demo se scrollea por dentro.

3. **Las demos llevan `html { scroll-behavior: smooth }`.** Con eso, `scrollTo(0,y)` **anima** en vez de saltar y el recorrido va a tirones y con retraso. Hay que forzar `scrollBehavior = 'auto'` en el documento del iframe al cargar.

4. **`overflow-x: hidden` en `<html>`/`<body>` rompe `position: sticky`.** Por la regla de overflow de CSS, fuerza `overflow-y` a `auto`, y los elementos fijos pasan a fijarse respecto a ese contenedor en vez de al viewport: el fijado deja de existir en silencio, y solo se nota al scrollear. Estaba en el tema original como guardia anti-scroll-horizontal; se quitó y **el arnés es ahora la red** (verificado: caza un desbordamiento real sin la muleta).

5. **`overflow` + interlineado apretado se come los descendentes.** `overflow: hidden` en la máscara de la portada, con `leading-[0.88]`, cortaba en plano el rabo de la `g` de "Sergio". Se arregla con `overflow: clip` + `overflow-clip-margin`, y entonces el viaje de la animación tiene que crecer o la línea asoma por el hueco nuevo.

6. **Las capturas se generan con `--hide-scrollbars`.** Sin la bandera, la barra de scroll del navegador queda incrustada en el póster y lo delata como captura de pantalla justo cuando queremos que parezca una web viva.

7. **`astro preview` no sirve para este proyecto.** No resuelve `/demo-*`. El arnés y Lighthouse se lanzan contra `npm run servir` (`scripts/servir.mjs`), que sirve `dist/` y hace de proxy de las demos, replicando lo que hace GitHub Pages.

## 7. Decisiones aplazadas a propósito

- **Dominio.** Hoy `charcoles-hub.github.io`. El repo se llama exactamente igual que el usuario para publicar en **raíz**, lo que evita el infierno de `BASE_URL` que hubo en Fisioymés (allí, por vivir en subruta, hubo que prefijar cada ruta y cada asset) y hace que migrar a dominio propio el día de mañana sea un simple CNAME, con cero reescritura. Un dominio propio son ~12€/año y es el gasto que más rinde: un diseñador cuyo portfolio vive en `github.io` se desmonta solo. Aplazado por Sergio, no descartado.
- **Teléfono / WhatsApp.** No entra ahora. Publicar un número es irreversible: los bots lo recogen en días y queda en cachés, archive.org y listas de spam que se revenden; se puede quitar de la web, no de donde ya lo copiaron. Como no se publica todavía, la decisión no urge. El bloque de contacto se diseña con hueco para el botón. Al publicar se elige entre: línea nueva de prepago (~5€), **WhatsApp Business con número aparte (recomendado)**, o seguir solo con email.
- **Fisioymés como cuarto proyecto.** El bloque de trabajo se diseña para que quepa un cuarto. Cuando cierre, entra arriba y con etiqueta *cliente*. Salto de credibilidad sin tocar la estructura.

## 8. Presupuesto de rendimiento (riesgo real)

Tres webs completas dentro de otra pesan. El prospecto típico abre esto **con el móvil, con 4G regular, en la sala de espera de su clínica**. Si el wow se convierte en una rueda girando, la web hace lo contrario de lo que se le pide — y encima contradice el argumento de §"Cómo trabajo".

- **Se mide antes de publicar**, en móvil real y con red limitada. No se da por bueno con la sensación de escritorio.
- **Plan B APLICADO (2026-07-16).** Con las tres demos cargando de salida: rendimiento **76**, LCP 6,9s. Fuera del listón. Solo la primera carga al entrar; las otras dos esperan.
- **Pero esperan a ACERCARSE, no a que las toquen.** El plan original decía "hasta que alguien las toque", y eso estaba mal: las secciones siguen midiendo 311vh y 260vh, así que dejaba tres pantallas de scroll ante una imagen quieta con la barra de progreso marcando un recorrido inexistente. Mataba la pieza central en dos de los tres proyectos. Con un `IntersectionObserver` de `rootMargin: 150%`, la demo llega cargada antes de verse: **se conserva el efecto entero y se protege el LCP igual**.
- **Resultado medido (verificado dos veces, por el implementador y por el controlador):** rendimiento **94-95**, accesibilidad **100**, buenas prácticas 96, SEO 100. LCP 2,8-2,9s, bloqueo 0ms. Las tres demos vivas y recorriéndose; al cargar solo existe un iframe.
- **Accesibilidad venía en 88, no cerca de 100** como daba por hecho este spec. Dos fallos reales, preexistentes: contraste insuficiente en `--color-tenue` (3,9:1, por debajo del mínimo AA de 4,5:1 → `#6b6f76` pasa a `#7a7e85`, 4,83:1) y ausencia de landmark `<main>`. Corregidos.
- Objetivo: Lighthouse móvil ≥ 90. Es el listón que Sergio vende; su propia web no puede bajar de ahí.
- Que la captura sea la base ya juega a favor: es la imagen que pinta primero, y el iframe llega después sin bloquear nada.

### Medición real (2026-07-16, Task 7)

Lighthouse móvil contra `npm run servir` (dist/ + proxy de `/demo-*` a producción, igual que GitHub Pages), throttling simulado, Chrome headless v13.

**Primera pasada, con los 3 iframes vivos al cargar:**

| Categoría | Puntuación |
|---|---|
| Performance | 76 |
| Accessibility | 88 |
| Best Practices | 96 |
| SEO | 100 |

Performance por debajo del listón (76 < 90) — LCP en 6.9s, arrastrado por los tres iframes de salida cargando en paralelo. **Se aplicó el plan B**: solo Navaja (`vivo: true`) carga su iframe al entrar en la página; Sereno y Ancla (`vivo: false`) se quedan en su captura hasta que alguien toca el botón que los despierta.

De paso, accesibilidad en 88 no estaba "cerca de 100" como se esperaba: dos hallazgos reales, no ruido — contraste insuficiente en `--color-tenue` (3.9:1, subido a `#7a7e85` → 4.83:1) y ausencia de landmark `<main>` (añadido en `Layout.astro`). Ambos corregidos.

**Segunda pasada, con el plan B aplicado y los fixes de accesibilidad:**

| Categoría | Puntuación |
|---|---|
| Performance | 95 |
| Accessibility | 100 |
| Best Practices | 96 |
| SEO | 100 |

Performance ≥ 90 cumplido. Best Practices se queda en 96 por un `favicon.ico` inexistente (404 en consola) — preexistente, fuera del alcance de esta tarea, no bloquea el criterio de aceptación.

**`VELOCIDAD` se queda en 3** — el spec dice explícitamente que es un mando de calibración humana (Task 4 Step 6) y esta tarea no lo toca.

## 9. Fuera de alcance

Blog. Formulario de contacto. Menú de navegación (el scroll es la navegación). Modo claro. Multiidioma. CMS. Analytics. Las once demos completas. Cualquier "estudio" o marca corporativa.

## 10. Criterios de aceptación

1. Un desconocido entiende en cinco segundos quién es Sergio y qué hace.
2. Las tres demos se ven vivas y se abren de verdad.
3. Ningún visitante puede confundir un concepto con un cliente.
4. Lighthouse móvil ≥ 90 con las tres cargadas, o plan B aplicado.
5. `prefers-reduced-motion` respetado y comprobado.
6. Sin scroll horizontal a 390px (gotcha conocido de Fisioymés: el menú off-canvas exigía `overflow-x:hidden` en `html`/`body`).
7. Cero datos personales publicados que no se hayan decidido a conciencia.
