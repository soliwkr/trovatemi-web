import assert from "node:assert/strict";
import test from "node:test";

/**
 * Contract regression for the Durable Object route shape.
 *
 * The generic public-check storage route MUST only match /shares/:token.
 * If it also matches /shares/:token/activation, saving an activation draft
 * overwrites the PublicCheck and the shared link later crashes.
 */
function genericShareRoute(parts: string[]) {
  return parts[0] === "shares" && Boolean(parts[1]) && parts.length === 2;
}

test("generic share route does not capture activation or stats subresources", () => {
  assert.equal(genericShareRoute(["shares", "abc"]), true);
  assert.equal(genericShareRoute(["shares", "abc", "activation"]), false);
  assert.equal(genericShareRoute(["shares", "abc", "stats"]), false);
  assert.equal(genericShareRoute(["shares", "abc", "events", "view"]), false);
});
