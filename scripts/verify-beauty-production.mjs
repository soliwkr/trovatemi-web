import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const required = [
  'src/layouts/ProductionLayout.astro',
  'src/styles/production.css',
  'src/pages/index.astro',
  'src/pages/check/index.astro',
  'src/pages/report/[slug].astro',
  'src/data/beauty-demo.ts',
  'docs/BEAUTY-PRODUCTION-V1.md',
  'wrangler.beauty-preview.jsonc',
];
const forbidden = [/wa\.me/i, /api\.whatsapp/i, /maps\.googleapis/i, /\bD1Database\b/, /Chris/i, /Sunny Cafe/i];

for (const file of required) await readFile(join(root, file), 'utf8');
const productionFiles = ['src/layouts/ProductionLayout.astro', 'src/pages/index.astro', 'src/pages/check/index.astro', 'src/pages/report/[slug].astro', 'src/data/beauty-demo.ts'];
for (const file of productionFiles) {
  const source = await readFile(join(root, file), 'utf8');
  for (const pattern of forbidden) if (pattern.test(source)) throw new Error(`${file}: contenuto vietato ${pattern}`);
}
const preview = JSON.parse(await readFile(join(root, 'wrangler.beauty-preview.jsonc'), 'utf8'));
if (preview.routes || preview.d1_databases) throw new Error('La preview non può avere route custom o D1.');
if (preview.name === 'trovatemi-web') throw new Error('La preview deve usare un Worker isolato.');
const reportFiles = (await readdir(join(root, 'src/pages/report'))).length;
if (!reportFiles) throw new Error('Report route mancante.');
console.log('Beauty production QA: OK');
