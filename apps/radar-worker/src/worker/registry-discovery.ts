import type { Bindings } from "./types.ts";

const SCOPE = "formia-v0";
const PROVIDER = "google_places";
const IDS_ONLY_CAP = 50_000;
const LOCK_MINUTES = 5;
const MAX_QUERIES_PER_RUN = 15;

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

type DiscoveryResult = {
  ok: boolean;
  status: "completed" | "target_reached" | "disabled" | "locked" | "blocked";
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

  if (!response.ok) throw new Error(`places_ids_only_${response.status}`);

  const payload = await response.json() as { places?: Array<{ id?: unknown }> };
  const ids = (Array.isArray(payload.places) ? payload.places : [])
    .map((place) => typeof place.id === "string" ? place.id.trim() : "")
    .filter(Boolean);

  return [...new Set(ids)];
}

async function ensureMonthlyIdsOnlyLedger(db: D1Database, month: string): Promise<void> {
  await db.prepare(`
    INSERT OR IGNORE INTO places_usage_monthly
      (month,sku_class,request_count,internal_cap,paid_overage_allowed,estimated_cost_micros)
    VALUES (?, 'ids_only', 0, ?, 0, 0)
  `).bind(month, IDS_ONLY_CAP).run();
}

async function reserveIdsOnlyRequest(db: D1Database, month: string): Promise<boolean> {
  await ensureMonthlyIdsOnlyLedger(db, month);
  const result = await db.prepare(`
    UPDATE places_usage_monthly
    SET request_count=request_count+1, updated_at=CURRENT_TIMESTAMP
    WHERE month=? AND sku_class='ids_only' AND request_count < internal_cap
  `).bind(month).run();
  return Number(result.meta.changes || 0) === 1;
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

  const count = await env.SUDPONTINO_DB.prepare(`
    SELECT COUNT(*) AS n
    FROM business_discovery_candidates
    WHERE provider=? AND municipality_id=?
  `).bind(PROVIDER, municipality.id).first<CountRow>();

  const month = new Date().toISOString().slice(0, 7);
  await ensureMonthlyIdsOnlyLedger(env.SUDPONTINO_DB, month);
  const usage = await env.SUDPONTINO_DB.prepare(`
    SELECT request_count,internal_cap,paid_overage_allowed
    FROM places_usage_monthly
    WHERE month=? AND sku_class='ids_only'
  `).bind(month).first<{ request_count: number; internal_cap: number; paid_overage_allowed: number }>();

  const currentTotal = Number(count?.n || 0);
  return {
    scope: SCOPE,
    enabled: state.enabled === 1,
    targetTotal: state.target_total,
    currentTotal,
    remaining: Math.max(0, state.target_total - currentTotal),
    idsOnlyRequestsThisMonth: usage?.request_count ?? 0,
    idsOnlyInternalCap: usage?.internal_cap ?? IDS_ONLY_CAP,
    paidOverageAllowed: usage?.paid_overage_allowed === 1,
  };
}

export async function runRegistryDiscovery(env: Bindings): Promise<DiscoveryResult> {
  if (!env.GOOGLE_PLACES_API_KEY) throw new Error("places_unconfigured");
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
      WHERE provider=? AND municipality_id=?
    `).bind(PROVIDER, municipality.id).first<CountRow>();

    const currentTotal = Number(before?.n || 0);
    if (currentTotal >= state.target_total) {
      await releaseLock(env.SUDPONTINO_DB);
      return {
        ok: true,
        status: "target_reached",
        targetTotal: state.target_total,
        currentTotal,
        queriesAttempted,
        candidatesSeen,
        candidatesInserted,
        externalRequests,
      };
    }

    const desiredNew = Math.min(
      state.max_new_per_run,
      state.target_total - currentTotal,
    );

    await env.SUDPONTINO_DB.prepare(`
      INSERT INTO business_discovery_runs (
        run_id,provider,municipality_id,mode,status,target_total,max_queries
      ) VALUES (?, ?, ?, 'ids_only', 'running', ?, ?)
    `).bind(runId, PROVIDER, municipality.id, state.target_total, MAX_QUERIES_PER_RUN).run();

    const month = new Date().toISOString().slice(0, 7);

    for (const query of FORMIA_DISCOVERY_QUERIES.slice(0, MAX_QUERIES_PER_RUN)) {
      if (candidatesInserted >= desiredNew) break;

      const reserved = await reserveIdsOnlyRequest(env.SUDPONTINO_DB, month);
      if (!reserved) {
        await env.SUDPONTINO_DB.prepare(`
          UPDATE business_discovery_runs
          SET status='blocked', error_code='ids_only_internal_cap',
              queries_attempted=?, candidates_seen=?, candidates_inserted=?,
              finished_at=CURRENT_TIMESTAMP
          WHERE run_id=?
        `).bind(queriesAttempted, candidatesSeen, candidatesInserted, runId).run();
        await releaseLock(env.SUDPONTINO_DB);
        return {
          ok: false,
          status: "blocked",
          targetTotal: state.target_total,
          currentTotal: currentTotal + candidatesInserted,
          queriesAttempted,
          candidatesSeen,
          candidatesInserted,
          externalRequests,
        };
      }

      queriesAttempted += 1;
      externalRequests += 1;
      const remaining = desiredNew - candidatesInserted;
      const ids = await searchPlaceIds(
        env.GOOGLE_PLACES_API_KEY,
        query,
        Math.min(20, Math.max(8, remaining)),
      );

      for (const placeId of ids) {
        candidatesSeen += 1;
        const provenance = `google_places:text_search:ids_only:${query}`;
        const inserted = await env.SUDPONTINO_DB.prepare(`
          INSERT OR IGNORE INTO business_discovery_candidates (
            provider,provider_identity,municipality_id,discovery_query,status,provenance_ref
          ) VALUES (?, ?, ?, ?, 'new', ?)
        `).bind(PROVIDER, placeId, municipality.id, query, provenance).run();

        if (Number(inserted.meta.changes || 0) === 1) {
          candidatesInserted += 1;
        } else {
          await env.SUDPONTINO_DB.prepare(`
            UPDATE business_discovery_candidates
            SET last_seen_at=CURRENT_TIMESTAMP
            WHERE provider=? AND provider_identity=?
          `).bind(PROVIDER, placeId).run();
        }

        if (candidatesInserted >= desiredNew) break;
      }
    }

    const after = await env.SUDPONTINO_DB.prepare(`
      SELECT COUNT(*) AS n FROM business_discovery_candidates
      WHERE provider=? AND municipality_id=?
    `).bind(PROVIDER, municipality.id).first<CountRow>();
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
