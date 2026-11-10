import test from "node:test";
import assert from "node:assert/strict";

import { removeLineBreaks, formatIntoTwoParagraphs } from "../lib/tools/removeLineBreaks.ts";
import { CITABLE_ANSWER_BLOCKS, getCitableAnswerBlock } from "../data/seo/citableAnswerBlocks.ts";
import { SEARCH_GUIDES } from "../data/seo/searchGuides.ts";
import { getToolEducationalContent } from "../data/seo/faq.ts";
import { getToolSeoBlueprint } from "../data/seoBlueprint.ts";
import { getToolBySlug } from "../data/toolsRegistry.ts";

/* ========================================================================== */
/* SECTION 1: WHITE-BOX ADVERSARIAL TESTS FOR removeLineBreaks.ts             */
/* ========================================================================== */

// 1.1 Weird Unicode Line Breaks (\u2028, \u2029, \f, \v)
test("Adversarial 1.1: Unicode Line Separator (\\u2028) and Paragraph Separator (\\u2029)", () => {
  const inputLineSep = "First sentence.\u2028Second sentence.\u2028Third sentence.\u2028Fourth sentence.";
  const resultLineSep = formatIntoTwoParagraphs(inputLineSep);
  assert.equal(resultLineSep.split(/\n\s*\n/).length, 2, "Line separator input should yield two paragraphs");

  const inputParaSep = "First paragraph.\u2029Second paragraph.";
  const resultParaSep = formatIntoTwoParagraphs(inputParaSep);
  assert.ok(resultParaSep.includes("First paragraph."), "Paragraph text must be preserved");
});

test("Adversarial 1.2: Form Feed (\\f) and Vertical Tab (\\v)", () => {
  const inputFormFeed = "Page 1 content.\fPage 2 content.\fPage 3 content.\fPage 4 content.";
  const resultFF = formatIntoTwoParagraphs(inputFormFeed);
  assert.equal(resultFF.split(/\n\s*\n/).length, 2, "Form feed input should yield two paragraphs");

  const inputVTab = "Line 1.\vLine 2.\vLine 3.\vLine 4.";
  const resultVT = formatIntoTwoParagraphs(inputVTab);
  assert.equal(resultVT.split(/\n\s*\n/).length, 2, "Vertical tab input should yield two paragraphs");
});

// 1.3 Extreme Punctuation in splitIntoSentences
test("Adversarial 1.3: Extreme Punctuation - Ellipses (...)", () => {
  const input = "Thinking... still thinking... now ready. Action started... finished successfully.";
  const result = formatIntoTwoParagraphs(input);
  const paras = result.split(/\n\s*\n/);
  assert.equal(paras.length, 2, "Ellipses input must split into exactly 2 paragraphs");
  assert.ok(result.includes("Thinking..."), "Initial ellipsis clause must be preserved");
  assert.ok(result.includes("finished successfully."), "Final ellipsis clause must be preserved");
});

test("Adversarial 1.4: Extreme Punctuation - Interrobang & Multiple Exclamations (!?!, ???, !!!)", () => {
  const input = "Is this real!?! Yes, absolutely!!! Are you sure??? Perfectly sure.";
  const result = formatIntoTwoParagraphs(input);
  const paras = result.split(/\n\s*\n/);
  assert.equal(paras.length, 2, "Multiple punctuation marks must split into 2 paragraphs");
  assert.ok(result.includes("Is this real!?!"), "First question must be preserved");
  assert.ok(result.includes("Perfectly sure."), "Last answer must be preserved");
});

// --- REMEDIATED ADVERSARIAL CASES IN splitIntoSentences & formatIntoTwoParagraphs ---

test(
  "Adversarial 1.5: [REMEDIATED] Punctuation inside tokens - Decimal numbers (3.14) & Currency ($19.99)",
  () => {
    const input = "The price is $19.99 today. Tomorrow it will be $3.14 per unit. Version 2.0.1 is live. Please upgrade now.";
    const result = formatIntoTwoParagraphs(input);
    assert.ok(result.includes("$19.99"), "$19.99 must be preserved intact");
    assert.ok(result.includes("$3.14"), "$3.14 must be preserved intact");
  }
);

test(
  "Adversarial 1.6: [REMEDIATED] Punctuation inside tokens - Email addresses & URLs",
  () => {
    const input = "Contact support@example.com for assistance. Visit https://ai-text-tool.org/faq for more details. Documentation is at docs.example.com today. All systems operational.";
    const result = formatIntoTwoParagraphs(input);
    assert.ok(result.includes("support@example.com"), "Email must be preserved intact");
    assert.ok(result.includes("https://ai-text-tool.org/faq"), "URL must be preserved intact");
    assert.ok(result.includes("docs.example.com"), "Domain must be preserved intact");
  }
);

test(
  "Adversarial 1.7: [REMEDIATED] Dialogue quote immediately following terminal punctuation",
  () => {
    const input = 'He said, "Stop!" She ran away. What now?';
    const result = formatIntoTwoParagraphs(input);
    assert.ok(result.includes("He said"), "Quoted dialogue must not have text before quote deleted");
    assert.ok(result.includes("Stop!"), "Dialogue content must be preserved");
  }
);

test(
  "Adversarial 1.8: [REMEDIATED] Accented word hyphenation across line breaks",
  () => {
    const inputAccent = "Enjoy the café-\nstyle atmosphere.\nSecond sentence is here.\nThird sentence is here.";
    const resultAccent = formatIntoTwoParagraphs(inputAccent);
    assert.ok(resultAccent.includes("caféstyle"), "Accented word café-\\nstyle should be un-hyphenated");
  }
);

test(
  "Adversarial 1.9: [REMEDIATED] Number hyphenation false-positive concatenation",
  () => {
    const input = "See pages 10-\n11 for details.\nNext sentence.\nThird sentence.";
    const result = formatIntoTwoParagraphs(input);
    assert.ok(!result.includes("1011"), "Page range 10-\\n11 should not be joined into 1011");
  }
);

test(
  "Adversarial 1.10: [REMEDIATED] Markdown horizontal dividers with spaces (- - -, * * *)",
  () => {
    const input = "Paragraph one starts here.\n- - -\nParagraph two starts here.";
    const result = formatIntoTwoParagraphs(input);
    assert.ok(!result.includes("- - -"), "Dividers with spaces (- - -) should be stripped");
  }
);

// 1.11 Single line hyphens preserved
test("Adversarial 1.11: Single line hyphens preserved intact", () => {
  const input = "This is a state-of-the-art solution.\nSecond line.\nThird line.\nFourth line.";
  const result = formatIntoTwoParagraphs(input);
  assert.ok(result.includes("state-of-the-art"), "Single line hyphens must not be stripped");
});

/* ========================================================================== */
/* SECTION 2: WORD COUNT STABILITY (citableAnswerBlocks.ts & ToolShell.tsx)   */
/* ========================================================================== */

test("Adversarial 2.1: Word count stability across different tokenization schemes", () => {
  for (const slug of ["remove-line-breaks", "ai-summarize"]) {
    const block = CITABLE_ANSWER_BLOCKS[slug];
    assert.ok(block, `${slug} must exist`);

    const fullText = [block.heading, block.intro, ...block.steps, block.takeaway].join(" ");

    // Scheme A: whitespace splitting (148 words)
    const whitespaceWords = fullText.trim().split(/\s+/).filter(Boolean);

    // Scheme B: Intl.Segmenter word segmenter (150 words)
    const segmenter = new Intl.Segmenter("en", { granularity: "word" });
    const intlWords = Array.from(segmenter.segment(fullText)).filter((s) => s.isWordLike);

    // Scheme C: Regex matching word tokens (147-148 tokens)
    const regexTokens = fullText.match(/\b[\w'-]+\b/g) || [];

    // All schemes strictly conform to the 130-160 bound
    assert.ok(
      whitespaceWords.length >= 130 && whitespaceWords.length <= 160,
      `${slug} whitespace count (${whitespaceWords.length}) must be in 130-160`
    );
    assert.ok(
      intlWords.length >= 130 && intlWords.length <= 160,
      `${slug} intl segmenter count (${intlWords.length}) must be in 130-160`
    );
    assert.ok(
      regexTokens.length >= 130 && regexTokens.length <= 160,
      `${slug} regex token count (${regexTokens.length}) must be in 130-160`
    );
  }
});

/* ========================================================================== */
/* SECTION 3: BLUEPRINT INHERITANCE (searchGuides.ts & faq.ts)                */
/* ========================================================================== */

test("Adversarial 3.1: Blueprint inheritance for all tools in SEARCH_GUIDES", () => {
  const guideSlugs = Object.keys(SEARCH_GUIDES);
  assert.equal(guideSlugs.length, 28, "Expected 28 search guides");

  for (const slug of guideSlugs) {
    const guide = SEARCH_GUIDES[slug];
    const blueprint = getToolSeoBlueprint(slug);

    assert.ok(blueprint, `Blueprint must resolve for '${slug}'`);
    assert.equal(blueprint.title, guide.title, `Blueprint title for '${slug}' must match guide title`);
    assert.equal(blueprint.metaDescription, guide.description, `Blueprint metaDescription for '${slug}' must match guide description`);
    assert.ok(blueprint.h1 && blueprint.h1.trim().length > 0, `Blueprint H1 for '${slug}' must be non-empty`);
    assert.ok(blueprint.aboveTheFoldIntro && blueprint.aboveTheFoldIntro.trim().length > 0, `Blueprint aboveTheFoldIntro for '${slug}' must be non-empty`);
    assert.ok(Array.isArray(blueprint.clusterSlugs), `Blueprint clusterSlugs for '${slug}' must be array`);
  }
});

test("Adversarial 3.2: Educational FAQ mapping across all SEARCH_GUIDES", () => {
  for (const [slug, guide] of Object.entries(SEARCH_GUIDES)) {
    const tool = getToolBySlug(slug);
    assert.ok(tool, `Tool for '${slug}' must exist in registry`);
    const content = getToolEducationalContent(tool.category, slug, tool.name);
    assert.ok(content, `Educational content for '${slug}' must exist`);
    const match = content.faqs.some((f) => f.question === guide.faq.question && f.answer === guide.faq.answer);
    assert.ok(match, `Primary FAQ from search guide for '${slug}' must appear in educational content`);
  }
});
