import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const fail = (message) => {
  console.error(`Reset gate fallito: ${message}`);
  process.exitCode = 1;
};

const resetSourcePaths = [
  'src/components/v13-rebuild/HomeExperience.tsx',
  'src/components/v13-rebuild/Shared.tsx',
  'src/data/site-copy.ts',
  'src/pages/brand-demo-v13/index.astro',
];
const resetSource = resetSourcePaths.map(read).join('\n');
const lowerSource = resetSource.toLocaleLowerCase('it');

for (const phrase of [
  'inevitabile',
  '14 giorni',
  'trial',
  'geo agent',
  'seo agent',
  'social agent',
  'rank-and-rent',
]) {
  if (lowerSource.includes(phrase)) fail(`rumore commerciale reintrodotto: ${phrase}`);
}

if (/\btrovato\b/i.test(resetSource)) fail('vecchia tassonomia piano reintrodotta: TROVATO');
if (/\brete\b/i.test(resetSource)) fail('vecchia tassonomia piano reintrodotta: RETE');

for (const required of [
  'Per saloni, barber e centri estetici',
  'I tuoi clienti escono contenti dal salone',
  'Fammi vedere sul mio salone',
  'TikTok',
  "price: '149'",
]) {
  if (!resetSource.includes(required)) fail(`messaggio core mancante: ${required}`);
}

const productionRoot = read('src/pages/index.astro');
const productionHash = createHash('sha256').update(productionRoot).digest('hex');
if (productionHash !== '91853c0d50df119fc43164c46c236b1cbcb15dc3a369dd3ce2ba658e66037edd') {
  fail('la home di produzione è cambiata');
}

const previewFile = new URL('dist/client/brand-demo-v13/index.html', root);
if (!existsSync(previewFile)) {
  fail('route preview /brand-demo-v13/ non generata');
} else {
  const html = readFileSync(previewFile, 'utf8');
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) fail(`/brand-demo-v13/ contiene ${h1Count} H1`);
  if (!/<meta\s+name="robots"\s+content="noindex, nofollow"/i.test(html)) fail('/brand-demo-v13/ non è noindex');
}

const demoFile = new URL('dist/client/demo/wellness-spa/index.html', root);
if (!existsSync(demoFile)) {
  fail('demo wellness-spa non generata');
} else {
  const demoHtml = readFileSync(demoFile, 'utf8');
  if (!demoHtml.includes('category=wellness-spa')) fail('iframe Climbo wellness-spa mancante');
}

if (!process.exitCode) {
  console.log('Reset gate superato: beauty-first, un solo prodotto, preview noindex, produzione invariata.');
}
