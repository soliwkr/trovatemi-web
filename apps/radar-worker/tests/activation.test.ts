import assert from "node:assert/strict";
import test from "node:test";
import { normalizeActivationInput } from "../src/worker/climbo.ts";

test("activation identity is normalized before checkout", () => {
  const input = normalizeActivationInput({
    ownerName: "  Mario   Rossi ",
    email: " MARIO@OFFICINA.IT ",
  });
  assert.equal(input.ownerName, "Mario Rossi");
  assert.equal(input.email, "mario@officina.it");
});

test("activation rejects unusable identity data", () => {
  assert.throws(() => normalizeActivationInput({ ownerName: "M", email: "mario@officina.it" }), /invalid_owner_name/);
  assert.throws(() => normalizeActivationInput({ ownerName: "Mario Rossi", email: "not-an-email" }), /invalid_email/);
});
