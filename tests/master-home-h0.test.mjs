import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../src/pages/master-home.astro', import.meta.url), 'utf8');

function assertAppearsInOrder(lines) {
  let previousIndex = -1;
  for (const line of lines) {
    const currentIndex = source.indexOf(line);
    assert.notEqual(currentIndex, -1, `missing beat: ${line}`);
    assert.ok(currentIndex > previousIndex, `beat out of order: ${line}`);
    previousIndex = currentIndex;
  }
}

test('H0 remains an isolated noindex preview', () => {
  assert.match(source, /name="robots" content="noindex, nofollow, noarchive"/);
  assert.match(source, /href="\/master-home\/"/);
});

test('H0 uses the lean visual system and drops rejected generated imagery', () => {
  assert.match(source, /master-home-lean-v6\.css/);
  assert.doesNotMatch(source, /master-home-product-v5\.css|master-home-campaign-v4\.css|master-home-meme-v3\.css|master-home-v2\.css/);
  assert.doesNotMatch(source, /master-home-(hero|compare|missing)-v3\.webp/);
  assert.match(source, /hero-local-business\.webp/);
  assert.match(source, /theme-color" content="#11110f"/);
});

test('H0 opens with the approved hook, product truth and visible product proof', () => {
  assertAppearsInOrder([
    'Hai già',
    'clienti felici.',
    'Fai in modo',
    'che si veda.',
    'Trovatemi fa vedere online quanto sei bravo davvero.',
    'TROVATEMI · WHATSAPP',
    'Lascia una recensione',
    '★★★★★',
    'Peccato che Google non era lì.',
    'Risponde. Lo riusa. Lo fa trovare.',
  ]);
});

test('H0 keeps one canonical master action without a fake form', () => {
  assert.match(source, /Cerca la tua attività/);
  assert.match(source, /href="#attivita"/);
  assert.doesNotMatch(source, /Prenota una call|Richiedi una demo|Contattaci/i);
  assert.doesNotMatch(source, /<form|<input|action=|\?demo=search/i);
});

test('H0 makes the competitive problem legible without decorative phones', () => {
  assertAppearsInOrder([
    'Sei più bravo.',
    '384',
    '41',
    'Indovina chi sembra più bravo.',
  ]);
  assert.match(source, /class="listing-compare"/);
  assert.doesNotMatch(source, /class="phone|screen-photo|quick-actions/);
});

test('H0 explains the product as one continuous mechanism, not a feature grid', () => {
  assertAppearsInOrder([
    'QUESTO È TROVATEMI',
    'Il passaparola c’è.',
    'Solo che gira male.',
    '>CHIEDE<',
    '>RICORDA<',
    '>RACCOGLIE<',
    'RIMETTE',
    'AL LAVORO',
  ]);
  assert.match(source, /class="mechanism-flow"/);
  assert.doesNotMatch(source, /product-card|glimpse-card|feature-grid|dashboard/i);
});

test('H0 keeps one explicit meme break and marks its numbers as an example', () => {
  assert.match(source, /UN ESEMPIO, NON I TUOI DATI[\s\S]*?>50<[\s\S]*?clienti felici\.[\s\S]*?>4<[\s\S]*?recensioni\.[\s\S]*?Dove sono finite le altre 46\?/);
  assert.match(source, /CLIENTI SERVITI/);
  assert.match(source, /NUOVE RECENSIONI/);
});

test('H0 keeps the future lookup honest until L2 is real', () => {
  assert.match(source, /id="attivita"/);
  assert.match(source, /Non un esempio/);
  assert.match(source, /Il tuo caso/);
  assert.match(source, /aria-disabled="true"/);
  assert.match(source, /prossimo slice L2/);
  assert.doesNotMatch(source, /Food Check|Dental Check|Restaurant Check|Bar Check/i);
});

test('H0 exposes only the canonical commercial offer', () => {
  assert.match(source, /UN SOLO PRODOTTO/);
  assert.match(source, /21 giorni/);
  assert.match(source, /€0/);
  assert.match(source, /€149\/mese/);
  assert.match(source, /Carta richiesta all’attivazione/);
  assert.match(source, /Welcome Kit fisico parte dopo il primo pagamento riuscito/);
  assert.match(source, /Una sede\. Tutto Trovatemi\. Nessun piano da scegliere\./);
});

test('H0 keeps Beauty & Wellness as the only active vertical', () => {
  assert.match(source, /Beauty &amp; Wellness/);
  assert.doesNotMatch(source, /Food Check|Dental Check|Restaurant Check|Bar Check/i);
});

test('H0 never exposes the internal strategy taxonomy', () => {
  assert.doesNotMatch(source, /FIDUCIA|VISIBILITÀ|SCELTA|pilastro|porta direttamente/i);
});
