---
version: 2
name: sergiogarciaweb
description: El Eixample de noche. Una web cinematográfica y viva para un estudio de diseño web de una persona. La cuadrícula de Cerdà se dibuja en tiempo real, las luces recorren sus calles y cada proyecto se enseña como una pieza de estudio.
colors:
  noche: "#08090D"
  noche-2: "#0E1016"
  superficie: "#12141B"
  linea: "#23252D"
  linea-fuerte: "#3A3D47"
  luz: "#EDE9E1"
  luz-2: "#C9C5BD"
  tenue: "#97948D"
  farola: "#FFB24A"
  farola-viva: "#FFC46E"
  sobre-farola: "#0B0B0F"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: clamp(3.1rem, 1rem + 9.2vw, 10.5rem)
    fontWeight: 480
    fontStretch: 100%
    lineHeight: 0.9
    letterSpacing: -0.05em
  titulo:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: clamp(2.4rem, 1.2rem + 4.4vw, 5.6rem)
    fontWeight: 480
    lineHeight: 0.95
    letterSpacing: -0.045em
  cita:
    fontFamily: "Newsreader, Georgia, serif"
    fontStyle: italic
    fontSize: clamp(1.7rem, 1.1rem + 2.2vw, 3.3rem)
    fontWeight: 380
    lineHeight: 1.18
  cuerpo:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.6
  rotulo:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: 0.8rem
    fontWeight: 560
    fontStretch: 118%
    letterSpacing: 0.02em
rounded:
  chaflan-s: 10px
  chaflan-l: 28px
components:
  boton-principal:
    backgroundColor: "{colors.farola}"
    textColor: "{colors.sobre-farola}"
    rounded: "{rounded.chaflan-s}"
    padding: 18px 28px
---

## Visión

**Lectura del encargo.** Es la web del propio estudio: el escaparate que tiene que demostrar que Sergio juega en otra liga. Si la web de quien vende webs es corriente, nadie le compra una extraordinaria. Se dirige a dueños de negocios y profesionales que buscan una web que les haga destacar. Tiene que impresionar en tres segundos y, después, convencer con trabajo real y trato directo. Objetivo: escribir por WhatsApp.

- **Modo:** Mostrar + Convencer.
- **Diales:** variación 8 · movimiento 8 · densidad 3.
- **Nivel de acabado:** premium.

## Concepto

**El Eixample de noche.** Desde arriba, la cuadrícula de Cerdà con sus chaflanes. Las manzanas son oscuras, con ventanas encendidas; las calles son ríos de luz, con faros blancos y pilotos ámbar; la Diagonal cruza en oblicuo.

Todo se dibuja en tiempo real con un shader: es la prueba, no la promesa, de que el estudio construye cosas técnicamente vivas. El concepto se queda en toda la web:

- el ámbar de farola como único acento
- el chaflán en botones y marcos
- la luz como material: brillos, grano y reflejos
- el movimiento como el tráfico: continuo, sereno y nunca nervioso

## Momentos (uno por sección)

1. **Portada:** ciudad WebGL a pantalla completa. Titular enorme que sube por líneas desde una máscara. Al hacer scroll, la cámara se inclina y avanza sobre la ciudad. El botón principal es magnético.
2. **Manifiesto:** «El diseño se demuestra.» Las palabras se encienden una a una con el scroll.
3. **Caso real (anclado):** portátil y teléfono con Fisioymés. La web se recorre dentro de las pantallas al ritmo del scroll y, al lado, los tres pasos del caso se iluminan por turnos.
4. **Reseña:** cita de Diana en cursiva de Newsreader, a gran tamaño, iluminándose palabra a palabra.
5. **Sectores (galería horizontal anclada):** seis conceptos que pasan en horizontal como escaparates. Burbuja «Ver» junto al cursor y etiqueta «Concepto» siempre visible.
6. **Servicios:** índice tipográfico enorme; cada fila se enciende al pasar (fondo de luz y anchura de letra).
7. **Proceso:** cuatro tarjetas que se apilan al hacer scroll (es una secuencia real, así que va numerada).
8. **Sobre mí:** manifiesto que se enciende con el scroll y trayectoria en línea de tiempo.
9. **Contacto:** campo ámbar a sangre, el único color intenso. Titular gigante en negro y el botón de WhatsApp magnético.
10. **Pie:** «Sergio García» a todo el ancho, como firma.

## Color

Noche azulada (no negro neutro), luz cálida para el texto y un solo acento: el ámbar de farola. Se usa en los botones, en los brillos del shader, en el foco y en el bloque de contacto.

Parejas comprobadas:

| Pareja | Contraste |
|---|---|
| luz / noche | 16:1 |
| luz-2 / noche | 11:1 |
| tenue / noche | 6,4:1 |
| sobre-farola / farola | 11,4:1 |
| farola / noche (texto) | 11,4:1 |

## Tipografía

- **Archivo** variable (peso y anchura) para todo. Los titulares grandes van en peso medio (480) con tracking muy cerrado: a tamaño enorme, el peso medio se lee más caro que el negro. La anchura se anima en los hovers de servicios.
- **Newsreader**, en cursiva variable, solo para citas y el manifiesto: textura editorial con un papel fijo. Nunca mezclada dentro de un titular.

## Movimiento

- GSAP (ScrollTrigger y SplitText) con Lenis para el scroll suave (solo escritorio con ratón).
- Curvas `expo.out` y `power3.out`. Entradas de 0,9-1,2 s; interacción por debajo de 300 ms.
- **Reduced motion:** sin scroll suave, sin anclajes ni scrub. Todo visible y estático; el shader pinta un solo fotograma.
- El fondo animado tiene un botón de pausa (WCAG 2.2.2).
- **Móvil (táctil):** scroll nativo, galería con deslizamiento nativo, sin anclajes largos y shader a menor resolución.
- **Sin JavaScript:** todo el contenido está en el HTML y visible. El script solo añade el movimiento.

## Profundidad y materia

- Grano de película fijo sobre toda la página (SVG de ruido, 7 % de opacidad).
- Viñeta y pozos de luz ámbar.
- Maquetas de portátil y teléfono en CSS con bisel, reflejo y sombra real.
- Marcos con chaflán y filete de luz.

## Honestidad

Fisioymés es el único cliente real y se enseña como tal. Los sectores son conceptos y lo dicen en cada tarjeta. No hay cifras, logos ni reseñas inventadas.

## Decisiones descartadas

- **v1 (papel blanco, azul bolígrafo, sin movimiento):** correcta pero plana. Quitaba lo genérico sin poner oficio en su lugar.
- **Fondo 3D de icosaedro genérico:** bonito, pero podría ser la web de cualquiera. La ciudad de Cerdà solo puede ser de aquí.
- **Cursor personalizado que sustituye al del sistema:** se mantiene el cursor nativo. La burbuja «Ver» es un complemento.
