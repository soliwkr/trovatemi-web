import assert from "node:assert/strict";
import test from "node:test";
import { buildOutreachMessage, buildPublicCheck } from "../src/worker/share.ts";
import type { ProspectResult, RadarRun } from "../src/worker/types.ts";

const prospect: ProspectResult = {
  id: "place-1",
  name: "Studio Aurora",
  address: "Via Demo 1, Formia",
  category: "Parrucchiere",
  rating: 4.6,
  reviews: 31,
  website: "https://example.com",
  phone: "+390771000000",
  googleMapsUri: "https://maps.google.com/demo",
  positionSignal: 6,
  status: "ok",
  observedAt: "2026-09-11T12:00:00Z",
  email: "private-business-contact@example.com",
  instagram: "https://instagram.com/studioaurora",
  facebook: null,
  whatsapp: null,
  bookingUrl: null,
  sourceConfidence: 0.92,
  eligible: true,
  eligibilityReason: "ok",
  score: 87,
  band: "hot",
  components: [],
  evidence: [
    "Google Places: rating 4.6",
    "Google Places: 31 recensioni",
    "Ricerca osservata: posizione-segnale 6 (non ranking Google assoluto)",
    "Sito pubblico trovato",
    "Email pubblica trovata sulla homepage",
    "Instagram collegato dal sito",
  ],
  checkBrief: {
    headline: "Ti ho cercato come ti cercherebbe un cliente.",
    publicScoreAllowed: false,
    query: "parrucchiere Formia",
    threeThingsToShow: [
      { label: "Gap recensioni", reason: "31 recensioni vs mediana locale 184." },
      { label: "Attrito di scelta", reason: "posizione-segnale 6 nell'insieme osservato." },
      { label: "Qualità vs presenza", reason: "Rating 4.6: attività apprezzata." },
    ],
    claimRule: "Mostrare solo evidenze osservate. positionSignal non è un ranking Google assoluto.",
  },
};

const run: RadarRun = {
  id: "run-1",
  category: "parrucchiere",
  city: "Formia",
  query: "parrucchiere Formia",
  createdAt: "2026-09-11T12:00:00Z",
  source: "google_places",
  medianReviews: 184,
  medianRating: 4.7,
  prospects: [prospect],
};

test("public check never leaks internal score or prospect contact data", () => {
  const check = buildPublicCheck(run, prospect, "0123456789abcdef0123456789abcdef");
  const json = JSON.stringify(check);
  assert.equal("score" in check, false);
  assert.equal(json.includes('"score"'), false);
  assert.equal(json.includes(prospect.email ?? ""), false);
  assert.equal(json.includes(prospect.phone ?? ""), false);
  assert.equal(check.evidence.some((item) => item.startsWith("Email")), false);
});

test("public check preserves customer-facing proof and an explicit claim rule", () => {
  const check = buildPublicCheck(run, prospect, "0123456789abcdef0123456789abcdef");
  assert.equal(check.business.name, "Studio Aurora");
  assert.equal(check.threeThingsToShow.length, 3);
  assert.equal(check.business.positionSignal, 6);
  assert.match(check.claimRule, /non è un ranking Google assoluto/);
  assert.match(check.cta.href, /trovatemi\.it/);
});

test("outreach message points to the generated share URL", () => {
  const check = buildPublicCheck(run, prospect, "0123456789abcdef0123456789abcdef");
  const url = "https://radar.example/c/0123456789abcdef0123456789abcdef";
  const message = buildOutreachMessage(check, url);
  assert.match(message, /Studio Aurora/);
  assert.match(message, /parrucchiere a Formia/);
  assert.equal(message.includes(url), true);
});
