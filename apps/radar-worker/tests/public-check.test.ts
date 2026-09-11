import assert from "node:assert/strict";
import test from "node:test";
import { buildPublicCheck } from "../src/worker/share.ts";
import { renderPublicCheck } from "../src/worker/public-check.ts";
import type { ProspectResult, RadarRun } from "../src/worker/types.ts";

const prospect: ProspectResult = {
  id: "place-1",
  name: "Officina <Aurora>",
  address: "Via Demo 1, Formia",
  category: "Meccanico",
  rating: 4.7,
  reviews: 24,
  website: null,
  phone: "+390771000000",
  googleMapsUri: null,
  positionSignal: 3,
  status: "missing",
  observedAt: "2026-09-11T12:00:00Z",
  email: null,
  instagram: null,
  facebook: null,
  whatsapp: null,
  bookingUrl: null,
  sourceConfidence: 0.9,
  eligible: true,
  eligibilityReason: "ok",
  score: 80,
  band: "priority",
  components: [],
  evidence: ["Google Places: rating 4.7", "Google Places: 24 recensioni"],
  checkBrief: {
    headline: "Ti ho cercato come ti cercherebbe un cliente.",
    publicScoreAllowed: false,
    query: "officina Formia",
    threeThingsToShow: [],
    claimRule: "internal",
  },
};

const run: RadarRun = {
  id: "run-1",
  category: "officina",
  city: "Formia",
  query: "officina Formia",
  createdAt: "2026-09-11T12:00:00Z",
  source: "google_places",
  medianReviews: 80,
  medianRating: 4.6,
  prospects: [prospect],
};

test("server-rendered check contains the full customer story without JavaScript", () => {
  const check = buildPublicCheck(run, prospect, "0123456789abcdef0123456789abcdef", 197);
  const html = renderPublicCheck(check);

  assert.match(html, /data-trovatemi-check=/);
  assert.match(html, /IL CLIENTE NON LEGGE IL TUO/);
  assert.match(html, /TRE COSE/);
  assert.match(html, /Sistemamelo/);
  assert.match(html, /€197/);
  assert.equal(html.includes('<div id="root"></div>'), false);
  assert.equal(html.includes("<script"), false);
});

test("server-rendered check exposes only boolean contactability, not the phone number", () => {
  const check = buildPublicCheck(run, prospect, "0123456789abcdef0123456789abcdef", 197);
  const html = renderPublicCheck(check);

  assert.match(html, /Telefono/);
  assert.equal(html.includes("+390771000000"), false);
});

test("server-rendered check escapes business-controlled text", () => {
  const check = buildPublicCheck(run, prospect, "0123456789abcdef0123456789abcdef", 197);
  const html = renderPublicCheck(check);

  assert.equal(html.includes("Officina <Aurora>"), false);
  assert.match(html, /Officina &lt;Aurora&gt;/);
});
