import fs from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = await fs.readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');

test('root exposes the current Trovatemi product truth', () => {
  assert.match(source, /TI TROVERESTI\?/);
  assert.match(source, /E TI SCEGLIERESTI\?/);
  assert.match(source, /segnali pubblici osservati/i);
  assert.match(source, /Non ti stiamo dando un voto/);
  assert.doesNotMatch(source, /Beauty &amp; Wellness/);
});

test('root keeps one primary action around the real business check', () => {
  assert.match(source, /Cerca la mia attività/);
  assert.match(source, /fetch\('\/api\/public-search'/);
});
