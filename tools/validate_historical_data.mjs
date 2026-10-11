#!/usr/bin/env node

import fs from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node tools/validate_historical_data.mjs <json-file>");
  process.exit(2);
}

const dataset = JSON.parse(fs.readFileSync(file, "utf8"));
const fail = (message) => {
  console.error(`Validation failed: ${message}`);
  process.exit(1);
};

if (dataset.datasetId !== "medications-ukw-historical") fail("unexpected datasetId");
if (dataset.dataVersion !== "0.1.0-historisch") fail("unexpected dataVersion");
if (dataset.reviewStatus !== "UNGEPRÜFT_HISTORISCH") fail("dataset is not marked historical/unreviewed");
if (dataset.usageStatus !== "historische Referenz") fail("unexpected usageStatus");
if (dataset.importPolicy?.mode !== "read-only") fail("importer is not read-only");
if (dataset.importPolicy?.calculatesMedicalValues !== false) fail("medical calculations are enabled");
if (dataset.importPolicy?.fillsMissingFields !== false) fail("missing-field filling is enabled");
if (dataset.importPolicy?.clinicalValidation !== false) fail("clinical validation is implied");
if (dataset.sourceDocument?.id !== "source-ukw-infusomaten-aufziehstandard-2020-12") fail("source id mismatch");
if (!Array.isArray(dataset.entries) || dataset.entries.length !== 51) fail("expected exactly 51 entries");

const required = [
  "id",
  "activeIngredient",
  "strengthForm",
  "category",
  "preparationText",
  "finalConcentration",
  "infusionDurationOrRate",
  "stabilityText",
  "sourceId",
  "sourceVersion",
  "reviewStatus",
  "searchTerms",
];

const ids = new Set();
for (const [position, entry] of dataset.entries.entries()) {
  for (const field of required) {
    if (!(field in entry)) fail(`entry ${position + 1} is missing ${field}`);
  }
  if (ids.has(entry.id)) fail(`duplicate id ${entry.id}`);
  ids.add(entry.id);
  if (entry.reviewStatus !== "UNGEPRÜFT_HISTORISCH") fail(`entry ${entry.id} is not historical/unreviewed`);
  if (entry.sourceId !== dataset.sourceDocument.id) fail(`entry ${entry.id} has a different source`);
  if (!Array.isArray(entry.searchTerms)) fail(`entry ${entry.id} searchTerms is not an array`);
  if (entry.diluent !== null) fail(`entry ${entry.id} inferred a diluent`);
}

const categories = Object.groupBy(dataset.entries, (entry) => entry.category);
const expectedCategories = {
  Antiinfektiva: 41,
  Sonstige: 7,
  Antiarrhythmika: 1,
  Elektrolyte: 1,
  Inodilatoren: 1,
};
for (const [category, count] of Object.entries(expectedCategories)) {
  if ((categories[category] ?? []).length !== count) fail(`category ${category} count mismatch`);
}

console.log(`Validated ${dataset.entries.length} historical medication entries.`);
