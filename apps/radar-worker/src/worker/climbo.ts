import type { ActivationDraft, Bindings } from "./types.ts";

export function normalizeActivationInput(input: unknown): { ownerName: string; email: string } {
  const body = (input && typeof input === "object") ? input as Record<string, unknown> : {};
  const ownerName = String(body.ownerName ?? "").trim().replace(/\s+/g, " ").slice(0, 100);
  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 254);

  if (ownerName.length < 2) throw new Error("invalid_owner_name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("invalid_email");

  return { ownerName, email };
}

export function climboConfigured(env: Bindings): boolean {
  return Boolean(env.CLIMBO_API_KEY && env.CLIMBO_PLAN_ID);
}

export async function createClimboClient(
  env: Bindings,
  draft: ActivationDraft,
): Promise<{ providerRef: string | null }> {
  if (!env.CLIMBO_API_KEY || !env.CLIMBO_PLAN_ID) throw new Error("climbo_unconfigured");

  const response = await fetch("https://api.climbo.com/client", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.CLIMBO_API_KEY,
    },
    body: JSON.stringify({
      user_name: draft.ownerName,
      email: draft.email,
      plan_id: env.CLIMBO_PLAN_ID,
      welcome: true,
    }),
  });

  if (!response.ok) {
    throw new Error("climbo_create_" + response.status);
  }

  const payload = await response.json() as Record<string, unknown>;
  const ref = payload.id ?? payload.client_id ?? payload.clientId ?? null;

  return {
    providerRef: typeof ref === "string" ? ref : null,
  };
}
