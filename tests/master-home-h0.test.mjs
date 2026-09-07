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

test('H0 uses the campaign-deck visual system instead of legacy landing treatments', () => {
  assert.match(source, /master-home-campaign-v4\.css/);
  assert.doesNotMatch(source, /master-home-v2\.css|master-home-meme-v3\.css/);
  assert.match(source, /theme-color" content="#fffefa"/);
});

test('H0 opens on a recognizable real-world scene before explanation', () => {
  assertAppearsInOrder([
    'Finalmente qualcuno che ha capito i miei capelli.',
    'Grazie! ❤️',
    'Paga.',
    'Esce.',
    'Fine.',
    'Peccato che Google non era lì.',
    'Hai già',
    'clienti felici.',
    'Fai in modo che si veda.',
  ]);
});

test('H0 makes the competitive choice visible through two explicit phone screens', () => {
  assert.match(source, /class="phone-stage"/);
  assert.match(source, />LORO<\/span>/);
  assert.match(source, />TU<\/span>/);
  assert.match(source, /\(384\)/);
  assert.match(source, /\(41\)/);
  assert.match(source, /Stesso servizio[\s\S]*Due percezioni diverse/);
  assert.match(source, /Indovina chi sceglie il cliente/);
});

test('H0 preserves the 50 happy customers / 4 reviews lost-word-of-mouth story', () => {
  assertAppearsInOrder(['50 clienti felici.', '4 recensioni.', 'Dove sono finite', 'le altre 46?']);
  assert.match(source, /Totale clienti serviti<\/strong><strong>50/);
  assert.match(source, /Nuove recensioni[\s\S]*questa settimana/);
  assert.match(source, /Solo che[\s\S]*gira male/);
});

test('H0 explains the product as three clear actions, not a feature zoo', () => {
  assertAppearsInOrder(['Cerca la tua attività', 'Vedi cosa perdi', 'Attiva Trovatemi']);
  assert.match(source, /Chiede, ricorda, organizza le risposte e rimette le parole migliori al lavoro/);
  assert.doesNotMatch(source, /feature-grid|dashboard|mock-card|route-card/i);
});

test('H0 keeps the master lookup honest until real L2 data is wired', () => {
  assert.match(source, /id="attivita"/);
  assert.match(source, /Non un audit generico/);
  assert.match(source, /Il tuo caso/);
  assert.match(source, /aria-disabled="true"/);
  assert.match(source, /non finge il lookup/i);
  assert.doesNotMatch(source, /<form|<input|action=|\?demo=search|BEAUTY CHECK/i);
});

test('H0 exposes only the canonical commercial offer', () => {
  assert.match(source, /21 GIORNI DI TRIAL/);
  assert.match(source, /€0/);
  assert.match(source, /€149\/mese/);
  assert.match(source, /Carta richiesta all’attivazione/);
  assert.match(source, /Welcome Kit fisico parte dopo il primo pagamento riuscito/);
  assert.match(source, /Una sede\. Un prodotto\./);
});

test('H0 keeps Beauty & Wellness as the active vertical without inventing new checks', () => {
  assert.match(source, /BEAUTY &amp; WELLNESS/);
  assert.doesNotMatch(source, /Food Check|Dental Check|Restaurant Check|Bar Check/i);
});

test('H0 uses existing approved local campaign imagery', () => {
  for (const image of [
    'master-home-hero-v3.webp',
    'master-home-compare-v3.webp',
    'master-home-goodbye.webp',
  ]) {
    assert.ok(source.includes(image), `missing campaign image: ${image}`);
  }
});
