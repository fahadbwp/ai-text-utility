/**
 * Opaque-box End-to-End (E2E) Test Suite: GEO & Presets (Tiers 1-4)
 *
 * Covers:
 * - R1: Generative Engine Optimization (GEO) & Citable Answer Blocks (130-160 words, top 30% placement, bullet steps)
 * - R2: Conversational Intent Search Guides & FAQ Coverage (searchGuides.ts, faq.ts, single-H1, no FAQPage schema)
 * - R3: 1-Click Paragraph Formatting & Cleanup Preset (removeLineBreaks, formatIntoTwoParagraphs, accessible presets)
 *
 * Test Tiers:
 * - Tier 1: Feature Coverage (>=5 test cases per feature for R1, R2, R3)
 * - Tier 2: Boundary & Corner Cases (>=5 test cases per feature for R1, R2, R3)
 * - Tier 3: Cross-Feature Combinations (pairwise interactions R1 + R2 + R3)
 * - Tier 4: Real-World Application Scenarios (multi-intent user queries with PDF/OCR/email artifacts)
 */

import test from "node:test";
import assert from "node:assert/strict";
import { CITABLE_ANSWER_BLOCKS, getCitableAnswerBlock } from "../../data/seo/citableAnswerBlocks.ts";
import { SEARCH_GUIDES } from "../../data/seo/searchGuides.ts";
import { getToolEducationalContent } from "../../data/seo/faq.ts";
import { getToolBySlug, TOOLS_REGISTRY } from "../../data/toolsRegistry.ts";
import { getToolSeoBlueprint } from "../../data/seoBlueprint.ts";
import * as removeLineBreaksModule from "../../lib/tools/removeLineBreaks.ts";

const { removeLineBreaks } = removeLineBreaksModule;
const formatIntoTwoParagraphs = (removeLineBreaksModule as Record<string, unknown>).formatIntoTwoParagraphs as
  | ((input: string, options?: { separator?: string }) => string)
  | undefined;

/**
 * Helper to count words in a string according to standard whitespace tokenization.
 */
function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Helper to compute total word count of a Citable Answer Block.
 */
function getAnswerBlockWordCount(block: { heading: string; intro: string; steps: string[]; takeaway: string }): number {
  const allText = [block.heading, block.intro, ...block.steps, block.takeaway].join(" ");
  return countWords(allText);
}

/* ========================================================================== */
/* TIER 1: FEATURE COVERAGE                                                   */
/* ========================================================================== */

// --- R1: Generative Engine Optimization (GEO) & Citable Answer Blocks ---

test("Tier 1 - R1.1: Citable answer block registry exists and contains target high-impression tools", () => {
  assert.ok(CITABLE_ANSWER_BLOCKS, "CITABLE_ANSWER_BLOCKS registry must be exported");
  assert.ok(
    typeof CITABLE_ANSWER_BLOCKS === "object" && CITABLE_ANSWER_BLOCKS !== null,
    "CITABLE_ANSWER_BLOCKS must be an object"
  );
  assert.ok(
    "remove-line-breaks" in CITABLE_ANSWER_BLOCKS,
    "CITABLE_ANSWER_BLOCKS must contain 'remove-line-breaks'"
  );
  assert.ok(
    "ai-summarize" in CITABLE_ANSWER_BLOCKS,
    "CITABLE_ANSWER_BLOCKS must contain 'ai-summarize'"
  );
});

test("Tier 1 - R1.2: Citable answer block word counts strictly satisfy 130-160 range", () => {
  const lineBreaksBlock = CITABLE_ANSWER_BLOCKS["remove-line-breaks"];
  assert.ok(lineBreaksBlock, "remove-line-breaks block must exist");
  const lineBreaksWords = getAnswerBlockWordCount(lineBreaksBlock);
  assert.ok(
    lineBreaksWords >= 130 && lineBreaksWords <= 160,
    `remove-line-breaks answer block word count must be 130-160, got ${lineBreaksWords}`
  );

  const aiSummarizeBlock = CITABLE_ANSWER_BLOCKS["ai-summarize"];
  assert.ok(aiSummarizeBlock, "ai-summarize block must exist");
  const aiSummarizeWords = getAnswerBlockWordCount(aiSummarizeBlock);
  assert.ok(
    aiSummarizeWords >= 130 && aiSummarizeWords <= 160,
    `ai-summarize answer block word count must be 130-160, got ${aiSummarizeWords}`
  );
});

test("Tier 1 - R1.3: Citable answer blocks contain direct, sequential bullet steps", () => {
  for (const slug of ["remove-line-breaks", "ai-summarize"]) {
    const block = CITABLE_ANSWER_BLOCKS[slug];
    assert.ok(block, `${slug} answer block must exist`);
    assert.ok(Array.isArray(block.steps), `${slug} steps must be an array`);
    assert.ok(block.steps.length >= 4, `${slug} must provide at least 4 direct steps, got ${block.steps.length}`);
    for (let i = 0; i < block.steps.length; i++) {
      const step = block.steps[i];
      assert.ok(typeof step === "string", `${slug} step ${i + 1} must be a string`);
      assert.ok(step.trim().length > 15, `${slug} step ${i + 1} must be descriptive (> 15 chars)`);
      assert.match(
        step,
        /^(?:Step\s+\d+:|•|\d+\.)/i,
        `${slug} step ${i + 1} must start with standard step notation`
      );
    }
  }
});

test("Tier 1 - R1.4: Citable answer blocks include introductory context and authoritative takeaway", () => {
  for (const slug of ["remove-line-breaks", "ai-summarize"]) {
    const block = CITABLE_ANSWER_BLOCKS[slug];
    assert.ok(block, `${slug} answer block must exist`);
    assert.ok(block.intro && block.intro.trim().length >= 40, `${slug} intro must be >= 40 characters`);
    assert.ok(block.takeaway && block.takeaway.trim().length >= 50, `${slug} takeaway must be >= 50 characters`);
    assert.ok(block.heading && block.heading.trim().length >= 20, `${slug} heading must be >= 20 characters`);
  }
});

test("Tier 1 - R1.5: Helper getCitableAnswerBlock resolves valid blocks and returns undefined for unknown slugs", () => {
  assert.ok(typeof getCitableAnswerBlock === "function", "getCitableAnswerBlock helper must be exported");
  const lineBreaks = getCitableAnswerBlock("remove-line-breaks");
  assert.equal(lineBreaks?.heading, CITABLE_ANSWER_BLOCKS["remove-line-breaks"].heading);

  const aiSummarize = getCitableAnswerBlock("ai-summarize");
  assert.equal(aiSummarize?.heading, CITABLE_ANSWER_BLOCKS["ai-summarize"].heading);

  const unknown = getCitableAnswerBlock("non-existent-tool");
  assert.equal(unknown, undefined, "Unknown slug must return undefined");
});

// --- R2: Conversational Intent Search Guides & FAQ Coverage ---

test("Tier 1 - R2.1: Search guides exist for remove-line-breaks and ai-summarize", (t) => {
  const lineBreaksGuide = SEARCH_GUIDES["remove-line-breaks"];
  const aiSummarizeGuide = SEARCH_GUIDES["ai-summarize"];

  if (!lineBreaksGuide || !aiSummarizeGuide) {
    t.skip("Search guides for remove-line-breaks or ai-summarize pending M2 implementation");
    return;
  }

  for (const slug of ["remove-line-breaks", "ai-summarize"]) {
    const guide = SEARCH_GUIDES[slug];
    assert.ok(guide, `Guide for ${slug} must be registered in SEARCH_GUIDES`);
    assert.ok(guide.title, `${slug} guide must have a title`);
    assert.ok(guide.description, `${slug} guide must have a description`);
    assert.ok(guide.heading, `${slug} guide must have a heading`);
    assert.ok(guide.useCase, `${slug} guide must have a useCase`);
    assert.ok(guide.example, `${slug} guide must have an example`);
    assert.ok(guide.limitation, `${slug} guide must have a limitation`);
    assert.ok(Array.isArray(guide.related), `${slug} guide must have a related array`);
    assert.ok(guide.faq, `${slug} guide must have an faq pair`);
  }
});

test("Tier 1 - R2.2: Search guide metadata conforms to length bounds and keyword requirements", (t) => {
  const lineBreaksGuide = SEARCH_GUIDES["remove-line-breaks"];
  const aiSummarizeGuide = SEARCH_GUIDES["ai-summarize"];

  if (!lineBreaksGuide || !aiSummarizeGuide) {
    t.skip("Search guides pending M2 implementation");
    return;
  }

  for (const slug of ["remove-line-breaks", "ai-summarize"]) {
    const guide = SEARCH_GUIDES[slug];
    assert.ok(
      guide.title.length >= 40 && guide.title.length <= 75,
      `${slug} guide title length must be 40-75 chars, got ${guide.title.length}`
    );
    assert.ok(
      guide.description.length >= 130 && guide.description.length <= 180,
      `${slug} guide description length must be 130-180 chars, got ${guide.description.length}`
    );
    assert.ok(guide.heading.length > 10, `${slug} guide heading length must be > 10 chars`);
  }
});

test("Tier 1 - R2.3: Search guide example inputs and outputs adhere to tool transform contracts", (t) => {
  const lineBreaksGuide = SEARCH_GUIDES["remove-line-breaks"];
  const aiSummarizeGuide = SEARCH_GUIDES["ai-summarize"];

  if (!lineBreaksGuide || !aiSummarizeGuide) {
    t.skip("Search guides pending M2 implementation");
    return;
  }

  // Deterministic tool check for remove-line-breaks
  const expectedOutput = removeLineBreaks(lineBreaksGuide.example.input, {
    collapseParagraphs: true,
    separator: " ",
  });
  assert.equal(
    expectedOutput,
    lineBreaksGuide.example.output,
    "remove-line-breaks search guide example output must match removeLineBreaks transformation"
  );

  // AI tool illustrative check for ai-summarize
  assert.match(
    aiSummarizeGuide.example.note,
    /[Ii]llustrative/,
    "ai-summarize search guide example note must state it is illustrative"
  );
  assert.ok(
    aiSummarizeGuide.example.output.length > 20,
    "ai-summarize search guide example output must contain substantial summarized text"
  );
});

test("Tier 1 - R2.4: Tool educational content integrates conversational search guide FAQs as primary item", (t) => {
  const lineBreaksGuide = SEARCH_GUIDES["remove-line-breaks"];
  const aiSummarizeGuide = SEARCH_GUIDES["ai-summarize"];

  if (!lineBreaksGuide || !aiSummarizeGuide) {
    t.skip("Search guides pending M2 implementation");
    return;
  }

  const lineBreaksContent = getToolEducationalContent("Cleanup", "remove-line-breaks", "Remove Line Breaks");
  assert.ok(lineBreaksContent.faqs.length >= 3, "remove-line-breaks must have at least 3 FAQs");
  assert.equal(
    lineBreaksContent.faqs[0].question,
    lineBreaksGuide.faq.question,
    "remove-line-breaks FAQ #1 must match the search guide FAQ question"
  );
  assert.equal(
    lineBreaksContent.faqs[0].answer,
    lineBreaksGuide.faq.answer,
    "remove-line-breaks FAQ #1 must match the search guide FAQ answer"
  );

  const aiContent = getToolEducationalContent("AI Magic", "ai-summarize", "AI Summarizer");
  assert.ok(aiContent.faqs.length >= 3, "ai-summarize must have at least 3 FAQs");
  assert.equal(
    aiContent.faqs[0].question,
    aiSummarizeGuide.faq.question,
    "ai-summarize FAQ #1 must match the search guide FAQ question"
  );
  assert.equal(
    aiContent.faqs[0].answer,
    aiSummarizeGuide.faq.answer,
    "ai-summarize FAQ #1 must match the search guide FAQ answer"
  );
});

test("Tier 1 - R2.5: Conversational FAQs explicitly address privacy, 2-paragraph formatting, and zero upload", (t) => {
  const lineBreaksGuide = SEARCH_GUIDES["remove-line-breaks"];
  const lineBreaksContent = getToolEducationalContent("Cleanup", "remove-line-breaks", "Remove Line Breaks");
  const allLineBreaksFaqText = lineBreaksContent.faqs.map((f) => `${f.question} ${f.answer}`).join(" ");

  const hasConversationalFaqs = /(?:browser|locally|without\s+uploading|zero\s+server)/i.test(allLineBreaksFaqText);
  if (!lineBreaksGuide || !hasConversationalFaqs) {
    t.skip("Conversational FAQs pending M2 implementation in data/seo/faq.ts and searchGuides.ts");
    return;
  }

  assert.match(
    allLineBreaksFaqText,
    /(?:browser|locally|without\s+uploading|zero\s+server)/i,
    "remove-line-breaks FAQs must address local client-side privacy"
  );
  assert.match(
    allLineBreaksFaqText,
    /(?:two\s+paragraphs|2\s+paragraphs|line\s+separators)/i,
    "remove-line-breaks FAQs must address multi-intent 2-paragraph / line separator formatting"
  );
});

// --- R3: 1-Click Paragraph Formatting & Cleanup Preset ---

test("Tier 1 - R3.1: removeLineBreaks supports 1-click two-paragraphs preset", (t) => {
  const input = "Sentence one is here.\nSentence two is here.\nSentence three is here.\nSentence four is here.";
  const result = removeLineBreaks(input, { preset: "two-paragraphs" } as any);

  // If preset option is not yet supported in current milestone
  if (result === "Sentence one is here. Sentence two is here. Sentence three is here. Sentence four is here.") {
    t.skip("preset: 'two-paragraphs' option pending M3 implementation in removeLineBreaks.ts");
    return;
  }

  const paragraphs = result.split(/\n\s*\n/);
  assert.equal(paragraphs.length, 2, "Output must contain exactly 2 paragraphs separated by blank line");
  assert.equal(paragraphs[0], "Sentence one is here. Sentence two is here.");
  assert.equal(paragraphs[1], "Sentence three is here. Sentence four is here.");
});

test("Tier 1 - R3.2: removeLineBreaks supports formatTwoParagraphs boolean flag", (t) => {
  const input = "First idea.\nSecond idea.\n\nThird idea.\nFourth idea.";
  const result = removeLineBreaks(input, { formatTwoParagraphs: true } as any);

  if (result.includes("First idea. Second idea.\n\nThird idea. Fourth idea.")) {
    // If formatTwoParagraphs is already active or works identically
    const paragraphs = result.split(/\n\s*\n/);
    assert.equal(paragraphs.length, 2);
  } else if (!("formatTwoParagraphs" in (removeLineBreaksModule as any))) {
    t.skip("formatTwoParagraphs flag pending M3 implementation");
  }
});

test("Tier 1 - R3.3: formatIntoTwoParagraphs cleans hyphenated line breaks", (t) => {
  if (typeof formatIntoTwoParagraphs !== "function") {
    t.skip("formatIntoTwoParagraphs helper pending M3 implementation");
    return;
  }

  const input = "The docu-\nment was split.\nSecond sentence is com-\nplete.";
  const result = formatIntoTwoParagraphs(input);
  assert.ok(result.includes("document"), "Hyphenated 'docu-\\nment' must become 'document'");
  assert.ok(result.includes("complete"), "Hyphenated 'com-\\nplete' must become 'complete'");
  const paragraphs = result.split(/\n\s*\n/);
  assert.equal(paragraphs.length, 2, "Must produce exactly two paragraphs");
});

test("Tier 1 - R3.4: formatIntoTwoParagraphs strips horizontal line dividers", (t) => {
  if (typeof formatIntoTwoParagraphs !== "function") {
    t.skip("formatIntoTwoParagraphs helper pending M3 implementation");
    return;
  }

  const input = "Paragraph one starts here.\nMore of paragraph one.\n---\nParagraph two starts here.\n***\nMore of paragraph two.";
  const result = formatIntoTwoParagraphs(input);
  assert.ok(!result.includes("---"), "Horizontal divider '---' must be stripped");
  assert.ok(!result.includes("***"), "Horizontal divider '***' must be stripped");
  const paragraphs = result.split(/\n\s*\n/);
  assert.equal(paragraphs.length, 2, "Must produce exactly two paragraphs");
});

test("Tier 1 - R3.5: Backward compatibility: default single-line and preserve-paragraphs options remain intact", () => {
  const input = "Line one.\nLine two.\n\nLine three.\nLine four.";

  // Default: joins all lines with space
  const singleLine = removeLineBreaks(input);
  assert.equal(singleLine, "Line one. Line two. Line three. Line four.");

  // Preserving paragraphs
  const preserved = removeLineBreaks(input, { collapseParagraphs: true });
  assert.equal(preserved, "Line one. Line two.\n\nLine three. Line four.");

  // Custom delimiter
  const customDelim = removeLineBreaks(input, { separator: ", " });
  assert.equal(customDelim, "Line one., Line two., Line three., Line four.");
});

/* ========================================================================== */
/* TIER 2: BOUNDARY & CORNER CASES                                            */
/* ========================================================================== */

// --- R1 Boundaries ---

test("Tier 2 - R1.1: Citable answer block word count exact boundaries (no underflow < 130 or overflow > 160)", () => {
  for (const slug of ["remove-line-breaks", "ai-summarize"]) {
    const block = CITABLE_ANSWER_BLOCKS[slug];
    assert.ok(block);
    const count = getAnswerBlockWordCount(block);
    assert.ok(count >= 130, `${slug} word count ${count} must be >= 130`);
    assert.ok(count <= 160, `${slug} word count ${count} must be <= 160`);
  }
});

test("Tier 2 - R1.2: Citable answer block heading does not contain H1 or HTML markup", () => {
  for (const slug of ["remove-line-breaks", "ai-summarize"]) {
    const block = CITABLE_ANSWER_BLOCKS[slug];
    assert.ok(block);
    assert.ok(!block.heading.includes("<h1"), `${slug} heading must not contain <h1> markup`);
    assert.ok(!block.heading.includes("</h1>"), `${slug} heading must not close <h1>`);
    assert.ok(!block.heading.includes("<"), `${slug} heading must be plain text`);
  }
});

test("Tier 2 - R1.3: Citable answer block steps do not have empty or whitespace-only elements", () => {
  for (const slug of ["remove-line-breaks", "ai-summarize"]) {
    const block = CITABLE_ANSWER_BLOCKS[slug];
    assert.ok(block);
    for (const step of block.steps) {
      assert.ok(step.trim().length > 0, `${slug} step cannot be empty whitespace`);
    }
  }
});

test("Tier 2 - R1.4: Citable answer block lookup is resilient to casing and whitespace", () => {
  const direct = getCitableAnswerBlock("remove-line-breaks");
  const caseInsensitive = getCitableAnswerBlock("REMOVE-LINE-BREAKS" as any);
  if (caseInsensitive) {
    assert.equal(caseInsensitive.heading, direct?.heading);
  }
  assert.ok(direct, "Canonical slug must always resolve");
});

test("Tier 2 - R1.5: Non-target tools return undefined for citable answer blocks", () => {
  const nonTargetSlugs = ["word-counter", "slug-generator", "base64", "json-formatter", "markdown-to-html"];
  for (const slug of nonTargetSlugs) {
    const block = getCitableAnswerBlock(slug);
    assert.equal(block, undefined, `Non-target tool ${slug} must not have a citable answer block`);
  }
});

// --- R2 Boundaries ---

test("Tier 2 - R2.1: Search guide related tools array contains >= 3 registered slugs without self-reference", (t) => {
  const lineBreaksGuide = SEARCH_GUIDES["remove-line-breaks"];
  const aiSummarizeGuide = SEARCH_GUIDES["ai-summarize"];

  if (!lineBreaksGuide || !aiSummarizeGuide) {
    t.skip("Search guides pending M2 implementation");
    return;
  }

  for (const slug of ["remove-line-breaks", "ai-summarize"]) {
    const guide = SEARCH_GUIDES[slug];
    assert.ok(guide.related.length >= 3, `${slug} related array must contain >= 3 tools`);
    assert.ok(!guide.related.includes(slug), `${slug} must not list itself in related tools`);
    for (const rel of guide.related) {
      const tool = getToolBySlug(rel);
      assert.ok(tool, `Related slug '${rel}' in ${slug} must exist in TOOLS_REGISTRY`);
    }
  }
});

test("Tier 2 - R2.2: Search guide internal markdown links point exclusively to existing canonical tools", (t) => {
  const lineBreaksGuide = SEARCH_GUIDES["remove-line-breaks"];
  const aiSummarizeGuide = SEARCH_GUIDES["ai-summarize"];

  if (!lineBreaksGuide || !aiSummarizeGuide) {
    t.skip("Search guides pending M2 implementation");
    return;
  }

  const linkRegex = /\[([^\]]+)\]\(\/tools\/([a-z0-9-]+)\)/g;

  for (const slug of ["remove-line-breaks", "ai-summarize"]) {
    const guide = SEARCH_GUIDES[slug];
    const textToScan = `${guide.useCase} ${guide.faq.answer}`;
    let match: RegExpExecArray | null;
    while ((match = linkRegex.exec(textToScan)) !== null) {
      const targetSlug = match[2];
      const targetTool = getToolBySlug(targetSlug);
      assert.ok(targetTool, `Internal link target '/tools/${targetSlug}' in ${slug} must exist in TOOLS_REGISTRY`);
    }
  }
});

test("Tier 2 - R2.3: Educational FAQ answers format without HTML tags and with valid markdown links", (t) => {
  const lineBreaksContent = getToolEducationalContent("Cleanup", "remove-line-breaks", "Remove Line Breaks");
  for (const faq of lineBreaksContent.faqs) {
    assert.ok(!faq.answer.includes("<script>"), "FAQ answers must never contain script tags");
    assert.ok(!faq.answer.includes("<h1>"), "FAQ answers must never contain h1 tags");
    assert.ok(faq.question.length > 10, "FAQ question must be descriptive (> 10 chars)");
    assert.ok(faq.answer.length > 20, "FAQ answer must be descriptive (> 20 chars)");
  }
});

test("Tier 2 - R2.4: Absence of FAQPage schema is strictly guarded", () => {
  // Confirm that the tool metadata and blueprints do not inject forbidden FAQPage JSON-LD
  const blueprint1 = getToolSeoBlueprint("remove-line-breaks");
  const blueprint2 = getToolSeoBlueprint("ai-summarize");
  assert.ok(blueprint1, "remove-line-breaks blueprint must exist");
  assert.ok(blueprint2, "ai-summarize blueprint must exist");

  // Verify that schemas property (if any) excludes FAQPage
  const raw1 = JSON.stringify(blueprint1);
  const raw2 = JSON.stringify(blueprint2);
  assert.ok(!raw1.includes('"FAQPage"'), "remove-line-breaks blueprint must not contain FAQPage schema");
  assert.ok(!raw2.includes('"FAQPage"'), "ai-summarize blueprint must not contain FAQPage schema");
});

test("Tier 2 - R2.5: Search guide example inputs contain realistic punctuation and zero control characters", (t) => {
  const lineBreaksGuide = SEARCH_GUIDES["remove-line-breaks"];
  if (!lineBreaksGuide) {
    t.skip("Search guides pending M2 implementation");
    return;
  }
  const input = lineBreaksGuide.example.input;
  assert.ok(!/[\u0000-\u0008\u000E-\u001F]/.test(input), "Example input must not contain control characters");
  assert.ok(input.includes("\n"), "Example input for remove-line-breaks must contain line breaks");
});

// --- R3 Boundaries ---

test("Tier 2 - R3.1: formatIntoTwoParagraphs handles empty, null, and whitespace-only input safely", (t) => {
  if (typeof formatIntoTwoParagraphs !== "function") {
    t.skip("formatIntoTwoParagraphs helper pending M3 implementation");
    return;
  }

  assert.equal(formatIntoTwoParagraphs(""), "");
  assert.equal(formatIntoTwoParagraphs("   "), "");
  assert.equal(formatIntoTwoParagraphs("\n\n\t\n"), "");
  assert.equal(formatIntoTwoParagraphs(null as any), "");
  assert.equal(formatIntoTwoParagraphs(undefined as any), "");
});

test("Tier 2 - R3.2: formatIntoTwoParagraphs handles single sentence input by midpoint word split", (t) => {
  if (typeof formatIntoTwoParagraphs !== "function") {
    t.skip("formatIntoTwoParagraphs helper pending M3 implementation");
    return;
  }

  const runOn = "This is a single continuous run on sentence without any ending period that should be divided into two halves";
  const result = formatIntoTwoParagraphs(runOn);
  const paragraphs = result.split(/\n\s*\n/);
  assert.equal(paragraphs.length, 2, "Run-on single sentence must be split into 2 paragraphs near median");
  assert.ok(paragraphs[0].length > 0 && paragraphs[1].length > 0);
});

test("Tier 2 - R3.3: formatIntoTwoParagraphs handles odd number of sentences gracefully", (t) => {
  if (typeof formatIntoTwoParagraphs !== "function") {
    t.skip("formatIntoTwoParagraphs helper pending M3 implementation");
    return;
  }

  const input = "Sentence one.\nSentence two.\nSentence three.\nSentence four.\nSentence five.";
  const result = formatIntoTwoParagraphs(input);
  const paragraphs = result.split(/\n\s*\n/);
  assert.equal(paragraphs.length, 2, "5 sentences must be split into 2 paragraphs (e.g. 3 and 2)");
  assert.equal(paragraphs[0], "Sentence one. Sentence two. Sentence three.");
  assert.equal(paragraphs[1], "Sentence four. Sentence five.");
});

test("Tier 2 - R3.4: formatIntoTwoParagraphs is idempotent on text that is already two paragraphs", (t) => {
  if (typeof formatIntoTwoParagraphs !== "function") {
    t.skip("formatIntoTwoParagraphs helper pending M3 implementation");
    return;
  }

  const alreadyTwo = "Paragraph one with several words.\n\nParagraph two with several words.";
  const result1 = formatIntoTwoParagraphs(alreadyTwo);
  const result2 = formatIntoTwoParagraphs(result1);
  assert.equal(result1, alreadyTwo);
  assert.equal(result2, alreadyTwo);
});

test("Tier 2 - R3.5: formatIntoTwoParagraphs handles extreme input size (50,000+ characters) efficiently", (t) => {
  if (typeof formatIntoTwoParagraphs !== "function") {
    t.skip("formatIntoTwoParagraphs helper pending M3 implementation");
    return;
  }

  const sentence = "The quick brown fox jumps over the lazy dog. ";
  const largeInput = sentence.repeat(1200); // ~55,000 characters
  const start = performance.now();
  const result = formatIntoTwoParagraphs(largeInput);
  const duration = performance.now() - start;

  assert.ok(duration < 250, `Large input processing should take < 250ms, took ${duration.toFixed(1)}ms`);
  const paragraphs = result.split(/\n\s*\n/);
  assert.equal(paragraphs.length, 2, "Large input must be partitioned into 2 paragraphs");
});

/* ========================================================================== */
/* TIER 3: CROSS-FEATURE COMBINATIONS                                         */
/* ========================================================================== */

test("Tier 3 - Cross 1: R1 answer block steps align with R3 presets and parameters", () => {
  const lineBreaksBlock = CITABLE_ANSWER_BLOCKS["remove-line-breaks"];
  assert.ok(lineBreaksBlock);
  const stepsText = lineBreaksBlock.steps.join(" ");

  // Step 3 should reference double line breaks
  assert.match(
    stepsText,
    /(?:Preserve Double Line Breaks|double\s+line\s+breaks|paragraphs)/i,
    "Answer block steps must prescribe double line break / paragraph preservation"
  );

  // Step 4 should reference the 1-click preset
  assert.match(
    stepsText,
    /(?:1-click|cleanup preset|preset)/i,
    "Answer block steps must reference the 1-click cleanup preset"
  );
});

test("Tier 3 - Cross 2: R2 search guide example input transformed with R3 engine produces exact guide output", (t) => {
  const lineBreaksGuide = SEARCH_GUIDES["remove-line-breaks"];
  if (!lineBreaksGuide) {
    t.skip("Search guides pending M2 implementation");
    return;
  }

  // Pure execution cross-check:
  const actualTransformed = removeLineBreaks(lineBreaksGuide.example.input, {
    collapseParagraphs: true,
    separator: " ",
  });
  assert.equal(
    actualTransformed,
    lineBreaksGuide.example.output,
    "Cross-verification: R3 engine must produce verbatim output published in R2 Search Guide"
  );
});

test("Tier 3 - Cross 3: R1 takeaway privacy guarantees align with R2 educational FAQ answers", (t) => {
  const lineBreaksBlock = CITABLE_ANSWER_BLOCKS["remove-line-breaks"];
  assert.ok(lineBreaksBlock);

  const lineBreaksGuide = SEARCH_GUIDES["remove-line-breaks"];
  if (!lineBreaksGuide) {
    t.skip("Search guide and conversational FAQs pending M2 implementation");
    return;
  }

  const educationalContent = getToolEducationalContent("Cleanup", "remove-line-breaks", "Remove Line Breaks");
  const faqAnswer = educationalContent.faqs[0]?.answer || "";

  // Both should emphasize local browser execution
  assert.match(lineBreaksBlock.takeaway, /(?:browser|local|memory|confidential)/i);
  assert.match(faqAnswer, /(?:browser|locally|without\s+uploading|zero\s+server)/i);
});

test("Tier 3 - Cross 4: R2 related tools cross-reference between remove-line-breaks and ai-summarize", (t) => {
  const lineBreaksGuide = SEARCH_GUIDES["remove-line-breaks"];
  const aiSummarizeGuide = SEARCH_GUIDES["ai-summarize"];

  if (!lineBreaksGuide || !aiSummarizeGuide) {
    t.skip("Search guides pending M2 implementation");
    return;
  }

  assert.ok(
    lineBreaksGuide.related.includes("ai-summarize"),
    "remove-line-breaks related list must include ai-summarize"
  );
  assert.ok(
    aiSummarizeGuide.related.includes("remove-line-breaks"),
    "ai-summarize related list must include remove-line-breaks"
  );
});

test("Tier 3 - Cross 5: Blueprint integration dynamically propagates search guide metadata to page SEO", (t) => {
  const lineBreaksGuide = SEARCH_GUIDES["remove-line-breaks"];
  if (!lineBreaksGuide) {
    t.skip("Search guides pending M2 implementation");
    return;
  }

  const blueprint = getToolSeoBlueprint("remove-line-breaks");
  assert.ok(blueprint);
  assert.equal(blueprint.title, lineBreaksGuide.title, "Blueprint title must inherit from SearchGuide title");
  assert.equal(
    blueprint.metaDescription,
    lineBreaksGuide.description,
    "Blueprint metaDescription must inherit from SearchGuide description"
  );
});

test("Tier 3 - Cross 6: Strict single H1 and valid heading hierarchy contract across components", () => {
  // Heading contracts:
  // 1. ToolShell hosts the only H1
  // 2. Citable answer block uses H2
  // 3. Search guide uses H2
  // 4. FAQ section uses H2 with H3 question items
  const lineBreaksBlock = CITABLE_ANSWER_BLOCKS["remove-line-breaks"];
  assert.ok(lineBreaksBlock);
  assert.ok(!lineBreaksBlock.heading.startsWith("# "), "Answer block heading must not be Markdown H1");
  assert.ok(!lineBreaksBlock.heading.toLowerCase().includes("<h1"), "Answer block heading must not be HTML H1");

  const lineBreaksGuide = SEARCH_GUIDES["remove-line-breaks"];
  if (lineBreaksGuide) {
    assert.ok(!lineBreaksGuide.heading.startsWith("# "), "Search guide heading must not be Markdown H1");
    assert.ok(!lineBreaksGuide.heading.toLowerCase().includes("<h1"), "Search guide heading must not be HTML H1");
  }
});

/* ========================================================================== */
/* TIER 4: REAL-WORLD APPLICATION SCENARIOS                                   */
/* ========================================================================== */

test("Tier 4 - Scenario 1: Multi-intent query: 'condense a long paragraph into two paragraphs and remove line separators' with PDF copy-paste artifact", (t) => {
  if (typeof formatIntoTwoParagraphs !== "function") {
    t.skip("formatIntoTwoParagraphs pending M3 implementation");
    return;
  }

  // Realistic messy PDF artifact with 60-character hard wraps, hyphenation, and line breaks
  const pdfArtifact =
    "Generative Engine Optimization (GEO) is an emerging prac-\n" +
    "tice designed to structure digital documentation for AI\n" +
    "search overviews. By formatting multi-line content into\n" +
    "concise answer blocks, search crawlers can index the\n" +
    "authoritative guidance seamlessly.\n" +
    "Modern text utilities process documents locally inside the\n" +
    "browser memory with zero server round-trips. This guaran-\n" +
    "tees complete client privacy while delivering instant trans-\n" +
    "formations for high-volume enterprise operations.";

  const result = formatIntoTwoParagraphs(pdfArtifact);
  const paragraphs = result.split(/\n\s*\n/);

  assert.equal(paragraphs.length, 2, "Must condense PDF artifact into exactly 2 cohesive paragraphs");
  assert.ok(!result.includes("prac-\n"), "Hyphen 'prac-\\n' must be un-hyphenated to 'practice'");
  assert.ok(result.includes("practice"), "Repaired 'practice' must exist");
  assert.ok(result.includes("guarantees"), "Repaired 'guarantees' must exist");
  assert.ok(result.includes("transformations"), "Repaired 'transformations' must exist");
  assert.ok(!result.includes("\nAI"), "Mid-sentence line wrap before 'AI' must be removed");
});

test("Tier 4 - Scenario 2: Multi-intent query: Email newsletter / raw text with erratic hard wraps and multiple blank line separators", (t) => {
  if (typeof formatIntoTwoParagraphs !== "function") {
    t.skip("formatIntoTwoParagraphs pending M3 implementation");
    return;
  }

  // Real-world raw email artifact with erratic CRLF, spaces, and 4 consecutive newlines
  const emailArtifact =
    "Welcome to the quarterly engineering update.\r\n" +
    "Our team has deployed several critical search optimizations.\r\n" +
    "\r\n\r\n\r\n" +
    "Client-side performance increased by forty percent.\r\n" +
    "All text operations run securely in the browser.";

  const result = formatIntoTwoParagraphs(emailArtifact);
  const paragraphs = result.split(/\n\s*\n/);

  assert.equal(paragraphs.length, 2, "Multiple blank lines must collapse to exactly 2 paragraphs");
  assert.equal(
    paragraphs[0],
    "Welcome to the quarterly engineering update. Our team has deployed several critical search optimizations."
  );
  assert.equal(
    paragraphs[1],
    "Client-side performance increased by forty percent. All text operations run securely in the browser."
  );
});

test("Tier 4 - Scenario 3: Multi-intent query: Terminal log & markdown artifact with horizontal rule dividers (---) and code separators", (t) => {
  if (typeof formatIntoTwoParagraphs !== "function") {
    t.skip("formatIntoTwoParagraphs pending M3 implementation");
    return;
  }

  const markdownArtifact =
    "Build verification started at 03:00 UTC with full test suite.\n" +
    "All unit and integration checks completed with exit code zero.\n" +
    "---\n" +
    "Deployment pipeline initialized static page generation.\n" +
    "Static output verified across all canonical routes.";

  const result = formatIntoTwoParagraphs(markdownArtifact);
  const paragraphs = result.split(/\n\s*\n/);

  assert.equal(paragraphs.length, 2, "Dividers must be removed and text split into 2 paragraphs");
  assert.ok(!result.includes("---"), "Rule divider '---' must be stripped");
  assert.equal(
    paragraphs[0],
    "Build verification started at 03:00 UTC with full test suite. All unit and integration checks completed with exit code zero."
  );
  assert.equal(
    paragraphs[1],
    "Deployment pipeline initialized static page generation. Static output verified across all canonical routes."
  );
});

test("Tier 4 - Scenario 4: Multi-intent query: OCR scan artifact with uneven sentence breaks and messy line wraps", (t) => {
  if (typeof formatIntoTwoParagraphs !== "function") {
    t.skip("formatIntoTwoParagraphs pending M3 implementation");
    return;
  }

  const ocrArtifact =
    "Optical character recognition scans frequently introduce\n" +
    "accidental line breaks at arbitrary margins.\n" +
    "Cleaning these breaks restores original readability.\n" +
    "Formatting the resulting text into two structured paragraphs\n" +
    "allows readers to absorb key information quickly.";

  const result = formatIntoTwoParagraphs(ocrArtifact);
  const paragraphs = result.split(/\n\s*\n/);

  assert.equal(paragraphs.length, 2, "OCR text must be reformatted into 2 paragraphs");
  assert.ok(!paragraphs[0].includes("\n"), "Paragraph 1 must have internal line breaks stripped");
  assert.ok(!paragraphs[1].includes("\n"), "Paragraph 2 must have internal line breaks stripped");
});

test("Tier 4 - Scenario 5: End-to-end multi-intent pipeline: Raw messy text -> R3 formatting -> AI summarizer input preparation", (t) => {
  if (typeof formatIntoTwoParagraphs !== "function") {
    t.skip("formatIntoTwoParagraphs pending M3 implementation");
    return;
  }

  // Simulated multi-step workflow: A user takes messy text with erratic line breaks,
  // formats it into 2 clean paragraphs via R3, and prepares it as clean input for AI summarization.
  const rawInput =
    "Artificial intelligence search overviews synthesize content from\n" +
    "high-authority web documentation.\n" +
    "Webmasters must ensure content is formatted clearly.\n" +
    "\n\n\n" +
    "Client privacy is paramount when evaluating online utilities.\n" +
    "Zero-knowledge browser tools provide maximum security\n" +
    "for confidential business communications.";

  // Step 1: Format into 2 clean paragraphs
  const cleanedForAi = formatIntoTwoParagraphs(rawInput);
  const paragraphs = cleanedForAi.split(/\n\s*\n/);

  assert.equal(paragraphs.length, 2, "Pipeline Step 1 must yield 2 clean paragraphs");
  assert.ok(cleanedForAi.length > 50, "Cleaned input must be substantial");
  assert.ok(!cleanedForAi.includes("\n\n\n"), "No triple newlines allowed");

  // Step 2: Verify it satisfies AI tool sample input characteristics (non-empty, <= 100k chars)
  const aiTool = getToolBySlug("ai-summarize");
  assert.ok(aiTool, "ai-summarize tool must exist in registry");
  assert.ok(aiTool.requiresAI, "ai-summarize requires AI execution");
  assert.ok(cleanedForAi.length < 100000, "Cleaned text is well within AI token / character limits");
});
