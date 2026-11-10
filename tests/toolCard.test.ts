import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { TOOLS_REGISTRY, CATEGORIES } from "../data/toolsRegistry.ts";
import { ToolCard } from "../components/ToolCard.tsx";
import { getToolTheme, getCategoryTheme, PALETTE } from "../lib/toolThemes.ts";

test("ToolCard - All 59 tools render completely with valid links and accessibility", () => {
  assert.equal(TOOLS_REGISTRY.length, 59, "Registry contains all 59 utilities");

  for (const tool of TOOLS_REGISTRY) {
    const html = renderToString(React.createElement(ToolCard, { tool }));

    // Link must point to canonical tool slug
    assert.ok(
      html.includes(`href="/tools/${tool.slug}"`),
      `${tool.id}: missing or broken link to /tools/${tool.slug}`
    );

    // Title must be present (HTML-escaped)
    const escapedName = tool.name.replace(/&/g, "&amp;");
    assert.ok(
      html.includes(escapedName),
      `${tool.id}: tool name "${tool.name}" missing from card`
    );

    // Description must be present
    const escapedDesc = tool.description.replace(/&/g, "&amp;");
    assert.ok(
      html.includes(escapedDesc),
      `${tool.id}: tool description missing from card`
    );

    // Category badge must be present
    const escapedCat = tool.category.replace(/&/g, "&amp;");
    assert.ok(
      html.includes(escapedCat),
      `${tool.id}: category badge "${tool.category}" missing from card`
    );

    // Accessible favorite button must be present
    assert.ok(
      html.includes('aria-label="Add ') || html.includes('aria-label="Remove '),
      `${tool.id}: favorite button lacks accessible name`
    );

    // Speed / AI indicator must be present
    if (tool.requiresAI) {
      assert.ok(html.includes("AI"), `${tool.id}: requiresAI tool must show AI indicator`);
    } else {
      assert.ok(html.includes("Instant"), `${tool.id}: browser tool must show Instant indicator`);
    }
  }
});

test("ToolCard - Featured card variant renders featured badge and border styling", () => {
  const diffChecker = TOOLS_REGISTRY.find((t) => t.id === "diff-checker")!;
  const standardHtml = renderToString(React.createElement(ToolCard, { tool: diffChecker, featured: false }));
  const featuredHtml = renderToString(React.createElement(ToolCard, { tool: diffChecker, featured: true }));

  assert.ok(!standardHtml.includes("Featured"), "Standard card should not render Featured badge");
  assert.ok(featuredHtml.includes("Featured"), "Featured card must render Featured badge");
  assert.ok(featuredHtml.includes("ring-1"), "Featured card must include ring outline");
});

test("ToolCard - Custom badgeLabel renders when passed", () => {
  const wordCounter = TOOLS_REGISTRY.find((t) => t.id === "word-counter")!;
  const html = renderToString(React.createElement(ToolCard, { tool: wordCounter, badgeLabel: "Recent" }));

  assert.ok(html.includes("Recent"), "Card should render custom badgeLabel");
});

test("ToolThemes - Every category and tool has valid design tokens", () => {
  for (const cat of CATEGORIES) {
    const theme = getCategoryTheme(cat.name);
    assert.ok(theme.accent.startsWith("#"), `${cat.name}: missing hex accent`);
    assert.ok(theme.iconBg.startsWith("bg-"), `${cat.name}: missing iconBg`);
    assert.ok(theme.badgeBg.startsWith("bg-"), `${cat.name}: missing badgeBg`);
  }

  for (const tool of TOOLS_REGISTRY) {
    const theme = getToolTheme(tool.id, tool.category);
    assert.ok(theme.accent.startsWith("#"), `${tool.id}: missing hex accent`);
    assert.ok(theme.iconBg.startsWith("bg-"), `${tool.id}: missing iconBg`);
  }
});
