import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const fail = (message) => {
  console.error(`V13 gate fallito: ${message}`);
  process.exitCode = 1;
};

const ids = ['luxury-watches', 'wellness-spa', 'sunny-cafe', 'fitness-club', 'grand-hotel-riviera'];
const routes = [
  'brand-demo-v13',
  'demo',
  'link',
  'per',
  ...ids.flatMap((id) => [`demo/${id}`, `link/${id}`, `per/${id}`]),
];

const publicSources = [
  'src/components/v13-rebuild/BioLinkExperience.tsx',
  'src/components/v13-rebuild/DemoExperiences.tsx',
  'src/components/v13-rebuild/DemoFrame.tsx',
  'src/components/v13-rebuild/HomeExperience.tsx',
  'src/components/v13-rebuild/LandingExperiences.tsx',
  'src/components/v13-rebuild/Shared.tsx',
  'src/data/site-copy.ts',
  'src/data/vertical-messaging.ts',
];

const combinedSource = publicSources.map(read).join('\n');
const lowerSource = combinedSource.toLocaleLowerCase('it');

for (const word of ['backend', 'tenant', 'playground']) {
  if (new RegExp(`(?:['\"\\s>])${word}(?:['\"\\s<.,])`, 'i').test(combinedSource)) {
    fail(`lessico pubblico vietato: ${word}`);
  }
}

for (const phrase of ['14 giorni gratis', 'prova gratuita', 'attiva il trial', 'inizia il trial']) {
  if (lowerSource.includes(phrase)) fail(`CTA trial pubblica: ${phrase}`);
}

const effectSources = readdirSync(new URL('src/components/v13-rebuild/', root))
  .filter((name) => name.endsWith('.tsx'))
  .map((name) => read(`src/components/v13-rebuild/${name}`))
  .join('\n');

if (/from\s+['\"](?:motion|motion\/react|framer-motion)['\"]/.test(effectSources)) {
  fail('una pagina V13 importa direttamente una libreria di animazione');
}

const css = read('src/styles/v13-aceternity.css');
if (/@keyframes\b/i.test(css)) fail('v13-aceternity.css definisce nuovi keyframe');

for (const color of ['#17302c', '#1a2344', '#302908', '#332b20', '#381c17', '#7f9dff', '#a7d3c5', '#d8b56c', '#f3c400', '#ff7b5c']) {
  if (css.toLowerCase().includes(color)) fail(`colore verticale ereditato: ${color}`);
}

const demoData = read('src/data/demo-tenants.ts');
if (/\b(?:accent|accentSoft|color|colour)\s*:/i.test(demoData)) fail('il catalogo tecnico contiene colori di settore');
for (const id of ids) {
  if (!demoData.includes(`id: '${id}'`) || !demoData.includes(`category: '${id}'`)) fail(`catalogo demo incompleto: ${id}`);
}

const detailSource = read('src/components/v13-rebuild/DemoExperiences.tsx');
const embedConsumers = publicSources
  .filter((path) => !path.endsWith('/DemoFrame.tsx'))
  .map(read)
  .join('\n');
if ((embedConsumers.match(/\bshowCode\b/g) ?? []).length !== 1 || !detailSource.includes('autoload showCode surface="demo"')) {
  fail('il codice embed non è confinato alla pagina demo');
}

const productionRoot = read('src/pages/index.astro');
const productionHash = createHash('sha256').update(productionRoot).digest('hex');
if (productionHash !== '91853c0d50df119fc43164c46c236b1cbcb15dc3a369dd3ce2ba658e66037edd') {
  fail('la home di produzione è cambiata');
}

const stripHtml = (html) => html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&(?:nbsp|amp|quot|#39);/g, ' ')
  .replace(/\s+/g, ' ')
  .toLocaleLowerCase('it');

for (const route of routes) {
  const file = new URL(`dist/client/${route}/index.html`, root);
  if (!existsSync(file)) {
    fail(`route non generata: /${route}/`);
    continue;
  }
  const html = readFileSync(file, 'utf8');
  const visible = stripHtml(html);
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) fail(`/${route}/ contiene ${h1Count} H1`);
  if (!/<meta\s+name="robots"\s+content="noindex, nofollow"/i.test(html)) fail(`/${route}/ non è noindex`);
  for (const word of ['backend', 'tenant', 'playground']) {
    if (new RegExp(`\\b${word}\\b`, 'i').test(visible)) fail(`/${route}/ mostra la parola vietata: ${word}`);
  }
  if (/href="[^"]*\?mode=live/i.test(html)) fail(`/${route}/ espone pubblicamente la modalità presentazione`);
}

for (const id of ids) {
  const file = new URL(`dist/client/demo/${id}/index.html`, root);
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf8');
  if (!html.includes(`category=${id}`)) fail(`iframe reale mancante nella demo ${id}`);
}

if (!process.exitCode) console.log(`V13 gate superato: ${routes.length} route, 5 demo reali, root produzione invariata.`);
