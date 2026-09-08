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

test('H0 uses the product-led visual system', () => {
  assert.match(source, /master-home-product-v5\.css/);
  assert.doesNotMatch(source, /master-home-campaign-v4\.css|master-home-meme-v3\.css|master-home-v2\.css/);
  assert.match(source, /theme-color" content="#fffdf8"/);
});

test('H0 opens with the canonical local hook and shows product immediately', () => {
  assertAppearsInOrder([
    'Finalmente qualcuno che ha capito i miei capelli.',
    'Peccato che Google non era lì.',
    'Hai già',
    'clienti felici.',
    'Fai in modo che si veda.',
    'Trovatemi chiede',
    'Il cliente lascia prova',
    'Trovatemi la rimette al lavoro',
  ]);
});

test('H0 keeps the master CTA as search your business', () => {
  assert.match(source, /Cerca la tua attività/);
  assert.match(source, /href="#attivita"/);
  assert.doesNotMatch(source, /Prenota una call|Richiedi una demo|Contattaci/i);
});

test('H0 makes competitive choice visible through explicit phone screens', () => {
  assert.match(source, /class="phone-stage"/);
  assert.match(source, />LORO<\/span>/);
  assert.match(source, />TU<\/span>/);
  assert.match(source, /\(384\)/);
  assert.match(source, /\(41\)/);
  assert.match(source, /Sei più brava/);
  assert.match(source, /vince un’altra/);
});

test('H0 dedicates the center of the page to visible product workflow', () => {
  assertAppearsInOrder([
    'QUESTO È TROVATEMI',
    '>CHIEDE<',
    '>RICORDA<',
    '>RACCOGLIE<',
    '>RIMETTE AL LAVORO<',
  ]);
  assert.match(source, /class="product-flow"/);
  assert.match(source, /WhatsApp/);
  assert.match(source, /Google/);
  assert.match(source, /RISPOSTA ALLA RECENSIONE/);
  assert.match(source, /Social proof/);
});

test('H0 uses the 50 happy customers meme as an ad break, not the whole page', () => {
  assertAppearsInOrder(['50 clienti felici.', '4 recensioni.', 'Dove sono finite le altre 46?']);
  assert.match(source, /Clienti serviti<\/strong><strong>50/);
  assert.match(source, /Nuove recensioni[\s\S]*questa settimana/);
  assertAppearsInOrder(['>RIMETTE AL LAVORO<', '50 clienti felici.']);
});

test('H0 keeps the future real lookup honest until L2 is wired', () => {
  assert.match(source, /id="attivita"/);
  assert.match(source, /Non un esempio/);
  assert.match(source, /Il tuo caso/);
  assert.match(source, /aria-disabled="true"/);
  assert.match(source, /prossimo slice L2/);
  assert.doesNotMatch(source, /<form|<input|action=|\?demo=search|Food Check|Dental Check|Restaurant Check/i);
});

test('H0 exposes only the canonical commercial offer', () => {
  assert.match(source, /UN SOLO PRODOTTO/);
  assert.match(source, /21 GIORNI DI TRIAL/);
  assert.match(source, /€0/);
  assert.match(source, /€149\/mese/);
  assert.match(source, /Carta richiesta all’attivazione/);
  assert.match(source, /Welcome Kit fisico parte dopo il primo pagamento riuscito/);
  assert.match(source, /Una sede\. Tutto Trovatemi\./);
});

test('H0 keeps Beauty & Wellness as the only active vertical', () => {
  assert.match(source, /BEAUTY &amp; WELLNESS/);
  assert.doesNotMatch(source, /Food Check|Dental Check|Restaurant Check|Bar Check/i);
});

test('H0 uses existing approved campaign imagery', () => {
  for (const image of [
    'master-home-hero-v3.webp',
    'master-home-compare-v3.webp',
    'master-home-goodbye.webp',
  ]) {
    assert.ok(source.includes(image), `missing campaign image: ${image}`);
  }
});
