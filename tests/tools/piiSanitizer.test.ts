import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizePii,
  restorePii,
} from "../../lib/tools/piiSanitizer.ts";

test("sanitizePii - detects emails, phone numbers, and IP addresses", () => {
  const input =
    "Contact Sarah Connor at sarah.connor@sky.net or call +1 (555) 019-2834. Server host is 192.168.1.105.";
  const result = sanitizePii(input);

  assert.equal(result.counts.email, 1);
  assert.equal(result.counts.phone, 1);
  assert.equal(result.counts.ip, 1);
  assert.ok(result.sanitizedText.includes("[EMAIL_1]"));
  assert.ok(result.sanitizedText.includes("[PHONE_1]"));
  assert.ok(result.sanitizedText.includes("[IP_ADDRESS_1]"));
  assert.ok(!result.sanitizedText.includes("sarah.connor@sky.net"));
  assert.ok(!result.sanitizedText.includes("+1 (555) 019-2834"));
  assert.ok(!result.sanitizedText.includes("192.168.1.105"));
});

test("sanitizePii - detects API keys and secrets", () => {
  const input =
    "My AWS key is AKIAIOSFODNN7EXAMPLE and auth token is api_key: 'sk_live_9876543210abcdef'.";
  const result = sanitizePii(input);

  assert.ok(result.counts.apiKey >= 2);
  assert.ok(result.sanitizedText.includes("[API_KEY_1]"));
  assert.ok(!result.sanitizedText.includes("AKIAIOSFODNN7EXAMPLE"));
  assert.ok(!result.sanitizedText.includes("sk_live_9876543210abcdef"));
});

test("sanitizePii - validates credit cards using Luhn algorithm", () => {
  // 4532015112830366 is a valid Luhn Visa test number
  // 4532015112830367 has invalid checksum
  const input =
    "Valid card: 4532-0151-1283-0366 and invalid card: 4532-0151-1283-0367.";
  const result = sanitizePii(input);

  assert.equal(result.counts.creditCard, 1);
  assert.ok(result.sanitizedText.includes("[CREDIT_CARD_1]"));
  assert.ok(!result.sanitizedText.includes("4532-0151-1283-0366"));
  assert.ok(result.sanitizedText.includes("4532-0151-1283-0367"));
});

test("sanitizePii - detects personal names with titles and labels", () => {
  const input = "Doctor in charge is Dr. Gregory House. Patient: Johnathan Davis.";
  const result = sanitizePii(input);

  assert.equal(result.counts.name, 2);
  assert.ok(result.sanitizedText.includes("[NAME_1]"));
  assert.ok(result.sanitizedText.includes("[NAME_2]"));
  assert.ok(!result.sanitizedText.includes("Gregory House"));
  assert.ok(!result.sanitizedText.includes("Johnathan Davis"));
});

test("restorePii - accurately restores AI response with original values", () => {
  const input =
    "Please send the contract to alex.turner@arctic.com and call +1 555-0123.";
  const sanitized = sanitizePii(input);

  // Simulated AI response retaining tokens
  const aiResponse =
    "I have drafted the legal contract for [EMAIL_1]. You can confirm via telephone at [PHONE_1].";

  const restored = restorePii(aiResponse, sanitized.mapping);

  assert.equal(
    restored,
    "I have drafted the legal contract for alex.turner@arctic.com. You can confirm via telephone at +1 555-0123."
  );
});

test("sanitizePii - supports irreversible redaction mode", () => {
  const input = "Confidential report for user@domain.com and call 555-0199.";
  const result = sanitizePii(input, {
    mode: "redacted",
    customMask: "████████",
  });

  assert.ok(result.sanitizedText.includes("████████"));
  assert.equal(Object.keys(result.mapping).length, 0);
});

test("sanitizePii & restorePii - Zero-Network security audit", async () => {
  let networkCallAttempted = false;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => {
    networkCallAttempted = true;
    throw new Error("Zero-network privacy violation: fetch called!");
  }) as unknown as typeof fetch;

  try {
    const input =
      "Sensitive prompt with admin@company.org, IP 10.0.0.1, and key AKIA1111222233334444.";
    const sanitized = sanitizePii(input);
    const restored = restorePii(sanitized.sanitizedText, sanitized.mapping);

    assert.equal(networkCallAttempted, false);
    assert.ok(restored.includes("admin@company.org"));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("sanitizePii - handles 100KB+ large input within 200ms", () => {
  const sample =
    "User email: client_99@testcorp.io, phone: +1-555-0144, server: 172.16.0.45. ";
  const largeInput = sample.repeat(1500); // ~110KB

  const start = performance.now();
  const result = sanitizePii(largeInput);
  const elapsed = performance.now() - start;

  assert.ok(result.totalCount > 0);
  assert.ok(
    elapsed < 200,
    `Processing took ${elapsed.toFixed(1)}ms, expected < 200ms`
  );
});

test("sanitizePii - handles empty and whitespace input safely", () => {
  const res1 = sanitizePii("");
  assert.equal(res1.sanitizedText, "");
  assert.equal(res1.totalCount, 0);

  const res2 = sanitizePii("   \n\t  ");
  assert.equal(res2.sanitizedText, "   \n\t  ");
  assert.equal(res2.totalCount, 0);
});
