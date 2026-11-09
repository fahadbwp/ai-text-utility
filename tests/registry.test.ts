import test from "node:test";
import assert from "node:assert/strict";
import {
  TOOLS_REGISTRY,
  CATEGORIES,
  getAllTools,
  getToolBySlug,
  getToolsByCategory,
  getFeaturedTools,
  searchTools,
  validateToolsRegistry,
  assertValidRegistry,
  TEXT_TOOLS,
  FORMAT_TOOLS,
  CLEANUP_TOOLS,
  TRANSFORM_TOOLS,
  DATE_TIME_TOOLS,
  AI_TOOLS,
  IMAGE_TOOLS,
  PDF_TOOLS,
  BUSINESS_TOOLS,
} from "../data/toolsRegistry.ts";
import type { ToolDefinition } from "../data/tools/types.ts";

test("Tools Registry - Structure & Uniqueness", () => {
  const allTools = getAllTools();
  assert.ok(allTools.length >= 40, "Registry should contain 40+ utilities");

  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const tool of allTools) {
    assert.ok(tool.id, `Tool missing id: ${JSON.stringify(tool)}`);
    assert.ok(tool.name, `Tool ${tool.id} missing name`);
    assert.ok(tool.slug, `Tool ${tool.id} missing slug`);
    assert.ok(tool.category, `Tool ${tool.id} missing category`);
    assert.ok(tool.description, `Tool ${tool.id} missing description`);
    assert.ok(tool.icon, `Tool ${tool.id} missing icon`);
    assert.ok(Array.isArray(tool.keywords) && tool.keywords.length > 0, `Tool ${tool.id} missing keywords`);

    assert.ok(!ids.has(tool.id), `Duplicate tool id detected: ${tool.id}`);
    assert.ok(!slugs.has(tool.slug), `Duplicate tool slug detected: ${tool.slug}`);

    ids.add(tool.id);
    slugs.add(tool.slug);
  }
});

test("Tools Registry - Modular Category Consistency", () => {
  assert.equal(TEXT_TOOLS.length, 15);
  assert.equal(FORMAT_TOOLS.length, 8);
  assert.equal(CLEANUP_TOOLS.length, 10);
  assert.equal(TRANSFORM_TOOLS.length, 12);
  assert.equal(DATE_TIME_TOOLS.length, 2);
  assert.equal(AI_TOOLS.length, 7);
  assert.equal(IMAGE_TOOLS.length, 3);
  assert.equal(PDF_TOOLS.length, 1);
  assert.equal(BUSINESS_TOOLS.length, 1);

  const totalSum =
    TEXT_TOOLS.length +
    FORMAT_TOOLS.length +
    CLEANUP_TOOLS.length +
    TRANSFORM_TOOLS.length +
    DATE_TIME_TOOLS.length +
    AI_TOOLS.length +
    IMAGE_TOOLS.length +
    PDF_TOOLS.length +
    BUSINESS_TOOLS.length;

  assert.equal(TOOLS_REGISTRY.length, totalSum);
  assert.equal(TOOLS_REGISTRY.length, 59);
});

test("Tools Registry - Valid Categories", () => {
  const validCategories = new Set(CATEGORIES.map((c) => c.name));
  for (const tool of TOOLS_REGISTRY) {
    assert.ok(
      validCategories.has(tool.category),
      `Tool ${tool.id} has invalid category: ${tool.category}`
    );
  }
});

test("Tools Registry - Lookup Helpers & Alias Resolution", () => {
  const wordCounter = getToolBySlug("word-counter");
  assert.ok(wordCounter, "getToolBySlug should find 'word-counter'");
  assert.equal(wordCounter?.name, "Word Counter");

  const nonExistent = getToolBySlug("non-existent-tool");
  assert.equal(nonExistent, undefined);

  // Test that all aliases resolve to their primary tool
  const expectedAliases = [
    { alias: "base64-encoder-decoder", expectedSlug: "base64" },
    { alias: "base64-encoder", expectedSlug: "base64" },
    { alias: "base64-decoder", expectedSlug: "base64" },
    { alias: "unix-timestamp-converter", expectedSlug: "unix-timestamp" },
    { alias: "date-difference-calculator", expectedSlug: "date-difference" },
    { alias: "grammar-spelling-fixer", expectedSlug: "ai-grammar" },
    { alias: "grammar-fixer", expectedSlug: "ai-grammar" },
    { alias: "ai-summarizer", expectedSlug: "ai-summarize" },
    { alias: "prompt-sanitizer", expectedSlug: "pii-sanitizer" },
    { alias: "keyword-frequency-counter", expectedSlug: "word-frequency" },
    { alias: "keyword-density-counter", expectedSlug: "word-frequency" },
        { alias: "word-frequency-counter", expectedSlug: "word-frequency" },
    { alias: "json-to-ts", expectedSlug: "json-to-typescript" },
    { alias: "json-to-zod", expectedSlug: "json-to-typescript" },
  ];

  for (const { alias, expectedSlug } of expectedAliases) {
    const resolved = getToolBySlug(alias);
    assert.ok(resolved, `Alias '${alias}' must resolve`);
    assert.equal(resolved?.slug, expectedSlug);
  }

  const textTools = getToolsByCategory("Text");
  assert.ok(textTools.length > 0);
  assert.ok(textTools.every((t) => t.category === "Text"));

  const featured = getFeaturedTools();
  assert.ok(featured.length > 0);
  assert.ok(featured.every((t) => t.featured));
});

test("Tools Registry - Search Engine", () => {
  const all = searchTools("");
  assert.equal(all.length, TOOLS_REGISTRY.length);

  const results = searchTools("slug");
  assert.ok(results.some((t) => t.slug === "slug-generator"));

  const aiResults = searchTools("AI Magic");
  assert.ok(aiResults.length >= 6);

  const empty = searchTools("xyznonexistenttool999");
  assert.equal(empty.length, 0);
});

test("Tools Registry - Valid Layouts", () => {
  const validLayouts = new Set([
    "transform",
    "generator",
    "dashboard",
    "table",
    "twoWay",
    "validator",
    "highlight",
    "splitPreview",
    "gallery",
    "compact",
    "ai",
  ]);

  for (const tool of TOOLS_REGISTRY) {
    assert.ok(
      validLayouts.has(tool.layout),
      `Tool ${tool.id} has invalid layout: ${tool.layout}`
    );
  }
});

test("Tools Registry - Automated Invariant Validation", () => {
  // Production registry must pass completely
  const result = validateToolsRegistry(TOOLS_REGISTRY);
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
  assert.doesNotThrow(() => assertValidRegistry(TOOLS_REGISTRY));

  // Test Simulated Duplicate ID Detection
  const duplicateIdList: ToolDefinition[] = [
    ...TOOLS_REGISTRY.slice(0, 2),
    { ...TOOLS_REGISTRY[0], slug: "unique-slug-test" },
  ];
  const dupIdRes = validateToolsRegistry(duplicateIdList);
  assert.equal(dupIdRes.valid, false);
  assert.ok(dupIdRes.errors.some((e) => e.includes("Duplicate tool ID detected")));

  // Test Simulated Duplicate Slug Detection
  const duplicateSlugList: ToolDefinition[] = [
    ...TOOLS_REGISTRY.slice(0, 2),
    { ...TOOLS_REGISTRY[0], id: "unique-id-test" },
  ];
  const dupSlugRes = validateToolsRegistry(duplicateSlugList);
  assert.equal(dupSlugRes.valid, false);
  assert.ok(dupSlugRes.errors.some((e) => e.includes("Duplicate tool slug detected")));

  // Test Simulated Alias-Slug Collision Detection
  const aliasCollisionList: ToolDefinition[] = [
    {
      id: "tool-a",
      name: "Tool A",
      slug: "tool-a",
      category: "Text",
      description: "Sample",
      icon: "Link2",
      keywords: ["test"],
      layout: "transform",
      aliases: ["tool-b"], // collides with tool-b's primary slug
    },
    {
      id: "tool-b",
      name: "Tool B",
      slug: "tool-b",
      category: "Text",
      description: "Sample",
      icon: "Link2",
      keywords: ["test"],
      layout: "transform",
    },
  ];
  const aliasCollisionRes = validateToolsRegistry(aliasCollisionList);
  assert.equal(aliasCollisionRes.valid, false);
  assert.ok(aliasCollisionRes.errors.some((e) => e.includes("collision")));

  // Test Simulated Missing Required Metadata
  const missingFieldList: ToolDefinition[] = [
    {
      id: "invalid-tool",
      name: "",
      slug: "invalid-tool",
      category: "Text",
      description: "",
      icon: "",
      keywords: [],
      layout: "transform",
    },
  ];
  const missingFieldRes = validateToolsRegistry(missingFieldList);
  assert.equal(missingFieldRes.valid, false);
  assert.ok(missingFieldRes.errors.length >= 3);
});
