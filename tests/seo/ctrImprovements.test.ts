import test from "node:test";
import assert from "node:assert/strict";
import { getToolSeoBlueprint, ToolSeoBlueprint } from "../../data/seoBlueprint.ts";
import { SEARCH_GUIDES } from "../../data/seo/searchGuides.ts";
import { getToolEducationalContent } from "../../data/seo/faq.ts";
import { TOOLS_REGISTRY, getToolBySlug } from "../../data/toolsRegistry.ts";
import { isValidInternalRoute, renderAnswerWithLinks } from "../../components/ToolSeoContent.tsx";
import React from "react";

const TARGET_SLUGS = [
  "ai-friendly",
  "remove-special-chars",
  "ai-professional",
  "ai-expand",
  "remove-extra-spaces",
  "slug-generator",
  "ai-paraphrase",
] as const;

test("SEO Phase 1 - 7 Target Tools Blueprint Existence & Metadata Quality", () => {
  for (const slug of TARGET_SLUGS) {
    const blueprint = getToolSeoBlueprint(slug);
    assert.ok(blueprint, `Blueprint must exist for ${slug}`);

    // Title validation: 40 - 75 characters, front-loaded keyword, non-empty
    assert.ok(blueprint.title.length >= 40, `Title too short for ${slug}: ${blueprint.title.length}`);
    assert.ok(blueprint.title.length <= 75, `Title too long for ${slug}: ${blueprint.title.length}`);

    // Meta description validation: 130 - 180 characters, compelling CTA, non-empty
    assert.ok(
      blueprint.metaDescription.length >= 130,
      `Meta description too short for ${slug}: ${blueprint.metaDescription.length}`
    );
    assert.ok(
      blueprint.metaDescription.length <= 180,
      `Meta description too long for ${slug}: ${blueprint.metaDescription.length}`
    );

    // H1 validation
    assert.ok(blueprint.h1.length > 5, `H1 must be non-empty for ${slug}`);
    assert.ok(!blueprint.h1.includes("–"), `H1 must not contain title separators for ${slug}`);

    // Above the fold intro validation
    assert.ok(blueprint.aboveTheFoldIntro.length > 30, `Intro must be descriptive for ${slug}`);
  }
});

test("SEO Phase 1 - Distinct Titles and Meta Descriptions (No Duplicates)", () => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const slug of TARGET_SLUGS) {
    const bp = getToolSeoBlueprint(slug)!;
    assert.ok(!titles.has(bp.title), `Duplicate title detected: ${bp.title}`);
    assert.ok(!descriptions.has(bp.metaDescription), `Duplicate description detected: ${bp.metaDescription}`);
    titles.add(bp.title);
    descriptions.add(bp.metaDescription);
  }
});

test("SEO Phase 1 - Search Guides Input/Output Examples & Limitations", () => {
  for (const slug of TARGET_SLUGS) {
    const guide = SEARCH_GUIDES[slug];
    assert.ok(guide, `SearchGuide must exist for ${slug}`);
    assert.ok(guide.heading.length > 10, `Heading must be descriptive for ${slug}`);
    assert.ok(guide.useCase.length > 20, `UseCase must be actionable for ${slug}`);
    assert.ok(guide.example.input.length > 0, `Example input must be non-empty for ${slug}`);
    assert.ok(guide.example.output.length > 0, `Example output must be non-empty for ${slug}`);
    assert.ok(guide.limitation.length > 20, `Limitation must clearly define scope for ${slug}`);
    assert.ok(guide.faq.question.length > 10, `FAQ question must exist for ${slug}`);
    assert.ok(guide.faq.answer.length > 20, `FAQ answer must exist for ${slug}`);
  }
});

test("SEO Phase 1 - Contextual Internal Links Validity", () => {
  for (const slug of TARGET_SLUGS) {
    const guide = SEARCH_GUIDES[slug];
    assert.ok(guide.related.length >= 3, `Must have at least 3 related tools for ${slug}`);

    for (const relSlug of guide.related) {
      const tool = getToolBySlug(relSlug);
      assert.ok(tool, `Related slug "${relSlug}" referenced by ${slug} must exist in TOOLS_REGISTRY`);
      assert.notEqual(relSlug, slug, `Tool ${slug} should not link to itself in related list`);
    }

    // Check links in useCase or FAQ answers
    const content = getToolEducationalContent("Text", slug, slug);
    const linkRegex = /\[([^\]]+)\]\(\/tools\/([^)]+)\)/g;
    const allText = `${guide.useCase} ${guide.limitation} ${content.faqs.map((f) => f.answer).join(" ")}`;
    let match: RegExpExecArray | null;

    let foundLinkCount = 0;
    while ((match = linkRegex.exec(allText)) !== null) {
      foundLinkCount++;
      const linkedSlug = match[2];
      const linkedTool = getToolBySlug(linkedSlug);
      assert.ok(linkedTool, `Linked slug "${linkedSlug}" from ${slug} must exist in TOOLS_REGISTRY`);
    }
    assert.ok(foundLinkCount > 0, `At least one contextual internal link must exist for ${slug}`);
  }
});

test("SEO Phase 1 - GSC Specific Search Term Alignments", () => {
  // 1. ai-friendly: Must contain 'AI Friendly' in title and H1
  const aiFriendly = getToolSeoBlueprint("ai-friendly")!;
  assert.ok(aiFriendly.title.toLowerCase().includes("ai friendly"), "Title must contain 'ai friendly'");
  assert.equal(aiFriendly.h1, "AI Friendly Text Rewriter");

  // 2. remove-special-chars: Must contain 'Remove Special Characters' in title and H1
  const specialChars = getToolSeoBlueprint("remove-special-chars")!;
  assert.ok(specialChars.title.toLowerCase().includes("remove special characters"), "Title must contain target query");
  assert.equal(specialChars.h1, "Remove Special Characters Online");

  // 3. ai-professional: Must target professional business emails / tone
  const prof = getToolSeoBlueprint("ai-professional")!;
  assert.ok(prof.title.toLowerCase().includes("professional"), "Title must target professional query");
  assert.equal(prof.h1, "AI Professional Tone Rewriter");

  // 4. ai-expand: Must target text expander / sentence expand
  const expand = getToolSeoBlueprint("ai-expand")!;
  assert.ok(expand.title.toLowerCase().includes("text expander"), "Title must target text expander query");
  assert.equal(expand.h1, "AI Text & Sentence Expander");

  // 5. remove-extra-spaces: Must target remove extra spaces / whitespace cleaner
  const spaces = getToolSeoBlueprint("remove-extra-spaces")!;
  assert.ok(spaces.title.toLowerCase().includes("remove extra spaces"), "Title must target remove extra spaces");
  assert.equal(spaces.h1, "Remove Extra Spaces from Text");

  // 6. slug-generator: Must target slug generator / seo slug
  const slugGen = getToolSeoBlueprint("slug-generator")!;
  assert.ok(slugGen.title.toLowerCase().includes("slug generator"), "Title must target slug generator");
  assert.equal(slugGen.h1, "Online SEO Slug Generator");

  // 7. ai-paraphrase: Must target paraphrasing tool / rephrase
  const paraphrase = getToolSeoBlueprint("ai-paraphrase")!;
  assert.ok(paraphrase.title.toLowerCase().includes("paraphrasing tool"), "Title must target paraphrasing tool");
  assert.equal(paraphrase.h1, "Free Online AI Paraphrasing Tool");
});


test("SEO Phase 1 - isValidInternalRoute Security & Scope Validation", () => {
  // Positive assertions: Registered tools and root path
  assert.equal(isValidInternalRoute("/tools/word-counter"), true, "Valid registered tool must pass");
  assert.equal(isValidInternalRoute("/tools/ai-friendly"), true, "Valid registered tool must pass");
  assert.equal(isValidInternalRoute("/tools/slug-generator"), true, "Valid registered tool must pass");
  assert.equal(isValidInternalRoute("/tools/remove-special-chars"), true, "Valid registered tool must pass");
  assert.equal(isValidInternalRoute("/"), true, "Root path must pass");

  // Negative assertions: Unregistered tools, external URLs, dangerous schemes, traversals
  assert.equal(isValidInternalRoute("/tools/nonexistent-tool-xyz"), false, "Unregistered tool must fail");
  assert.equal(isValidInternalRoute("https://external-site.com"), false, "HTTPS URL must fail");
  assert.equal(isValidInternalRoute("http://external-site.com"), false, "HTTP URL must fail");
  assert.equal(isValidInternalRoute("//external-site.com"), false, "Protocol-relative URL must fail");
  assert.equal(isValidInternalRoute("javascript:alert(1)"), false, "javascript: scheme must fail");
  assert.equal(isValidInternalRoute("data:text/html,<script>"), false, "data: scheme must fail");
  assert.equal(isValidInternalRoute("/tools/word-counter/../../etc/passwd"), false, "Path traversal must fail");
  assert.equal(isValidInternalRoute("/api/ai"), false, "Non-tool API route must fail");
  assert.equal(isValidInternalRoute(""), false, "Empty URL must fail");
  assert.equal(isValidInternalRoute("   "), false, "Whitespace URL must fail");
});

test("SEO Phase 1 - renderAnswerWithLinks Sanitization & Fallback", () => {
  // Positive: Valid internal link renders React Link element
  const validOutput = renderAnswerWithLinks("Explore our [Word Counter](/tools/word-counter) utility.");
  assert.ok(Array.isArray(validOutput), "Output with valid link should be an array of React nodes");
  const linkNode = validOutput.find((node) => React.isValidElement(node)) as React.ReactElement | undefined;
  assert.ok(linkNode, "Valid link must produce a React element");
  assert.equal(linkNode?.props.href, "/tools/word-counter");

  // Negative: Malicious / external / unregistered link falls back to plain text label
  const maliciousOutput = renderAnswerWithLinks("Check this [Security Exploit](javascript:alert(1)) immediately.");
  assert.ok(Array.isArray(maliciousOutput), "Output should be an array of nodes");
  const maliciousElements = maliciousOutput.filter((node) => React.isValidElement(node));
  assert.equal(maliciousElements.length, 0, "Must not create any React elements for dangerous links");
  assert.ok(maliciousOutput.includes("Security Exploit"), "Should preserve the text label as safe plain text");

  const externalOutput = renderAnswerWithLinks("Visit [External Website](https://example.com) for details.");
  const externalElements = (externalOutput as React.ReactNode[]).filter((node) => React.isValidElement(node));
  assert.equal(externalElements.length, 0, "Must not create any React elements for external links");
  assert.ok((externalOutput as React.ReactNode[]).includes("External Website"), "Should keep plain text label");

  const unregisteredOutput = renderAnswerWithLinks("Use [Ghost Tool](/tools/unregistered-slug-12345) here.");
  const unregisteredElements = (unregisteredOutput as React.ReactNode[]).filter((node) => React.isValidElement(node));
  assert.equal(unregisteredElements.length, 0, "Must not link to unregistered tools");
  assert.ok((unregisteredOutput as React.ReactNode[]).includes("Ghost Tool"), "Should keep plain text label");
});
