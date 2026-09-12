import { Hono } from "hono";
import { searchPlaces, validateRadarInput } from "./places.ts";
import { inspectWebsite } from "./website.ts";
import { median, scoreProspect } from "./scoring.ts";
import { getCheckStats, loadActivationDraft, loadCache, loadPublicCheck, loadRun, RadarStore, recordCheckEvent, saveActivationDraft, saveCache, savePublicCheck, saveRun, takeRateToken } from "./store.ts";
import { csvEscape, mapLimit, sha256 } from "./utils.ts";
import { buildOutreachMessage, buildPublicCheck, createShareToken } from "./share.ts";
import { climboConfigured, createClimboClient, normalizeActivationInput } from "./climbo.ts";
import { renderPublicCheck } from "./public-check.ts";
import type { ActivationDraft, Bindings, RadarRun } from "./types.ts";

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", async (c, next) => {
  await next();
  c.header("x-content-type-options", "nosniff");
  c.header("x-frame-options", "DENY");
  c.header("referrer-policy", "no-referrer");
  c.header("cache-control", "no-store");
  c.header("content-security-policy", "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'");
});

app.get("/health", (c) => c.json({ ok: true, service: "trovatemi-radar", env: c.env.APP_ENV ?? "unknown" }));


app.get("/", (c) => {
  const host = new URL(c.req.url).hostname;
  if (host === "check.trovatemi.it") {
    return c.redirect(c.env.PUBLIC_HOME_URL ?? "https://trovatemi.it", 302);
  }
  return c.env.ASSETS.fetch(c.req.raw);
});


app.get("/c/:token", async (c) => {
  const token = c.req.param("token");
  const requestUrl = new URL(c.req.url);
  const publicBase = (c.env.PUBLIC_CHECK_BASE_URL ?? "").replace(/\/$/, "");
  if (requestUrl.hostname === "radar.trovatemi.it" && publicBase) {
    return c.redirect(`${publicBase}/c/${token}`, 302);
  }
  if (!/^[a-f0-9]{32}$/.test(token)) {
    return c.html("<!doctype html><html lang=\"it\"><head><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex,nofollow\"></head><body style=\"font-family:Arial,sans-serif;padding:32px\"><h1>Check non valido.</h1></body></html>", 400);
  }

  let check;
  try {
    check = await loadPublicCheck(c.env, token);
  } catch (error) {
    console.error(JSON.stringify({
      event: "public_check.load.failed",
      token,
      message: error instanceof Error ? error.message : "unknown",
    }));
    return c.html("<!doctype html><html lang=\"it\"><head><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex,nofollow\"></head><body style=\"font-family:Arial,sans-serif;padding:32px\"><h1>Il check è temporaneamente indisponibile.</h1><p>Riprova tra poco.</p></body></html>", 503);
  }

  if (!check) {
    return c.html("<!doctype html><html lang=\"it\"><head><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex,nofollow\"></head><body style=\"font-family:Arial,sans-serif;padding:32px\"><h1>Questo check non è disponibile.</h1><p>Il link potrebbe essere scaduto.</p></body></html>", 404);
  }

  try {
    const html = renderPublicCheck(check);

    try {
      c.executionCtx.waitUntil(
        recordCheckEvent(c.env, token, "view").catch((error) => {
          console.warn(JSON.stringify({
            event: "public_check.view_tracking.failed",
            token,
            message: error instanceof Error ? error.message : "unknown",
          }));
        }),
      );
    } catch (error) {
      console.warn(JSON.stringify({
        event: "public_check.view_tracking.schedule_failed",
        token,
        message: error instanceof Error ? error.message : "unknown",
      }));
    }

    return c.html(html, 200, {
      "x-trovatemi-render": "server",
      "x-trovatemi-tracking": "best-effort",
    });
  } catch (error) {
    console.error(JSON.stringify({
      event: "public_check.render.failed",
      token,
      message: error instanceof Error ? error.message : "unknown",
    }));

    const safeName = String(check.business?.name ?? "questa attività")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

    return c.html(`<!doctype html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Trovatemi · Check</title>
</head>
<body style="margin:0;background:#fffdf8;color:#111214;font-family:Arial,sans-serif;padding:32px">
  <main style="max-width:760px;margin:0 auto">
    <p style="font-weight:900">TROVATEMI.IT ★</p>
    <h1 style="font-size:clamp(42px,10vw,88px);line-height:.9;margin:24px 0">TI HO CERCATO.</h1>
    <p style="font-size:20px;line-height:1.5">Ho preparato un check per <strong>${safeName}</strong>.</p>
    <p style="line-height:1.6">La versione completa ha avuto un problema di rendering, ma il link è valido. Riprova tra poco.</p>
  </main>
</body>
</html>`, 200, {
      "x-trovatemi-render": "fallback",
    });
  }
});

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

  const clientIp = c.req.header("x-trovatemi-client-ip") ?? c.req.header("cf-connecting-ip") ?? "unknown";
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

  const baseUrl = (c.env.PUBLIC_CHECK_BASE_URL ?? new URL(c.req.url).origin).replace(/\/$/, "");
  const shareUrl = `${baseUrl}/c/${token}`;
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


app.post("/api/public/runs/:id/prospects/:prospectId/share", async (c) => {
  const run = await loadRun(c.env, c.req.param("id"));
  if (!run) return c.json({ error: "run_not_found" }, 404);

  const prospect = run.prospects.find((item) => item.id === c.req.param("prospectId"));
  if (!prospect) return c.json({ error: "prospect_not_found" }, 404);

  const token = createShareToken();
  const priceEur = Math.max(0, Number(c.env.ACTIVATION_PRICE_EUR) || 197);
  const check = buildPublicCheck(run, prospect, token, priceEur);
  await savePublicCheck(c.env, check);

  const baseUrl = (c.env.PUBLIC_CHECK_BASE_URL ?? new URL(c.req.url).origin).replace(/\/$/, "");
  return c.json({
    shareUrl: `${baseUrl}/c/${token}`,
    expiresAt: check.expiresAt,
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

  let input: { ownerName: string; email: string };
  try {
    input = normalizeActivationInput(await c.req.json());
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "invalid_activation_input" }, 400);
  }

  const existing = await loadActivationDraft(c.env, token);
  const now = new Date().toISOString();
  const checkoutReady = Boolean(c.env.ACTIVATION_CHECKOUT_URL);
  const draft: ActivationDraft = {
    token,
    businessName: check.business.name,
    ownerName: input.ownerName,
    email: input.email,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    status: existing?.status === "provisioned"
      ? "provisioned"
      : checkoutReady ? "checkout_ready" : "intent",
    providerRef: existing?.providerRef ?? null,
  };

  await saveActivationDraft(c.env, draft);
  await recordCheckEvent(c.env, token, "activation");

  if (!checkoutReady) {
    return c.json({
      ok: true,
      checkoutReady: false,
      priceEur: check.offer.priceEur,
      status: "intent_recorded",
    });
  }

  const checkout = new URL(c.env.ACTIVATION_CHECKOUT_URL!);
  checkout.searchParams.set("client_reference_id", token);
  checkout.searchParams.set("prefilled_email", draft.email);
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

app.post("/api/activations/:token/provision", async (c) => {
  const token = c.req.param("token");
  if (!/^[a-f0-9]{32}$/.test(token)) return c.json({ error: "invalid_check_token" }, 400);

  const suppliedSecret = c.req.header("x-provisioning-secret") ?? "";
  if (!c.env.PROVISIONING_SECRET || suppliedSecret !== c.env.PROVISIONING_SECRET) {
    return c.json({ error: "unauthorized" }, 401);
  }

  if (!climboConfigured(c.env)) return c.json({ error: "climbo_unconfigured" }, 503);

  const draft = await loadActivationDraft(c.env, token);
  if (!draft) return c.json({ error: "activation_not_found" }, 404);

  if (draft.status === "provisioned") {
    return c.json({ ok: true, status: "already_provisioned", providerRef: draft.providerRef });
  }

  try {
    const result = await createClimboClient(c.env, draft);
    const updated: ActivationDraft = {
      ...draft,
      status: "provisioned",
      providerRef: result.providerRef,
      updatedAt: new Date().toISOString(),
    };
    await saveActivationDraft(c.env, updated);
    return c.json({ ok: true, status: "provisioned", providerRef: result.providerRef });
  } catch (error) {
    console.error(JSON.stringify({
      event: "activation.provision.failed",
      token,
      message: error instanceof Error ? error.message : "unknown",
    }));
    return c.json({ error: error instanceof Error ? error.message : "provision_failed" }, 502);
  }
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
