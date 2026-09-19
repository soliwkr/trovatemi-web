import type { APIRoute } from 'astro';

const allowedDestinations = new Set(['gaeta']);
const allowedSources = new Set(['gaeta_mvp']);

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!body || typeof body !== 'object') {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_body' }), { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const query = typeof payload.query === 'string' ? payload.query.trim().slice(0, 500) : '';
  const destination = typeof payload.destination === 'string' ? payload.destination : '';
  const source = typeof payload.source === 'string' ? payload.source : '';

  if (!query || !allowedDestinations.has(destination) || !allowedSources.has(source)) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_intent' }), {
      status: 422,
      headers: { 'content-type': 'application/json' },
    });
  }

  const event = {
    event: 'intent_submitted',
    intentId: crypto.randomUUID(),
    destination,
    source,
    query,
    occurredAt: new Date().toISOString(),
  };

  // Gate 1: structured observability only. No cookies, account, email, phone or IP are persisted here.
  // Gate 2 will bind the same event contract to D1 after schema review.
  console.log(JSON.stringify(event));

  return new Response(JSON.stringify({ ok: true, intentId: event.intentId }), {
    status: 202,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
};
