import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

// Check the generated artifact, not template strings: links, semantics and SEO.
const dist = resolve('dist');
const pages = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith('.html')) pages.push(path);
  }
}
walk(dist);
assert.ok(pages.length >= 25, 'An existing route disappeared');

const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
const nodes = (html) => jsonLd(html).flatMap((s) => (s['@graph'] ? s['@graph'] : [s]));

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `One h1: ${file}`);
  assert.equal((html.match(/<main(?:\s|>)/g) || []).length, 1, `One main landmark: ${file}`);
  assert.match(html, /<link rel="canonical" href="https:\/\/sergiogarciaweb.com\//, `Canonical: ${file}`);
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/, `Fonts are self-hosted: ${file}`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate ID: ${file}`);
  for (const [, href] of html.matchAll(/\shref="([^"]+)"/g)) {
    if (href.startsWith('#')) assert.ok(ids.includes(href.slice(1)), `Missing anchor ${href}: ${file}`);
    if (href.startsWith('/') && !href.startsWith('//')) {
      const [pathname, fragment] = decodeURIComponent(href).split('#');
      const clean = pathname.split('?')[0];
      const target = join(dist, clean.endsWith('/') ? `${clean}index.html` : clean);
      assert.ok(existsSync(target), `Missing internal target ${href}: ${file}`);
      if (fragment && target.endsWith('.html')) {
        assert.ok(readFileSync(target, 'utf8').includes(`id="${fragment}"`), `Missing anchor ${href}: ${file}`);
      }
    }
  }
  for (const [, attrs] of html.matchAll(/<img\s([^>]+)>/g)) {
    // alt vacío (Astro lo escribe como `alt` a secas) es válido: imagen decorativa.
    assert.match(attrs, /\balt(?:="[^"]*")?(?=\s|$)/, `Missing image alt: ${file}`);
    assert.match(attrs, /\bwidth="\d+"/, `Missing image width: ${file}`);
    assert.match(attrs, /\bheight="\d+"/, `Missing image height: ${file}`);
    const src = attrs.match(/\bsrc="([^"]+)"/)?.[1];
    if (src?.startsWith('/')) assert.ok(existsSync(join(dist, src)), `Missing image ${src}`);
  }
  // La valoración estructurada debe corresponder a la reseña publicada.
  const rated = nodes(html).filter((n) => n.aggregateRating);
  assert.equal(rated.length, 1, `One rated business: ${file}`);
  assert.equal(rated[0].aggregateRating.reviewCount, 1, `Real review count: ${file}`);
  assert.equal(rated[0].aggregateRating.ratingValue, '5.0', `Real review rating: ${file}`);
  assert.equal(rated[0].review?.[0]?.reviewBody?.startsWith('Muy buen trato y gran profesionalidad.'), true, `Real review text: ${file}`);
}

// Recursos compartidos: fuentes precargadas, iconos e imagen para redes.
for (const asset of ['fonts/inter-latin-wght.woff2', 'fonts/instrument-serif-latin.woff2', 'fonts/instrument-serif-latin-italic.woff2', 'favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'og.jpg']) {
  assert.ok(existsSync(join(dist, asset)), `Missing asset: ${asset}`);
}
assert.ok(statSync(join(dist, 'og.jpg')).size < 300_000, 'og.jpg must stay under 300 KB or WhatsApp may skip the preview');

const soloEspanol = [
  'diseno-web', 'rediseno-web', 'mantenimiento-web', 'posicionamiento-google',
  'diseno-web-cornella', 'diseno-web-baix-llobregat', 'diseno-web-barcelona',
  'diseno-web-clinicas-dentales', 'diseno-web-fisioterapeutas', 'diseno-web-psicologos',
  'diseno-web-veterinarias', 'diseno-web-gestorias', 'diseno-web-arquitectos',
  'revision-web-gratis', 'proyectos/fisioymes',
];
for (const slug of soloEspanol) {
  const html = readFileSync(join(dist, slug, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /<link rel="alternate" hreflang=/, `Only equivalent translations may use hreflang: ${slug}`);
  assert.doesNotMatch(html, /<meta name="robots" content="noindex"/, `Must be indexable: ${slug}`);
  assert.ok(nodes(html).some((n) => n['@type'] === 'BreadcrumbList'), `Breadcrumbs: ${slug}`);
}

// Páginas por sector: la demo se declara concepto, y enlazan a la revisión gratuita.
for (const slug of soloEspanol.filter((s) => /^diseno-web-(clinicas|fisio|psico|veter|gesto|arqui)/.test(s))) {
  const html = readFileSync(join(dist, slug, 'index.html'), 'utf8');
  assert.match(html, /Concepto de ejemplo, no un cliente/, `Concept label: ${slug}`);
  assert.ok(html.includes('href="/revision-web-gratis/"'), `Free review link: ${slug}`);
}

const home = readFileSync(join(dist, 'index.html'), 'utf8');
for (const slug of ['diseno-web-cornella', 'diseno-web-baix-llobregat', 'diseno-web-barcelona', 'posicionamiento-google', 'proyectos/fisioymes', 'revision-web-gratis', 'diseno-web-clinicas-dentales', 'diseno-web-fisioterapeutas']) {
  assert.ok(home.includes(`href="/${slug}/"`), `Missing home link to ${slug}`);
}
for (const [lang, path] of [['es', 'index.html'], ['ca', 'ca/index.html'], ['en', 'en/index.html']]) {
  const html = readFileSync(join(dist, path), 'utf8');
  assert.match(html, new RegExp(`<html lang="${lang}"`));
  for (const alternate of ['es', 'en', 'ca', 'x-default']) assert.ok(html.includes(`hreflang="${alternate}"`), `Missing ${alternate} on ${lang}`);
  assert.ok(nodes(html).some((n) => n.areaServed?.['@type'] === 'Country' && n.areaServed?.name === 'España'), `National coverage: ${lang}`);
  assert.ok(nodes(html).some((n) => n['@type'] === 'WebSite'), `WebSite schema: ${lang}`);
  assert.ok(html.includes('https://wa.me/34620650597?text='), `WhatsApp: ${lang}`);
  assert.ok(html.includes('mailto:info@sergiogarciaweb.com'), `Email: ${lang}`);
  assert.ok(html.includes('tel:+34620650597'), `Phone: ${lang}`);
  assert.ok(!html.includes('/presupuesto-web/'), `No calculator link: ${lang}`);
  assert.doesNotMatch(html, /(?:\d[\d.,]*\s*€|€\s*\d)/, `No fixed euro amount: ${lang}`);
  assert.equal((html.match(/<script(?! type="application\/ld\+json")/g) || []).length, 0, `Home must work without runtime JavaScript: ${lang}`);
  assert.match(html, /id="resenas"/, `Published reviews section: ${lang}`);
  assert.ok(html.includes('Muy buen trato y gran profesionalidad.'), `Diana's review on home: ${lang}`);
}

for (const [lang, path, thanks] of [
  ['es', 'resena/index.html', '/gracias/'],
  ['ca', 'ca/ressenya/index.html', '/ca/gracies/'],
  ['en', 'en/review/index.html', '/en/thanks/'],
]) {
  const html = readFileSync(join(dist, path), 'utf8');
  assert.ok(html.includes(`name="Idioma" value="${lang}"`), `Review language: ${lang}`);
  assert.ok(html.includes(`name="redirect" value="https://sergiogarciaweb.com${thanks}"`), `Review redirect: ${lang}`);
  assert.match(html, /<meta name="robots" content="noindex"/, `Review form is noindex: ${lang}`);
  assert.ok(html.includes('Muy buen trato y gran profesionalidad.'), `Diana's review on review page: ${lang}`);
}

const revision = readFileSync(join(dist, 'revision-web-gratis/index.html'), 'utf8');
assert.ok(revision.includes('action="https://api.web3forms.com/submit"'), 'Free review form posts to Web3Forms');
assert.ok(revision.includes('name="redirect" value="https://sergiogarciaweb.com/gracias-revision/"'), 'Free review redirect');
for (const campo of ['Web', 'Nombre', 'email']) assert.match(revision, new RegExp(`name="${campo}"[^>]*required`), `Required field ${campo}`);
assert.match(readFileSync(join(dist, 'gracias-revision/index.html'), 'utf8'), /<meta name="robots" content="noindex"/, 'Thanks page is noindex');

const sitemap = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
for (const excluida of ['/gracias/', '/gracias-revision/', '/resena/', '/en/review/', '/ca/ressenya/', '/en/thanks/', '/ca/gracies/']) {
  assert.ok(!sitemap.includes(`https://sergiogarciaweb.com${excluida}<`), `Sitemap must skip noindex page ${excluida}`);
}
for (const incluida of soloEspanol) assert.ok(sitemap.includes(`https://sergiogarciaweb.com/${incluida}/<`), `Sitemap lists /${incluida}/`);

console.log(`PASS: ${pages.length} generated pages; links, anchors, images, SEO metadata, schema, 3 languages, forms, sitemap and contact paths.`);
