import test from "node:test";
import assert from "node:assert/strict";
import {
  AI_TOOLS_DIRECTORY,
  AI_CATEGORIES,
  getAllAiTools,
  getAiToolBySlug,
  getAiToolsByCategory,
  getAlternativesForTool,
  getFeaturedAiTools,
  searchAiTools,
  type AiCategory,
} from "../data/aiToolsDirectory.ts";

test("AI Tools Directory - Minimum Scale & Uniqueness", () => {
  const allTools = getAllAiTools();
  assert.ok(
    allTools.length >= 100,
    `AI Directory must contain at least 100 curated tools, currently: ${allTools.length}`
  );

  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const tool of allTools) {
    assert.ok(tool.id && tool.id.trim(), `Tool missing id: ${JSON.stringify(tool)}`);
    assert.ok(tool.name && tool.name.trim(), `Tool ${tool.id} missing name`);
    assert.ok(tool.slug && tool.slug.trim(), `Tool ${tool.id} missing slug`);
    assert.ok(tool.tagline && tool.tagline.trim(), `Tool ${tool.id} missing tagline`);
    assert.ok(tool.description && tool.description.length >= 20, `Tool ${tool.id} description too short`);
    assert.ok(tool.category, `Tool ${tool.id} missing category`);
    assert.ok(tool.pricing, `Tool ${tool.id} missing pricing`);
    assert.ok(tool.startingPrice, `Tool ${tool.id} missing startingPrice`);
    assert.ok(tool.websiteUrl.startsWith("http"), `Tool ${tool.id} invalid websiteUrl: ${tool.websiteUrl}`);
    assert.ok(tool.icon, `Tool ${tool.id} missing icon`);
    assert.ok(Array.isArray(tool.tags) && tool.tags.length >= 2, `Tool ${tool.id} must have >= 2 tags`);
    assert.ok(Array.isArray(tool.pros) && tool.pros.length >= 2, `Tool ${tool.id} must have >= 2 pros`);
    assert.ok(Array.isArray(tool.cons) && tool.cons.length >= 1, `Tool ${tool.id} must have >= 1 cons`);
    assert.ok(Array.isArray(tool.alternatives), `Tool ${tool.id} missing alternatives array`);

    assert.ok(!ids.has(tool.id), `Duplicate tool ID detected: ${tool.id}`);
    assert.ok(!slugs.has(tool.slug), `Duplicate tool slug detected: ${tool.slug}`);

    ids.add(tool.id);
    slugs.add(tool.slug);
  }
});

test("AI Tools Directory - All Categories Populated with Quality Tools", () => {
  const validCategoryIds = new Set(AI_CATEGORIES.map((c) => c.id));
  assert.equal(AI_CATEGORIES.length, 7, "Expected 7 curated AI categories");

  const requiredCategories: AiCategory[] = [
    "writing",
    "coding",
    "image",
    "video",
    "audio",
    "productivity",
    "seo",
  ];

  for (const cat of requiredCategories) {
    assert.ok(validCategoryIds.has(cat), `Category '${cat}' not in AI_CATEGORIES`);
    const toolsInCat = getAiToolsByCategory(cat);
    assert.ok(
      toolsInCat.length >= 5,
      `Category '${cat}' has too few tools: ${toolsInCat.length} (expected at least 5)`
    );
  }
});

test("AI Tools Directory - Slug Lookup and Fallbacks", () => {
  const chatgpt = getAiToolBySlug("chatgpt");
  assert.ok(chatgpt, "Should find ChatGPT by slug");
  assert.equal(chatgpt?.name, "ChatGPT");

  const claude = getAiToolBySlug("claude");
  assert.ok(claude, "Should find Claude by slug");
  assert.equal(claude?.category, "writing");

  const missing = getAiToolBySlug("non-existent-ai-software-xyz");
  assert.equal(missing, undefined);
});

test("AI Tools Directory - Alternative Generation Robustness", () => {
  const allTools = getAllAiTools();

  for (const tool of allTools) {
    const alternatives = getAlternativesForTool(tool.slug);
    assert.ok(
      alternatives.length >= 2,
      `Tool '${tool.slug}' must have at least 2 alternatives returned, got ${alternatives.length}`
    );
    // Verify every explicitly listed alternative slug maps to a valid tool
    for (const altSlug of tool.alternatives) {
      assert.ok(
        allTools.some((t) => t.slug === altSlug || t.id === altSlug),
        `Tool '${tool.slug}' references unknown alternative slug: '${altSlug}'`
      );
    }
  }
});

test("AI Tools Directory - Real-time Search Engine", () => {
  const codeMatches = searchAiTools("python");
  assert.ok(codeMatches.length > 0, "Search for 'python' should match tools");

  const writingMatches = searchAiTools("essay", "writing");
  assert.ok(writingMatches.length > 0, "Search for 'essay' in writing should match tools");

  const emptySearch = searchAiTools("");
  assert.equal(emptySearch.length, AI_TOOLS_DIRECTORY.length, "Empty query returns all tools");
});

test("AI Tools Directory - Featured Tools Selection", () => {
  const featured = getFeaturedAiTools();
  assert.ok(featured.length >= 4, "Should have at least 4 featured AI tools");
  assert.ok(featured.every((t) => t.featured === true));
});
