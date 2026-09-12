import type { WebsiteSignals } from "./types.ts";

const MAX_HTML_BYTES = 400_000;
const FETCH_TIMEOUT_MS = 4_500;

function isPrivateIpv4(host: string): boolean {
  const match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;
  const [a, b] = match.slice(1).map(Number);
  return (
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a === 0
  );
}

export function safePublicUrl(raw: string | null | undefined): URL | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (!["http:", "https:"].includes(url.protocol)) return null;
    if (url.username || url.password) return null;
    if (
      host === "localhost" ||
      host.endsWith(".local") ||
      host === "::1" ||
      host === "[::1]" ||
      isPrivateIpv4(host)
    ) return null;
    return url;
  } catch {
    return null;
  }
}

async function readBoundedText(response: Response): Promise<string> {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;

  while (bytes < MAX_HTML_BYTES) {
    const { value, done } = await reader.read();
    if (done) break;
    if (!value) continue;
    const remaining = MAX_HTML_BYTES - bytes;
    const slice = value.byteLength > remaining ? value.slice(0, remaining) : value;
    chunks.push(slice);
    bytes += slice.byteLength;
    if (value.byteLength > remaining) {
      await reader.cancel();
      break;
    }
  }

  const merged = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(merged);
}

function firstMatch(html: string, pattern: RegExp): string | null {
  const match = pattern.exec(html);
  return match?.[1] ? match[1].replace(/&amp;/g, "&") : null;
}

export function extractWebsiteSignalsFromHtml(html: string, observedAt = new Date().toISOString()): WebsiteSignals {
  const email = firstMatch(html, /(?:mailto:|["'\s>])([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})(?:[?"'\s<]|$)/i);
  const instagram = firstMatch(html, /(https?:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9._-]+\/?)/i);
  const facebook = firstMatch(html, /(https?:\/\/(?:www\.)?facebook\.com\/[A-Za-z0-9._-]+\/?)/i);
  const whatsapp = firstMatch(html, /(https?:\/\/(?:wa\.me|api\.whatsapp\.com)\/[^"'\s<]+)/i);
  const bookingUrl = firstMatch(
    html,
    /(https?:\/\/[^"'\s<]*(?:prenot|booking|book-now|appointment|fresha|treatwell)[^"'\s<]*)/i,
  );

  return {
    status: "ok",
    observedAt,
    email,
    instagram,
    facebook,
    whatsapp,
    bookingUrl,
  };
}

async function fetchOnce(url: URL): Promise<Response> {
  return fetch(url.toString(), {
    method: "GET",
    redirect: "manual",
    headers: {
      "accept": "text/html,application/xhtml+xml",
      "accept-language": "it-IT,it;q=0.9,en;q=0.6",
      "user-agent": "TrovatemiRadar/0.1 (+https://trovatemi.it)",
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}

export async function inspectWebsite(rawUrl: string | null): Promise<WebsiteSignals> {
  const observedAt = new Date().toISOString();
  let url = safePublicUrl(rawUrl);
  if (!url) {
    return { status: rawUrl ? "blocked" : "missing", observedAt, email: null, instagram: null, facebook: null, whatsapp: null, bookingUrl: null };
  }

  try {
    let response = await fetchOnce(url);
    for (let redirects = 0; redirects < 2 && response.status >= 300 && response.status < 400; redirects += 1) {
      const location = response.headers.get("location");
      if (!location) break;
      const next = safePublicUrl(new URL(location, url).toString());
      if (!next) return { status: "blocked", observedAt, email: null, instagram: null, facebook: null, whatsapp: null, bookingUrl: null };
      url = next;
      response = await fetchOnce(url);
    }

    if (!response.ok) {
      return { status: "failed", observedAt, email: null, instagram: null, facebook: null, whatsapp: null, bookingUrl: null };
    }

    const type = response.headers.get("content-type") ?? "";
    if (!type.includes("text/html") && !type.includes("application/xhtml+xml")) {
      return { status: "failed", observedAt, email: null, instagram: null, facebook: null, whatsapp: null, bookingUrl: null };
    }

    return extractWebsiteSignalsFromHtml(await readBoundedText(response), observedAt);
  } catch {
    return { status: "failed", observedAt, email: null, instagram: null, facebook: null, whatsapp: null, bookingUrl: null };
  }
}
