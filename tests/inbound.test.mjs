import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const home = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
const trova = readFileSync(new URL('../src/pages/trova/index.astro', import.meta.url), 'utf8');
const legacy = readFileSync(new URL('../src/pages/beauty-check/index.astro', import.meta.url), 'utf8');

test('Trovatemi public MVP is one root page', () => {
  assert.match(home, /HAI CLIENTI/);
  assert.match(home, /FAI IN MODO/);
  assert.match(home, /IL PASSAPAROLA CHE HAI GIÀ/);
  assert.match(home, /SCRIVICI SU INSTAGRAM/);
});

test('root contains only the three MVP actions', () => {
  assert.match(home, /RACCOGLI/);
  assert.match(home, /RISPONDI/);
  assert.match(home, /FALLA LAVORARE/);
  assert.doesNotMatch(home, /pricing|dashboard|check|audit|Google Places|21 GIORNI/i);
});

test('old inbound routes collapse back to root', () => {
  assert.match(trova, /Astro\.redirect\('\/', 301\)/);
  assert.match(legacy, /Astro\.redirect\('\/', 301\)/);
});
