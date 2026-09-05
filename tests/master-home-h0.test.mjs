import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../src/pages/master-home.astro', import.meta.url), 'utf8');
const demoSource = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');

function assertAppearsInOrder(lines) {
  let previousIndex = -1;

  for (const line of lines) {
    const currentIndex = source.indexOf(line);
    assert.notEqual(currentIndex, -1, `missing story beat: ${line}`);
    assert.ok(currentIndex > previousIndex, `story beat out of order: ${line}`);
    previousIndex = currentIndex;
  }
}

test('H0 remains an isolated noindex preview', () => {
  assert.match(source, /name="robots" content="noindex, nofollow, noarchive"/);
  assert.match(source, /href="\/master-home\/"/);
});

test('H0 leads with the approved recognition and product truth', () => {
  for (const line of [
    'Hai già',
    'clienti felici.',
    'Fai in modo',
    'che si veda.',
    'Trovatemi fa vedere online',
    'quanto sei bravo davvero.',
  ]) {
    assert.ok(source.includes(line), `missing approved product truth: ${line}`);
  }
});

test('H0 locks the campaign story-first order', () => {
  assertAppearsInOrder([
    'Hai già',
    'Mi sono trovata',
    'Google<br />non era lì.',
    'Dove sono finite',
    'Sei più bravo.',
    'Cliente contento',
    'id="attivita"',
    '21 giorni',
  ]);
});

test('H0 turns the compliment into one continuous narrative sequence', () => {
  assertAppearsInOrder(['Mi sono trovata', 'Grazie.', 'Paga.', 'Esce.', 'Fine.', 'Google<br />non era lì.']);
  assertAppearsInOrder(['Cliente contento', 'Richiesta', 'Recensione', 'Risposta', 'Riuso']);
  assert.match(source, /Il passaparola che hai già\./);
  assert.match(source, /Messo al lavoro\./);
});

test('H0 keeps the competitor story honest and pronouns coherent', () => {
  assert.match(source, />LUI<\/span><strong>384<\/strong><small>RECENSIONI/);
  assert.match(source, />TU<\/span><strong>41<\/strong><small>RECENSIONI/);
  assert.doesNotMatch(source, />LORO<\/span>/);
  assert.doesNotMatch(source, /\b[1-5][,.][0-9]\b/);
});

test('H0 hands off to the complete declared demo without faking L2', () => {
  assert.match(source, /id="attivita"/);
  assert.match(source, /Cerca la tua/);
  assert.match(source, /APRI LA DEMO COMPLETA/);
  assert.match(source, /href="\/\?demo=search&amp;from=master-home"/);
  assert.match(source, /dati dimostrativi dichiarati/);
  assert.match(source, /Il lookup reale verrà attivato con L2\./);
  assert.doesNotMatch(source, /<form|action=/);

  assert.match(demoSource, /searchParams\.get\('demo'\) === 'search'/);
  assert.match(demoSource, /stage: startsAtSearch \? 'search' : 'intro'/);
  assert.match(demoSource, /'intro' \| 'search' \| 'confirm' \| 'quiz' \| 'flash' \| 'capture' \| 'report'/);
  assert.match(demoSource, /\/master-home\/#attivita/);
});

test('H0 exposes one approved offer after the business concept', () => {
  assertAppearsInOrder(['id="attivita"', 'id="offerta"']);
  assert.match(source, /21 giorni/);
  assert.match(source, /€0/);
  assert.match(source, /€149/);
  assert.match(source, /durante il trial/i);
  assert.match(source, /UNA SOLA OFFERTA/);
});

test('H0 excludes internal jargon, dashboards and feature zoo patterns', () => {
  assert.doesNotMatch(source, />\s*FIDUCIA\s*</);
  assert.doesNotMatch(source, />\s*VISIBILITÀ\s*</);
  assert.doesNotMatch(source, />\s*SCELTA\s*</);
  assert.doesNotMatch(source, /dashboard|mock-card|feature-grid|four-actions|route-card/i);
  assert.doesNotMatch(source, /<article|<h3/);
});

test('H0 uses the approved campaign photography', () => {
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
