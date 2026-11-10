# Original User Request

## Initial Request — 2026-11-10T03:27:31Z

Optimize `ai-text-utility` for Google Generative AI Search (AI Overviews, SGE, and conversational queries) based on Google Search Console intelligence, targeting conversational multi-intent queries like "condense a long paragraph into two paragraphs and remove line separators".

Working directory: d:/ai-text-tool
Integrity mode: development

## Requirements

### R1. Generative Engine Optimization (GEO) & Citable Answer Blocks
Implement self-contained, highly citable answer blocks (130–160 words) in the top 30% of content for high-impression tools (`/tools/remove-line-breaks`, `/tools/ai-summarize`). Structure content with direct bullet steps that Google AI Overviews and answer engines can cite directly.

### R2. Conversational Intent Search Guides & FAQ Coverage
Add practical search guides and educational FAQ pairs in `data/seo/searchGuides.ts` and `data/toolFaqs.ts` addressing multi-intent conversational tasks (condensing run-on text into 2 structured paragraphs, removing hard line separators, and formatting text without data upload).

### R3. 1-Click Paragraph Formatting & Cleanup Preset
Enhance `components/tools/TransformTool.tsx` and underlying text utilities to provide a 1-click preset option (e.g., "Clean Line Separators & Format into 2 Paragraphs" or double-break paragraph normalization) with accessible controls, running 100% in-browser with zero server compute.

## Acceptance Criteria

### Automated Verification
- [ ] `npm run typecheck` passes with 0 TypeScript errors.
- [ ] `npm test` passes all 258+ unit and integration tests.
- [ ] `npm run check:production` crawls and passes all 184 canonical pages with single H1s, server-rendered guides, FAQ content, and valid schemas.
- [ ] `npm run build` succeeds with 0 errors across all 239 SSG static routes.

### SEO & GEO Guardrails
- [ ] Front-loaded citable answer blocks placed within the top 30% of content.
- [ ] Preserves strict single `<h1>` per page and valid heading hierarchy (`h1` -> `h2` -> `h3`).
- [ ] Retains 100% browser client-side privacy with $0 server hosting cost.
- [ ] Clean sync with git remotes (`fahadbwp/main` and `origin/main`).
