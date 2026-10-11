import type { Bindings } from "./types.ts";

const SCOPE = "formia-v0";
const GOOGLE_PROVIDER = "google_places";
const OSM_PROVIDER = "openstreetmap";
const IDS_ONLY_CAP = 50_000;
const LOCK_MINUTES = 5;
const OSM_LICENSE = "ODbL-1.0 © OpenStreetMap contributors";
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const OSM_DISCOVERY_QUERY_KEY = "overpass:formia:businesses:v0";

export const FORMIA_DISCOVERY_QUERIES = [
  "bar Formia",
  "ristorante Formia",
  "pizzeria Formia",
  "parrucchiere Formia",
  "barbiere Formia",
  "centro estetico Formia",
  "dentista Formia",
  "palestra Formia",
  "agenzia immobiliare Formia",
  "officina auto Formia",
  "hotel Formia",
  "idraulico Formia",
  "elettricista Formia",
  "ottico Formia",
  "fisioterapista Formia",
] as const;

export const FORMIA_OVERPASS_QUERY = `
[out:json][timeout:20];
area["boundary"="administrative"]["admin_level"="8"]["name"="Formia"]->.formia;
(
  nwr(area.formia)["name"]["amenity"];
  nwr(area.formia)["name"]["shop"];
  nwr(area.formia)["name"]["tourism"];
  nwr(area.formia)["name"]["craft"];
  nwr(area.formia)["name"]["office"];
);
out center 120;
`.trim();

type DiscoveryResult = {
  ok: boolean;
  status: "completed" | "target_reached" | "disabled" | "locked" | "blocked";
  provider: "openstreetmap";
  targetTotal: number;
  currentTotal: number;
  queriesAttempted: number;
  candidatesSeen: number;
  candidatesInserted: number;
  externalRequests: number;
};

type StateRow = {
  target_total: number;
  max_new_per_run: number;
  enabled: number;
};

type CountRow = { n: number };
type FetchLike = typeof fetch;

export type OsmCandidate = {
  identity: string;
  name: string;
  category: string | null;
  lat: number | null;
  lon: number | null;
  sourceUrl: string;
  licenseRef: string;
};

function findNestedReason(value: unknown, depth = 0): string | undefined {
  if (depth > 5 || value == null) return undefined;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findNestedReason(item, depth + 1);
      if (found) return found;
    }
    return undefined;
  }
  if (typeof value === "object") {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (key === "reason" && typeof nested === "string" && nested.trim()) return nested.trim();
      const found = findNestedReason(nested, depth + 1);
      if (found) return found;
    }
  }
  return undefined;
}

function classifyGooglePermissionMessage(message: unknown): string {
  const text = typeof message === "string" ? message.toLowerCase() : "";
  if (!text) return "UNKNOWN";
  if (text.includes("api key not valid") || text.includes("api key is invalid") || text.includes("provided api key")) return "INVALID_KEY";
  if (text.includes("billing")) return "BILLING";
  if (text.includes("referer") || text.includes("referrer")) return "REFERRER_RESTRICTION";
  if (text.includes("ip address") || text.includes("ip restriction")) return "IP_RESTRICTION";
  if (text.includes("not authorized") || text.includes("not enabled") || text.includes("has not been used")) return "API_NOT_AUTHORIZED";
  if (text.includes("blocked")) return "REQUEST_BLOCKED";
  return "OTHER";
}

export async function searchPlaceIds(
  apiKey: string,
  textQuery: string,
  pageSize = 10,
  fetcher: FetchLike = fetch,
): Promise<string[]> {
  const safePageSize = Math.max(1, Math.min(20, Math.trunc(pageSize) || 10));
  const response = await fetcher("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id",
    },
    body: JSON.stringify({
      textQuery,
      languageCode: "it",
      regionCode: "IT",
      pageSize: safePageSize,
    }),
  });

  if (!response.ok) {
    let status = "UNKNOWN";
    let reason = "UNKNOWN";
    try {
      const errorPayload = await response.clone().json() as {
        error?: {
          status?: unknown;
          message?: unknown;
          details?: unknown;
        };
      };
      if (typeof errorPayload.error?.status === "string") status = errorPayload.error.status.slice(0, 80);
      const foundReason = findNestedReason(errorPayload.error?.details);
      if (typeof foundReason === "string") reason = foundReason.slice(0, 100);
      const messageClass = classifyGooglePermissionMessage(errorPayload.error?.message);
      throw new Error(`places_ids_only_${response.status}_${status}_${reason}_${messageClass}`);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("places_ids_only_")) throw error;
    }
    throw new Error(`places_ids_only_${response.status}_${status}_${reason}_UNKNOWN`);
  }

  const payload = await response.json() as { places?: Array<{ id?: unknown }> };
  const ids = (Array.isArray(payload.places) ? payload.places : [])
    .map((place) => typeof place.id === "string" ? place.id.trim() : "")
    .filter(Boolean);

  return [...new Set(ids)];
}

function osmCategory(tags: Record<string, unknown>): string | null {
  for (const key of ["amenity", "shop", "tourism", "craft", "office"]) {
    const value = tags[key];
    if (typeof value === "string" && value.trim()) return `${key}:${value.trim()}`;
  }
  return null;
}

export async function searchOsmCandidates(fetcher: FetchLike = fetch): Promise<OsmCandidate[]> {
  const response = await fetcher(OVERPASS_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      "accept": "application/json",
    },
    body: "data=" + encodeURIComponent(FORMIA_OVERPASS_QUERY),
  });

  if (!response.ok) throw new Error(`overpass_${response.status}`);

  const payload = await response.json() as {
    elements?: Array<{
      type?: unknown;
      id?: unknown;
      lat?: unknown;
      lon?: unknown;
      center?: { lat?: unknown; lon?: unknown };
      tags?: Record<string, unknown>;
    }>;
  };

  const seen = new Set<string>();
  const rows: OsmCandidate[] = [];

  for (const element of Array.isArray(payload.elements) ? payload.elements : []) {
    const type = typeof element.type === "string" ? element.type : "";
    const id = typeof element.id === "number" || typeof element.id === "string" ? String(element.id) : "";
    const tags = element.tags && typeof element.tags === "object" ? element.tags : {};
    const name = typeof tags.name === "string" ? tags.name.trim() : "";
    if (!["node", "way", "relation"].includes(type) || !id || !name) continue;

    const identity = `${type}/${id}`;
    if (seen.has(identity)) continue;
    seen.add(identity);

    const rawLat = typeof element.lat === "number" ? element.lat : element.center?.lat;
    const rawLon = typeof element.lon === "number" ? element.lon : element.center?.lon;
    const lat = typeof rawLat === "number" && Number.isFinite(rawLat) ? rawLat : null;
    const lon = typeof rawLon === "number" && Number.isFinite(rawLon) ? rawLon : null;

    rows.push({
      identity,
      name,
      category: osmCategory(tags),
      lat,
      lon,
      sourceUrl: `https://www.openstreetmap.org/${identity}`,
      licenseRef: OSM_LICENSE,
    });
  }

  return rows;
}

async function ensureMonthlyIdsOnlyLedger(db: D1Database, month: string): Promise<void> {
  await db.prepare(`
    INSERT OR IGNORE INTO places_usage_monthly
      (month,sku_class,request_count,internal_cap,paid_overage_allowed,estimated_cost_micros)
    VALUES (?, 'ids_only', 0, ?, 0, 0)
  `).bind(month, IDS_ONLY_CAP).run();
}

async function releaseLock(db: D1Database): Promise<void> {
  await db.prepare(`
    UPDATE business_discovery_state
    SET locked_until=NULL, last_run_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP
    WHERE scope=?
  `).bind(SCOPE).run();
}

export async function registryDiscoveryStatus(env: Bindings): Promise<{
  scope: string;
  enabled: boolean;
  targetTotal: number;
  currentTotal: number;
  remaining: number;
  osmCandidates: number;
  googleCandidates: number;
  idsOnlyRequestsThisMonth: number;
  idsOnlyInternalCap: number;
  paidOverageAllowed: boolean;
}> {
  const state = await env.SUDPONTINO_DB.prepare(`
    SELECT target_total,max_new_per_run,enabled
    FROM business_discovery_state
    WHERE scope=?
  `).bind(SCOPE).first<StateRow>();
  if (!state) throw new Error("discovery_state_missing");

  const municipality = await env.SUDPONTINO_DB.prepare(
    "SELECT id FROM municipalities WHERE slug='formia' LIMIT 1"
  ).first<{ id: number }>();
  if (!municipality) throw new Error("formia_missing");

  const counts = await env.SUDPONTINO_DB.prepare(`
    SELECT
      COUNT(*) AS n,
      SUM(CASE WHEN provider='openstreetmap' THEN 1 ELSE 0 END) AS osm_n,
      SUM(CASE WHEN provider='google_places' THEN 1 ELSE 0 END) AS google_n
    FROM business_discovery_candidates
    WHERE municipality_id=?
  `).bind(municipality.id).first<{ n: number; osm_n: number | null; google_n: number | null }>();

  const month = new Date().toISOString().slice(0, 7);
  await ensureMonthlyIdsOnlyLedger(env.SUDPONTINO_DB, month);
  const usage = await env.SUDPONTINO_DB.prepare(`
    SELECT request_count,internal_cap,paid_overage_allowed
    FROM places_usage_monthly
    WHERE month=? AND sku_class='ids_only'
  `).bind(month).first<{ request_count: number; internal_cap: number; paid_overage_allowed: number }>();

  const currentTotal = Number(counts?.n || 0);
  return {
    scope: SCOPE,
    enabled: state.enabled === 1,
    targetTotal: state.target_total,
    currentTotal,
    remaining: Math.max(0, state.target_total - currentTotal),
    osmCandidates: Number(counts?.osm_n || 0),
    googleCandidates: Number(counts?.google_n || 0),
    idsOnlyRequestsThisMonth: usage?.request_count ?? 0,
    idsOnlyInternalCap: usage?.internal_cap ?? IDS_ONLY_CAP,
    paidOverageAllowed: usage?.paid_overage_allowed === 1,
  };
}

export async function runRegistryDiscovery(env: Bindings): Promise<DiscoveryResult> {
  if (!env.SUDPONTINO_DB) throw new Error("sudpontino_db_unconfigured");

  const lock = await env.SUDPONTINO_DB.prepare(`
    UPDATE business_discovery_state
    SET locked_until=datetime('now', ?), updated_at=CURRENT_TIMESTAMP
    WHERE scope=? AND enabled=1
      AND (locked_until IS NULL OR datetime(locked_until) < datetime('now'))
  `).bind(`+${LOCK_MINUTES} minutes`, SCOPE).run();

  if (Number(lock.meta.changes || 0) !== 1) {
    const status = await registryDiscoveryStatus(env);
    return {
      ok: true,
      status: status.enabled ? "locked" : "disabled",
      provider: "openstreetmap",
      targetTotal: status.targetTotal,
      currentTotal: status.currentTotal,
      queriesAttempted: 0,
      candidatesSeen: 0,
      candidatesInserted: 0,
      externalRequests: 0,
    };
  }

  const runId = crypto.randomUUID();
  let queriesAttempted = 0;
  let candidatesSeen = 0;
  let candidatesInserted = 0;
  let externalRequests = 0;

  try {
    const state = await env.SUDPONTINO_DB.prepare(`
      SELECT target_total,max_new_per_run,enabled
      FROM business_discovery_state WHERE scope=?
    `).bind(SCOPE).first<StateRow>();
    if (!state) throw new Error("discovery_state_missing");

    const municipality = await env.SUDPONTINO_DB.prepare(
      "SELECT id FROM municipalities WHERE slug='formia' LIMIT 1"
    ).first<{ id: number }>();
    if (!municipality) throw new Error("formia_missing");

    const before = await env.SUDPONTINO_DB.prepare(`
      SELECT COUNT(*) AS n FROM business_discovery_candidates
      WHERE municipality_id=?
    `).bind(municipality.id).first<CountRow>();

    const currentTotal = Number(before?.n || 0);
    if (currentTotal >= state.target_total) {
      await releaseLock(env.SUDPONTINO_DB);
      return {
        ok: true,
        status: "target_reached",
        provider: "openstreetmap",
        targetTotal: state.target_total,
        currentTotal,
        queriesAttempted,
        candidatesSeen,
        candidatesInserted,
        externalRequests,
      };
    }

    const desiredNew = Math.min(state.max_new_per_run, state.target_total - currentTotal);

    await env.SUDPONTINO_DB.prepare(`
      INSERT INTO business_discovery_runs (
        run_id,provider,municipality_id,mode,status,target_total,max_queries
      ) VALUES (?, ?, ?, 'free_osm', 'running', ?, 1)
    `).bind(runId, OSM_PROVIDER, municipality.id, state.target_total).run();

    queriesAttempted = 1;
    externalRequests = 1;
    const candidates = await searchOsmCandidates();

    for (const candidate of candidates) {
      if (candidatesInserted >= desiredNew) break;
      candidatesSeen += 1;

      const inserted = await env.SUDPONTINO_DB.prepare(`
        INSERT OR IGNORE INTO business_discovery_candidates (
          provider,provider_identity,municipality_id,discovery_query,status,
          display_name_hint,category_hint,lat_hint,lon_hint,source_url,license_ref,
          provenance_ref
        ) VALUES (?, ?, ?, ?, 'new', ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        OSM_PROVIDER,
        candidate.identity,
        municipality.id,
        OSM_DISCOVERY_QUERY_KEY,
        candidate.name,
        candidate.category,
        candidate.lat,
        candidate.lon,
        candidate.sourceUrl,
        candidate.licenseRef,
        `openstreetmap:overpass:${candidate.identity}`,
      ).run();

      if (Number(inserted.meta.changes || 0) === 1) {
        candidatesInserted += 1;
      } else {
        await env.SUDPONTINO_DB.prepare(`
          UPDATE business_discovery_candidates
          SET last_seen_at=CURRENT_TIMESTAMP,
              display_name_hint=COALESCE(?,display_name_hint),
              category_hint=COALESCE(?,category_hint),
              lat_hint=COALESCE(?,lat_hint),
              lon_hint=COALESCE(?,lon_hint),
              source_url=COALESCE(?,source_url),
              license_ref=COALESCE(?,license_ref)
          WHERE provider=? AND provider_identity=?
        `).bind(
          candidate.name,
          candidate.category,
          candidate.lat,
          candidate.lon,
          candidate.sourceUrl,
          candidate.licenseRef,
          OSM_PROVIDER,
          candidate.identity,
        ).run();
      }
    }

    const after = await env.SUDPONTINO_DB.prepare(`
      SELECT COUNT(*) AS n FROM business_discovery_candidates
      WHERE municipality_id=?
    `).bind(municipality.id).first<CountRow>();
    const finalTotal = Number(after?.n || 0);

    await env.SUDPONTINO_DB.prepare(`
      UPDATE business_discovery_runs
      SET status='completed', queries_attempted=?, candidates_seen=?,
          candidates_inserted=?, finished_at=CURRENT_TIMESTAMP
      WHERE run_id=?
    `).bind(queriesAttempted, candidatesSeen, candidatesInserted, runId).run();

    await releaseLock(env.SUDPONTINO_DB);

    return {
      ok: true,
      status: finalTotal >= state.target_total ? "target_reached" : "completed",
      provider: "openstreetmap",
      targetTotal: state.target_total,
      currentTotal: finalTotal,
      queriesAttempted,
      candidatesSeen,
      candidatesInserted,
      externalRequests,
    };
  } catch (error) {
    const code = error instanceof Error ? error.message.slice(0, 120) : "unknown";
    try {
      await env.SUDPONTINO_DB.prepare(`
        UPDATE business_discovery_runs
        SET status='failed', error_code=?, queries_attempted=?,
            candidates_seen=?, candidates_inserted=?, finished_at=CURRENT_TIMESTAMP
        WHERE run_id=?
      `).bind(code, queriesAttempted, candidatesSeen, candidatesInserted, runId).run();
      await releaseLock(env.SUDPONTINO_DB);
    } catch {}
    throw error;
  }
}
