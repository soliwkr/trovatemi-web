import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  buildPassaparolaDiagnosis,
  buildPassaparolaMath,
  demoBusinesses,
  diagnosticQuestions,
  diagnosisVersion,
} from '../src/data/beauty-check-v2.mjs';

const page = readFileSync(
  new URL('../src/pages/beauty-check/index.astro', import.meta.url),
  'utf8',
);

const layout = readFileSync(
  new URL('../src/layouts/BeautyLeanLayout.astro', import.meta.url),
  'utf8',
);

const styles = readFileSync(
  new URL('../src/styles/beauty-check-v2.css', import.meta.url),
  'utf8',
);

test('the Trovatemi proof demo asks exactly three operational questions', () => {
  assert.equal(diagnosticQuestions.length, 3);
  assert.deepEqual(
    diagnosticQuestions.map((question) => question.id),
    ['reviewAsk', 'replies', 'reuse'],
  );
});

test('passaparola math is explicit and conservative', () => {
  const result = buildPassaparolaMath({ weeklyClients: 50, recentReviews: 4 });

  assert.equal(result.weeklyClients, 50);
  assert.equal(result.recentReviews, 4);
  assert.equal(result.estimatedMonthlyClients, 217);
  assert.equal(result.visibleShare, 2);
  assert.match(result.disclaimer, /non tutti i clienti lascerebbero una recensione/i);
});

test('diagnosis v3 is deterministic and exposes no master score', () => {
  const answers = {
    reviewAsk: 'sometimes',
    replies: 'always',
    reuse: 'manual',
  };

  const first = buildPassaparolaDiagnosis(demoBusinesses[0], answers);
  const second = buildPassaparolaDiagnosis(demoBusinesses[0], answers);

  assert.deepEqual(first, second);
  assert.equal(first.version, diagnosisVersion);
  assert.equal(diagnosisVersion, 'passaparola-v3');
  assert.equal(first.code, 'collection_leak');
  assert.equal(first.shortLabel, 'SI FERMA ALL’USCITA');
  assert.equal(first.headline, 'Il tuo passaparola si ferma all’uscita.');
  assert.equal(first.actions.length, 3);
  assert.equal('score' in first, false);
});

test('reply leak wins when collection is systematic but responses are abandoned', () => {
  const diagnosis = buildPassaparolaDiagnosis(demoBusinesses[1], {
    reviewAsk: 'systematic',
    replies: 'never',
    reuse: 'systematic',
  });

  assert.equal(diagnosis.code, 'reply_leak');
  assert.equal(diagnosis.shortLabel, 'SI FERMA SU GOOGLE');
  assert.match(diagnosis.headline, /smettono di lavorare/i);
});

test('reuse leak turns existing proof into the core problem', () => {
  const diagnosis = buildPassaparolaDiagnosis(demoBusinesses[2], {
    reviewAsk: 'systematic',
    replies: 'always',
    reuse: 'nothing',
  });

  assert.equal(diagnosis.code, 'reuse_leak');
  assert.equal(diagnosis.shortLabel, 'LA PROVA RESTA FERMA');
  assert.match(diagnosis.headline, /Le vede troppo poca gente/i);
});

test('mature collection, reply and reuse produce continuity instead of a score', () => {
  const diagnosis = buildPassaparolaDiagnosis(demoBusinesses[2], {
    reviewAsk: 'systematic',
    replies: 'structured',
    reuse: 'systematic',
  });

  assert.equal(diagnosis.code, 'healthy_no_dominant_leak');
  assert.equal(diagnosis.shortLabel, 'IL CIRCUITO REGGE');
});

test('public Google evidence remains separate from owner-declared process data', () => {
  const diagnosis = buildPassaparolaDiagnosis({
    id: 'ChIJ12345678_test',
    name: 'Gloss Nails',
    reviews: 73,
    rating: 4.8,
  }, {
    reviewAsk: 'sometimes',
    replies: 'always',
    reuse: 'manual',
  });

  assert.equal(diagnosis.evidence.reviews, 73);
  assert.equal(diagnosis.evidence.rating, 4.8);
  assert.match(diagnosis.evidence.note, /73 recensioni/);
});

test('the experience starts with proof, not a questionnaire', () => {
  assert.match(page, /Ti cercano\./);
  assert.match(page, /Ti confrontano\./);
  assert.match(page, /CERCA LA TUA ATTIVITÀ/);
  assert.match(page, /QUELLO CHE VEDE IL CLIENTE/);
  assert.match(page, /ESSERE PIÙ BRAVO NON BASTA/);
});

test('same-query context is presented as evidence, never as ranking', () => {
  assert.match(page, /\/api\/places\/context/);
  assert.match(page, /UN ALTRO RISULTATO DELLA STESSA RICERCA/);
  assert.match(page, /Non è una classifica/);
  assert.doesNotMatch(page, /competitor ufficiale/i);
});

test('the proof demo asks for owner-declared monthly evidence instead of inventing review velocity', () => {
  assert.match(page, /Clienti serviti in una settimana normale/);
  assert.match(page, /Nuove recensioni ricevute circa negli ultimi 30 giorni/);
  assert.match(page, /stima da clienti settimanali × 4,33/);
  assert.doesNotMatch(page, /reviewsLast30DaysFromGoogle/i);
});

test('three questions are shown together and the old quiz/report framing is gone', () => {
  assert.match(page, /TRE DOMANDE\. FINE\./);
  assert.equal((page.match(/class="question-block"/g) || []).length, 1);
  assert.doesNotMatch(page, /Beauty Check/);
  assert.doesNotMatch(page, /Apri la sintesi/);
  assert.doesNotMatch(page, /data-capture-form/);
});

test('the final reveal is the Trovatemi mechanism, not another audit screen', () => {
  assert.match(page, /Le persone lo dicono/);
  assert.match(page, /Noi lo facciamo/);
  assert.match(page, /CLIENTE FELICE/);
  assert.match(page, /RECENSIONE/);
  assert.match(page, /RISPOSTA/);
  assert.match(page, /CONTENUTO/);
  assert.match(page, /SCELTA/);
  assert.match(page, /21 GIORNI · €0/);
  assert.match(page, /€149\/mese per sede/);
});

test('product truth remains explicit', () => {
  assert.match(page, /senza review gating/i);
  assert.match(page, /senza promettere posizioni su Google/i);
  assert.doesNotMatch(page, /garantiamo|prima posizione|top 3/i);
});

test('legacy direct-response overlay stays retired', () => {
  assert.doesNotMatch(layout, /beauty-direct-response/);
  assert.doesNotMatch(page, /beauty-direct-response/);
});

test('visual grammar matches the campaign system', () => {
  assert.match(styles, /--yellow: #f2bd18/i);
  assert.match(styles, /--black: #08090a/i);
  assert.match(styles, /font-family: "Anton"/);
  assert.match(styles, /campaign-line/);
});
