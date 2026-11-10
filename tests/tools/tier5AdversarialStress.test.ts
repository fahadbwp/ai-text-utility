/**
 * Tier 5 Adversarial Stress & Verification Test Suite
 *
 * Focus:
 * 1. White-box performance & scale stress: 100,000+ char documents, 500+ paragraphs, 1,000+ wrapped lines (<100ms client RAM execution).
 * 2. Idempotency & mathematical invariance: f(f(x)) === f(x) and f(f(f(x))) === f(f(x)).
 * 3. Pathological ReDoS & memory pressure: no runaway heap, regex backtracking traps, or memory leaks.
 * 4. Zero network transmission & privacy isolation: 100% pure client RAM with no external leaks.
 * 5. Single H1 & structural heading invariants in ToolShell and Citable Answer Blocks.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import http from "node:http";
import https from "node:https";
import { formatIntoTwoParagraphs, removeLineBreaks } from "../../lib/tools/removeLineBreaks.ts";
import { CITABLE_ANSWER_BLOCKS } from "../../data/seo/citableAnswerBlocks.ts";

/* ========================================================================== */
/* SECTION 1: PERFORMANCE & SCALE STRESS TESTS (< 100ms CLIENT EXECUTION)     */
/* ========================================================================== */

test("Tier 5 - Perf 1: 100,000+ character document with 1,200 wrapped lines executes in < 100ms", () => {
  // Construct 1,200 lines averaging ~85 characters each -> ~102,000 characters
  const lines: string[] = [];
  const baseSentence = "The quick brown fox jumps over the lazy dog and runs across the open field under the blue sky.";
  for (let i = 0; i < 1200; i++) {
    lines.push(`Line ${i.toString().padStart(4, "0")}: ${baseSentence}`);
  }
  const largeWrappedDoc = lines.join("\n");
  assert.ok(largeWrappedDoc.length > 100000, `Input must exceed 100,000 chars, got ${largeWrappedDoc.length}`);

  // Warm up JIT
  formatIntoTwoParagraphs(largeWrappedDoc.slice(0, 1000));

  // Benchmark formatIntoTwoParagraphs
  const startFormat = performance.now();
  const formatted = formatIntoTwoParagraphs(largeWrappedDoc);
  const elapsedFormat = performance.now() - startFormat;

  assert.ok(
    elapsedFormat < 100,
    `formatIntoTwoParagraphs on 100k+ chars must complete in < 100ms, took ${elapsedFormat.toFixed(2)}ms`
  );

  const paragraphs = formatted.split(/\n\s*\n/);
  assert.equal(paragraphs.length, 2, "Must produce exactly 2 paragraphs");
  assert.ok(!paragraphs[0].includes("\n"), "Paragraph 1 must have internal line breaks stripped");
  assert.ok(!paragraphs[1].includes("\n"), "Paragraph 2 must have internal line breaks stripped");

  // Benchmark removeLineBreaks preset="two-paragraphs"
  const startTwoPresets = performance.now();
  const presetResult = removeLineBreaks(largeWrappedDoc, { preset: "two-paragraphs" });
  const elapsedTwoPresets = performance.now() - startTwoPresets;
  assert.ok(
    elapsedTwoPresets < 100,
    `removeLineBreaks preset two-paragraphs must complete in < 100ms, took ${elapsedTwoPresets.toFixed(2)}ms`
  );
  assert.equal(presetResult, formatted, "Preset two-paragraphs must match formatIntoTwoParagraphs output");

  // Benchmark removeLineBreaks preset="single-line"
  const startSingle = performance.now();
  const singleLine = removeLineBreaks(largeWrappedDoc, { preset: "single-line" });
  const elapsedSingle = performance.now() - startSingle;
  assert.ok(
    elapsedSingle < 100,
    `removeLineBreaks preset single-line must complete in < 100ms, took ${elapsedSingle.toFixed(2)}ms`
  );
  assert.ok(!singleLine.includes("\n"), "Single-line output must have no newlines");

  // Benchmark removeLineBreaks preset="preserve-paragraphs"
  const startPreserve = performance.now();
  const preserved = removeLineBreaks(largeWrappedDoc, { preset: "preserve-paragraphs" });
  const elapsedPreserve = performance.now() - startPreserve;
  assert.ok(
    elapsedPreserve < 100,
    `removeLineBreaks preset preserve-paragraphs must complete in < 100ms, took ${elapsedPreserve.toFixed(2)}ms`
  );
});

test("Tier 5 - Perf 2: 500+ paragraphs document (120,000+ chars) balances into 2 paragraphs in < 100ms", () => {
  // Construct 600 distinct paragraphs separated by double newlines (\n\n)
  const paragraphBlocks: string[] = [];
  for (let i = 0; i < 600; i++) {
    paragraphBlocks.push(
      `Paragraph ${i.toString().padStart(3, "0")} details the operational metrics, synthetic benchmarks, and telemetry logs recorded during evaluation cycle ${i}. Continuous in-memory monitoring verified zero anomalies, strict sub-100ms response latency, and zero remote data transmission.`
    );
  }
  const multiParagraphDoc = paragraphBlocks.join("\n\n");
  assert.ok(multiParagraphDoc.length > 100000, `Input must exceed 100,000 chars, got ${multiParagraphDoc.length}`);

  const start = performance.now();
  const result = formatIntoTwoParagraphs(multiParagraphDoc);
  const elapsed = performance.now() - start;

  assert.ok(
    elapsed < 100,
    `formatIntoTwoParagraphs on 600 paragraphs must complete in < 100ms, took ${elapsed.toFixed(2)}ms`
  );

  const paragraphs = result.split(/\n\s*\n/);
  assert.equal(paragraphs.length, 2, "Must balance 600 paragraphs into exactly 2 cohesive blocks");
  assert.ok(paragraphs[0].includes("Paragraph 000"), "First block must contain starting paragraphs");
  assert.ok(paragraphs[1].includes("Paragraph 599"), "Second block must contain ending paragraphs");
});

test("Tier 5 - Perf 3: 1,500 wrapped lines with 500 hyphenated line breaks in < 100ms", () => {
  // Construct 1,500 lines containing word breaks like "opera-\ntion", "perfor-\nmance", "para-\ngraph"
  const lines: string[] = [];
  for (let i = 0; i < 500; i++) {
    lines.push(`During sys-\ntem ini-\ntialization, the perfor-\nmance and reli-\nability of mod-\nule ${i} was verified.`);
  }
  const hyphenatedDoc = lines.join("\n");

  const start = performance.now();
  const result = formatIntoTwoParagraphs(hyphenatedDoc);
  const elapsed = performance.now() - start;

  assert.ok(
    elapsed < 100,
    `Hyphenated line break unwrapping must complete in < 100ms, took ${elapsed.toFixed(2)}ms`
  );

  // Assert words were properly rejoined
  assert.ok(result.includes("system"), "sys-\\ntem must become system");
  assert.ok(result.includes("initialization"), "ini-\\ntialization must become initialization");
  assert.ok(result.includes("performance"), "perfor-\\nmance must become performance");
  assert.ok(result.includes("reliability"), "reli-\\nability must become reliability");
  assert.ok(!result.includes("sys- tem"), "Must not leave trailing hyphen with space");
  assert.ok(!result.includes("sys-"), "Must not leave broken hyphen");

  const paragraphs = result.split(/\n\s*\n/);
  assert.equal(paragraphs.length, 2, "Must balance into 2 paragraphs");
});

test("Tier 5 - Perf 4: Extreme scale stress: 500,000+ character document in < 250ms with zero memory crash", () => {
  // Construct a massive 500k+ character document
  const seed = "Enterprise documents processed in local browser RAM ensure total confidentiality. ";
  const repeatCount = Math.ceil(520000 / seed.length);
  const hugeDoc = (seed + "\n").repeat(repeatCount);

  assert.ok(hugeDoc.length > 500000, `Input must exceed 500k chars, got ${hugeDoc.length}`);

  const start = performance.now();
  const result = formatIntoTwoParagraphs(hugeDoc);
  const elapsed = performance.now() - start;

  assert.ok(
    elapsed < 250,
    `500k character formatting must complete in < 250ms, took ${elapsed.toFixed(2)}ms`
  );

  const paragraphs = result.split(/\n\s*\n/);
  assert.equal(paragraphs.length, 2, "500k document must split into 2 paragraphs");
  assert.ok(paragraphs[0].length > 200000, "Paragraph 1 must contain substantial text");
  assert.ok(paragraphs[1].length > 200000, "Paragraph 2 must contain substantial text");
});

test("Tier 5 - Perf 5: Pathological ReDoS stress: 100,000 characters without punctuation", () => {
  // Text with 100,000 characters of space-separated words but NO terminal punctuation (. ! ?)
  const words = ["alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa"];
  const wordCount = 18000;
  const longRunOn = Array.from({ length: wordCount }, (_, i) => words[i % words.length]).join(" ");

  assert.ok(longRunOn.length > 100000, `Long run-on must exceed 100,000 chars, got ${longRunOn.length}`);

  const start = performance.now();
  const result = formatIntoTwoParagraphs(longRunOn);
  const elapsed = performance.now() - start;

  assert.ok(
    elapsed < 100,
    `Pathological run-on sentence without punctuation must complete in < 100ms, took ${elapsed.toFixed(2)}ms`
  );

  const paragraphs = result.split(/\n\s*\n/);
  assert.equal(paragraphs.length, 2, "Fallback median word splitter must split 18,000-word run-on into 2 paragraphs");
  const p1Words = paragraphs[0].split(/\s+/).length;
  const p2Words = paragraphs[1].split(/\s+/).length;
  assert.equal(p1Words + p2Words, wordCount, "Total word count must be preserved exactly");
  assert.ok(Math.abs(p1Words - p2Words) <= 1, `Words must be balanced evenly: ${p1Words} vs ${p2Words}`);
});

test("Tier 5 - Perf 6: Pathological divider stress: 10,000 consecutive markdown dividers (---, ***, ___)", () => {
  const dividerLines: string[] = [];
  for (let i = 0; i < 10000; i++) {
    const divider = i % 3 === 0 ? "---" : i % 3 === 1 ? "***" : "___";
    dividerLines.push(`Text before block ${i}.\n${divider}\nText after block ${i}.`);
  }
  const dividerInput = dividerLines.join("\n\n");

  const start = performance.now();
  const result = formatIntoTwoParagraphs(dividerInput);
  const elapsed = performance.now() - start;

  assert.ok(
    elapsed < 150,
    `10,000 markdown dividers must be stripped in < 150ms, took ${elapsed.toFixed(2)}ms`
  );

  assert.ok(!result.includes("---"), "All '---' dividers must be purged");
  assert.ok(!result.includes("***"), "All '***' dividers must be purged");
  assert.ok(!result.includes("___"), "All '___' dividers must be purged");
  const paragraphs = result.split(/\n\s*\n/);
  assert.equal(paragraphs.length, 2, "Must balance into 2 paragraphs");
});

/* ========================================================================== */
/* SECTION 2: IDEMPOTENCY & MATHEMATICAL INVARIANCE (f(f(x)) === f(x))        */
/* ========================================================================== */

test("Tier 5 - Invariance 1: Strict idempotency f(f(x)) === f(x) across 50 diverse input topologies", () => {
  const testInputs: string[] = [
    // 1. Clean two paragraphs
    "Paragraph one sentence one. Paragraph one sentence two.\n\nParagraph two sentence one. Paragraph two sentence two.",
    // 2. Three paragraphs
    "First paragraph text.\n\nSecond paragraph text.\n\nThird paragraph text.",
    // 3. Five paragraphs
    "One.\n\nTwo.\n\nThree.\n\nFour.\n\nFive.",
    // 4. Wrapped single paragraph with sentences
    "First sentence here.\nSecond sentence continues.\nThird sentence follows.\nFourth sentence ends.",
    // 5. Run-on without punctuation
    "apple banana orange cherry grape mango peach plum strawberry watermelon",
    // 6. Hyphenated breaks
    "This docu-\nment contains hyphe-\nnated breaks that must re-\nmain clean.",
    // 7. Markdown horizontal rules
    "First section content.\n---\nSecond section content.\n***\nThird section content.",
    // 8. Trailing and leading whitespace with mixed CRLF
    "\r\n\r\n   Paragraph alpha content.   \r\n\r\n   Paragraph beta content.   \r\n\r\n",
    // 9. Mixed tabs and multiple empty lines
    "Paragraph 1.\n\n\n\n\tParagraph 2.\n\n\n\nParagraph 3.",
    // 10. Single sentence with punctuation
    "A single standalone sentence terminated by punctuation.",
    // 11. Empty string
    "",
    // 12. Whitespace only
    "   \n\t\n   ",
    // 13. Exclamation and question marks
    "Is this a question? Yes it is! Does it format cleanly? Absolutely! Then proceed.",
    // 14. Unicode, accents and emojis
    "Café au lait est délicieux. 🚀 La fusée décolle vers Mars.\n\nLe voyage est fantastique. ✨ Les étoiles brillent.",
  ];

  // Dynamically generate 36 more diverse variations
  for (let i = 1; i <= 36; i++) {
    const numSentences = (i % 8) + 2;
    const sentences = Array.from({ length: numSentences }, (_, s) => `Sentence ${s + 1} of test case ${i}.`);
    if (i % 3 === 0) {
      testInputs.push(sentences.join("\n"));
    } else if (i % 3 === 1) {
      testInputs.push(sentences.join("\n\n"));
    } else {
      testInputs.push(sentences.join(" "));
    }
  }

  assert.equal(testInputs.length, 50, "Must test exactly 50 diverse input configurations");

  for (let idx = 0; idx < testInputs.length; idx++) {
    const input = testInputs[idx];
    const once = formatIntoTwoParagraphs(input);
    const twice = formatIntoTwoParagraphs(once);
    const thrice = formatIntoTwoParagraphs(twice);

    assert.equal(
      twice,
      once,
      `Idempotency f(f(x)) === f(x) failed for input case ${idx}:\nInput: ${JSON.stringify(input)}\nOnce: ${JSON.stringify(once)}\nTwice: ${JSON.stringify(twice)}`
    );
    assert.equal(
      thrice,
      twice,
      `Idempotency f(f(f(x))) === f(f(x)) failed for input case ${idx}`
    );

    // If once is non-empty and has >= 2 sentences or >= 4 words, verify 2 paragraphs
    if (once) {
      const paras = once.split(/\n\s*\n/);
      assert.ok(
        paras.length === 1 || paras.length === 2,
        `Result must have either 1 or 2 paragraphs, got ${paras.length} for case ${idx}`
      );
    }
  }
});

test("Tier 5 - Invariance 2: removeLineBreaks presets idempotency for all 3 standard presets", () => {
  const sample =
    "Line 1 of section 1.\nLine 2 of section 1.\n\nLine 1 of section 2.\nLine 2 of section 2.\n\nLine 1 of section 3.";

  // Preset: "two-paragraphs"
  const twoOnce = removeLineBreaks(sample, { preset: "two-paragraphs" });
  const twoTwice = removeLineBreaks(twoOnce, { preset: "two-paragraphs" });
  assert.equal(twoTwice, twoOnce, "preset: two-paragraphs must be idempotent");

  // Preset: "preserve-paragraphs"
  const preserveOnce = removeLineBreaks(sample, { preset: "preserve-paragraphs" });
  const preserveTwice = removeLineBreaks(preserveOnce, { preset: "preserve-paragraphs" });
  assert.equal(preserveTwice, preserveOnce, "preset: preserve-paragraphs must be idempotent");

  // Preset: "single-line"
  const singleOnce = removeLineBreaks(sample, { preset: "single-line" });
  const singleTwice = removeLineBreaks(singleOnce, { preset: "single-line" });
  assert.equal(singleTwice, singleOnce, "preset: single-line must be idempotent");
});

test("Tier 5 - Invariance 3: Separator parameter customization invariance", () => {
  const input = "Apple\nBanana\n\nCarrot\nDate\n\nEggplant\nFig";

  // Test custom separators
  const commaFormatted = formatIntoTwoParagraphs(input, { separator: ", " });
  assert.ok(commaFormatted.includes("Apple, Banana"), "Must join wrapped lines with comma separator");
  const paragraphs = commaFormatted.split(/\n\s*\n/);
  assert.equal(paragraphs.length, 2, "Must produce 2 paragraphs");

  // Idempotency check with custom separator
  const secondPass = formatIntoTwoParagraphs(commaFormatted, { separator: ", " });
  assert.equal(secondPass, commaFormatted, "Custom separator formatting must remain idempotent");
});

/* ========================================================================== */
/* SECTION 3: CLIENT MEMORY & RESOURCE INTEGRITY                              */
/* ========================================================================== */

test("Tier 5 - Memory 1: 1,000 consecutive transformations maintain bounded heap usage", () => {
  const seed = "Paragraph one with detailed text.\nParagraph two with wrapped line.\n\nParagraph three.";
  const input = seed.repeat(200); // ~15,000 chars per run

  // Force garbage collection if available or record initial heap
  if (global.gc) {
    global.gc();
  }
  const initialHeap = process.memoryUsage().heapUsed;

  for (let i = 0; i < 1000; i++) {
    const res = formatIntoTwoParagraphs(input);
    assert.ok(res.length > 0);
  }

  if (global.gc) {
    global.gc();
  }
  const finalHeap = process.memoryUsage().heapUsed;
  const growthBytes = finalHeap - initialHeap;
  const growthMB = growthBytes / (1024 * 1024);

  // Growth should be negligible (well under 50MB in Node V8)
  assert.ok(
    growthMB < 50,
    `1,000 large iterations must not cause memory leak, heap grew by ${growthMB.toFixed(2)} MB`
  );
});

test("Tier 5 - Memory 2: Zero mutation of input string and options parameters", () => {
  const inputOriginal = "Constant input text.\nLine 2.\n\nParagraph 2.";
  const optionsOriginal = Object.freeze({ separator: " - " });

  const result = formatIntoTwoParagraphs(inputOriginal, optionsOriginal);
  assert.ok(result.length > 0);
  assert.equal(inputOriginal, "Constant input text.\nLine 2.\n\nParagraph 2.", "Input string must remain immutable");
});

/* ========================================================================== */
/* SECTION 4: SECURITY & ZERO NETWORK TRANSMISSION AUDIT                       */
/* ========================================================================== */

test("Tier 5 - Security 1: Client transformation functions dispatch ZERO outbound network requests", async () => {
  let networkDispatched = false;
  let dispatchedUrl = "";

  // Trap global fetch
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (url: string | URL | Request) => {
    networkDispatched = true;
    dispatchedUrl = url.toString();
    throw new Error(`Forbidden outbound network call during pure client transformation to: ${dispatchedUrl}`);
  }) as typeof globalThis.fetch;

  // Trap http.request and https.request
  const originalHttpRequest = http.request;
  const originalHttpsRequest = https.request;
  (http as Record<string, unknown>).request = () => {
    networkDispatched = true;
    throw new Error("Forbidden http.request call");
  };
  (https as Record<string, unknown>).request = () => {
    networkDispatched = true;
    throw new Error("Forbidden https.request call");
  };

  try {
    const sensitiveDoc =
      "TOP SECRET CONFIDENTIAL HEALTHCARE AND FINANCIAL RECORD.\n" +
      "Patient: John Doe, SSN: 000-12-3456, Account: 987654321.\n" +
      "Diagnosed with acute hypertension.\n\n" +
      "Treatment plan: Prescribed medication daily.\n" +
      "Follow-up scheduled in two weeks.";

    // Execute transformations
    const result1 = formatIntoTwoParagraphs(sensitiveDoc);
    const result2 = removeLineBreaks(sensitiveDoc, { preset: "two-paragraphs" });
    const result3 = removeLineBreaks(sensitiveDoc, { preset: "single-line" });
    const result4 = removeLineBreaks(sensitiveDoc, { preset: "preserve-paragraphs" });

    assert.ok(result1.includes("John Doe"), "Transformation 1 must succeed");
    assert.ok(result2.includes("John Doe"), "Transformation 2 must succeed");
    assert.ok(result3.includes("John Doe"), "Transformation 3 must succeed");
    assert.ok(result4.includes("John Doe"), "Transformation 4 must succeed");

    assert.equal(networkDispatched, false, "Pure client tools must NEVER trigger network requests");
    assert.equal(dispatchedUrl, "", "No network URL may be accessed");
  } finally {
    // Restore mocks
    globalThis.fetch = originalFetch;
    http.request = originalHttpRequest;
    https.request = originalHttpsRequest;
  }
});

/* ========================================================================== */
/* SECTION 5: DOM & HEADING HIERARCHY INVARIANTS                              */
/* ========================================================================== */

test("Tier 5 - Heading Invariance: Citable Answer Blocks use H2 and never inject duplicate H1s", () => {
  for (const slug of ["remove-line-breaks", "ai-summarize"]) {
    const block = CITABLE_ANSWER_BLOCKS[slug];
    assert.ok(block, `${slug} must have a citable answer block`);
    // Verify heading starts with standard question/answer pattern
    assert.match(
      block.heading,
      /^Quick Answer:/,
      `${slug} block heading must start with 'Quick Answer:' to qualify as an H2 section title`
    );
    // Verify none of the steps or takeaways contain H1 markdown or HTML tags
    for (const step of block.steps) {
      assert.ok(!step.includes("<h1"), `${slug} steps must not contain raw <h1> tags`);
      assert.ok(!step.startsWith("# "), `${slug} steps must not contain markdown H1`);
    }
    assert.ok(!block.takeaway.includes("<h1"), `${slug} takeaway must not contain raw <h1> tags`);
    assert.ok(!block.takeaway.startsWith("# "), `${slug} takeaway must not contain markdown H1`);
  }
});
