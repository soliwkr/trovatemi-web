import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildGoogleTextSearchBody,
  googlePlaceDetailsFieldMask,
  googlePlacesSearchFieldMask,
  isValidPlaceId,
  isValidSearchQuery,
  normalizeGooglePlaceDetails,
  normalizeGoogleSearchResponse,
} from '../src/data/google-places.mjs';

test('search deliberately omits rating fields so Text Search stays out of Enterprise tier', () => {
  assert.match(googlePlacesSearchFieldMask, /places\.id/);
  assert.match(googlePlacesSearchFieldMask, /places\.displayName/);
  assert.equal(googlePlacesSearchFieldMask.includes('rating'), false);
  assert.equal(googlePlacesSearchFieldMask.includes('userRatingCount'), false);
});

test('details requests rating and review count only after a place is selected', () => {
  assert.match(googlePlaceDetailsFieldMask, /rating/);
  assert.match(googlePlaceDetailsFieldMask, /userRatingCount/);
});

test('text search is Italy-scoped, explicit and capped at five results', () => {
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

test('Google responses are normalized to the minimal Check contract', () => {
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
