import assert from 'node:assert/strict';
import test from 'node:test';

import {
  auditQuestions,
  buildPassaparolaDiagnosis,
  demoBusinesses,
  diagnosisVersion,
} from '../src/data/beauty-check-v2.mjs';

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
