import test from "node:test";
import assert from "node:assert/strict";
import { extractPhoneNumbers } from "../../lib/tools/extractPhoneNumbers.ts";

test("extractPhoneNumbers - extracts international and domestic numbers", () => {
  const input =
    "Reach us at +1 (555) 234-5678 or +44 20 7946 0912. For local inquiries call 555-0143.";
  const result = extractPhoneNumbers(input, { deduplicate: true, format: "clean" });
  const lines = result.split("\n");

  assert.equal(lines.length, 3);
  assert.ok(lines.includes("+1 (555) 234-5678"));
  assert.ok(lines.includes("+44 20 7946 0912"));
  assert.ok(lines.includes("555-0143"));
});

test("extractPhoneNumbers - extracts 1-800 toll-free numbers", () => {
  const input = "Customer support hotline: 1-800-555-0199 or 1-888-234-5678.";
  const result = extractPhoneNumbers(input, { format: "clean" });
  const lines = result.split("\n");

  assert.equal(lines.length, 2);
  assert.equal(lines[0], "1-800-555-0199");
  assert.equal(lines[1], "1-888-234-5678");
});

test("extractPhoneNumbers - deduplicates numbers regardless of format differences", () => {
  const input = "Call +1 (555) 123-4567, 1-555-123-4567, or +15551234567.";
  const result = extractPhoneNumbers(input, { deduplicate: true });
  const lines = result.split("\n");

  assert.equal(lines.length, 1);
});

test("extractPhoneNumbers - supports digits-only format", () => {
  const input = "Contact: +1 (555) 234-5678 and local 555-0199";
  const result = extractPhoneNumbers(input, { format: "digits-only" });
  const lines = result.split("\n");

  assert.equal(lines[0], "+15552345678");
  assert.equal(lines[1], "5550199");
});

test("extractPhoneNumbers - ignores years and short numeric strings", () => {
  const input = "In 2024, our sales increased by 450 units. Order ID: #1092. Direct phone: 555-0143.";
  const result = extractPhoneNumbers(input);
  const lines = result.split("\n");

  assert.equal(lines.length, 1);
  assert.equal(lines[0], "555-0143");
});

test("extractPhoneNumbers - handles empty and whitespace input safely", () => {
  assert.equal(extractPhoneNumbers(""), "");
  assert.equal(extractPhoneNumbers("No numbers here at all!"), "");
});
