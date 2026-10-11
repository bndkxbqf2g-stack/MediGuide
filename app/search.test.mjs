import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { filterMedications, normalizeText } from "./search.js";

const dataset = JSON.parse(
  fs.readFileSync(new URL("../data/medications-historical.v0.1.0.json", import.meta.url), "utf8")
);

test("normalizes umlauts and case for mobile search", () => {
  assert.equal(normalizeText("ÄÖÜ Cisplatin"), "aou cisplatin");
});

test("returns all historical entries for an empty query", () => {
  assert.equal(filterMedications(dataset.entries, "").length, 51);
});

test("finds entries by active ingredient and trade name", () => {
  assert.ok(filterMedications(dataset.entries, "aciclovir").length >= 1);
  assert.ok(filterMedications(dataset.entries, "AmBisome").length >= 1);
});

test("does not index preparation free text as a search synonym", () => {
  assert.equal(filterMedications(dataset.entries, "NaCl").length, 0);
});

test("keeps the historical status visible in every result", () => {
  assert.ok(filterMedications(dataset.entries, "Caspofungin").every((entry) => entry.reviewStatus === "UNGEPRÜFT_HISTORISCH"));
});
