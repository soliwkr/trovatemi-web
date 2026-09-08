import fs from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = await fs.readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');

test('root exposes the current Trovatemi product truth', () => {
  assert.match(source, /Hai già clienti felici/);
  assert.match(source, /PASSAPAROLA PERSO/);
  assert.match(source, /€149/);
  assert.match(source, /21 giorni/i);
  assert.match(source, /Beauty &amp; Wellness/);
});

test('root keeps one primary action around the real business check', () => {
  assert.match(source, /Cerca la tua attività/);
  assert.match(source, /beauty-check-v2-preview/);
});
