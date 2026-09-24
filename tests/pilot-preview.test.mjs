import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildCheckoutUrl,
  resolveFounderOffer,
  resolvePilotPreview,
} from '../src/domain/pilot-preview.ts';

const configuredPreview = JSON.stringify([
  {
    token: 'pilot-token-7f3a',
    reference: 'pilot_formia_001',
    status: 'ready',
    observedAt: '2026-09-08T10:00:00.000Z',
    business: {
      name: 'Caffè Esempio',
      category: 'Bar e caffetteria',
      city: 'Formia',
      address: 'Via Esempio 1',
      rating: 4.7,
      reviewCount: 38,
    },
    diagnosis: {
      headline: 'Il passaparola esiste, ma online lascia poche tracce recenti.',
      evidence: ['38 recensioni visibili al momento della rilevazione.'],
      priorities: ['Rendere semplice la prima richiesta autentica.'],
    },
    after: {
      promise: 'Una presenza chiara e un percorso recensioni pronto da usare.',
      services: ['Pagina Trovatemi verificata', 'QR digitale', 'Primo invio assistito'],
    },
  },
]);

test('resolves one ready pilot preview from an opaque token', () => {
  const result = resolvePilotPreview(configuredPreview, 'pilot-token-7f3a');

  assert.equal(result.status, 'found');
  assert.equal(result.preview.reference, 'pilot_formia_001');
  assert.equal(result.preview.business.name, 'Caffè Esempio');
  assert.equal(result.preview.activationPath, '/attiva/pilot-token-7f3a');
});

test('contains malformed private configuration instead of crashing the route', () => {
  const result = resolvePilotPreview('{not-json', 'pilot-token-7f3a');

  assert.deepEqual(result, { status: 'configuration_error' });
});

test('rejects a matching preview when required evidence is incomplete', () => {
  const incompletePreview = JSON.stringify([
    {
      token: 'pilot-token-7f3a',
      reference: 'pilot_formia_001',
      status: 'ready',
      business: { name: 'Caffè Esempio' },
    },
  ]);

  const result = resolvePilotPreview(incompletePreview, 'pilot-token-7f3a');

  assert.deepEqual(result, { status: 'configuration_error' });
});

test('starts Stripe Checkout with the opaque pilot reference, never the private token', () => {
  const result = buildCheckoutUrl(
    'https://buy.stripe.com/test_123?locale=it',
    'pilot_formia_001',
  );

  assert.equal(result.status, 'ready');
  assert.equal(
    result.url,
    'https://buy.stripe.com/test_123?locale=it&client_reference_id=pilot_formia_001',
  );
  assert.doesNotMatch(result.url, /pilot-token-7f3a/);
});

test('refuses a checkout destination outside the hosted Stripe domain', () => {
  const result = buildCheckoutUrl(
    'https://example.com/collect-card',
    'pilot_formia_001',
  );

  assert.deepEqual(result, { status: 'configuration_error' });
});

test('enables the founder offer only when commercial and legal terms are complete', () => {
  const configuredOffer = JSON.stringify({
    name: 'Attivazione Fondatori',
    priceCents: 14900,
    currency: 'EUR',
    durationDays: 90,
    capacity: 10,
    taxLabel: 'IVA inclusa',
    renewalLabel: 'Nessun rinnovo automatico',
    day91: 'La pagina base resta consultabile; gestione e automazioni si fermano.',
    refundPolicy: 'Rimborso integrale prima dell’avvio della configurazione.',
    seller: {
      legalName: 'Trovatemi S.r.l.',
      vatId: 'IT00000000000',
    },
    termsUrl: 'https://trovatemi.it/condizioni',
    privacyUrl: 'https://trovatemi.it/privacy',
  });

  const result = resolveFounderOffer(configuredOffer);

  assert.equal(result.status, 'ready');
  assert.equal(result.offer.formattedPrice, '149 €');
  assert.equal(result.offer.durationDays, 90);
});

test('keeps checkout blocked when example placeholders were not replaced', () => {
  const placeholderOffer = JSON.stringify({
    name: 'Attivazione Fondatori',
    priceCents: 14900,
    currency: 'EUR',
    durationDays: 90,
    capacity: 10,
    taxLabel: 'SOSTITUIRE: IVA inclusa o esclusa',
    renewalLabel: 'Nessun rinnovo automatico',
    day91: 'SOSTITUIRE con la regola approvata.',
    refundPolicy: 'SOSTITUIRE con la regola approvata.',
    seller: { legalName: 'SOSTITUIRE', vatId: 'SOSTITUIRE' },
    termsUrl: 'https://trovatemi.it/condizioni',
    privacyUrl: 'https://trovatemi.it/privacy',
  });

  assert.deepEqual(resolveFounderOffer(placeholderOffer), { status: 'configuration_error' });
  assert.deepEqual(
    buildCheckoutUrl('https://buy.stripe.com/test_replace_me', 'pilot_formia_001'),
    { status: 'configuration_error' },
  );
});
