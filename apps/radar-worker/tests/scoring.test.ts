import assert from "node:assert/strict";
import test from "node:test";
import { median, scoreProspect } from "../src/worker/scoring.ts";
import { extractWebsiteSignalsFromHtml, safePublicUrl } from "../src/worker/website.ts";
import type { PlaceRecord } from "../src/worker/types.ts";

const base: PlaceRecord = {
  id: "you",
  name: "Studio Aurora",
  address: "Formia LT",
  category: "Parrucchiere",
  rating: 4.6,
  reviews: 31,
  website: "https://studio.example",
  phone: "+390000000001",
  googleMapsUri: null,
  positionSignal: 6,
};

test("median ignores missing values", () => {
  assert.equal(median([10, null, 20, 30]), 20);
  assert.equal(median([10, 20]), 15);
});

test("good but underrepresented business becomes a priority prospect", () => {
  const signals = extractWebsiteSignalsFromHtml(
    '<a href="mailto:ciao@example.com">Email</a><a href="https://instagram.com/studioaurora">IG</a>',
    "2026-09-11T12:00:00Z",
  );
  const result = scoreProspect(base, signals, "parrucchiere Formia", 184);
  assert.equal(result.eligible, true);
  assert.ok(result.score >= 70);
  assert.notEqual(result.band, "skip");
  assert.equal(result.checkBrief.publicScoreAllowed, false);
  assert.match(result.checkBrief.claimRule, /non è un ranking Google assoluto/);
});

test("weak-rating business is skipped instead of rewarded", () => {
  const result = scoreProspect(
    { ...base, id: "weak", rating: 3.6 },
    extractWebsiteSignalsFromHtml("", "2026-09-11T12:00:00Z"),
    "parrucchiere Formia",
    184,
  );
  assert.equal(result.eligible, false);
  assert.equal(result.score, 0);
  assert.equal(result.band, "skip");
});

test("website extraction returns only business-surface signals", () => {
  const signals = extractWebsiteSignalsFromHtml(`
    <a href="mailto:hello@salone.it">mail</a>
    <a href="https://instagram.com/salone">instagram</a>
    <a href="https://facebook.com/salone">facebook</a>
    <a href="https://wa.me/391234567890">whatsapp</a>
    <a href="https://salone.it/prenotazione">prenota</a>
  `, "2026-09-11T12:00:00Z");
  assert.equal(signals.email, "hello@salone.it");
  assert.match(signals.instagram ?? "", /instagram/);
  assert.match(signals.bookingUrl ?? "", /prenotazione/);
});

test("SSRF guard rejects private and local URLs", () => {
  assert.equal(safePublicUrl("http://127.0.0.1/private"), null);
  assert.equal(safePublicUrl("http://192.168.1.20"), null);
  assert.equal(safePublicUrl("http://localhost:8787"), null);
  assert.equal(safePublicUrl("https://example.com")?.hostname, "example.com");
});
