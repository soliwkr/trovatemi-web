import assert from 'node:assert/strict';
import test from 'node:test';

import { buildLocalAnalysis } from '../public/funnel-analysis.js';

const business = {
  id: 'you',
  name: 'Studio Aurora',
  rating: 4.3,
  reviews: 31,
  category: 'Parrucchiere',
};

const places = [
  { id: 'a', name: 'Linea 21', rating: 4.8, reviews: 326 },
  { id: 'b', name: 'Atelier 9', rating: 4.7, reviews: 184 },
  { id: 'c', name: 'Nodo Studio', rating: 4.6, reviews: 112 },
  { id: 'd', name: 'Forma Hair', rating: 4.6, reviews: 96 },
  { id: 'e', name: 'Spazio 12', rating: 4.5, reviews: 77 },
  business,
];

test('analysis turns returned order into a careful local visibility signal', () => {
  const result = buildLocalAnalysis(business, places);
  assert.equal(result.rank, 6);
  assert.equal(result.leader.name, 'Linea 21');
  assert.match(result.verdict, /prima vedono altri/i);
});

test('analysis produces exactly three evidence-led issues', () => {
  const result = buildLocalAnalysis(business, places);
  assert.equal(result.issues.length, 3);
  assert.equal(result.issues[0].label, 'Visibilità');
  assert.equal(result.issues[1].label, 'Prova sociale');
  assert.equal(result.issues[2].label, 'Fiducia');
  assert.equal(result.issues[0].tone, 'danger');
  assert.equal(result.issues[1].tone, 'danger');
  assert.equal(result.issues[2].tone, 'danger');
});

test('healthy local proof is not forced into a fake red problem', () => {
  const strong = { id: 'you', name: 'Studio Forte', rating: 4.9, reviews: 410 };
  const result = buildLocalAnalysis(strong, [
    strong,
    { id: 'a', name: 'A', rating: 4.7, reviews: 200 },
    { id: 'b', name: 'B', rating: 4.8, reviews: 240 },
    { id: 'c', name: 'C', rating: 4.6, reviews: 180 },
  ]);
  assert.equal(result.rank, 1);
  assert.equal(result.issues[0].tone, 'good');
  assert.equal(result.issues[1].tone, 'good');
  assert.equal(result.issues[2].tone, 'good');
});
