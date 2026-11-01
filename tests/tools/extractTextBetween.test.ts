import test from "node:test";
import assert from "node:assert/strict";
import { extractTextBetween } from "../../lib/tools/extractTextBetween.ts";

test("extractTextBetween - extracts double quoted substrings", () => {
  const input = 'Alice said "hello" to "Bob" on "Friday".';
  const result = extractTextBetween(input, { startDelimiter: '"', endDelimiter: '"' });
  assert.equal(result, "hello\nBob\nFriday");
});

test("extractTextBetween - extracts single quoted substrings", () => {
  const input = "SELECT * FROM users WHERE status = 'active' AND role = 'admin'";
  const result = extractTextBetween(input, { startDelimiter: "'", endDelimiter: "'" });
  assert.equal(result, "active\nadmin");
});

test("extractTextBetween - extracts parentheses content", () => {
  const input = "Point A (10, 20) and Point B (30, 40)";
  const result = extractTextBetween(input, { startDelimiter: "(", endDelimiter: ")" });
  assert.equal(result, "10, 20\n30, 40");
});

test("extractTextBetween - includes delimiters when requested", () => {
  const input = "Status: [OK] Code: [200]";
  const result = extractTextBetween(input, {
    startDelimiter: "[",
    endDelimiter: "]",
    includeDelimiters: true,
  });
  assert.equal(result, "[OK]\n[200]");
});

test("extractTextBetween - supports custom tags and deduplication", () => {
  const input = "<b>bold1</b> and <i>italic</i> and <b>bold1</b> and <b>bold2</b>";
  const result = extractTextBetween(input, {
    startDelimiter: "<b>",
    endDelimiter: "</b>",
    deduplicate: true,
  });
  assert.equal(result, "bold1\nbold2");
});

test("extractTextBetween - handles empty input safely", () => {
  assert.equal(extractTextBetween(""), "");
  assert.equal(extractTextBetween("No quotes here", { startDelimiter: '"', endDelimiter: '"' }), "");
});
