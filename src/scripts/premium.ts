/**
 * Movimiento de la web: scroll suave, coreografía y microinteracciones.
 *
 * Mejora progresiva: todo el contenido está en el HTML y se ve sin este script.
 * El script solo añade movimiento, y nada con prefers-reduced-motion (salvo el
 * fotograma fijo de la ciudad). En táctil, el scroll es el nativo.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { iniciarNoche } from './noche';

gsap.registerPlugin(ScrollTrigger, SplitText);

const raiz = document.documentElement;
const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
const punteroFino = matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---- 1. Scroll suave (escritorio con ratón) ----
if (!reducir && punteroFino) {
  const lenis = new Lenis({ lerp: 0.09, anchors: { offset: -84 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ---- 2. La ciudad de fondo ----
const lienzo = document.querySelector<HTMLCanvasElement>('[data-noche]');
const portada = document.querySelector<HTMLElement>('[data-portada]');
if (lienzo) {
  const progreso = () => (portada ? Math.min(1, Math.max(0, window.scrollY / portada.offsetHeight)) : 0);
  const noche = iniciarNoche(lienzo, progreso);
  if (noche) {
    raiz.classList.add('noche-viva');
    const boton = document.querySelector<HTMLButtonElement>('[data-pausa-fondo]');
    if (boton && !reducir) {
      boton.hidden = false;
      boton.addEventListener('click', () => {
        const pausar = !noche.pausada;
        if (pausar) noche.pausar(); else noche.reanudar();
        boton.setAttribute('aria-pressed', String(pausar));
        const texto = boton.querySelector('[data-texto]');
        if (texto) texto.textContent = pausar ? boton.dataset.reanudar ?? '' : boton.dataset.pausar ?? '';
      });
    }
  }
}

// ---- 3. Cabecera: transparente sobre la portada, sólida al bajar ----
const cabecera = document.querySelector('.cabecera');
if (cabecera) {
  ScrollTrigger.create({ start: 40, end: 'max', onToggle: (t) => cabecera.classList.toggle('cabecera--solida', t.isActive) });
}

if (!reducir) {
  // ---- 4. Entrada de la portada: el titular sube por líneas desde una máscara ----
  const titulo = document.querySelector<HTMLElement>('[data-titulo-portada]');
  if (titulo) {
    SplitText.create(titulo, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'linea',
      autoSplit: true,
      onSplit(self) {
        gsap.set(titulo, { visibility: 'visible' });
        return gsap.from(self.lines, { yPercent: 115, duration: 1.25, ease: 'expo.out', stagger: 0.11, delay: 0.1 });
      },
    });
  }
  gsap.fromTo('[data-sube]', { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'power3.out', stagger: 0.09, delay: 0.55 });
  raiz.classList.add('mov-listo');

  // Al bajar, el contenido de la portada se aleja y la ciudad toma el plano.
  if (portada) {
    gsap.to('[data-portada-contenido]', {
      yPercent: -14, autoAlpha: 0.15, ease: 'none',
      scrollTrigger: { trigger: portada, start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  // ---- 5. Textos que se encienden palabra a palabra con el scroll ----
  document.querySelectorAll<HTMLElement>('[data-enciende]').forEach((el) => {
    SplitText.create(el, {
      type: 'words',
      wordsClass: 'palabra',
      autoSplit: true,
      onSplit(self) {
        return gsap.fromTo(self.words, { opacity: 0.16 }, {
          opacity: 1, ease: 'none', stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: true },
        });
      },
    });
  });

  // ---- 6. Revelados con máscara para piezas grandes (no todo: solo lo marcado) ----
  document.querySelectorAll<HTMLElement>('[data-desvela]').forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(12% 8% 12% 8%)', scale: 1.04 }, {
      clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 38%', scrub: 0.6 },
    });
  });

  const mm = gsap.matchMedia();

  // ---- 7. Caso real: pantallas que se recorren y pasos que se iluminan ----
  const caso = document.querySelector<HTMLElement>('[data-caso]');
  if (caso) {
    const pantallas = [...caso.querySelectorAll<HTMLElement>('[data-pantalla]')];
    const recorrido = (p: HTMLElement) => {
      const img = p.querySelector('img');
      return img ? -(img.offsetHeight - p.clientHeight) : 0;
    };
    mm.add('(min-width: 1000px)', () => {
      const pasos = [...caso.querySelectorAll<HTMLElement>('[data-paso]')];
      const tl = gsap.timeline({
        scrollTrigger: { trigger: caso, start: 'top top', end: '+=230%', pin: true, scrub: 0.8, invalidateOnRefresh: true },
      });
      pantallas.forEach((p) => tl.to(p.querySelector('img'), { y: () => recorrido(p), ease: 'none', duration: 1 }, 0));
      tl.fromTo('[data-caso-progreso]', { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: 1 }, 0);
      const tramo = 1 / pasos.length;
      pasos.forEach((paso, i) => {
        tl.fromTo(paso, { opacity: 0.26 }, { opacity: 1, duration: 0.08, ease: 'none' }, i * tramo);
        if (i < pasos.length - 1) tl.to(paso, { opacity: 0.26, duration: 0.08, ease: 'none' }, (i + 1) * tramo - 0.02);
      });
    });
    mm.add('(max-width: 999px)', () => {
      pantallas.forEach((p) => gsap.to(p.querySelector('img'), {
        y: () => recorrido(p), ease: 'none',
        scrollTrigger: { trigger: p, start: 'top 85%', end: 'bottom 15%', scrub: true, invalidateOnRefresh: true },
      }));
    });
  }

  // ---- 8. Galería horizontal de sectores (en móvil: deslizamiento nativo) ----
  mm.add('(min-width: 1000px)', () => {
    const galeria = document.querySelector<HTMLElement>('[data-galeria]');
    const pista = galeria?.querySelector<HTMLElement>('[data-pista]');
    if (!galeria || !pista) return;
    galeria.classList.add('galeria--anclada');
    const distancia = () => Math.max(0, pista.scrollWidth - raiz.clientWidth);
    gsap.to(pista, {
      x: () => -distancia(), ease: 'none',
      scrollTrigger: { trigger: galeria, start: 'top top', end: () => `+=${distancia()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
    });
    return () => galeria.classList.remove('galeria--anclada');
  });

  // ---- 9. Proceso: tarjetas que se apilan ----
  mm.add('(min-width: 760px)', () => {
    const tarjetas = gsap.utils.toArray<HTMLElement>('[data-apila]');
    tarjetas.forEach((t, i) => {
      const siguiente = tarjetas[i + 1];
      if (!siguiente) return;
      gsap.to(t, {
        scale: 0.94, filter: 'brightness(0.42)', ease: 'none',
        scrollTrigger: { trigger: siguiente, start: 'top 85%', end: 'top 25%', scrub: true },
      });
    });
  });

  // ---- 10. Microinteracciones con ratón: botones magnéticos y burbuja «Ver» ----
  if (punteroFino) {
    document.querySelectorAll<HTMLElement>('[data-iman]').forEach((el) => {
      const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * 0.28);
        y((e.clientY - (r.top + r.height / 2)) * 0.38);
      });
      el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.45)' }));
    });

    const objetivos = document.querySelectorAll<HTMLElement>('[data-cursor]');
    if (objetivos.length) {
      const burbuja = document.createElement('div');
      burbuja.className = 'burbuja';
      burbuja.setAttribute('aria-hidden', 'true');
      document.body.append(burbuja);
      gsap.set(burbuja, { scale: 0, autoAlpha: 0 });
      const bx = gsap.quickTo(burbuja, 'x', { duration: 0.5, ease: 'power3.out' });
      const by = gsap.quickTo(burbuja, 'y', { duration: 0.5, ease: 'power3.out' });
      window.addEventListener('pointermove', (e) => { bx(e.clientX); by(e.clientY); }, { passive: true });
      objetivos.forEach((el) => {
        el.addEventListener('pointerenter', () => {
          burbuja.textContent = el.dataset.cursor ?? '';
          gsap.to(burbuja, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'power3.out' });
        });
        el.addEventListener('pointerleave', () => gsap.to(burbuja, { scale: 0, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }));
      });
    }
  }

  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
