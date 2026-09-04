export const googlePlacesSearchFieldMask = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.primaryTypeDisplayName',
].join(',');

export const googlePlaceDetailsFieldMask = [
  'id',
  'displayName',
  'formattedAddress',
  'primaryTypeDisplayName',
  'rating',
  'userRatingCount',
].join(',');

export function normalizeSearchQuery(input) {
  return String(input ?? '').trim().replace(/\s+/g, ' ').slice(0, 120);
}

export function isValidSearchQuery(input) {
  const value = normalizeSearchQuery(input);
  return value.length >= 3 && value.length <= 120;
}

export function isValidPlaceId(input) {
  return /^[A-Za-z0-9_-]{8,256}$/.test(String(input ?? ''));
}

export function buildGoogleTextSearchBody(query) {
  return {
    textQuery: normalizeSearchQuery(query),
    languageCode: 'it',
    regionCode: 'IT',
    pageSize: 5,
  };
}

export function normalizeGoogleSearchResponse(payload) {
  const places = Array.isArray(payload?.places) ? payload.places : [];

  return places
    .map((place) => ({
      id: place?.id ?? '',
      name: place?.displayName?.text ?? '',
      address: place?.formattedAddress ?? '',
      category: place?.primaryTypeDisplayName?.text ?? 'Attività locale',
      source: 'google_maps',
    }))
    .filter((place) => place.id && place.name);
}

export function normalizeGooglePlaceDetails(payload) {
  const id = payload?.id ?? '';
  const rating = Number.isFinite(payload?.rating) ? payload.rating : null;
  const reviews = Number.isInteger(payload?.userRatingCount) ? payload.userRatingCount : null;

  return {
    id,
    externalId: id ? `google:${id}` : '',
    placeId: id,
    name: payload?.displayName?.text ?? '',
    address: payload?.formattedAddress ?? '',
    category: payload?.primaryTypeDisplayName?.text ?? 'Attività locale',
    rating,
    reviews,
    cohortMedianReviews: null,
    source: 'google_maps',
    sourceLabel: 'Google Maps',
  };
}
