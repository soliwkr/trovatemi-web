import fs from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = await fs.readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');

test('root exposes the Trovatemi opportunity radar MVP', () => {
  assert.match(source, /DOVE STAI PERDENDO/);
  assert.match(source, /CLIENTI LOCALI/);
  assert.match(source, /TROVATEMI RADAR/);
  assert.match(source, /3 opportunità/);
  assert.match(source, /Cerca la mia attività/);
});

test('root connects selection to the opportunity decision endpoint and action funnel', () => {
  assert.match(source, /\/api\/public-opportunities/);
  assert.match(source, /data-fix-opportunity/);
  assert.match(source, /Sistemami la priorità/);
  assert.match(source, /\/api\/public-check/);
});

test('root exposes product-grade recovery and navigation states', () => {
  assert.match(source, /Modifica ricerca/);
  assert.match(source, /Cambia attività/);
  assert.match(source, /data-retry-search/);
  assert.match(source, /data-retry-opportunities/);
  assert.match(source, /check-feedback/);
});
