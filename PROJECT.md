# Project: ai-text-utility Google Generative Search & Conversational Optimization

## Architecture
The application is a Next.js (App Router, SSG/SSR) utility providing 59+ tools with 100% in-browser client-side execution, zero server compute cost, and strict privacy guarantees.
- **Routing & Rendering**: `app/tools/[slug]/page.tsx` renders dynamic routes with SSG parameters, canonical redirects, and JSON-LD structured data (`WebApplication`, `BreadcrumbList`).
- **Heading Hierarchy Contract**: Exactly one `<h1>` per page, hosted exclusively in `components/layouts/ToolShell.tsx:124`. All sub-headings must strictly follow `<h2>` -> `<h3>`.
- **Schema Guardrail**: `FAQPage` JSON-LD schema is strictly prohibited by `scripts/check-production.mjs:68-72` to avoid rich snippet conflicts. Visible FAQ content is rendered as semantic HTML (`section[aria-labelledby="faq-heading"]` -> `h2#faq-heading` -> `h3` -> `p`).
- **GEO & Citable Answer Blocks (R1)**: Self-contained 130–160 word structured blocks with direct bullet steps rendered in `components/layouts/ToolShell.tsx` between Header Card and tool workspace, residing at word offset ~35–175 (top 4%–21% of DOM content, well within the top 30% boundary).
- **Conversational Search Guides & FAQs (R2)**: Structured intent guides in `data/seo/searchGuides.ts` and educational FAQ pairs in `data/seo/faq.ts` (`data/toolFaqs.ts`) targeting conversational multi-intent queries.
- **Client-Side Text Engine & Presets (R3)**: Pure TypeScript transformation logic in `lib/tools/removeLineBreaks.ts` and accessible 1-click UI preset controls in `components/tools/TransformTool.tsx` with live mode reactivity and zero server transmission.

## Code Layout
- `data/seo/citableAnswerBlocks.ts`: Citable answer block content model and registry (F1). [DONE]
- `components/layouts/ToolShell.tsx`: Layout shell hosting single `<h1>` and the top-30% citable answer block component (F2). [DONE]
- `data/seo/searchGuides.ts`: Editorial search guides with input/output examples, use cases, limitations, and FAQs (F3). [DONE]
- `data/seo/faq.ts` / `data/toolFaqs.ts`: Tool-specific FAQ items and educational content (F4). [DONE]
- `lib/tools/removeLineBreaks.ts`: Core line break removal, hyphen cleanup, lookbehind sentence splitting, and 2-paragraph formatting logic (F5). [DONE]
- `components/tools/TransformTool.tsx`: Interactive transform tool with accessible 1-click presets bar (F6). [DONE]
- `tests/e2e/geo-and-presets.test.ts`: E2E opaque-box test suite covering Tiers 1-4 (F7). [DONE]
- `tests/seo/citableAnswerBlocks.test.ts`: Unit test suite verifying answer block word counts (130-160 words), bullet steps, and placement contracts (F1/F2). [DONE]
- `tests/tools/cleanupTools.test.ts`: Unit tests verifying `removeLineBreaks` presets, 2-paragraph formatting, and adversarial edge cases (F5). [DONE]
- `tests/seo/searchGuides.test.ts`: Integration tests verifying search guides sync with FAQs and transform outputs (F3/F4). [DONE]
- `tests/adversarial.test.ts`: White-box Tier 5 adversarial tests covering decimals, emails, unicode hyphens, and dividers. [DONE]

## Feature Inventory
| # | Feature | Description | Milestone | Status |
|---|---------|-------------|-----------|--------|
| 1 | Citable Answer Blocks Data | 130–160 word self-contained blocks with direct bullet steps for `/tools/remove-line-breaks` and `/tools/ai-summarize` | M1 | DONE |
| 2 | Top-30% Answer Block Component | Server-rendered callout card below Header Card in `ToolShell.tsx` using `<h2>` heading | M1 | DONE |
| 3 | Conversational Search Guides | Rich editorial guides in `data/seo/searchGuides.ts` for `remove-line-breaks` and `ai-summarize` | M2 | DONE |
| 4 | Conversational FAQ Coverage | Multi-intent conversational FAQ pairs in `data/seo/faq.ts` (`data/toolFaqs.ts`) | M2 | DONE |
| 5 | Two-Paragraph Formatting Engine | Pure helper `formatIntoTwoParagraphs` and preset options in `lib/tools/removeLineBreaks.ts` | M3 | DONE |
| 6 | 1-Click Accessible Presets Bar | Accessible button group (`aria-pressed`, `aria-label`) in `TransformTool.tsx` with live preview | M3 | DONE |
| 7 | E2E Test Suite (Tiers 1-4) | Comprehensive opaque-box test suite for search guides, FAQs, GEO blocks, and presets | Track-E | DONE |
| 8 | Final Pipeline Verification & Adversarial Hardening (Tier 5) | 100% E2E test pass, typecheck, test (337 pass), build (239 routes), check:production (184 pages), git sync | M4 & Tier 5 | DONE |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| Track-E | E2E Testing Track | Design and publish E2E test suite (`tests/e2e/geo-and-presets.test.ts`), `TEST_INFRA.md`, and `TEST_READY.md` | none | DONE |
| M1 | GEO & Citable Answer Blocks | Create `citableAnswerBlocks.ts`, render in `ToolShell.tsx`, add `citableAnswerBlocks.test.ts` | none | DONE |
| M2 | Conversational Search Guides & FAQs | Update `searchGuides.ts`, `faq.ts`, `tests/seo/searchGuides.test.ts` | none | DONE |
| M3 | 1-Click Paragraph Cleanup Preset | Update `removeLineBreaks.ts`, `TransformTool.tsx`, `cleanupTools.test.ts` | none | DONE |
| M4 | Final Milestone & Adversarial Hardening | Verify 100% E2E tests, Tier 5 whitebox adversarial tests, full audit, and pipeline gate | Track-E, M1, M2, M3 | DONE |
