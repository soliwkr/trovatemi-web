import assert from "node:assert/strict";
import test from "node:test";
import { searchPlaceIds } from "../src/worker/registry-discovery.ts";

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
