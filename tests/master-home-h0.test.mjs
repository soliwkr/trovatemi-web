import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../src/pages/master-home.astro', import.meta.url), 'utf8');

test('H0 remains an isolated noindex preview', () => {
  assert.match(source, /name="robots" content="noindex, nofollow, noarchive"/);
  assert.match(source, /href="\/master-home\/"/);
});

test('H0 carries the approved public messaging backbone', () => {
  for (const line of [
    'Hai già',
    'clienti felici.',
    'Fai in modo',
    'che si veda.',
    'Peccato che',
    'Google non era lì.',
    'Dove sono finite',
    'le altre 46?',
    'Sei più bravo.',
    'Indovina chi sembra più bravo.',
    'Il passaparola c’è.',
    'Solo che gira male.',
    'Il passaparola che hai già.',
    'Messo al lavoro.',
  ]) {
    assert.ok(source.includes(line), `missing approved copy: ${line}`);
  }
});

test('H0 exposes exactly the approved offer and cross-vertical routes', () => {
  assert.match(source, /21 giorni di trial/);
  assert.match(source, /€0 durante il trial/);
  assert.match(source, /€149\/mese/);
  assert.match(source, /class="route-card route-beauty" href="\/"/);
  assert.match(source, /class="route-card route-local" href="#demo"/);
});

test('H0 does not publish internal messaging labels or decorative dashboards', () => {
  assert.doesNotMatch(source, />\s*FIDUCIA\s*</);
  assert.doesNotMatch(source, />\s*VISIBILITÀ\s*</);
  assert.doesNotMatch(source, />\s*SCELTA\s*</);
  assert.doesNotMatch(source, /mock-card|dashboard/i);
});
