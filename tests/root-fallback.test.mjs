import fs from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = await fs.readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
const controller = await fs.readFile(new URL('../public/search-funnel.js', import.meta.url), 'utf8');

test('root exposes the Google-like local choice funnel', () => {
  assert.match(source, /TI <em>TROVERESTI/);
  assert.match(source, /Nome attività/);
  assert.match(source, /Cosa fai/);
  assert.match(source, /Dove/);
  assert.match(source, /Non è SEO/);
  assert.match(source, /€197/);
});

test('root is one progressive experience instead of the old beauty landing', () => {
  assert.match(source, /id="landing"/);
  assert.match(source, /id="results"/);
  assert.match(source, /id="decision"/);
  assert.match(source, /id="prescription"/);
  assert.match(controller, /\/api\/places\/search/);
  assert.doesNotMatch(source, /21 giorni/i);
  assert.doesNotMatch(source, /Beauty &amp; Wellness/);
});
