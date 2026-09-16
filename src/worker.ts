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



type EventExtraction = {
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  confidence: number;
  notes: string;
};

function parseModelJson(value: unknown): EventExtraction | null {
  const text = typeof value === 'string'
    ? value
    : typeof (value as { response?: unknown })?.response === 'string'
      ? String((value as { response: string }).response)
      : '';

  if (!text) return null;

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) return null;

  try {
    const raw = JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
    const confidence = Number(raw.confidence);
    return {
      title: cleanPart(raw.title, 180),
      date: cleanPart(raw.date, 20),
      time: cleanPart(raw.time, 30),
      venue: cleanPart(raw.venue, 180),
      city: cleanPart(raw.city, 100),
      confidence: Number.isFinite(confidence) ? Math.min(1, Math.max(0, confidence)) : 0,
      notes: cleanPart(raw.notes, 280),
    };
  } catch {
    return null;
  }
}

async function extractEventFromImage(request: Request, env: Env) {
  const body = await readJson(request);
  const image = typeof body?.image === 'string' ? body.image : '';

  if (!image.startsWith('data:image/') || image.length > 6_000_000) {
    return Response.json({ error: 'invalid_image' }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const prompt = [
    'Estrai i dati di UN evento principale dalla locandina o screenshot fornito.',
    'Non inventare mai informazioni non visibili.',
    'Se un campo non è leggibile o non è presente, usa stringa vuota.',
    'Se la fonte usa parole relative come oggi, domani, venerdì o sabato, usa la data corrente solo quando la conversione è inequivocabile.',
    'Data corrente UTC: ' + today + '.',
    'Rispondi ESCLUSIVAMENTE con JSON valido, senza markdown, con queste chiavi:',
    '{"title":"","date":"YYYY-MM-DD oppure stringa vuota","time":"HH:MM oppure intervallo o stringa vuota","venue":"","city":"","confidence":0.0,"notes":""}',
    'confidence deve essere tra 0 e 1. notes deve segnalare conflitti o ambiguità.',
  ].join('\n');

  const model = '@cf/meta/llama-3.2-11b-vision-instruct';

  const runVision = () => env.AI.run(model, {
    messages: [
      { role: 'system', content: 'Sei un estrattore prudente di dati evento da immagini italiane.' },
      { role: 'user', content: prompt },
    ],
    image,
  });

  try {
    let result;
    try {
      result = await runVision();
    } catch (firstError) {
      const message = firstError instanceof Error ? firstError.message : String(firstError);
      if (!/5016|agree|license|acceptable use/i.test(message)) throw firstError;

      // Cloudflare requires a one-time Meta license acceptance for this model.
      await env.AI.run(model, { prompt: 'agree' });
      result = await runVision();
    }

    const event = parseModelJson(result);
    if (!event) {
      return Response.json({ error: 'extraction_failed' }, { status: 502 });
    }

    return Response.json(
      { event },
      { headers: { 'cache-control': 'no-store' } },
    );
  } catch (error) {
    console.error(JSON.stringify({
      event: 'event.extract.error',
      message: error instanceof Error ? error.message : String(error),
    }));
    const message = error instanceof Error ? error.message : String(error);
    const code = /5016|agree|license|acceptable use/i.test(message)
      ? 'model_license_required'
      : /too small|minimum|image/i.test(message)
        ? 'vision_image_error'
        : 'extraction_unavailable';
    return Response.json({ error: code, detail: message.slice(0, 240) }, { status: 502 });
  }
}


type StoredEvent = {
  id: string;
  slug: string;
  title: string;
  event_date: string;
  event_time: string;
  venue: string;
  city: string;
  lifecycle_status: 'draft';
  source_kind: 'upload';
  source_digest: string | null;
  created_at: string;
  updated_at: string;
};

function eventSlug(title: string, id: string) {
  const base = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'evento';
  return base + '-' + id.slice(0, 8);
}

async function createStoredEvent(request: Request, env: Env) {
  const body = await readJson(request);
  if (!body) return Response.json({ error: 'invalid_json' }, { status: 400 });

  const title = cleanPart(body.title, 180);
  const eventDate = cleanPart(body.date, 20);
  const eventTime = cleanPart(body.time, 30);
  const venue = cleanPart(body.venue, 180);
  const city = cleanPart(body.city, 100);
  const sourceDigest = cleanPart(body.sourceDigest, 128) || null;

  if (title.length < 2 || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate) || city.length < 2) {
    return Response.json({ error: 'invalid_event_fields' }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const slug = eventSlug(title, id);
  const now = new Date().toISOString();

  const event: StoredEvent = {
    id,
    slug,
    title,
    event_date: eventDate,
    event_time: eventTime,
    venue,
    city,
    lifecycle_status: 'draft',
    source_kind: 'upload',
    source_digest: sourceDigest,
    created_at: now,
    updated_at: now,
  };

  try {
    await env.EVENTS_DB.prepare(
      `INSERT INTO events (
        id, slug, title, event_date, event_time, venue, city,
        lifecycle_status, source_kind, source_digest, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      event.id,
      event.slug,
      event.title,
      event.event_date,
      event.event_time,
      event.venue,
      event.city,
      event.lifecycle_status,
      event.source_kind,
      event.source_digest,
      event.created_at,
      event.updated_at,
    ).run();

    return Response.json({ event }, {
      status: 201,
      headers: { 'cache-control': 'no-store' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({ event: 'event.persist.error', message }));
    return Response.json({
      error: 'event_persistence_failed',
      detail: message.slice(0, 240),
    }, { status: 500 });
  }
}

async function readStoredEvent(id: string, env: Env) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return Response.json({ error: 'invalid_event_id' }, { status: 400 });
  }

  try {
    const event = await env.EVENTS_DB.prepare(
      `SELECT
        id, slug, title, event_date, event_time, venue, city,
        lifecycle_status, source_kind, source_digest, created_at, updated_at
       FROM events
       WHERE id = ?
       LIMIT 1`
    ).bind(id).first<StoredEvent>();

    if (!event) return Response.json({ error: 'event_not_found' }, { status: 404 });

    return Response.json({ event }, {
      headers: { 'cache-control': 'no-store' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({ event: 'event.read.error', message }));
    return Response.json({
      error: 'event_read_failed',
      detail: message.slice(0, 240),
    }, { status: 500 });
  }
}

async function recordPublicFunnelEvent(env: Env, event: string) {
  if (!['search', 'results', 'selection', 'check_request', 'check_created'].includes(event)) return;
  try {
    await env.RADAR.fetch(new Request('https://radar.internal/api/funnel/events/' + event, { method: 'POST' }));
  } catch {
    // CRO telemetry must never block the public funnel.
  }
}

async function proxyPublicSearch(request: Request, env: Env) {
  const body = await readJson(request);
  if (!body) return Response.json({ error: 'invalid_json' }, { status: 400 });

  const category = cleanPart(body.category);
  const city = cleanPart(body.city);
  if (category.length < 2 || city.length < 2) {
    return Response.json({ error: 'invalid_input' }, { status: 400 });
  }

  await recordPublicFunnelEvent(env, 'search');

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

  await recordPublicFunnelEvent(env, 'results');

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

  await recordPublicFunnelEvent(env, 'check_request');

  const path = '/api/public/runs/' + encodeURIComponent(runId) + '/prospects/' + encodeURIComponent(prospectId) + '/share';
  const upstream = await env.RADAR.fetch(new Request('https://radar.internal' + path, { method: 'POST' }));

  const payload = await upstream.json() as { shareUrl?: string; error?: string };
  if (!upstream.ok || !payload.shareUrl) {
    return Response.json({ error: payload.error ?? 'check_failed' }, { status: upstream.status || 502 });
  }

  await recordPublicFunnelEvent(env, 'check_created');
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

    if (request.method === 'POST' && url.pathname === '/api/event-extract') {
      return extractEventFromImage(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/api/events') {
      return createStoredEvent(request, env);
    }

    const eventReadMatch = request.method === 'GET'
      ? url.pathname.match(/^\/api\/events\/([0-9a-f-]{36})$/i)
      : null;
    if (eventReadMatch) {
      return readStoredEvent(eventReadMatch[1], env);
    }

    if (request.method === 'POST' && url.pathname === '/api/public-search') {
      return proxyPublicSearch(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/api/public-check') {
      return proxyPublicCheck(request, env);
    }


    if (request.method === 'POST' && url.pathname === '/api/public-event') {
      const body = await readJson(request);
      const event = cleanPart(body?.event, 40);
      if (!['selection'].includes(event)) {
        return Response.json({ error: 'invalid_event' }, { status: 400 });
      }
      await recordPublicFunnelEvent(env, event);
      return Response.json({ ok: true });
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
