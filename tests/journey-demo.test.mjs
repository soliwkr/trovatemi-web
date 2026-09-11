import fs from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = await fs.readFile(new URL('../src/pages/journey-demo.astro', import.meta.url), 'utf8');

test('simulated journey covers the full customer decision path', () => {
  for (const term of ['GOOGLE','RECENSIONI','INSTAGRAM','FACEBOOK','SITO','SEI MEGLIO DI COME APPARI']) {
    assert.match(source, new RegExp(term));
  }
  assert.match(source, /Dati e attività in questa pagina sono simulati/);
  assert.match(source, /€197/);
});

test('simulated journey is not indexable and does not replace root', () => {
  assert.match(source, /noindex,nofollow/);
  assert.match(source, /PROTOTIPO SIMULATO/);
});
