import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

import {
  googlePlaceDetailsFieldMask,
  isValidPlaceId,
  normalizeGooglePlaceDetails,
} from '../../../data/google-places.mjs';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  },
});

export const GET: APIRoute = async ({ url }) => {
  const placeId = String(url.searchParams.get('id') ?? '');

  if (!isValidPlaceId(placeId)) {
    return json({ error: 'invalid_place_id' }, 400);
  }

  if (!env.GOOGLE_PLACES_API_KEY) {
    return json({ error: 'places_unconfigured' }, 503);
  }

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        'X-Goog-Api-Key': env.GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': googlePlaceDetailsFieldMask,
      },
    });

    if (!response.ok) {
      console.error(JSON.stringify({
        event: 'places.details.failed',
        status: response.status,
      }));
      return json({ error: 'places_upstream_failed' }, 502);
    }

    const payload = await response.json();
    const business = normalizeGooglePlaceDetails(payload);

    if (!business.id || !business.name) {
      return json({ error: 'place_not_found' }, 404);
    }

    return json({
      business,
      source: 'google_maps',
    });
  } catch (error) {
    console.error(JSON.stringify({
      event: 'places.details.error',
      message: error instanceof Error ? error.message : 'unknown',
    }));
    return json({ error: 'places_unavailable' }, 502);
  }
};
