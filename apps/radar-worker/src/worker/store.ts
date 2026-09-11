import type { Bindings, RadarRun } from "./types.ts";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export class RadarStore {
  constructor(private readonly state: DurableObjectState, _env: Bindings) {}

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);

    if (request.method === "PUT" && parts[0] === "runs" && parts[1]) {
      const run = await request.json() as RadarRun;
      await this.state.storage.put(`run:${parts[1]}`, run);
      return json({ ok: true });
    }

    if (request.method === "GET" && parts[0] === "runs" && parts[1]) {
      const run = await this.state.storage.get(`run:${parts[1]}`) as RadarRun | undefined;
      return run ? json(run) : json({ error: "run_not_found" }, 404);
    }

    if (request.method === "GET" && parts[0] === "cache" && parts[1]) {
      const cached = await this.state.storage.get(`cache:${parts[1]}`) as { expiresAt: number; run: RadarRun } | undefined;
      if (!cached || cached.expiresAt <= Date.now()) return json({ hit: false });
      return json({ hit: true, run: { ...cached.run, cached: true } });
    }

    if (request.method === "PUT" && parts[0] === "cache" && parts[1]) {
      const run = await request.json() as RadarRun;
      await this.state.storage.put(`cache:${parts[1]}`, {
        expiresAt: Date.now() + 6 * 60 * 60 * 1000,
        run,
      });
      return json({ ok: true });
    }

    if (request.method === "POST" && parts[0] === "rate" && parts[1] && parts[2]) {
      const key = `rate:${parts[1]}:${parts[2]}`;
      const current = Number(await this.state.storage.get(key) ?? 0);
      const limit = 6;
      if (current >= limit) return json({ allowed: false, remaining: 0 }, 429);
      await this.state.storage.put(key, current + 1);
      return json({ allowed: true, remaining: limit - current - 1 });
    }

    return json({ error: "store_not_found" }, 404);
  }
}

export function storeStub(env: Bindings) {
  const id = env.RADAR_STORE.idFromName("global-v1");
  return env.RADAR_STORE.get(id);
}

export async function saveRun(env: Bindings, run: RadarRun) {
  const stub = storeStub(env);
  await stub.fetch(new Request(`https://radar-store/runs/${encodeURIComponent(run.id)}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(run),
  }));
}

export async function loadRun(env: Bindings, id: string): Promise<RadarRun | null> {
  const response = await storeStub(env).fetch(new Request(`https://radar-store/runs/${encodeURIComponent(id)}`));
  return response.ok ? await response.json() as RadarRun : null;
}

export async function loadCache(env: Bindings, key: string): Promise<RadarRun | null> {
  const response = await storeStub(env).fetch(new Request(`https://radar-store/cache/${encodeURIComponent(key)}`));
  if (!response.ok) return null;
  const body = await response.json() as { hit: boolean; run?: RadarRun };
  return body.hit && body.run ? body.run : null;
}

export async function saveCache(env: Bindings, key: string, run: RadarRun) {
  await storeStub(env).fetch(new Request(`https://radar-store/cache/${encodeURIComponent(key)}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(run),
  }));
}

export async function takeRateToken(env: Bindings, hashedIp: string): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10);
  const response = await storeStub(env).fetch(new Request(`https://radar-store/rate/${day}/${hashedIp}`, { method: "POST" }));
  return response.ok;
}
