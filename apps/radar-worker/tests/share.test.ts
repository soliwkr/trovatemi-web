import assert from "node:assert/strict";
import test from "node:test";
import { buildOutreachMessage, buildPublicCheck } from "../src/worker/share.ts";
import type { ProspectResult, RadarRun } from "../src/worker/types.ts";

const prospect: ProspectResult = {
  id: "place-1",
  name: "Officina Aurora",
  address: "Via Demo 1, Formia",
  category: "Officina",
  rating: 4.6,
  reviews: 31,
  website: "https://example.com",
  phone: "+390771000000",
  googleMapsUri: "https://maps.google.com/demo",
  positionSignal: 6,
  status: "ok",
  observedAt: "2026-09-11T12:00:00Z",
  email: "private-business-contact@example.com",
  instagram: "https://instagram.com/officinaaurora",
  facebook: null,
  whatsapp: null,
  bookingUrl: null,
  sourceConfidence: 0.92,
  eligible: true,
  eligibilityReason: "ok",
  score: 87,
  band: "hot",
  components: [
    { key: "review_gap", label: "Gap recensioni", score: 20, maxScore: 25, reason: "internal" },
    { key: "conversion_friction", label: "Attrito di scelta", score: 10, maxScore: 10, reason: "internal" },
  ],
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
    query: "officina Formia",
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
  category: "officina",
  city: "Formia",
  query: "officina Formia",
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

test("customer check translates internal jargon into a human journey", () => {
  const check = buildPublicCheck(run, prospect, "0123456789abcdef0123456789abcdef");
  const publicCopy = JSON.stringify({
    journey: check.journey,
    actions: check.actions,
    verdict: check.verdict,
  }).toLowerCase();

  assert.equal(check.journey.length, 3);
  assert.equal(check.actions.length, 3);
  assert.match(check.verdict.title, /SEI MEGLIO DI COME APPARI/);
  assert.equal(publicCopy.includes("gap recensioni"), false);
  assert.equal(publicCopy.includes("conversion friction"), false);
  assert.equal(publicCopy.includes("confidence"), false);
  assert.equal(publicCopy.includes("opportunity score"), false);
});

test("review comparison is framed as observed choice context, not absolute ranking", () => {
  const check = buildPublicCheck(run, prospect, "0123456789abcdef0123456789abcdef");
  assert.match(check.journey[1].body, /mediana/i);
  assert.match(check.journey[1].body, /non dice chi lavora meglio/i);
  assert.match(check.journey[1].proof ?? "", /specifica ricerca osservata/i);
  assert.match(check.claimRule, /non una dichiarazione di ranking Google assoluto/i);
});

test("activation offer is one-time and does not smuggle a subscription", () => {
  const check = buildPublicCheck(run, prospect, "0123456789abcdef0123456789abcdef", 197);
  assert.equal(check.offer.priceEur, 197);
  assert.match(check.offer.note, /Una tantum/i);
  assert.match(check.offer.note, /ricorrenti.*separati/i);
  assert.equal(check.cta.href, "/go/0123456789abcdef0123456789abcdef");
});

test("outreach message points to the generated share URL and stays conversational", () => {
  const check = buildPublicCheck(run, prospect, "0123456789abcdef0123456789abcdef");
  const url = "https://radar.example/c/0123456789abcdef0123456789abcdef";
  const message = buildOutreachMessage(check, url);
  assert.match(message, /Officina Aurora/);
  assert.match(message, /officina a Formia/i);
  assert.match(message, /meno forte/i);
  assert.equal(message.includes(url), true);
});
