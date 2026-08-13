import assert from 'node:assert/strict';
import test from 'node:test';

import { auditQuestions, buildAuditReport, demoBusinesses } from '../src/data/beauty-lean-demo.mjs';

test('the L1 demo covers the approved Beauty & Wellness verticals', () => {
  const categories = demoBusinesses.map((business) => business.category.toLowerCase()).join(' ');

  for (const expected of ['hair', 'barber', 'estetico', 'nails', 'massaggi', 'spa', 'wellness']) {
    assert.match(categories, new RegExp(expected));
  }
});

test('the private diagnostic contains exactly five unique questions', () => {
  assert.equal(auditQuestions.length, 5);
  assert.equal(new Set(auditQuestions.map((question) => question.id)).size, 5);
  assert.ok(auditQuestions.every((question) => question.options.length === 4));
});

test('the report is deterministic and always returns three ordered actions', () => {
  const business = demoBusinesses[0];
  const answers = {
    reviewAsk: 'sometimes',
    replies: 'never',
    reuse: 'nothing',
    channels: 'one',
    weeklyClients: 'medium',
  };

  const first = buildAuditReport(business, answers);
  const second = buildAuditReport(business, answers);

  assert.deepEqual(first, second);
  assert.equal(first.actions.length, 3);
  assert.equal(first.weakestPillar, 'Risposte');
  assert.equal(first.reviewGap, -45);
  assert.ok([first.reputation, first.collection, first.replies, first.socialProof].every((score) => score >= 0 && score <= 100));
});

test('a fully mature operation still receives a complete prioritized report', () => {
  const report = buildAuditReport(demoBusinesses[5], {
    reviewAsk: 'systematic',
    replies: 'automated',
    reuse: 'automatic',
    channels: 'many',
    weeklyClients: 'veryHigh',
  });

  assert.equal(report.actions.length, 3);
  assert.ok(report.strongestPillar);
  assert.ok(report.weakestPillar);
});
