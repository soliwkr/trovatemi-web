import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

import {
  buildGoogleTextSearchBody,
  googlePlacesSearchFieldMask,
  isValidSearchQuery,
  normalizeGoogleSearchResponse,
  normalizeSearchQuery,
} from '../../../data/google-places.mjs';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  },
});

export const GET: APIRoute = async ({ url }) => {
  const query = normalizeSearchQuery(url.searchParams.get('q'));
  const runtimeEnv = env as typeof env & { GOOGLE_PLACES_API_KEY?: string };
  const apiKey = runtimeEnv.GOOGLE_PLACES_API_KEY;

  if (!isValidSearchQuery(query)) {
    return json({ error: 'invalid_query' }, 400);
  }

  if (!apiKey) {
    return json({ error: 'places_unconfigured' }, 503);
  }

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': googlePlacesSearchFieldMask,
      },
      body: JSON.stringify(buildGoogleTextSearchBody(query)),
    });

    if (!response.ok) {
      console.error(JSON.stringify({
        event: 'places.search.failed',
        status: response.status,
      }));
      return json({ error: 'places_upstream_failed' }, 502);
    }

    const payload = await response.json();

    return json({
      places: normalizeGoogleSearchResponse(payload),
      source: 'google_maps',
    });
  } catch (error) {
    console.error(JSON.stringify({
      event: 'places.search.error',
      message: error instanceof Error ? error.message : 'unknown',
    }));
    return json({ error: 'places_unavailable' }, 502);
  }
};
