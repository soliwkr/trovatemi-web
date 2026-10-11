import assert from "node:assert/strict";
import test from "node:test";
import { FORMIA_OVERPASS_QUERY, searchOsmCandidates, searchPlaceIds } from "../src/worker/registry-discovery.ts";

test("IDs-only discovery requests only places.id", async () => {
  let seenUrl = "";
  let seenInit: RequestInit | undefined;

  const fakeFetch: typeof fetch = async (input, init) => {
    seenUrl = String(input);
    seenInit = init;
    return new Response(JSON.stringify({
      places: [{ id: "place-a" }, { id: "place-a" }, { id: "place-b" }],
    }), { status: 200, headers: { "content-type": "application/json" } });
  };

  const ids = await searchPlaceIds("test-key", "bar Formia", 50, fakeFetch);

  assert.equal(seenUrl, "https://places.googleapis.com/v1/places:searchText");
  assert.equal(seenInit?.method, "POST");
  const headers = new Headers(seenInit?.headers);
  assert.equal(headers.get("X-Goog-FieldMask"), "places.id");
  assert.equal(headers.get("X-Goog-Api-Key"), "test-key");
  assert.ok(!headers.get("X-Goog-FieldMask")?.includes("displayName"));
  assert.ok(!headers.get("X-Goog-FieldMask")?.includes("rating"));
  assert.ok(!headers.get("X-Goog-FieldMask")?.includes("nationalPhoneNumber"));

  const body = JSON.parse(String(seenInit?.body));
  assert.equal(body.textQuery, "bar Formia");
  assert.equal(body.languageCode, "it");
  assert.equal(body.regionCode, "IT");
  assert.equal(body.pageSize, 20);
  assert.deepEqual(ids, ["place-a", "place-b"]);
});

test("IDs-only discovery fails closed on provider error", async () => {
  const fakeFetch: typeof fetch = async () => new Response("no", { status: 429 });
  await assert.rejects(
    () => searchPlaceIds("test-key", "bar Formia", 10, fakeFetch),
    /places_ids_only_429/,
  );
});


test("OSM discovery uses one fixed Formia Overpass query and preserves provenance", async () => {
  let seenUrl = "";
  let seenInit: RequestInit | undefined;

  const fakeFetch: typeof fetch = async (input, init) => {
    seenUrl = String(input);
    seenInit = init;
    return new Response(JSON.stringify({
      elements: [
        {
          type: "node",
          id: 101,
          lat: 41.25,
          lon: 13.61,
          tags: { name: "Bar Uno", amenity: "cafe" },
        },
        {
          type: "way",
          id: 202,
          center: { lat: 41.26, lon: 13.62 },
          tags: { name: "Hotel Due", tourism: "hotel" },
        },
        {
          type: "relation",
          id: 303,
          center: { lat: 41.27, lon: 13.63 },
          tags: { name: "Negozio Tre", shop: "clothes" },
        },
        {
          type: "node",
          id: 404,
          lat: 41.28,
          lon: 13.64,
          tags: { amenity: "restaurant" },
        },
      ],
    }), { status: 200, headers: { "content-type": "application/json" } });
  };

  const rows = await searchOsmCandidates(fakeFetch);

  assert.equal(seenUrl, "https://overpass-api.de/api/interpreter");
  assert.equal(seenInit?.method, "POST");
  const headers = new Headers(seenInit?.headers);
  assert.match(headers.get("content-type") || "", /application\/x-www-form-urlencoded/);

  const params = new URLSearchParams(String(seenInit?.body));
  assert.equal(params.get("data"), FORMIA_OVERPASS_QUERY);
  assert.match(FORMIA_OVERPASS_QUERY, /name"="Formia/);
  assert.match(FORMIA_OVERPASS_QUERY, /out center 120/);

  assert.equal(rows.length, 3);
  assert.deepEqual(rows.map((x) => x.identity), ["node/101", "way/202", "relation/303"]);
  assert.equal(rows[0].name, "Bar Uno");
  assert.equal(rows[0].category, "amenity:cafe");
  assert.equal(rows[1].category, "tourism:hotel");
  assert.equal(rows[1].lat, 41.26);
  assert.equal(rows[2].sourceUrl, "https://www.openstreetmap.org/relation/303");
  assert.match(rows[2].licenseRef, /ODbL-1\.0/);
  assert.match(rows[2].licenseRef, /OpenStreetMap contributors/);
});

test("OSM discovery fails closed on provider error", async () => {
  const fakeFetch: typeof fetch = async () => new Response("busy", { status: 429 });
  await assert.rejects(
    () => searchOsmCandidates(fakeFetch),
    /overpass_429/,
  );
});
