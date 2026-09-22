import { readFileSync, existsSync, readdirSync } from 'node:fs';
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
assert.ok(pages.length >= 16, 'An existing route disappeared');
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `One h1: ${file}`);
  assert.match(html, /<link rel="canonical" href="https:\/\/sergiogarciaweb.com\//, `Canonical: ${file}`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate ID: ${file}`);
  for (const [, href] of html.matchAll(/\shref="([^"]+)"/g)) {
    if (href.startsWith('#')) assert.ok(ids.includes(href.slice(1)), `Missing anchor ${href}: ${file}`);
    if (href.startsWith('/') && !href.startsWith('//')) {
      const pathname = decodeURIComponent(href.split(/[?#]/)[0]);
      const target = join(dist, pathname.endsWith('/') ? `${pathname}index.html` : pathname);
      assert.ok(existsSync(target), `Missing internal target ${href}: ${file}`);
    }
  }
  for (const [, attrs] of html.matchAll(/<img\s([^>]+)>/g)) {
    assert.match(attrs, /\balt="[^"]*"/, `Missing image alt: ${file}`);
    assert.match(attrs, /\bwidth="\d+"/, `Missing image width: ${file}`);
    assert.match(attrs, /\bheight="\d+"/, `Missing image height: ${file}`);
    const src = attrs.match(/\bsrc="([^"]+)"/)?.[1];
    if (src?.startsWith('/')) assert.ok(existsSync(join(dist, src)), `Missing image ${src}`);
  }
}
for (const [lang, path] of [['es','index.html'], ['ca','ca/index.html'], ['en','en/index.html']]) {
  const html = readFileSync(join(dist, path), 'utf8');
  assert.match(html, new RegExp(`<html lang="${lang}"`));
  for (const alternate of ['es', 'en', 'ca', 'x-default']) assert.ok(html.includes(`hreflang="${alternate}"`), `Missing ${alternate} on ${lang}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  assert.ok(schemas.some(s => s.areaServed?.['@type'] === 'Country' && s.areaServed?.name === 'España'), `National coverage: ${lang}`);
  assert.ok(schemas.every(s => !s.aggregateRating), `Unverified review rating: ${lang}`);
  assert.ok(html.includes('https://wa.me/34620650597?text='), `WhatsApp: ${lang}`);
  assert.ok(html.includes('mailto:info@sergiogarciaweb.com'), `Email: ${lang}`);
  assert.ok(html.includes('tel:+34620650597'), `Phone: ${lang}`);
  assert.ok(!html.includes('/presupuesto-web/'), `No calculator link: ${lang}`);
  assert.doesNotMatch(html, /(?:\d[\d.,]*\s*€|€\s*\d)/, `No fixed euro amount: ${lang}`);
  assert.equal((html.match(/<script(?! type="application\/ld\+json")/g) || []).length, 0, `Home must work without runtime JavaScript: ${lang}`);
}
for (const [lang, path, thanks] of [
  ['es', 'resena/index.html', '/gracias/'],
  ['ca', 'ca/ressenya/index.html', '/ca/gracies/'],
  ['en', 'en/review/index.html', '/en/thanks/'],
]) {
  const html = readFileSync(join(dist, path), 'utf8');
  assert.ok(html.includes(`name="Idioma" value="${lang}"`), `Review language: ${lang}`);
  assert.ok(html.includes(`name="redirect" value="https://sergiogarciaweb.com${thanks}"`), `Review redirect: ${lang}`);
}
console.log(`PASS: ${pages.length} generated pages; internal links, anchors, images, titles, 3 languages, national schema and contact paths.`);
