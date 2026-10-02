import assert from "node:assert/strict";
import test from "node:test";
import { buildRuleOpportunities } from "../src/worker/opportunities.ts";
import type { ProspectResult, RadarRun } from "../src/worker/types.ts";

function makeProspect(overrides: Partial<ProspectResult> = {}): ProspectResult {
  return {
    id: "place-1",
    name: "Barber Demo",
    address: "Via Demo 1, Formia",
    category: "Barbiere",
    rating: 4.7,
    reviews: 32,
    website: "https://example.com",
    phone: "+390771000000",
    googleMapsUri: "https://maps.google.com/demo",
    positionSignal: 6,
    status: "ok",
    observedAt: "2026-10-02T12:00:00Z",
    email: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    bookingUrl: null,
    sourceConfidence: 0.92,
    eligible: true,
    eligibilityReason: "ok",
    score: 78,
    band: "priority",
    components: [],
    evidence: [],
    checkBrief: {
      headline: "demo",
      publicScoreAllowed: false,
      query: "barbiere Formia",
      threeThingsToShow: [],
      claimRule: "observed only",
    },
    ...overrides,
  };
}

function makeRun(prospect: ProspectResult, overrides: Partial<RadarRun> = {}): RadarRun {
  return {
    id: "run-1",
    category: "barbiere",
    city: "Formia",
    query: "barbiere Formia",
    createdAt: "2026-10-02T12:00:00Z",
    source: "google_places",
    medianReviews: 180,
    medianRating: 4.6,
    prospects: [prospect],
    ...overrides,
  };
}

test("review gap becomes a concrete first opportunity", () => {
  const prospect = makeProspect();
  const opportunities = buildRuleOpportunities(makeRun(prospect), prospect);

  assert.equal(opportunities[0].type, "review_acquisition");
  assert.equal(opportunities[0].actionType, "start_review_campaign");
  assert.match(opportunities[0].reason, /32 recensioni/);
  assert.ok(opportunities.length <= 3);
});

test("healthy review proof does not invent a review gap", () => {
  const prospect = makeProspect({ reviews: 220, positionSignal: 2, whatsapp: "https://wa.me/390771000000" });
  const opportunities = buildRuleOpportunities(makeRun(prospect, { medianReviews: 180 }), prospect);

  assert.equal(opportunities.some((item) => item.type === "review_acquisition"), false);
  assert.equal(opportunities.some((item) => item.type === "profile_proof"), true);
});

test("missing website creates a high priority contact opportunity", () => {
  const prospect = makeProspect({ website: null, status: "missing", reviews: 200, positionSignal: 2 });
  const opportunities = buildRuleOpportunities(makeRun(prospect, { medianReviews: 180 }), prospect);

  const contact = opportunities.find((item) => item.type === "contact_friction");
  assert.ok(contact);
  assert.equal(contact.severity, "high");
  assert.equal(contact.actionType, "fix_contact_path");
});
