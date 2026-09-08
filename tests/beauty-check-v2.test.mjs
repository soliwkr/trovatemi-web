import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  auditQuestions,
  buildPassaparolaDiagnosis,
  demoBusinesses,
  diagnosisVersion,
} from '../src/data/beauty-check-v2.mjs';

const directResponseSource = readFileSync(
  new URL('../public/beauty-direct-response.js', import.meta.url),
  'utf8',
);
const directResponseStyles = readFileSync(
  new URL('../public/beauty-direct-response.css', import.meta.url),
  'utf8',
);
const beautyCheckPageSource = readFileSync(
  new URL('../src/pages/beauty-check/index.astro', import.meta.url),
  'utf8',
);

test('Beauty Check v2 preserves exactly five private questions', () => {
  assert.equal(auditQuestions.length, 5);
  assert.equal(new Set(auditQuestions.map((question) => question.id)).size, 5);
});

test('the diagnosis is deterministic and exposes no customer-facing master score', () => {
  const answers = {
    reviewAsk: 'sometimes',
    replies: 'always',
    reuse: 'manual',
    channels: 'two',
    weeklyClients: 'high',
  };

  const first = buildPassaparolaDiagnosis(demoBusinesses[0], answers);
  const second = buildPassaparolaDiagnosis(demoBusinesses[0], answers);

  assert.deepEqual(first, second);
  assert.equal(first.version, diagnosisVersion);
  assert.equal(first.code, 'collection_leak');
  assert.equal(first.headline, "Si perde all'uscita.");
  assert.equal(first.actions.length, 3);
  assert.equal('score' in first, false);
  assert.equal('reputation' in first, false);
  assert.equal('weakestPillar' in first, false);
});

test('reply leak wins when collection is systematic but replies are abandoned', () => {
  const diagnosis = buildPassaparolaDiagnosis(demoBusinesses[1], {
    reviewAsk: 'systematic',
    replies: 'never',
    reuse: 'automatic',
    channels: 'many',
    weeklyClients: 'medium',
  });

  assert.equal(diagnosis.code, 'reply_leak');
  assert.match(diagnosis.headline, /Google/);
});

test('reuse leak is explainable from stored private answers', () => {
  const diagnosis = buildPassaparolaDiagnosis(demoBusinesses[2], {
    reviewAsk: 'systematic',
    replies: 'always',
    reuse: 'nothing',
    channels: 'many',
    weeklyClients: 'medium',
  });

  assert.equal(diagnosis.code, 'reuse_leak');
  assert.match(diagnosis.answerSummary, /restano quasi sempre su Google/);
});

test('a mature process produces a healthy diagnosis instead of an invented high score', () => {
  const diagnosis = buildPassaparolaDiagnosis(demoBusinesses[5], {
    reviewAsk: 'systematic',
    replies: 'automated',
    reuse: 'automatic',
    channels: 'many',
    weeklyClients: 'veryHigh',
  });

  assert.equal(diagnosis.code, 'healthy_no_dominant_leak');
  assert.equal(diagnosis.shortLabel, 'NESSUN BUCO NETTO');
  assert.equal(diagnosis.actions.length, 3);
});

test('public evidence remains separate from the diagnosis and keeps the transparent demo gap', () => {
  const diagnosis = buildPassaparolaDiagnosis(demoBusinesses[0], {
    reviewAsk: 'sometimes',
    replies: 'sometimes',
    reuse: 'nothing',
    channels: 'one',
    weeklyClients: 'medium',
  });

  assert.equal(diagnosis.evidence.reviews, 73);
  assert.equal(diagnosis.evidence.cohortMedianReviews, 118);
  assert.equal(diagnosis.evidence.reviewGap, -45);
  assert.match(diagnosis.evidence.note, /45 recensioni/);
});

test('real lookup evidence does not invent a cohort when none exists', () => {
  const diagnosis = buildPassaparolaDiagnosis({
    id: 'ChIJ12345678_test',
    name: 'Gloss Nails',
    reviews: 73,
    rating: 4.8,
    cohortMedianReviews: null,
  }, {
    reviewAsk: 'sometimes',
    replies: 'always',
    reuse: 'manual',
    channels: 'two',
    weeklyClients: 'medium',
  });

  assert.equal(diagnosis.evidence.reviews, 73);
  assert.equal(diagnosis.evidence.cohortMedianReviews, null);
  assert.equal(diagnosis.evidence.reviewGap, null);
  assert.match(diagnosis.evidence.note, /benchmark verrà mostrato solo/);
});

test('the final proof story shows the three moves as concrete operational scenes', () => {
  assert.match(directResponseSource, /CLIENTE FELICE/);
  assert.match(directResponseSource, /GESTO CONCRETO/);
  assert.match(directResponseSource, /PIÙ PROVA VISIBILE/);
  assert.match(directResponseSource, /QR NON SCANSIONABILE/);
  assert.match(directResponseSource, /RECENSIONE RICEVUTA · ESEMPIO/);
  assert.match(directResponseSource, /RISPOSTA DA RIVEDERE/);
  assert.match(directResponseSource, /PUBBLICA RISPOSTA/);
  assert.match(directResponseSource, /\.stage-confirm > blockquote/);
  assert.match(directResponseSource, /DOVE OPERATIVO E TESTATO/);
  assert.match(directResponseSource, /PUBBLICAZIONE SOLO DOVE IL CANALE È OPERATIVO E TESTATO/);
  assert.match(directResponseStyles, /\.proof-scene--collect/);
  assert.match(directResponseStyles, /\.proof-scene--reply/);
  assert.match(directResponseStyles, /\.proof-scene--reuse/);
  assert.match(directResponseSource, /proof-beauty-nfc-v1\.webp/);
  assert.match(directResponseStyles, /proof-beauty-social-v1\.webp/);
});

test('manual cost and Trovatemi reveal preserve the locked direct-response sequence', () => {
  assert.match(
    directResponseSource,
    /CHIEDI → INSEGUI → RISPONDI → COPIA → PUBBLICA → RICOMINCIA/,
  );
  assert.match(directResponseSource, /OPPURE LO METTI A SISTEMA/);
  assert.match(
    directResponseSource,
    /TU PENSA ALLE CLIENTI\. IL PASSAPAROLA CONTINUA A LAVORARE\. ★/,
  );
});

test('the social proof scene does not present unverified channel automation as product truth', () => {
  assert.match(directResponseSource, /BOZZA/);
  assert.match(directResponseSource, /CONTROLLA PRIMA/);
  assert.match(directResponseSource, /NESSUN AUTOPILOTA PROMESSO/);
  assert.match(directResponseSource, /DA CONFIGURARE SUL FLUSSO/);
  assert.doesNotMatch(directResponseSource, /BASELINE ATTIVA/i);
  assert.doesNotMatch(
    directResponseSource,
    /PUBBLICAZIONE AUTOMATICA|RISPOSTA AUTOMATICA|AUTOPILOTA ATTIVO/i,
  );
  assert.doesNotMatch(directResponseSource, /IG STORY|WHATSAPP|TIKTOK|FACEBOOK/i);
  assert.match(directResponseSource, /mechanism\.remove\(\)/);
});

test('the long report is not injected as a live-region announcement', () => {
  assert.match(
    beautyCheckPageSource,
    /setAttribute\('aria-live', state\.stage === 'report' \? 'off' : 'polite'\)/,
  );
});
