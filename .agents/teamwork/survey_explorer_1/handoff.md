# Architecture, Pages & Verification Pipeline Survey

## 1. Observation

### Baseline Verification Pipeline Results
Direct tool execution on `d:\ai-text-tool` confirmed the current baseline health:
- **`npm run typecheck`** (`tsc --noEmit`):
  ```text
  > ai-smart-text-utility@1.0.0 typecheck
  > tsc --noEmit
  Exited with code 0.
  ```
- **`npm test`** (`node --import tsx --test "tests/**/*.test.ts"`):
  ```text
  ℹ tests 258
  ℹ suites 0
  ℹ pass 258
  ℹ fail 0
  ℹ cancelled 0
  ℹ skipped 0
  ℹ todo 0
  ℹ duration_ms 18172.5509
  Exited with code 0.
  ```
- **`npm run build`** (`next build`):
  ```text
  ✓ Compiled successfully in 1720ms
  ✓ Generating static pages using 7 workers (239/239) in 8.6s
  Total static routes: 239 (SSG / Static / Dynamic)
  Exited with code 0.
  ```
- **`npm run check:production`** (`node --experimental-strip-types scripts/check-production.mjs`):
  ```text
  PASS: 184 canonical pages, titles, descriptions, H1s, social images, visible FAQ content, absent FAQPage schema, application/breadcrumb schemas, aliases, 404/noindex, named controls, internal tool links, practical guides and canonical sitemap
  Exited with code 0.
  ```
- **Git Remotes & Branch**:
  - `fahadbwp` -> `https://github.com/fahadbwp/ai-text-utility.git` (fetch/push)
  - `origin` -> `https://github.com/advertisingbwp-cmyk/ai-text-utility.git` (fetch/push)
  - Branch: `main` (clean working tree, up to date with `fahadbwp/main`).

### Tool Page Architecture (`/tools/[slug]`)
1. **Dynamic Routing**:
   - `app/tools/[slug]/page.tsx` defines static parameters across all `TOOLS_REGISTRY` tools and aliases.
   - Enforces canonical redirects: line 117 `if (slug !== tool.slug) { permanentRedirect(`/tools/${tool.slug}`); }` (e.g., alias `/tools/ai-summarizer` -> 308 redirect to `/tools/ai-summarize`).
2. **Metadata & Schemas**:
   - Lines 28–106: `generateMetadata()` reads from `getToolSeoBlueprint(tool.slug)` (falling back to registry description).
   - Lines 127–172: injects JSON-LD for `WebApplication` and `BreadcrumbList`.
   - Lines 69–72 in `scripts/check-production.mjs` explicitly assert that `FAQPage` schema is **absent** from JSON-LD to prevent Google rich result policy conflicts.
3. **Component Hierarchy**:
   - `app/tools/[slug]/page.tsx` renders:
     ```tsx
     <article>
       <ToolPageClient tool={tool} />
       <ToolAdvertisements tool={tool} />
       <ToolSeoContent tool={tool} />
     </article>
     ```
   - In `app/tools/[slug]/ToolPageClient.tsx`:
     - Dispatches `remove-line-breaks` to `<TransformTool tool={tool} />` (lines 89–90).
     - Dispatches `ai-summarize` (`tool.category === "AI Magic"`) to `<AiTool tool={tool} />` (lines 34–36).
   - In both tools, the layout wrapper `components/layouts/ToolWorkspaceResolver.tsx` resolves to `components/layouts/ToolShell.tsx`.

### Heading Hierarchy (`H1` -> `H2` -> `H3`)
- **Single `<h1>`**:
  - Found exclusively in `components/layouts/ToolShell.tsx` (lines 124–126):
    ```tsx
    <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
      {blueprint?.h1 || tool.name}
    </h1>
    ```
  - Directly followed by above-the-fold introductory text (lines 142–144):
    ```tsx
    <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
      {blueprint?.aboveTheFoldIntro || tool.description}
    </p>
    ```
- **SEO Sections in `components/ToolSeoContent.tsx`**:
  - `h2#about-heading`: `"About {tool.name}"` -> contains `<h3>` `"How to Use {tool.name}"` and `<h3>` `"Key Features & Security"`.
  - `h2#search-guide-heading`: `"{searchGuide.heading}"` (if `searchGuide` exists) -> contains `<h3>` `"Example input"`, `<h3>` `"Example result"`, and `<h3>` `"What this tool does and does not do"`.
  - `h2#faq-heading`: `"Frequently Asked Questions"` -> contains `<h3>` for each FAQ question, immediately followed by `<p>` answer.
  - `h2#related-heading`: `"Related {tool.category} Tools"` -> contains `<h3>` for each related tool name.
- **Auditing Enforcement**:
  - `scripts/check-production.mjs` line 35 strictly validates:
    `assert.equal(doc.querySelectorAll('h1').length, 1, `${path}: one host heading`);`
  - Introducing any second `<h1>` anywhere in tool workspaces, answer blocks, or SEO components will immediately fail `npm run check:production`.

### Target Tools Status
1. **`/tools/remove-line-breaks`**:
   - Registry: `data/tools/cleanup.ts` (lines 90–103).
   - Implementation: `lib/tools/removeLineBreaks.ts` supports `separator?: string` and `collapseParagraphs?: boolean`.
   - UI: `components/tools/TransformTool.tsx` (lines 695–723) currently has a "Replace With" dropdown (`" "`, `", "`, `"; "`, `""`) and a checkbox for "Preserve Double Line Breaks (Paragraphs)".
   - SEO Blueprint: `data/seo/blueprints.ts` (lines 285–307).
   - Search Guide: **Currently absent** in `data/seo/searchGuides.ts`.
   - FAQs: `data/seo/faq.ts` (lines 1996–2026) has 3 FAQs and 4 feature items.
2. **`/tools/ai-summarize`**:
   - Registry: `data/tools/ai.ts` (lines 67–81), alias `ai-summarizer`, `requiresAI: true`.
   - Implementation: `components/tools/AiTool.tsx` calls `requestAiTool()` in `lib/tools/aiTools.ts` pointing to `/api/ai`.
   - SEO Blueprint: `data/seo/blueprints.ts` (lines 98–121).
   - Search Guide: **Currently absent** in `data/seo/searchGuides.ts`.
   - FAQs: `data/seo/faq.ts` (lines 2289–2319) has 3 FAQs and 4 feature items.

### Automated Testing Constraints
- **`tests/seo/searchGuides.test.ts`**:
  - Lines 44–52: For every tool in `SEARCH_GUIDES`, `guide.faq.question` and `guide.faq.answer` MUST be present verbatim in `getToolEducationalContent().faqs` (`data/seo/faq.ts`).
  - Line 50: If `tool.requiresAI` is true (as with `ai-summarize`), `guide.example.note` MUST match `/[Ii]llustrative/`.
  - Lines 38–41: Any tool registered in `transforms` map must have its `example.input` transform result strictly equal `example.output`.
- **`tests/seo/ctrImprovements.test.ts`**:
  - Blueprints must have title 40–75 chars, description 130–180 chars, intro > 30 chars, and no `–` in `h1`.
  - Contextual internal links must use `[Label](/tools/slug)` with registered slugs.
  - `related` list must have at least 3 distinct registered slugs.
- **`scripts/check-production.mjs`**:
  - Lines 43–46: All interactive elements (`input`, `textarea`, `select`, `button`) must have accessible names (`aria-label`, `aria-labelledby`, `<label>`, or inner text).
  - Lines 54–58: If a tool exists in `SEARCH_GUIDES`, the page MUST render `#search-guide-heading` and the body text MUST contain `searchGuide.example.output`.

---

## 2. Logic Chain

1. **Verification Precondition**:
   Running `npm run check:production` requires a compiled `.next` directory generated by `next build` because the crawler invokes `node node_modules/next/dist/bin/next start`. Therefore, the required verification order for any subsequent changes is:
   `npm run typecheck` -> `npm test` -> `npm run build` -> `npm run check:production`.
2. **Citable Answer Blocks Placement (R1)**:
   - Requirement R1 specifies a self-contained, highly citable answer block (130–160 words) in the top 30% of content with bullet steps.
   - Because `ToolShell.tsx` hosts the single `<h1>` at lines 124–126 and `scripts/check-production.mjs:35` fails if `querySelectorAll('h1').length !== 1`, the answer block must use semantic non-H1 tags (such as `<h2>` or a styled overview box with bullet steps) and be placed in `ToolShell.tsx` or in the tool component above/adjacent to the workspace.
3. **Search Guides & FAQs Coordination (R2)**:
   - Adding `remove-line-breaks` and `ai-summarize` to `data/seo/searchGuides.ts` will trigger `SEARCH_GUIDES[path]` checks in `scripts/check-production.mjs:54-58` and `tests/seo/searchGuides.test.ts:44-52`.
   - Therefore, the exact FAQ pair (`guide.faq`) must also be added to `data/seo/faq.ts` under the tool's `faqs` list.
   - For `ai-summarize`, `guide.example.note` must contain the word `"illustrative"`.
   - For `remove-line-breaks`, the input/output example must match the output of `removeLineBreaks` if added to the deterministic transform map.
4. **1-Click Preset Implementation (R3)**:
   - Adding a preset option in `components/tools/TransformTool.tsx` (e.g., "Clean Line Separators & Format into 2 Paragraphs") requires buttons or toggle controls.
   - All added buttons must include explicit `aria-label` or visible text to avoid failing `check-production.mjs`'s unnamed control check (line 45).
   - Execution must remain 100% client-side in `lib/tools/removeLineBreaks.ts` with zero backend calls, maintaining browser privacy.

---

## 3. Caveats

1. **Production Check Dependencies**: `npm run check:production` binds to port 3001 and spawns a local server. If port 3001 is occupied or the server fails to spin up within 15s, it times out. A clean build must precede it.
2. **Testing Engine**: The codebase uses Node's native test runner (`node:test`) executed via `tsx`, not Jest or Vitest. Test flags or syntax specific to Jest/Vitest will not work.
3. **FAQ Schema Intentional Absence**: `scripts/check-production.mjs` explicitly checks `assert.ok(!schemas.some(containsFaqSchema))`. Do not add `FAQPage` structured data to JSON-LD.

---

## 4. Conclusion

- The codebase is in a verified clean state: 0 TypeScript errors, 258/258 unit/integration tests passing, 239 SSG static routes building cleanly, and all 184 canonical production pages passing SEO/a11y audits.
- Both target tools (`/tools/remove-line-breaks` and `/tools/ai-summarize`) are cleanly routed, use `ToolShell.tsx` for their single `<h1>`, and have existing blueprints and FAQ structures, but lack dedicated `SEARCH_GUIDES` entries and front-loaded citable answer blocks.
- All guardrails (single H1, citable answer block word counts, accessible form controls, FAQ synchronization, and deterministic test outputs) are well-defined and enforceable via the automated pipeline.

---

## 5. Verification Method

To independently verify the architecture baseline and pipeline health, execute the following commands in sequence:

```powershell
# 1. Type check
npm run typecheck

# 2. Unit & Integration test suite
npm test

# 3. Static site generation build (required before check:production)
npm run build

# 4. Production crawler audit across all 184 canonical pages
npm run check:production

# 5. Git status & remotes check
git status
git remote -v
```

### Invalidation Conditions
- Any TypeScript diagnostic emitted by `tsc --noEmit`.
- Fewer than 258 passing tests or any test failures in `tests/**/*.test.ts`.
- Any page having more or fewer than 1 `<h1>` tag during `check:production`.
- Missing `#search-guide-heading` or mismatched published example output when adding to `SEARCH_GUIDES`.
- Any interactive element lacking an accessible name.
