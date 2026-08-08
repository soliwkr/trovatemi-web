import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const clientRoot = resolve('dist/client');

const routes = {
  production: 'index.html',
  archive: 'archivio/home-v7-2/index.html',
  home: 'brand-demo-v13/index.html',
  demoHub: 'demo/index.html',
  demo: 'demo/sunny-cafe/index.html',
  biolink: 'link/sunny-cafe/index.html',
  landing: 'per/sunny-cafe/index.html',
};

const html = {};
for (const [name, relativePath] of Object.entries(routes)) {
  const absolutePath = resolve(clientRoot, relativePath);
  if (!existsSync(absolutePath)) throw new Error(`V13 verification: missing ${name} route at ${relativePath}`);
  html[name] = readFileSync(absolutePath, 'utf8');
}

const requireText = (name, pattern, message) => {
  if (!pattern.test(html[name])) throw new Error(`V13 verification: ${message}`);
};

requireText('production', /Il cliente ti sta già cercando\./, 'production root no longer renders the V7.2 marker');
requireText('archive', /ARCHIVIO · HOME V7\.2/, 'archive route does not identify the V7.2 snapshot');
requireText('archive', /name="robots" content="noindex, nofollow"/, 'archive route is not noindex');
requireText('home', /Ogni cliente soddisfatto può portarti il prossimo\./, 'V13 homepage marker missing');
requireText('home', /name="robots" content="noindex, nofollow"/, 'V13 homepage is not noindex');
requireText('home', /data-src="https:\/\/app\.trovatemi\.it\/try\/#\/home\?category=sunny-cafe"/, 'homepage does not contain the gated real backend URL');
requireText('demoHub', /Non guardare una presentazione\. Entra nel sistema\./, 'demo hub marker missing');
requireText('demo', /<iframe src="https:\/\/app\.trovatemi\.it\/try\/#\/home\?category=sunny-cafe"/, 'standalone demo does not autoload the real backend');
requireText('demo', /Codice embed/, 'standalone demo does not expose embed code');
requireText('biolink', /Prova il pannello demo/, 'biolink primary action missing');
requireText('biolink', /Apri la modalità live/, 'biolink live action missing');
requireText('landing', /data-src="https:\/\/app\.trovatemi\.it\/try\/#\/home\?category=sunny-cafe"/, 'landing does not contain the gated real backend URL');
requireText('landing', /Prima lo vedi\. Poi decidiamo come provarlo davvero\./, 'demo-first commercial boundary missing');

if (/<iframe src="https:\/\/app\.trovatemi\.it\/try\/#\/home\?category=sunny-cafe"/.test(html.landing)) {
  throw new Error('V13 verification: vertical landing autoloads the heavy backend before visitor action');
}

const h1Count = (html.home.match(/<h1(?:\s|>)/g) || []).length;
if (h1Count !== 1) throw new Error(`V13 verification: V13 homepage has ${h1Count} H1 elements; expected exactly one`);

console.log('V13 build verification passed');
console.log(`Routes checked: ${Object.keys(routes).length}`);
console.log('Production root: V7.2 preserved');
console.log('Backend strategy: standalone autoload + editorial click-to-load');
