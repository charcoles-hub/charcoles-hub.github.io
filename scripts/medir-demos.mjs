import puppeteer from 'puppeteer-core';

const b = await puppeteer.launch({
  executablePath: process.env.CHROMIUM ?? '/usr/bin/chromium',
  headless: 'new',
  args: ['--no-sandbox'],
});

for (const slug of ['demo-barberia-navaja', 'demo-dental-sereno', 'demo-psicologia-ancla']) {
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(`https://charcoles-hub.github.io/${slug}/`, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500)); // que asienten las animaciones de entrada
  const alto = await p.evaluate(() => document.documentElement.scrollHeight);
  console.log(`${slug.padEnd(24)} alto: ${alto}px  (${(alto / 900).toFixed(1)} pantallas)`);
  await p.close();
}

await b.close();
