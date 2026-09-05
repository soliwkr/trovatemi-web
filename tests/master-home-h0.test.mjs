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
    'Trovatemi fa vedere online quanto sei bravo davvero.',
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
    'Cerca la tua attività.',
  ]) {
    assert.ok(source.includes(line), `missing approved copy: ${line}`);
  }
});

test('H0 tells the campaign story in the approved order', () => {
  const beats = [
    'STORIA 01',
    'STORIA 02',
    'STORIA 03',
    'STORIA 04',
    'ADESSO TOCCA A TE',
    'UNA SOLA OFFERTA',
  ];

  let previous = -1;
  for (const beat of beats) {
    const index = source.indexOf(beat);
    assert.ok(index >= 0, `missing story beat: ${beat}`);
    assert.ok(index > previous, `story beat out of order: ${beat}`);
    previous = index;
  }
});

test('H0 explains the product before mechanism detail', () => {
  const productTruth = source.indexOf('Trovatemi fa vedere online quanto sei bravo davvero.');
  const mechanism = source.indexOf('Cliente contento');
  assert.ok(productTruth >= 0, 'missing product truth');
  assert.ok(mechanism >= 0, 'missing mechanism story');
  assert.ok(productTruth < mechanism, 'product truth must appear before mechanism detail');
});

test('H0 keeps the lookup conceptual until L2 exists', () => {
  assert.match(source, /Cerca la tua attività\./);
  assert.match(source, /disabled aria-disabled="true"/);
  assert.match(source, /La ricerca reale verrà attivata con L2/);
});

test('H0 avoids misleading competitor ratings and feature-zoo patterns', () => {
  assert.doesNotMatch(source, /4,8|4,9|4,3|rating/i);
  assert.doesNotMatch(source, /class="four-actions/);
  assert.doesNotMatch(source, /mock-card|dashboard/i);
});

test('H0 exposes the approved offer only', () => {
  assert.match(source, /€0/);
  assert.match(source, /21 giorni/);
  assert.match(source, /€149/);
  assert.match(source, /per sede, salvo cancellazione prima del rinnovo/);
});

test('H0 does not publish internal strategic labels', () => {
  assert.doesNotMatch(source, />\s*FIDUCIA\s*</);
  assert.doesNotMatch(source, />\s*VISIBILITÀ\s*</);
  assert.doesNotMatch(source, />\s*SCELTA\s*</);
  assert.doesNotMatch(source, /porta direttamente a SCELTA/i);
});

test('H0 uses the campaign-led image system', () => {
  for (const image of [
    'master-home-hero-v3.webp',
    'master-home-goodbye.webp',
    'master-home-missing-v3.webp',
    'master-home-compare-v3.webp',
    'master-home-proof-v2.webp',
  ]) {
    assert.ok(source.includes(image), `missing campaign image: ${image}`);
  }
});
