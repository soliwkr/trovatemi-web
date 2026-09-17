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
  venue_role: 'physical_place' | 'business_host' | 'address' | 'non_venue' | 'unknown';
  venue_evidence: string;
};

type VenueValidation = {
  venue: string;
  valid: boolean;
  role: 'physical_place' | 'business_host' | 'address' | 'non_venue' | 'unknown';
  evidence: string;
  notes: string;
};

function parseVenueValidation(value: unknown): VenueValidation | null {
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
    const roleRaw = cleanPart(raw.role, 40);
    const role = ['physical_place', 'business_host', 'address', 'non_venue', 'unknown'].includes(roleRaw)
      ? roleRaw as VenueValidation['role']
      : 'unknown';
    return {
      venue: cleanPart(raw.venue, 180),
      valid: raw.valid === true,
      role,
      evidence: cleanPart(raw.evidence, 220),
      notes: cleanPart(raw.notes, 280),
    };
  } catch {
    return null;
  }
}

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
    const rawRole = cleanPart(raw.venue_role, 40);
    const venueRole = ['physical_place', 'business_host', 'address', 'non_venue', 'unknown'].includes(rawRole)
      ? rawRole as EventExtraction['venue_role']
      : 'unknown';

    return {
      title: cleanPart(raw.title, 180),
      date: cleanPart(raw.date, 20),
      time: cleanPart(raw.time, 30),
      venue: cleanPart(raw.venue, 180),
      city: cleanPart(raw.city, 100),
      confidence: Number.isFinite(confidence) ? Math.min(1, Math.max(0, confidence)) : 0,
      notes: cleanPart(raw.notes, 280),
      venue_role: venueRole,
      venue_evidence: cleanPart(raw.venue_evidence, 220),
    };
  } catch {
    return null;
  }
}


function normalizeItalianText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function romeTodayIso() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return values.year + '-' + values.month + '-' + values.day;
}

const IT_MONTHS: Record<string, number> = {
  gennaio: 1, febbraio: 2, marzo: 3, aprile: 4, maggio: 5, giugno: 6,
  luglio: 7, agosto: 8, settembre: 9, ottobre: 10, novembre: 11, dicembre: 12,
};

const IT_WEEKDAYS: Record<string, number> = {
  domenica: 0, lunedi: 1, martedi: 2, mercoledi: 3,
  giovedi: 4, venerdi: 5, sabato: 6,
};

function pureItalianDatePhrase(value: string) {
  const normalized = normalizeItalianText(value).replace(/[.,]/g, '');
  return /^(?:(?:lunedi|martedi|mercoledi|giovedi|venerdi|sabato|domenica)\s+)?\d{1,2}\s+(?:gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)(?:\s+\d{4})?$/.test(normalized);
}

function inferUpcomingItalianDate(value: string, todayIso: string) {
  const normalized = normalizeItalianText(value).replace(/[.,]/g, '');
  const match = normalized.match(/^(?:(lunedi|martedi|mercoledi|giovedi|venerdi|sabato|domenica)\s+)?(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)(?:\s+(\d{4}))?$/);
  if (!match) return '';

  const [, weekdayName, dayRaw, monthName, explicitYear] = match;
  const day = Number(dayRaw);
  const month = IT_MONTHS[monthName];
  const todayYear = Number(todayIso.slice(0, 4));
  const years = explicitYear ? [Number(explicitYear)] : [todayYear, todayYear + 1];

  for (const year of years) {
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) continue;

    if (weekdayName && date.getUTCDay() !== IT_WEEKDAYS[weekdayName]) continue;

    const iso = year.toString().padStart(4, '0') + '-' +
      month.toString().padStart(2, '0') + '-' +
      day.toString().padStart(2, '0');

    if (explicitYear || iso >= todayIso) return iso;
  }

  return '';
}


const CORE_LOCALITIES = new Set([
  'formia','gaeta','fondi','itri','minturno','sperlonga','terracina',
  'ponza','ventotene','spigno saturnia','castelforte','santi cosma e damiano',
  'lenola','campodimele','monte san biagio','san felice circeo','priverno'
]);

function moveVenueLocalityIntoCity(event: EventExtraction) {
  if (event.city) return event;

  const venue = normalizeItalianText(event.venue);
  if (!venue || !CORE_LOCALITIES.has(venue)) return event;

  return {
    ...event,
    city: event.venue,
    venue: '',
    confidence: Math.min(event.confidence, 0.85),
    notes: cleanPart(
      [event.notes, 'La località rilevata nel campo luogo è stata riclassificata come città.']
        .filter(Boolean)
        .join(' '),
      500,
    ),
  };
}

function sanitizeExtraction(event: EventExtraction, todayIso: string): EventExtraction {
  let date = event.date;
  let venue = event.venue;
  let venueRole = event.venue_role;
  let venueEvidence = event.venue_evidence;
  let confidence = event.confidence;
  const notes: string[] = event.notes ? [event.notes] : [];

  if (venue && !['physical_place', 'business_host', 'address'].includes(venueRole)) {
    venue = '';
    venueEvidence = '';
    notes.push('Il candidato luogo non era provato come sede fisica dell evento ed è stato rimosso.');
    confidence = Math.min(confidence, 0.65);
  }

  if (pureItalianDatePhrase(venue)) {
    const inferred = inferUpcomingItalianDate(venue, todayIso);
    if (inferred && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < todayIso)) {
      date = inferred;
      notes.push('Data ricostruita dal giorno/mese visibile nella locandina: verifica prima di confermare.');
      confidence = Math.min(confidence, 0.75);
    }
    venue = '';
    notes.push('Il testo rilevato come luogo era in realtà una data, quindi il campo luogo è stato svuotato.');
    confidence = Math.min(confidence, 0.7);
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date) && date < todayIso) {
    date = '';
    notes.push('La data estratta risultava nel passato ed è stata rimossa invece di inventare un anno.');
    confidence = Math.min(confidence, 0.4);
  }

  return moveVenueLocalityIntoCity({
    ...event,
    date,
    venue,
    confidence,
    notes: cleanPart(notes.join(' '), 500),
    venue_role: venue ? venueRole : 'unknown',
    venue_evidence: venue ? venueEvidence : '',
  });
}

async function validateVenueFromImage(image: string, event: EventExtraction, env: Env): Promise<EventExtraction> {
  const candidate = event.venue || '(nessun candidato)';
  const prompt = [
    'Valida ESCLUSIVAMENTE il luogo fisico dell evento mostrato nell immagine.',
    'Candidato del primo passaggio: ' + candidate + '.',
    'Citta gia estratta: ' + (event.city || '(vuota)') + '.',
    'La domanda e: DOVE SI SVOLGE FISICAMENTE L EVENTO?',
    'Un venue valido e una struttura, palestra, teatro, locale, sala, attivita ospitante o indirizzo.',
    'NON accettare come venue: prova gratuita, ingresso gratuito/libero, open day, novita, offerta, promozione, CTA, slogan, prodotto, cuffie, tecnologia, sistema, metodo, format, servizio, sponsor o nome dell esperienza.',
    'Se il candidato non e un luogo, cerca nell immagine un host fisico chiaramente visibile. Non inventare.',
    'Se non puoi provare dall immagine un luogo fisico, restituisci venue vuoto, valid false e role unknown.',
    'evidence deve essere testo visibile nell immagine che dimostra il luogo/host, non una tua inferenza.',
    'Rispondi SOLO JSON valido:',
    '{"venue":"","valid":false,"role":"unknown","evidence":"","notes":""}',
  ].join('\n');

  try {
    const result = await env.AI.run('@cf/meta/llama-3.2-11b-vision-instruct', {
      messages: [
        { role: 'system', content: 'Sei un verificatore conservativo di venue per eventi italiani.' },
        { role: 'user', content: prompt },
      ],
      image,
    });
    const validation = parseVenueValidation(result);
    if (!validation) return { ...event, venue: '', venue_role: 'unknown', venue_evidence: '' };

    const accepted = validation.valid &&
      Boolean(validation.venue) &&
      ['physical_place', 'business_host', 'address'].includes(validation.role) &&
      Boolean(validation.evidence);

    return {
      ...event,
      venue: accepted ? validation.venue : '',
      venue_role: accepted ? validation.role : 'unknown',
      venue_evidence: accepted ? validation.evidence : '',
      confidence: accepted ? Math.min(event.confidence, 0.9) : Math.min(event.confidence, 0.65),
      notes: cleanPart(
        [event.notes, validation.notes, accepted ? '' : 'Venue non verificato nel secondo passaggio: lasciato vuoto.']
          .filter(Boolean)
          .join(' '),
        500,
      ),
    };
  } catch {
    return {
      ...event,
      venue: '',
      venue_role: 'unknown',
      venue_evidence: '',
      confidence: Math.min(event.confidence, 0.6),
      notes: cleanPart([event.notes, 'Verifica venue non riuscita: campo luogo lasciato vuoto.'].filter(Boolean).join(' '), 500),
    };
  }
}

async function extractEventFromImage(request: Request, env: Env) {
  const body = await readJson(request);
  const image = typeof body?.image === 'string' ? body.image : '';

  if (!image.startsWith('data:image/') || image.length > 6_000_000) {
    return Response.json({ error: 'invalid_image' }, { status: 400 });
  }

  const today = romeTodayIso();
  const prompt = [
    'Estrai i dati di UN evento principale dalla locandina o screenshot fornito.',
    'Non inventare mai informazioni non visibili.',
    'Se un campo non è leggibile o non è presente, usa stringa vuota.',
    'La data corrente a Formia/Roma è ' + today + '.',
    'Se sulla locandina giorno e mese sono visibili ma l anno NON è visibile, non inventare mai un anno passato. Usa l anno corrente o successivo soltanto se coerente con giorno, mese ed eventuale giorno della settimana; altrimenti lascia date vuota.',
    'venue deve rispondere alla domanda: DOVE SUCCEDE FISICAMENTE L EVENTO?',
    'Sono venue valide: palestra/teatro/bar/locale/centro commerciale/sala/struttura che ospita, oppure un indirizzo specifico.',
    'NON sono venue: prodotto, tecnologia, sistema audio, cuffie, format, slogan, metodo, servizio, sponsor o nome dell esperienza.',
    'Se vedi soltanto il nome del comune/località (es. Formia, Gaeta, Fondi), mettilo in city e lascia venue vuoto.',
    'venue_role deve essere uno tra: physical_place, business_host, address, non_venue, unknown.',
    'venue_evidence deve contenere il testo VISIBILE nella locandina che prova che quel venue è davvero host/luogo fisico. Se non c è prova visibile, venue deve essere vuoto e venue_role unknown.',
    'confidence NON è una certezza matematica: non usare 1.0 se hai inferito qualcosa o se almeno un campo è ambiguo.',
    'Rispondi ESCLUSIVAMENTE con JSON valido, senza markdown, con queste chiavi:',
    '{"title":"","date":"YYYY-MM-DD oppure stringa vuota","time":"HH:MM oppure intervallo o stringa vuota","venue":"","city":"","confidence":0.0,"notes":"","venue_role":"unknown","venue_evidence":""}',
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

    const parsed = parseModelJson(result);
    if (!parsed) {
      return Response.json({ error: 'extraction_failed' }, { status: 502 });
    }

    const sanitized = sanitizeExtraction(parsed, today);
    const event = await validateVenueFromImage(image, sanitized, env);

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

  if (eventDate < romeTodayIso()) {
    return Response.json({ error: 'event_date_in_past' }, { status: 400 });
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
