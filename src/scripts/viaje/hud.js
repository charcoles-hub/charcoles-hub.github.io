// El HUD es DOM normal superpuesto a la escena (decisión híbrida del spec §2:
// titulares flotan en 3D, el texto de lectura va aquí). Al ser HTML de verdad,
// los enlaces son enlaces, el texto se selecciona y el toggle ES/EN es trivial.
// Durante los segmentos de viaje el panel se retira: en movimiento no se lee.

function esc(s) {
  // Todo lo que se pinta viene de site.ts (contenido propio), pero el HUD usa
  // innerHTML para los enlaces y esto cuesta un if — higiene básica.
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function htmlPanel(id, C) {
  if (id === 'hero') {
    return `<p class="hud-sub">${esc(C.subHero)}</p>
            <p class="hud-pista">${esc(C.portadaPie)}</p>`;
  }
  if (id.startsWith('proyecto-')) {
    const p = C.proyectos[Number(id.split('-')[1])];
    const nota = p.etiqueta === 'cliente' ? C.proyecto.notaCliente : C.proyecto.notaConcepto;
    return `<p class="hud-ficha">${esc(p.tituloFicha)} <span class="hud-vivo">${esc(C.proyecto.envivo)}</span></p>
            <h2 class="hud-nombre">${esc(p.nombre)}</h2>
            <p class="hud-rubro">${esc(p.rubro)}</p>
            <p class="hud-desc">${esc(p.descripcion)}</p>
            <p class="hud-nota">${esc(nota)}</p>
            <a class="hud-abrir" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(C.proyecto.abrir)}</a>`;
  }
  if (id === 'bio') {
    return `<h2 class="hud-nombre">${esc(C.bio.titular)}</h2>` +
      C.bio.parrafos.map((t, i) => `<p class="hud-desc" data-parrafo="${i}">${esc(t)}</p>`).join('');
  }
  if (id === 'contacto') {
    return `<p class="hud-ficha">${esc(C.contacto.eyebrow)}</p>
            <h2 class="hud-nombre">${esc(C.contacto.titular)}</h2>
            <p class="hud-desc">${esc(C.contacto.texto)}</p>
            <a class="hud-abrir" href="mailto:${esc(C.site.email)}">${esc(C.site.email)} ↗</a>`;
  }
  return '';
}

export function crearHud({ root, datos, langInicial, onCambiarIdioma }) {
  let lang = langInicial;
  let panelActual = null;

  root.innerHTML = `
    <div class="hud-top">
      <span class="hud-marca"></span>
      <div class="hud-idiomas">
        <button type="button" data-idioma="es">ES</button>
        <button type="button" data-idioma="en">EN</button>
      </div>
    </div>
    <div class="hud-panel"></div>`;

  const marca = root.querySelector('.hud-marca');
  const panel = root.querySelector('.hud-panel');
  const botones = [...root.querySelectorAll('button[data-idioma]')];

  for (const b of botones) {
    b.addEventListener('click', () => onCambiarIdioma(b.dataset.idioma));
  }

  function pintaIdioma() {
    marca.textContent = `${datos[lang].site.nombre} — ${datos[lang].site.rol}`;
    for (const b of botones) b.toggleAttribute('data-activo', b.dataset.idioma === lang);
    panelActual = null; // fuerza repintado del panel en el próximo frame
  }
  pintaIdioma();

  function actualizar(seg, t) {
    if (seg.tipo === 'viaje') {
      panel.classList.remove('visible');
      panelActual = null;
      return;
    }
    if (panelActual !== seg.id) {
      panelActual = seg.id;
      panel.innerHTML = htmlPanel(seg.id, datos[lang]);
      panel.classList.add('visible');
    }
    if (seg.id === 'bio') {
      for (const p of panel.querySelectorAll('[data-parrafo]')) {
        p.classList.toggle('visible', t >= Number(p.dataset.parrafo) / 3);
      }
    }
  }

  return {
    setIdioma(nuevo) { lang = nuevo; pintaIdioma(); },
    actualizar,
    lang: () => lang,
  };
}
