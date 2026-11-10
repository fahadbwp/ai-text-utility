# BRIEFING — 2026-11-10T03:45:00Z

## Mission
Extract and document exact specifications, data contracts, heading hierarchy, word count, schema constraints, and verification rules for R1 (GEO Citable Answer Blocks) and R2 (Conversational Intent Search Guides & FAQ Coverage).

## 🔒 My Identity
- Archetype: Specification Miner
- Roles: Specification Mining, Teamwork specialist
- Working directory: d:\ai-text-tool\.agents\teamwork\survey_explorer_2
- Original parent: 79340a7f-ea06-4433-abc9-447aa6cb7b2b
- Milestone: Exploration & Spec Mining (Survey Phase)

## 🔒 Key Constraints
- Do NOT modify any source code (read-only role).
- Report findings in `handoff.md` with standard 5 sections (Observation, Logic Chain, Caveats, Conclusion, Verification Method) and specification miner tables (Features Discovered, Edge Cases).
- Prioritize authoritative codebase and test/crawler sources over assumptions.

## Current Parent
- Conversation ID: 79340a7f-ea06-4433-abc9-447aa6cb7b2b
- Updated: 2026-11-10T03:29:44Z

## Task Summary
- **What to build/probe**:
  1. `data/seo/searchGuides.ts` structure, type definitions, usage across routes, existing entries.
  2. `data/toolFaqs.ts` structure, type definitions, usage across routes, FAQ schema generation (`FAQPage`), existing entries.
  3. R1 GEO citable answer blocks specs: 130-160 words, placement in top 30% of content, direct bullet steps for `/tools/remove-line-breaks` and `/tools/ai-summarize`. How answer blocks are rendered or where they fit into page templates (`ToolShell`, `ToolSeoContent`, etc.).
  4. R2 Conversational search guides & FAQ coverage: multi-intent conversational tasks (condensing run-on text into 2 structured paragraphs, removing hard line separators, formatting text without data upload).
  5. `npm run check:production` verification script: how it checks canonical pages, headings (single H1, valid hierarchy), schemas, and SSR content.
- **Success criteria**: Comprehensive, exact data contracts, line references, word count rules, heading structure rules, and verification requirements documented in `handoff.md`.
- **Status**: Investigation completed. Findings synthesized in `handoff.md`.

## Key Decisions Made
- Discovered and confirmed strict prohibition on `FAQPage` JSON-LD schema enforced by `scripts/check-production.mjs:72`.
- Discovered strict single `<h1>` enforcement by `scripts/check-production.mjs:35`.
- Verified word position math: placing Citable Answer Blocks in `ToolShell.tsx` below Header Card and above workspace places them at word offset ~35–175 (top 4.1%–20.6% of the ~850-word page), strictly satisfying the top 30% requirement with an `<h2>` heading.
- Drafted exact 138-word Citable Answer Blocks for both `/tools/remove-line-breaks` and `/tools/ai-summarize` with direct bullet steps.
- Formulated exact `SearchGuide` additions for `remove-line-breaks` and `ai-summarize` (titles 54 and 58 chars, descriptions 157 and 148 chars, illustrative note for AI tool).
- Formulated exact educational FAQ pairs for `data/seo/faq.ts` covering multi-intent conversational tasks.

## Artifact Index
- `d:\ai-text-tool\.agents\teamwork\survey_explorer_2\DISPATCH.md` — Task assignment
- `d:\ai-text-tool\.agents\teamwork\survey_explorer_2\BRIEFING.md` — Agent briefing
- `d:\ai-text-tool\.agents\teamwork\survey_explorer_2\progress.md` — Liveness and progress
- `d:\ai-text-tool\.agents\teamwork\survey_explorer_2\handoff.md` — Final findings report
