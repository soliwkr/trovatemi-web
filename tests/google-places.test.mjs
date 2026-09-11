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

test('initial search deliberately omits rating fields so lookup stays lean', () => {
  assert.match(googlePlacesSearchFieldMask, /places\.id/);
  assert.match(googlePlacesSearchFieldMask, /places\.displayName/);
  assert.equal(googlePlacesSearchFieldMask.includes('rating'), false);
  assert.equal(googlePlacesSearchFieldMask.includes('userRatingCount'), false);
});

test('same-query context explicitly requests rating and review count for visual proof', () => {
  assert.match(googlePlacesContextFieldMask, /places\.rating/);
  assert.match(googlePlacesContextFieldMask, /places\.userRatingCount/);
  const body = buildGoogleTextSearchBody('Nails Formia', 10);
  assert.equal(body.textQuery, 'Nails Formia');
  assert.equal(body.pageSize, 10);
});

test('details requests rating and review count only after a place is selected', () => {
  assert.match(googlePlaceDetailsFieldMask, /rating/);
  assert.match(googlePlaceDetailsFieldMask, /userRatingCount/);
});

test('text search is Italy-scoped, explicit and normally capped at five results', () => {
  const body = buildGoogleTextSearchBody('  Gloss   Nails Gaeta  ');
  assert.equal(body.textQuery, 'Gloss Nails Gaeta');
  assert.equal(body.languageCode, 'it');
  assert.equal(body.regionCode, 'IT');
  assert.equal(body.pageSize, 5);
  assert.equal(isValidSearchQuery('ab'), false);
  assert.equal(isValidSearchQuery('Gloss Nails Gaeta'), true);
});

test('place ids are validated before upstream details calls', () => {
  assert.equal(isValidPlaceId('ChIJ12345678_test'), true);
  assert.equal(isValidPlaceId('../etc/passwd'), false);
  assert.equal(isValidPlaceId('short'), false);
});

test('Google responses are normalized to the minimal Check contracts', () => {
  const places = normalizeGoogleSearchResponse({
    places: [{
      id: 'ChIJ12345678_test',
      displayName: { text: 'Gloss Nails' },
      formattedAddress: 'Gaeta LT, Italia',
      primaryTypeDisplayName: { text: 'Salone manicure' },
    }],
  });

  assert.deepEqual(places[0], {
    id: 'ChIJ12345678_test',
    name: 'Gloss Nails',
    address: 'Gaeta LT, Italia',
    category: 'Salone manicure',
    source: 'google_maps',
  });

  const context = normalizeGoogleContextResponse({
    places: [{
      id: 'ChIJ87654321_test',
      displayName: { text: 'Nails Lab' },
      formattedAddress: 'Formia LT, Italia',
      primaryTypeDisplayName: { text: 'Salone manicure' },
      rating: 4.7,
      userRatingCount: 121,
    }],
  });

  assert.equal(context[0].name, 'Nails Lab');
  assert.equal(context[0].rating, 4.7);
  assert.equal(context[0].reviews, 121);

  const business = normalizeGooglePlaceDetails({
    id: 'ChIJ12345678_test',
    displayName: { text: 'Gloss Nails' },
    formattedAddress: 'Gaeta LT, Italia',
    primaryTypeDisplayName: { text: 'Salone manicure' },
    rating: 4.8,
    userRatingCount: 73,
  });

  assert.equal(business.externalId, 'google:ChIJ12345678_test');
  assert.equal(business.rating, 4.8);
  assert.equal(business.reviews, 73);
  assert.equal(business.cohortMedianReviews, null);
});
