import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildGoogleTextSearchBody,
  googlePlaceDetailsFieldMask,
  googlePlacesContextFieldMask,
  googlePlacesSearchFieldMask,
  isValidPlaceId,
  isValidSearchQuery,
  normalizeGoogleContextResponse,
  normalizeGooglePlaceDetails,
  normalizeGoogleSearchResponse,
} from '../src/data/google-places.mjs';

test('initial place lookup stays lean', () => {
  assert.match(googlePlacesSearchFieldMask, /places\.id/);
  assert.match(googlePlacesSearchFieldMask, /places\.displayName/);
  assert.equal(googlePlacesSearchFieldMask.includes('rating'), false);
  assert.equal(googlePlacesSearchFieldMask.includes('userRatingCount'), false);
});

test('context and details request only the proof metrics used by the funnel', () => {
  assert.match(googlePlacesContextFieldMask, /places\.rating/);
  assert.match(googlePlacesContextFieldMask, /places\.userRatingCount/);
  assert.match(googlePlaceDetailsFieldMask, /rating/);
  assert.match(googlePlaceDetailsFieldMask, /userRatingCount/);
});

test('text search is scoped to Italy and normalized', () => {
  const body = buildGoogleTextSearchBody('  parrucchiere   Formia  ', 10);
  assert.equal(body.textQuery, 'parrucchiere Formia');
  assert.equal(body.languageCode, 'it');
  assert.equal(body.regionCode, 'IT');
  assert.equal(body.pageSize, 10);
  assert.equal(isValidSearchQuery('ab'), false);
  assert.equal(isValidSearchQuery('parrucchiere Formia'), true);
});

test('place ids are validated before upstream calls', () => {
  assert.equal(isValidPlaceId('ChIJ12345678_test'), true);
  assert.equal(isValidPlaceId('../etc/passwd'), false);
  assert.equal(isValidPlaceId('short'), false);
});

test('Google responses normalize to the public funnel contract', () => {
  const search = normalizeGoogleSearchResponse({
    places: [{
      id: 'ChIJ12345678_test',
      displayName: { text: 'Studio Aurora' },
      formattedAddress: 'Formia LT, Italia',
      primaryTypeDisplayName: { text: 'Parrucchiere' },
    }],
  });
  assert.equal(search[0].name, 'Studio Aurora');
  assert.equal(search[0].source, 'google_places');

  const context = normalizeGoogleContextResponse({
    places: [{
      id: 'ChIJ87654321_test',
      displayName: { text: 'Linea 21' },
      formattedAddress: 'Formia LT, Italia',
      primaryTypeDisplayName: { text: 'Parrucchiere' },
      rating: 4.8,
      userRatingCount: 326,
    }],
  });
  assert.equal(context[0].rating, 4.8);
  assert.equal(context[0].reviews, 326);

  const details = normalizeGooglePlaceDetails({
    id: 'ChIJ12345678_test',
    displayName: { text: 'Studio Aurora' },
    formattedAddress: 'Formia LT, Italia',
    primaryTypeDisplayName: { text: 'Parrucchiere' },
    rating: 4.3,
    userRatingCount: 31,
  });
  assert.equal(details.externalId, 'google:ChIJ12345678_test');
  assert.equal(details.rating, 4.3);
  assert.equal(details.reviews, 31);
});
