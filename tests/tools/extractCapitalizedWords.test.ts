import test from "node:test";
import assert from "node:assert/strict";
import { extractCapitalizedWords } from "../../lib/tools/extractCapitalizedWords.ts";

test("extractCapitalizedWords - extracts all words starting with uppercase", () => {
  const input = "Alice Johnson visited Paris and London in July.";
  const result = extractCapitalizedWords(input, { mode: "all-capitalized" });
  assert.equal(result, "Alice\nJohnson\nParis\nLondon\nJuly");
});

test("extractCapitalizedWords - extracts only all-caps acronyms", () => {
  const input = "Delegates from UNESCO and WHO met with NASA officials at 9AM.";
  const result = extractCapitalizedWords(input, { mode: "uppercase-only" });
  assert.equal(result, "UNESCO\nWHO\nNASA");
});

test("extractCapitalizedWords - extracts consecutive capitalized proper nouns", () => {
  const input = "The New York Times reported that Dr. Alice Johnson won the Nobel Prize.";
  const result = extractCapitalizedWords(input, { mode: "consecutive" });
  const lines = result.split("\n");
  assert.ok(lines.includes("The New York Times"));
  assert.ok(lines.includes("Alice Johnson"));
  assert.ok(lines.includes("Nobel Prize"));
});

test("extractCapitalizedWords - deduplicates words correctly", () => {
  const input = "Paris, Rome, Berlin, Paris, Madrid, Rome, London";
  const result = extractCapitalizedWords(input, { deduplicate: true });
  assert.equal(result, "Paris\nRome\nBerlin\nMadrid\nLondon");
});

test("extractCapitalizedWords - respects minimum word length", () => {
  const input = "A big cat and I saw Dr. Smith.";
  const result = extractCapitalizedWords(input, { minWordLength: 3 });
  assert.equal(result, "Smith");
});

test("extractCapitalizedWords - handles empty input safely", () => {
  assert.equal(extractCapitalizedWords(""), "");
  assert.equal(extractCapitalizedWords("all lowercase words without caps"), "");
});
