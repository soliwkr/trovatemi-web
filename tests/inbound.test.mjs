import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const home = readFileSync(
  new URL('../src/pages/index.astro', import.meta.url),
  'utf8',
);

const inbound = readFileSync(
  new URL('../src/pages/trova/index.astro', import.meta.url),
  'utf8',
);

const legacy = readFileSync(
  new URL('../src/pages/beauty-check/index.astro', import.meta.url),
  'utf8',
);

test('homepage is Trovatemi-first and contains no Beauty/check positioning', () => {
  assert.match(home, /TROVATEMI\.IT/);
  assert.match(home, /IL PASSAPAROLA CHE HAI GIÀ/);
  assert.match(home, /CERCA LA TUA ATTIVITÀ/);
  assert.doesNotMatch(home, /BEAUTY BUSINESSES GROW|FAI IL CHECK/i);
});

test('homepage keeps the supplied campaign-page grammar', () => {
  assert.match(home, /TI CERCANO/);
  assert.match(home, /TI SCELGONO/);
  assert.match(home, /SCELGONO QUELLO/);
  assert.match(home, /DA CLIENTE FELICE/);
  assert.match(home, /PROVA VISIBILE/);
  assert.match(home, /PIÙ PROVE/);
  assert.match(home, /PIÙ FIDUCIA/);
  assert.match(home, /PIÙ CLIENTI/);
});

test('homepage sends inbound traffic to /trova instead of a check route', () => {
  assert.match(home, /const inboundUrl = '\/trova\//);
  assert.doesNotMatch(home, /const checkUrl|\/beauty-check\//);
});

test('/trova is an instant Google visibility snapshot, not a questionnaire', () => {
  assert.match(inbound, /LA TUA ATTIVITÀ\. COME APPARE OGGI/);
  assert.match(inbound, /GUARDA COME APPARI/);
  assert.match(inbound, /CERCA LA TUA ATTIVITÀ/);
  assert.match(inbound, /NELLA STESSA RICERCA/);
  assert.match(inbound, /LA LETTURA TROVATEMI/);
  assert.doesNotMatch(inbound, /TRE DOMANDE|question-block|data-diagnose|buildPassaparolaDiagnosis/);
});

test('/trova uses real selected-place details and same-query context', () => {
  assert.match(inbound, /\/api\/places\/search/);
  assert.match(inbound, /\/api\/places\/details/);
  assert.match(inbound, /\/api\/places\/context/);
  assert.match(inbound, /Non è una classifica/);
});

test('/trova never claims that same-query context proves who is better', () => {
  assert.match(inbound, /non dice chi lavora meglio/i);
  assert.match(inbound, /Non significa che lavori meglio/i);
  assert.doesNotMatch(inbound, /competitor ufficiale|migliore su Google|numero uno su Google|prima posizione garantita/i);
});

test('inbound closes on Trovatemi mechanism and conversation, not another score', () => {
  assert.match(inbound, /IL PASSAPAROLA CHE HAI GIÀ/);
  assert.match(inbound, /MESSO AL LAVORO/);
  assert.match(inbound, /VEDI COME TROVATEMI LO METTE AL LAVORO/);
  assert.doesNotMatch(inbound, /score|67\/100|audit/i);
});

test('legacy /beauty-check route only redirects to /trova', () => {
  assert.match(legacy, /Astro\.redirect\('\/trova\/', 301\)/);
  assert.doesNotMatch(legacy, /data-proof-app|diagnosticQuestions/);
});
