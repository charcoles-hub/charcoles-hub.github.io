import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const PUERTO = Number(process.env.PUERTO ?? 4321);
const RAIZ = new URL('../dist/', import.meta.url).pathname;
const ORIGEN_DEMOS = 'https://charcoles-hub.github.io';
const ORIGEN_FISIOYMES = 'https://fisioymes.com';

// Rutas que NO son de este sitio, sino de otros repos publicados en el mismo
// usuario de GitHub Pages. En producción las sirve GitHub en el mismo origen;
// aquí las traemos para replicarlo. Al añadir un cliente nuevo, mételo aquí y
// en el proxy de astro.config.mjs, o su iframe cargará un 404 en local.
const ES_PROYECTO = /^\/(demo-|fisioymes)/;

// Fisioymés ya vive en su propio dominio: charcoles-hub.github.io/fisioymes/
// es un 301 a fisioymes.com, y el HTML que sirve referencia sus assets con
// rutas absolutas de RAÍZ (/assets/*, /_astro/*). En producción esas rutas las
// resuelve su dominio; aquí caerían en dist/ y darían 404, así que si dist/ no
// las tiene se las pedimos a fisioymes.com. Lo nuestro siempre gana: dist/ se
// intenta primero, esto es solo el último recurso.
const ES_ASSET_FISIOYMES = /^\/(assets|_astro)\//;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

createServer(async (req, res) => {
  const ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);

  // Las demos: igual que en producción, mismo origen.
  if (ES_PROYECTO.test(ruta)) {
    const upstream = await fetch(ORIGEN_DEMOS + ruta, { redirect: 'follow' });
    res.writeHead(upstream.status, {
      'content-type': upstream.headers.get('content-type') ?? 'application/octet-stream',
    });
    res.end(Buffer.from(await upstream.arrayBuffer()));
    return;
  }

  // El sitio: estático desde dist/.
  // normalize() corta los ../ antes de tocar el disco.
  const rel = normalize(ruta).replace(/^(\.\.[/\\])+/, '');
  const archivo = join(RAIZ, rel.endsWith('/') ? rel + 'index.html' : rel);
  try {
    const cuerpo = await readFile(archivo);
    res.writeHead(200, { 'content-type': TIPOS[extname(archivo)] ?? 'application/octet-stream' });
    res.end(cuerpo);
  } catch {
    if (ES_ASSET_FISIOYMES.test(ruta)) {
      const upstream = await fetch(ORIGEN_FISIOYMES + ruta, { redirect: 'follow' });
      res.writeHead(upstream.status, {
        'content-type': upstream.headers.get('content-type') ?? 'application/octet-stream',
      });
      res.end(Buffer.from(await upstream.arrayBuffer()));
      return;
    }
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('404');
  }
}).listen(PUERTO, () => console.log(`dist/ + proxy de demos en http://localhost:${PUERTO}/`));
