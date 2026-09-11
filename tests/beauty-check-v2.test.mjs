import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  auditQuestions,
  buildPassaparolaDiagnosis,
  demoBusinesses,
  diagnosisVersion,
} from '../src/data/beauty-check-v2.mjs';

const beautyCheckPageSource = readFileSync(
  new URL('../src/pages/beauty-check/index.astro', import.meta.url),
  'utf8',
);

const beautyLayoutSource = readFileSync(
  new URL('../src/layouts/BeautyLeanLayout.astro', import.meta.url),
  'utf8',
);

const beautyStyles = readFileSync(
  new URL('../src/styles/beauty-check-v2.css', import.meta.url),
  'utf8',
);

test('the diagnostic preserves exactly five private questions', () => {
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
  assert.equal(first.headline, 'Il primo punto debole è la raccolta.');
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
  assert.equal(diagnosis.shortLabel, 'RISPOSTE');
});

test('reuse leak remains explainable from private answers', () => {
  const diagnosis = buildPassaparolaDiagnosis(demoBusinesses[2], {
    reviewAsk: 'systematic',
    replies: 'always',
    reuse: 'nothing',
    channels: 'many',
    weeklyClients: 'medium',
  });

  assert.equal(diagnosis.code, 'reuse_leak');
  assert.equal(diagnosis.shortLabel, 'RIUSO DELLA PROVA');
  assert.match(diagnosis.answerSummary, /restano quasi sempre su Google/);
});

test('a mature process produces continuity instead of an invented high score', () => {
  const diagnosis = buildPassaparolaDiagnosis(demoBusinesses[5], {
    reviewAsk: 'systematic',
    replies: 'automated',
    reuse: 'automatic',
    channels: 'many',
    weeklyClients: 'veryHigh',
  });

  assert.equal(diagnosis.code, 'healthy_no_dominant_leak');
  assert.equal(diagnosis.shortLabel, 'CONTINUITÀ');
  assert.equal(diagnosis.actions.length, 3);
});

test('public evidence remains separate from the diagnosis and keeps transparent demo context', () => {
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

test('real lookup evidence does not invent a cohort', () => {
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
  assert.match(diagnosis.evidence.note, /Non aggiungiamo confronti statistici/);
});

test('the public diagnostic is self-contained and no longer uses the legacy direct-response overlay', () => {
  assert.doesNotMatch(beautyLayoutSource, /beauty-direct-response/);
  assert.doesNotMatch(beautyCheckPageSource, /beauty-direct-response/);
  assert.match(beautyCheckPageSource, /Guarda la tua attività come la vede chi deve scegliere/);
  assert.match(beautyCheckPageSource, /Nessun punteggio inventato/);
});

test('the same-query evidence is integrated directly into the diagnostic', () => {
  assert.match(beautyCheckPageSource, /\/api\/places\/context/);
  assert.match(beautyCheckPageSource, /ALTRI RISULTATI EMERSI DALLA STESSA RICERCA/);
  assert.match(beautyCheckPageSource, /Contesto reale, non una classifica e non un benchmark/);
});

test('S01 does not fake an email capture or a delivery that does not exist yet', () => {
  assert.doesNotMatch(beautyCheckPageSource, /type="email"/);
  assert.doesNotMatch(beautyCheckPageSource, /data-capture-form/);
  assert.doesNotMatch(beautyCheckPageSource, /In questa preview non viene inviato nulla/);
});

test('the visual system uses restrained black paper and signal yellow instead of the retired beauty palette', () => {
  assert.match(beautyStyles, /var\(--signal\)/);
  assert.doesNotMatch(beautyStyles, /--wine|--pink|--acid/);
});

test('the long report is not injected as a live-region announcement', () => {
  assert.match(
    beautyCheckPageSource,
    /setAttribute\('aria-live', state\.stage === 'report' \? 'off' : 'polite'\)/,
  );
});

test('customer-facing product truth explicitly preserves no review gating and no ranking promise', () => {
  assert.match(beautyCheckPageSource, /Senza review gating/);
  assert.match(beautyCheckPageSource, /senza promettere posizioni su Google/);
});
