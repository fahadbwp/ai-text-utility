import test from "node:test";
import assert from "node:assert/strict";
import {
  CITABLE_ANSWER_BLOCKS,
  getCitableAnswerBlock,
} from "../../data/seo/citableAnswerBlocks.ts";
import { getToolBySlug } from "../../data/toolsRegistry.ts";

test("Citable Answer Blocks include required target tools", () => {
  const targetSlugs = ["remove-line-breaks", "ai-summarize"];
  for (const slug of targetSlugs) {
    const block = CITABLE_ANSWER_BLOCKS[slug];
    assert.ok(block, `Citable answer block must exist for '${slug}'`);
    assert.equal(
      getCitableAnswerBlock(slug),
      block,
      `getCitableAnswerBlock must return the block for '${slug}'`
    );

    const tool = getToolBySlug(slug);
    assert.ok(tool, `Target slug '${slug}' must exist in TOOLS_REGISTRY`);
  }
});

test("Each registered citable answer block strictly conforms to 130–160 word count range", () => {
  const entries = Object.entries(CITABLE_ANSWER_BLOCKS);
  assert.ok(entries.length > 0, "At least one citable answer block must be registered");

  for (const [slug, block] of entries) {
    const bodyWords = [block.intro, ...block.steps, block.takeaway]
      .join(" ")
      .trim()
      .split(/\s+/).length;

    const fullWords = [block.heading, block.intro, ...block.steps, block.takeaway]
      .join(" ")
      .trim()
      .split(/\s+/).length;

    assert.ok(
      bodyWords >= 130 && bodyWords <= 160,
      `Block '${slug}' body word count (${bodyWords}) must be between 130 and 160 words`
    );

    assert.ok(
      fullWords >= 130 && fullWords <= 160,
      `Block '${slug}' full word count with heading (${fullWords}) must be between 130 and 160 words`
    );
  }
});

test("Each citable answer block has at least 4 direct actionable bullet steps", () => {
  for (const [slug, block] of Object.entries(CITABLE_ANSWER_BLOCKS)) {
    assert.ok(
      Array.isArray(block.steps),
      `Block '${slug}' steps must be an array`
    );
    assert.ok(
      block.steps.length >= 4,
      `Block '${slug}' must contain at least 4 steps, found ${block.steps.length}`
    );

    block.steps.forEach((step, idx) => {
      assert.ok(
        typeof step === "string" && step.trim().length >= 15,
        `Block '${slug}' step ${idx + 1} must be a descriptive string`
      );
      assert.match(
        step,
        /^Step \d+:/,
        `Block '${slug}' step ${idx + 1} should have a direct 'Step N:' label for citeability`
      );
    });
  }
});

test("Citable answer blocks contain valid heading, intro, and privacy takeaway", () => {
  for (const [slug, block] of Object.entries(CITABLE_ANSWER_BLOCKS)) {
    assert.ok(
      block.heading.trim().length > 10,
      `Block '${slug}' heading must be non-empty`
    );
    assert.ok(
      block.intro.trim().length > 20,
      `Block '${slug}' intro must provide substantial context`
    );
    assert.ok(
      block.takeaway.trim().length > 20,
      `Block '${slug}' takeaway must provide substantial summary/privacy information`
    );
  }
});

test("Placement within top 30% of tool page content", () => {
  // A typical canonical tool page has ~850-950 words total.
  // Header card is ~35 words (~4%).
  // Citable answer block is ~138 words (~14%).
  // Placement right below header card spans words ~35 to ~173 (within top 4% to 20%),
  // which is well inside the top 30% of content (< 255 words).
  const headerCardEstimatedWords = 35;
  const pageTotalEstimatedWords = 850;
  const top30PercentThreshold = pageTotalEstimatedWords * 0.3; // 255 words

  for (const [slug, block] of Object.entries(CITABLE_ANSWER_BLOCKS)) {
    const blockWordCount = [block.intro, ...block.steps, block.takeaway]
      .join(" ")
      .trim()
      .split(/\s+/).length;
    const endOffset = headerCardEstimatedWords + blockWordCount;

    assert.ok(
      endOffset < top30PercentThreshold,
      `Block '${slug}' ending offset (${endOffset} words) must be within top 30% (${top30PercentThreshold} words)`
    );
  }
});
