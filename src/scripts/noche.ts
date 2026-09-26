/**
 * El Eixample de noche, dibujado en tiempo real (WebGL 1, sin librerías).
 *
 * Un plano visto desde arriba con la cuadrícula de Cerdà: manzanas con chaflán
 * y patio interior, ventanas encendidas, tráfico (faros y pilotos) por las
 * calles y la Diagonal cruzando en oblicuo. La cámara avanza despacio, se
 * inclina con el scroll y sigue un poco al ratón.
 *
 * Rendimiento: resolución limitada (≤1× en escritorio, 0,75× en táctil), bucle
 * pausado fuera de pantalla o con la pestaña oculta. Con reduced motion se pinta
 * un único fotograma. Sin WebGL, no pasa nada: queda el degradado de CSS.
 */

const VERTICES = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAGMENTOS = `
precision highp float;
uniform vec2 uRes;
uniform float uTiempo;
uniform float uScroll;
uniform vec2 uRaton;
uniform float uEntrada;

float azar(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Manzana con chaflán (octógono) en coordenadas locales de la celda [-0.5, 0.5].
float manzana(vec2 q, float b, float k) {
  vec2 a = abs(q);
  return max(max(a.x, a.y) - b, (a.x + a.y - (2.0 * b - k)) * 0.70710678);
}

// Luces de tráfico a lo largo de una calle. x: distancia a la calzada;
// y: posición a lo largo de la calle; id: índice de la calle.
vec3 trafico(float x, float y, float id, float vel) {
  vec3 luz = vec3(0.0);
  for (int carril = 0; carril < 2; carril++) {
    float sentido = carril == 0 ? 1.0 : -1.0;
    float desvio = sentido * 0.028;
    float pos = y * 2.2 + sentido * uTiempo * vel * (0.7 + 0.6 * azar(vec2(id, float(carril)))) + azar(vec2(id, 7.0)) * 9.0;
    float coche = floor(pos);
    float hay = step(0.42, azar(vec2(coche, id + float(carril) * 13.0)));
    float l = (fract(pos) - 0.5) / 0.07;
    float lado = (x - desvio) / 0.012;
    // x*x y no pow(): pow() con base negativa no está definido en GLSL.
    float brillo = exp(-l * l) * exp(-lado * lado);
    vec3 color = carril == 0 ? vec3(1.0, 0.93, 0.8) : vec3(1.0, 0.36, 0.16);
    luz += color * brillo * hay;
  }
  return luz;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float s = smoothstep(0.0, 1.0, uScroll);

  // Cámara aérea: se ve el horizonte arriba; con el scroll baja y avanza.
  float inclinacion = mix(0.34, 0.24, s);
  vec3 ro = vec3(uRaton.x * 0.16, 1.15 - s * 0.35, -uTiempo * 0.05 - s * 1.4);
  vec3 f = normalize(vec3(0.0, -sin(inclinacion), -cos(inclinacion)));
  vec3 r = normalize(cross(f, vec3(0.0, 1.0, 0.0)));
  vec3 u = cross(r, f);
  float focal = 1.35;
  vec3 rd = normalize(f * focal + uv.x * r + (uv.y + uRaton.y * 0.025) * u);

  // Cielo nocturno con la contaminación lumínica cálida pegada al horizonte.
  vec3 horizonte = vec3(0.16, 0.075, 0.035);
  vec3 cielo = mix(horizonte, vec3(0.012, 0.016, 0.036), smoothstep(0.0, 0.3, rd.y));
  vec3 col = cielo;

  if (rd.y < -0.0005) {
    float t = -ro.y / rd.y;
    vec3 pos = ro + rd * t;
    float escala = 3.4;
    float ang = 0.72;
    mat2 giro = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
    vec2 g = giro * pos.xz * escala;
    vec2 celda = floor(g);
    vec2 q = fract(g) - 0.5;
    // Tamaño de un píxel en coordenadas de la cuadrícula: suaviza bordes y
    // apaga el detalle diminuto a lo lejos para que no titile.
    float px = t * escala / (uRes.y * focal * max(0.12, -rd.y));
    float lejos = smoothstep(0.035, 0.14, px);

    float d = manzana(q, 0.40, 0.11);
    float dentro = 1.0 - smoothstep(-px, px, d);

    // Manzanas: tejado oscuro, patio interior y ventanas encendidas.
    float tono = azar(celda) * 0.01;
    vec3 tejado = vec3(0.022 + tono, 0.022 + tono, 0.032 + tono);
    float patio = 1.0 - smoothstep(-px, px, manzana(q, 0.24, 0.08));
    tejado = mix(tejado, vec3(0.012, 0.012, 0.02), patio);
    vec2 v = floor((q + 0.5) * 16.0);
    float ventana = step(0.88, azar(v + celda * 17.0)) * (1.0 - patio) * (1.0 - lejos);
    float parpadeo = 0.7 + 0.3 * sin(uTiempo * (0.3 + azar(v) * 1.2) + azar(celda) * 6.28);
    tejado += vec3(1.0, 0.72, 0.42) * ventana * 0.2 * parpadeo;

    // Calles: el ámbar del alumbrado, más vivo junto a las aceras y en las farolas.
    float acera = (d - 0.02) / (0.014 + px);
    float junto = exp(-acera * acera);
    float aLoLargo = abs(q.x) > abs(q.y) ? g.y : g.x;
    float farola = pow(0.5 + 0.5 * cos(aLoLargo * 6.2831 * 4.0), 10.0) * (1.0 - lejos);
    vec3 alumbrado = vec3(1.0, 0.5, 0.14) * (0.07 + junto * (0.3 + 0.8 * farola));
    vec3 calle = vec3(0.02, 0.014, 0.012) + alumbrado;

    // Tráfico: faros blancos y pilotos rojos.
    float ix = floor(g.x + 0.5);
    float iy = floor(g.y + 0.5);
    calle += (trafico(g.x - ix, g.y, ix, 0.5) + trafico(g.y - iy, g.x, iy + 101.0, 0.5)) * 1.3 * (1.0 - lejos * 0.6);

    col = mix(calle, tejado, dentro);

    // La Diagonal: avenida ancha en oblicuo, con más luz y más tráfico.
    vec2 n = normalize(vec2(0.42, -1.0));
    float dd = dot(g - vec2(0.3, 0.0), n);
    float diagonal = 1.0 - smoothstep(0.1 - px, 0.1 + px, abs(dd));
    vec3 luzDiagonal = vec3(0.03, 0.018, 0.012) + vec3(1.0, 0.52, 0.16) * 0.22 + trafico(dd, dot(g, vec2(n.y, -n.x)), 999.0, 0.8) * 1.6;
    col = mix(col, luzDiagonal, diagonal);
    col += vec3(1.0, 0.55, 0.2) * exp(-abs(dd) * 6.0) * 0.05;

    // Bruma cálida con la distancia: la ciudad se funde con el horizonte.
    col = mix(col, horizonte * 0.85, 1.0 - exp(-t * 0.2));
  }

  // Viñeta, entrada, tono y un poco de grano para que no haya bandas.
  col *= 1.0 - 0.5 * dot(uv * 0.8, uv * 0.8);
  col *= uEntrada;
  col = 1.0 - exp(-col * 1.7);
  col += (azar(gl_FragCoord.xy + uTiempo) - 0.5) * 0.014;
  gl_FragColor = vec4(col, 1.0);
}
`;

export interface Noche {
  pausar(): void;
  reanudar(): void;
  get pausada(): boolean;
}

export function iniciarNoche(lienzo: HTMLCanvasElement, progresoScroll: () => number): Noche | null {
  const gl = lienzo.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power' });
  if (!gl) return null;

  const compilar = (tipo: number, fuente: string) => {
    const s = gl.createShader(tipo)!;
    gl.shaderSource(s, fuente);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
    return s;
  };
  let programa: WebGLProgram;
  try {
    programa = gl.createProgram()!;
    gl.attachShader(programa, compilar(gl.VERTEX_SHADER, VERTICES));
    gl.attachShader(programa, compilar(gl.FRAGMENT_SHADER, FRAGMENTOS));
    gl.linkProgram(programa);
    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) return null;
  } catch {
    return null;
  }
  gl.useProgram(programa);

  // Un triángulo que cubre toda la pantalla.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const atributo = gl.getAttribLocation(programa, 'p');
  gl.enableVertexAttribArray(atributo);
  gl.vertexAttribPointer(atributo, 2, gl.FLOAT, false, 0, 0);

  const u = {
    res: gl.getUniformLocation(programa, 'uRes'),
    tiempo: gl.getUniformLocation(programa, 'uTiempo'),
    scroll: gl.getUniformLocation(programa, 'uScroll'),
    raton: gl.getUniformLocation(programa, 'uRaton'),
    entrada: gl.getUniformLocation(programa, 'uEntrada'),
  };

  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tactil = matchMedia('(pointer: coarse)').matches;
  const escala = Math.min(window.devicePixelRatio || 1, tactil ? 0.75 : 1);

  const ajustar = () => {
    const w = Math.max(1, Math.round(lienzo.clientWidth * escala));
    const h = Math.max(1, Math.round(lienzo.clientHeight * escala));
    if (lienzo.width !== w || lienzo.height !== h) {
      lienzo.width = w;
      lienzo.height = h;
      gl.viewport(0, 0, w, h);
    }
  };
  ajustar();

  const raton = { x: 0, y: 0, ox: 0, oy: 0 };
  if (!tactil && !reducir) {
    window.addEventListener('pointermove', (e) => {
      raton.ox = (e.clientX / window.innerWidth) * 2 - 1;
      raton.oy = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  const pintar = (tiempo: number, entrada: number) => {
    ajustar();
    raton.x += (raton.ox - raton.x) * 0.04;
    raton.y += (raton.oy - raton.y) * 0.04;
    gl.uniform2f(u.res, lienzo.width, lienzo.height);
    gl.uniform1f(u.tiempo, tiempo);
    gl.uniform1f(u.scroll, progresoScroll());
    gl.uniform2f(u.raton, raton.x, -raton.y);
    gl.uniform1f(u.entrada, entrada);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  if (reducir) {
    pintar(24, 1);
    new ResizeObserver(() => pintar(24, 1)).observe(lienzo);
    return { pausar() {}, reanudar() {}, get pausada() { return true; } };
  }

  let pausada = false;
  let visible = true;
  let marco = 0;
  let acumulado = 0;
  let anterior = performance.now();
  const inicio = anterior;

  const bucle = (ahora: number) => {
    marco = 0;
    if (pausada || !visible || document.hidden) return;
    acumulado += Math.min(ahora - anterior, 100) / 1000;
    anterior = ahora;
    const entrada = Math.min(1, (ahora - inicio) / 1600);
    pintar(12 + acumulado, 1 - Math.pow(1 - entrada, 3));
    marco = requestAnimationFrame(bucle);
  };
  const arrancar = () => {
    if (!marco && !pausada && visible && !document.hidden) {
      anterior = performance.now();
      marco = requestAnimationFrame(bucle);
    }
  };

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; arrancar(); }).observe(lienzo);
  document.addEventListener('visibilitychange', arrancar);
  arrancar();

  return {
    pausar() { pausada = true; },
    reanudar() { pausada = false; arrancar(); },
    get pausada() { return pausada; },
  };
}
