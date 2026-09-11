import { Hono } from "hono";
import { searchPlaces, validateRadarInput } from "./places.ts";
import { inspectWebsite } from "./website.ts";
import { median, scoreProspect } from "./scoring.ts";
import { getCheckStats, loadCache, loadPublicCheck, loadRun, RadarStore, recordCheckEvent, saveCache, savePublicCheck, saveRun, takeRateToken } from "./store.ts";
import { csvEscape, mapLimit, sha256 } from "./utils.ts";
import { buildOutreachMessage, buildPublicCheck, createShareToken } from "./share.ts";
import type { Bindings, RadarRun } from "./types.ts";

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", async (c, next) => {
  await next();
  c.header("x-content-type-options", "nosniff");
  c.header("x-frame-options", "DENY");
  c.header("referrer-policy", "no-referrer");
  c.header("cache-control", "no-store");
  c.header("content-security-policy", "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'");
});

app.get("/health", (c) => c.json({ ok: true, service: "trovatemi-radar", env: c.env.APP_ENV ?? "unknown" }));

app.post("/api/runs", async (c) => {
  if (!c.env.GOOGLE_PLACES_API_KEY) return c.json({ error: "places_unconfigured" }, 503);

  let input: { category?: unknown; city?: unknown; limit?: unknown };
  try {
    input = await c.req.json();
  } catch {
    return c.json({ error: "invalid_json" }, 400);
  }

  let parsed: ReturnType<typeof validateRadarInput>;
  try {
    parsed = validateRadarInput(input.category, input.city, input.limit);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "invalid_input" }, 400);
  }

  const query = `${parsed.category} ${parsed.city}`;
  const cacheKey = (await sha256(query.toLowerCase())).slice(0, 24);
  const cached = await loadCache(c.env, cacheKey);
  if (cached) return c.json(cached);

  const clientIp = c.req.header("cf-connecting-ip") ?? "unknown";
  const hashedIp = (await sha256(clientIp)).slice(0, 20);
  if (!(await takeRateToken(c.env, hashedIp))) return c.json({ error: "rate_limited" }, 429);

  try {
    const places = await searchPlaces(c.env.GOOGLE_PLACES_API_KEY, parsed.category, parsed.city, parsed.limit);
    const medianReviews = median(places.map((place) => place.reviews));
    const medianRating = median(places.map((place) => place.rating));

    const enriched = await mapLimit(places, 4, async (place) => {
      const website = await inspectWebsite(place.website);
      return scoreProspect(place, website, query, medianReviews);
    });

    const prospects = enriched.sort((a, b) => {
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      return b.score - a.score;
    });

    const run: RadarRun = {
      id: crypto.randomUUID(),
      category: parsed.category,
      city: parsed.city,
      query,
      createdAt: new Date().toISOString(),
      source: "google_places",
      medianReviews,
      medianRating,
      prospects,
    };

    await Promise.all([saveRun(c.env, run), saveCache(c.env, cacheKey, run)]);
    return c.json(run);
  } catch (error) {
    console.error(JSON.stringify({
      event: "radar.run.failed",
      query,
      message: error instanceof Error ? error.message : "unknown",
    }));
    return c.json({ error: error instanceof Error ? error.message : "radar_failed" }, 502);
  }
});

app.get("/api/runs/:id", async (c) => {
  const run = await loadRun(c.env, c.req.param("id"));
  return run ? c.json(run) : c.json({ error: "run_not_found" }, 404);
});

app.get("/api/runs/:id/prospects/:prospectId/check", async (c) => {
  const run = await loadRun(c.env, c.req.param("id"));
  if (!run) return c.json({ error: "run_not_found" }, 404);
  const prospect = run.prospects.find((item) => item.id === c.req.param("prospectId"));
  return prospect ? c.json({ business: prospect.name, evidence: prospect.evidence, checkBrief: prospect.checkBrief }) : c.json({ error: "prospect_not_found" }, 404);
});


app.post("/api/runs/:id/prospects/:prospectId/share", async (c) => {
  const run = await loadRun(c.env, c.req.param("id"));
  if (!run) return c.json({ error: "run_not_found" }, 404);

  const prospect = run.prospects.find((item) => item.id === c.req.param("prospectId"));
  if (!prospect) return c.json({ error: "prospect_not_found" }, 404);
  if (!prospect.eligible) return c.json({ error: "prospect_not_shareable" }, 409);

  const token = createShareToken();
  const priceEur = Math.max(0, Number(c.env.ACTIVATION_PRICE_EUR) || 197);
  const check = buildPublicCheck(run, prospect, token, priceEur);
  await savePublicCheck(c.env, check);

  const origin = new URL(c.req.url).origin;
  const shareUrl = `${origin}/c/${token}`;
  return c.json({
    token,
    shareUrl,
    expiresAt: check.expiresAt,
    outreachMessage: buildOutreachMessage(check, shareUrl),
    stats: {
      views: 0,
      ctaClicks: 0,
      activationIntents: 0,
    },
  });
});

app.get("/api/checks/:token", async (c) => {
  const token = c.req.param("token");
  if (!/^[a-f0-9]{32}$/.test(token)) return c.json({ error: "invalid_check_token" }, 400);

  const check = await loadPublicCheck(c.env, token);
  return check ? c.json(check) : c.json({ error: "check_not_found" }, 404);
});


app.get("/api/checks/:token/stats", async (c) => {
  const token = c.req.param("token");
  if (!/^[a-f0-9]{32}$/.test(token)) return c.json({ error: "invalid_check_token" }, 400);
  const check = await loadPublicCheck(c.env, token);
  if (!check) return c.json({ error: "check_not_found" }, 404);
  const stats = await getCheckStats(c.env, token);
  return c.json(stats);
});

app.post("/api/checks/:token/events/:event", async (c) => {
  const token = c.req.param("token");
  const event = c.req.param("event");
  if (!/^[a-f0-9]{32}$/.test(token)) return c.json({ error: "invalid_check_token" }, 400);
  if (!["view", "activation"].includes(event)) return c.json({ error: "invalid_check_event" }, 400);

  const stats = await recordCheckEvent(c.env, token, event as "view" | "activation");
  return stats ? c.json(stats) : c.json({ error: "check_not_found" }, 404);
});

app.get("/go/:token", async (c) => {
  const token = c.req.param("token");
  if (!/^[a-f0-9]{32}$/.test(token)) return c.redirect("/", 302);

  const check = await loadPublicCheck(c.env, token);
  if (!check) return c.redirect("/", 302);

  await recordCheckEvent(c.env, token, "cta");
  return c.redirect(`/a/${token}`, 302);
});

app.post("/api/checks/:token/activation-intent", async (c) => {
  const token = c.req.param("token");
  if (!/^[a-f0-9]{32}$/.test(token)) return c.json({ error: "invalid_check_token" }, 400);

  const check = await loadPublicCheck(c.env, token);
  if (!check) return c.json({ error: "check_not_found" }, 404);

  await recordCheckEvent(c.env, token, "activation");

  const configured = Boolean(c.env.ACTIVATION_CHECKOUT_URL);
  if (!configured) {
    return c.json({
      ok: true,
      checkoutReady: false,
      priceEur: check.offer.priceEur,
      status: "intent_recorded",
    });
  }

  const checkout = new URL(c.env.ACTIVATION_CHECKOUT_URL!);
  checkout.searchParams.set("client_reference_id", token);
  checkout.searchParams.set("utm_source", "trovatemi-check");
  checkout.searchParams.set("utm_medium", "activation");
  checkout.searchParams.set("utm_campaign", check.business.city.toLowerCase());

  return c.json({
    ok: true,
    checkoutReady: true,
    priceEur: check.offer.priceEur,
    checkoutUrl: checkout.toString(),
  });
});

app.get("/api/runs/:id/export.csv", async (c) => {
  const run = await loadRun(c.env, c.req.param("id"));
  if (!run) return c.json({ error: "run_not_found" }, 404);

  const rows = [
    ["score","band","name","category","address","rating","reviews","phone","website","email","instagram","facebook","whatsapp","booking_url"],
    ...run.prospects.map((p) => [
      p.score,p.band,p.name,p.category,p.address,p.rating ?? "",p.reviews ?? "",p.phone ?? "",p.website ?? "",
      p.email ?? "",p.instagram ?? "",p.facebook ?? "",p.whatsapp ?? "",p.bookingUrl ?? "",
    ]),
  ];

  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  return new Response(csv + "\n", {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="trovatemi-radar-${run.id}.csv"`,
      "cache-control": "no-store",
    },
  });
});

app.notFound((c) => c.json({ error: "not_found" }, 404));

export { RadarStore };
export default app;
