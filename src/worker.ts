import { handle } from '@astrojs/cloudflare/handler';

type PublicSearchResult = {
  id: string;
  name: string;
  address: string;
  rating: number | null;
  reviews: number | null;
  positionSignal: number;
  phonePresent: boolean;
  websitePresent: boolean;
  directActionPresent: boolean;
  shareable: boolean;
};

async function readJson(request: Request) {
  try {
    return await request.json() as Record<string, unknown>;
  } catch {
    return null;
  }
}

function cleanPart(value: unknown, max = 80) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, max);
}

async function proxyPublicSearch(request: Request, env: Env) {
  const body = await readJson(request);
  if (!body) return Response.json({ error: 'invalid_json' }, { status: 400 });

  const category = cleanPart(body.category);
  const city = cleanPart(body.city);
  if (category.length < 2 || city.length < 2) {
    return Response.json({ error: 'invalid_input' }, { status: 400 });
  }

  const clientIp = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const upstream = await env.RADAR.fetch(new Request('https://radar.internal/api/runs', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-trovatemi-client-ip': clientIp,
    },
    body: JSON.stringify({ category, city, limit: 8 }),
  }));

  const payload = await upstream.json() as {
    id?: string;
    query?: string;
    medianReviews?: number | null;
    medianRating?: number | null;
    prospects?: Array<Record<string, unknown>>;
    error?: string;
  };

  if (!upstream.ok || !payload.id || !Array.isArray(payload.prospects)) {
    return Response.json({ error: payload.error ?? 'search_failed' }, { status: upstream.status || 502 });
  }

  const results: PublicSearchResult[] = payload.prospects.slice(0, 8).map((item) => ({
    id: String(item.id ?? ''),
    name: String(item.name ?? ''),
    address: String(item.address ?? ''),
    rating: typeof item.rating === 'number' ? item.rating : null,
    reviews: typeof item.reviews === 'number' ? item.reviews : null,
    positionSignal: typeof item.positionSignal === 'number' ? item.positionSignal : 0,
    phonePresent: Boolean(item.phone),
    websitePresent: Boolean(item.website),
    directActionPresent: Boolean(item.whatsapp || item.bookingUrl),
    shareable: Boolean(item.eligible),
  })).filter((item) => item.id && item.name);

  return Response.json({
    runId: payload.id,
    query: payload.query ?? (category + ' ' + city),
    medianReviews: payload.medianReviews ?? null,
    medianRating: payload.medianRating ?? null,
    results,
  }, { headers: { 'cache-control': 'no-store' } });
}

async function proxyPublicCheck(request: Request, env: Env) {
  const body = await readJson(request);
  if (!body) return Response.json({ error: 'invalid_json' }, { status: 400 });

  const runId = cleanPart(body.runId, 120);
  const prospectId = cleanPart(body.prospectId, 240);
  if (!runId || !prospectId) return Response.json({ error: 'invalid_input' }, { status: 400 });

  const path = '/api/runs/' + encodeURIComponent(runId) + '/prospects/' + encodeURIComponent(prospectId) + '/share';
  const upstream = await env.RADAR.fetch(new Request('https://radar.internal' + path, { method: 'POST' }));

  const payload = await upstream.json() as { shareUrl?: string; error?: string };
  if (!upstream.ok || !payload.shareUrl) {
    return Response.json({ error: payload.error ?? 'check_failed' }, { status: upstream.status || 502 });
  }

  return Response.json({ shareUrl: payload.shareUrl }, { headers: { 'cache-control': 'no-store' } });
}

export default {
  async fetch(request, env, ctx) {
    const startedAt = Date.now();
    const url = new URL(request.url);

    if (url.hostname === 'www.trovatemi.it') {
      url.protocol = 'https:';
      url.hostname = 'trovatemi.it';
      const response = Response.redirect(url.toString(), 308);
      console.log(JSON.stringify({
        event: 'request.redirect',
        method: request.method,
        path: url.pathname,
        status: response.status,
        durationMs: Date.now() - startedAt,
      }));
      return response;
    }

    if (request.method === 'POST' && url.pathname === '/api/public-search') {
      return proxyPublicSearch(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/api/public-check') {
      return proxyPublicCheck(request, env);
    }

    const response = await handle(request, env, ctx);

    console.log(JSON.stringify({
      event: 'request.complete',
      method: request.method,
      path: url.pathname,
      status: response.status,
      durationMs: Date.now() - startedAt,
    }));

    return response;
  },
} satisfies ExportedHandler<Env>;
