import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../src/pages/master-home.astro', import.meta.url), 'utf8');

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

test('H0 leads with the approved recognition and an explicit product truth', () => {
  for (const line of [
    'Hai già',
    'clienti felici.',
    'Fai in modo',
    'che si veda.',
    'Trovatemi fa vedere online',
    'quanto sei bravo davvero.',
    'Chiede recensioni',
    'segue chi dimentica',
    'organizza le risposte',
    'rimette le parole dei clienti al lavoro',
  ]) {
    assert.ok(source.includes(line), `missing approved product truth: ${line}`);
  }
});

test('H0 sells the product before using the campaign stories as proof', () => {
  assertAppearsInOrder([
    'Hai già',
    'QUESTO È IL PRODOTTO',
    '>CHIEDE<',
    '>RICORDA<',
    '>RISPONDE<',
    '>RIUSA<',
    'Mi sono trovata',
    'Google<br />non era lì.',
    'Dove sono finite',
    'Sei più bravo.',
    'COSA CAMBIA OGNI GIORNO',
    'COSA RICEVI NEI PRIMI 21 GIORNI',
    'id="attivita"',
    '21 giorni',
  ]);
});

test('H0 turns the compliment into one continuous narrative sequence', () => {
  assertAppearsInOrder(['Mi sono trovata', 'Grazie.', 'Paga.', 'Esce.', 'Fine.', 'Google<br />non era lì.']);
  assert.match(source, /Il passaparola che hai già\./);
  assert.match(source, /Messo al lavoro\./);
});

test('H0 explains the daily product change without a feature zoo', () => {
  assertAppearsInOrder(['Ricordarti di chiedere', 'Richiesta + promemoria']);
  assertAppearsInOrder(['Ricordarti di rispondere', 'Routine di risposta']);
  assertAppearsInOrder(['Copiare recensioni a mano', 'Riuso sui canali attivi']);
  assert.match(source, /Non ti serve[\s\S]*altro marketing\./);
  assert.match(source, /Ti serve un sistema\./);
});

test('H0 keeps the competitor story honest and pronouns coherent', () => {
  assert.match(source, />LUI<\/span><strong>384<\/strong><small>RECENSIONI/);
  assert.match(source, />TU<\/span><strong>41<\/strong><small>RECENSIONI/);
  assert.doesNotMatch(source, />LORO<\/span>/);
  assert.doesNotMatch(source, /\b[1-5][,.][0-9]\b/);
});

test('H0 presents the future real lookup without linking to the outdated demo or faking L2', () => {
  assert.match(source, /id="attivita"/);
  assert.match(source, /Cerca la tua/);
  assert.match(source, /cosa si vede, dove si ferma il passaparola e cosa sistemare prima/);
  assert.match(source, /Il lookup verrà attivato con L2\./);
  assert.match(source, /aria-disabled="true"/);
  assert.doesNotMatch(source, /<form|<input|action=|\?demo=search|APRI LA DEMO COMPLETA|BEAUTY CHECK/i);
});

test('H0 explains trial delivery and exposes one approved offer', () => {
  assertAppearsInOrder(['Starter Review Kit digitale', 'id="attivita"', 'id="offerta"']);
  assertAppearsInOrder(['id="attivita"', 'id="offerta"']);
  assert.match(source, /21 giorni/);
  assert.match(source, /€0/);
  assert.match(source, /€149/);
  assert.match(source, /durante il trial/i);
  assert.match(source, /UNA SOLA OFFERTA/);
  assert.match(source, /TUTTO TROVATEMI · UNA SEDE/);
  assert.match(source, /Carta richiesta all’attivazione/);
  assert.match(source, /Welcome Kit fisico dopo il primo pagamento riuscito/);
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
