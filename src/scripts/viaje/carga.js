// La carga ES la primera escena (spec §3): la cámara ya está en el plano de
// apertura y el usuario ve cómo las pantallas entran volando a la curva.
// El progreso es real: cuenta iframes cargados, no un temporizador disfrazado.
const DUR_ENTRADA = 520;  // ms por pantalla
const PASO_ENTRADA = 260; // ms de escalonado entre pantallas
const MIN_MONTAJE = 1800; // la secuencia tiene que lucirse aunque todo vuele
const MAX_ESPERA = 7000;  // una demo lenta no atraca el viaje

export async function montarEscena({ escena, pantallas, nTotal }) {
  const capa = document.getElementById('carga');
  const texto = document.getElementById('carga-texto');
  const t0 = performance.now();
  // Scroll bloqueado durante el montaje: el viaje no empieza hasta el final.
  document.documentElement.style.overflow = 'hidden';

  let cargadas = 0;
  for (const f of pantallas.iframes) {
    if (f.dataset.cargado === 'si') cargadas++;
    else f.addEventListener('load', () => cargadas++, { once: true });
  }

  // Las pantallas nacen desplazadas (más cerca de cámara y más altas) y
  // transparentes; cada una entra a su posición de la curva con easing.
  const objetos = pantallas.objetos;
  const finales = objetos.map((o) => o.position.clone());
  const origenes = finales.map((p) => p.clone().setZ(p.z + 1200).setY(p.y + 300));
  for (const o of objetos) o.element.style.opacity = '0';

  let fin = false;
  escena.enCadaFrame(() => {
    if (fin) return;
    const t = performance.now() - t0;
    objetos.forEach((o, i) => {
      const k = Math.min(1, Math.max(0, (t - i * PASO_ENTRADA) / DUR_ENTRADA));
      const e = 1 - Math.pow(1 - k, 3); // easeOutCubic
      o.position.lerpVectors(origenes[i], finales[i], e);
      o.element.style.opacity = String(e);
    });
    texto.textContent = `Montando ${Math.min(cargadas, nTotal)}/${nTotal}`;
  });

  await pantallas.esperarCarga(MAX_ESPERA);
  const restante = MIN_MONTAJE - (performance.now() - t0);
  if (restante > 0) await new Promise((r) => setTimeout(r, restante));

  fin = true;
  for (const o of objetos) o.element.classList.add('montada');
  capa.setAttribute('aria-hidden', 'true'); // el CSS la desvanece
  document.documentElement.style.overflow = '';
}
