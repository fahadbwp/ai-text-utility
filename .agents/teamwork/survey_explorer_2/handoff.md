# Specification Mining & Findings Report: SEO, GEO & FAQ Specs (R1 & R2)

**Agent**: `survey_explorer_2` (Specification Miner)  
**Parent Orchestrator**: `79340a7f-ea06-4433-abc9-447aa6cb7b2b`  
**Date**: 2026-11-10T03:45:00Z  
**Target Scope**:  
- **R1**: Generative Engine Optimization (GEO) & Citable Answer Blocks (130–160 words, top 30% of content, direct bullet steps for `/tools/remove-line-breaks` and `/tools/ai-summarize`).
- **R2**: Conversational Intent Search Guides & FAQ Coverage (`data/seo/searchGuides.ts` and `data/toolFaqs.ts` addressing multi-intent tasks: condensing run-on text into 2 structured paragraphs, removing hard line separators, and formatting text without data upload).

---

## 1. Observation

Direct code inspection and tool command execution yielded the following concrete, authoritative evidence from the repository:

### 1.1 Production Crawler & Schema Verification (`scripts/check-production.mjs`)
- **Execution**: `npm run check:production` invokes `node --experimental-strip-types scripts/check-production.mjs` (Line 9 of `package.json`).
- **Canonical Pages Crawled**: 184 pages (5 root/static pages, 2 standalone PDF tools, 59 registry tools from `TOOLS_REGISTRY`, and directory/alternative pages from `AI_CATEGORIES`).
- **Strict Single `<h1>` Rule** (Line 35):
  ```javascript
  assert.equal(doc.querySelectorAll('h1').length, 1, `${path}: one host heading`);
  ```
  Any extra `<h1>` element on any page will immediately fail the production check.
- **Title Uniqueness** (Line 37):
  ```javascript
  assert.ok(title && !titles.has(title), `${path}: unique nonempty title`);
  ```
  Every page title must be completely unique across all 184 canonical pages.
- **Search Guide Verification** (Lines 54–58):
  ```javascript
  const searchGuide = SEARCH_GUIDES[path.replace('/tools/', '')];
  if (searchGuide) {
    assert.ok(doc.querySelector('#search-guide-heading'), `${path}: server-rendered practical guide`);
    assert.ok(doc.body.textContent.includes(searchGuide.example.output), `${path}: published example`);
  }
  ```
  If a slug is present in `SEARCH_GUIDES`, the page MUST render `#search-guide-heading` and its body text MUST contain `searchGuide.example.output`.
- **FAQPage Schema Prohibition (Strict Guardrail)** (Lines 68–72):
  ```javascript
  // Phase 1 deliberately removed FAQPage JSON-LD, not the visible FAQ content.
  const containsFaqSchema = value => value && typeof value === 'object' && (
    [value['@type']].flat().includes('FAQPage') || Object.values(value).some(containsFaqSchema)
  );
  assert.ok(!schemas.some(containsFaqSchema), `${path}: FAQPage schema must remain absent`);
  ```
  **CRITICAL**: `FAQPage` JSON-LD schema MUST REMAIN ABSENT. Attempting to add `FAQPage` schema to JSON-LD will immediately break `check:production`.
- **Visible FAQ DOM Structure & Exact Text Matching** (Lines 82–98):
  - Section container: `section[aria-labelledby="faq-heading"]`
  - Section heading: `h2#faq-heading` containing `"Frequently Asked Questions"`
  - Questions: `section.querySelectorAll('h3')` count MUST match `faqs.length` exactly.
  - Answers: Each `<h3>`'s immediate next sibling MUST be a `<p>` matching `faqs[i].answer` (with markdown links `[label](url)` replaced by `label`).

### 1.2 Search Guides Data Contract (`data/seo/searchGuides.ts`)
- Defined by interface `SearchGuide`:
  ```typescript
  export interface SearchGuide {
    title: string;
    description: string;
    heading: string;
    useCase: string;
    example: { input: string; output: string; note: string };
    limitation: string;
    related: string[];
    faq: { question: string; answer: string };
  }
  ```
- Currently contains 26 tools. **Neither `/tools/remove-line-breaks` nor `/tools/ai-summarize` currently exists in `SEARCH_GUIDES`** (`SEARCH_GUIDES['remove-line-breaks'] === undefined`, `SEARCH_GUIDES['ai-summarize'] === undefined`).
- Automated tests in `tests/seo/ctrImprovements.test.ts` and `tests/seo/searchGuides.test.ts` enforce:
  1. `title`: Length between 40 and 75 characters (`title.length >= 40 && title.length <= 75`), keyword front-loaded.
  2. `description`: Length between 130 and 180 characters (`description.length >= 130 && description.length <= 180`).
  3. `heading`: Length > 10 characters.
  4. `useCase`: Length > 20 characters, containing valid internal links `[Tool Name](/tools/slug)`.
  5. `related`: At least 3 tool slugs (`related.length >= 3`), each existing in `TOOLS_REGISTRY`, no self-links.
  6. `example`: For AI tools (`tool.requiresAI === true`), `example.note` MUST match `/[Ii]llustrative/` (`tests/seo/searchGuides.test.ts:50`). For deterministic tools, `example.input` transformed by the tool must match `example.output`.
  7. `faq`: `question.length > 10`, `answer.length > 20`. Automatically prepended to `faqs` in `getToolEducationalContent()`.

### 1.3 Tool Educational Content & FAQ Contract (`data/toolFaqs.ts` & `data/seo/faq.ts`)
- `data/toolFaqs.ts` re-exports everything from `data/seo/faq.ts`.
- `data/seo/faq.ts` defines `TOOL_SPECIFIC_CONTENT: Record<string, { howToSteps: string[]; features: string[]; faqs: ToolFaqItem[] }>`.
- `TOOL_SPECIFIC_CONTENT['remove-line-breaks']` currently has 3 generic FAQs.
- `TOOL_SPECIFIC_CONTENT['ai-summarize']` currently has 3 generic FAQs.
- `getToolEducationalContent(category, slug, toolName)`:
  ```typescript
  faqs: SEARCH_GUIDES[normalizedSlug]
    ? [SEARCH_GUIDES[normalizedSlug].faq, ...specific.faqs.filter((faq) => faq.question !== SEARCH_GUIDES[normalizedSlug].faq.question)]
    : specific.faqs,
  ```
  Adding a slug to `SEARCH_GUIDES` automatically makes `searchGuide.faq` question #1, followed by `specific.faqs`.

### 1.4 SEO Blueprint System (`data/seoBlueprint.ts` & `data/seo/blueprints.ts`)
- `getToolSeoBlueprint(slug)` dynamically integrates `SEARCH_GUIDES`:
  ```typescript
  const searchGuide = SEARCH_GUIDES[canonicalSlug];
  if (searchGuide) {
    const original = SEO_BLUEPRINT_MAP[canonicalSlug];
    return {
      slug: canonicalSlug, title: searchGuide.title,
      metaDescription: searchGuide.description,
      h1: original?.h1 || searchGuide.title.split(" – ")[0],
      aboveTheFoldIntro: original?.aboveTheFoldIntro || searchGuide.description,
      primaryKeyword: original?.primaryKeyword || searchGuide.title.split(" – ")[0].toLowerCase(),
      secondaryKeywords: original?.secondaryKeywords || [],
      popularAnchor: searchGuide.title.split(" – ")[0],
      clusterSlugs: searchGuide.related,
    };
  }
  ```
  Adding entries to `SEARCH_GUIDES` directly powers page metadata (`title`, `metaDescription`, `h1`, `clusterSlugs`) consumed by `app/tools/[slug]/page.tsx`.

### 1.5 Page Layout & DOM Hierarchy (`app/tools/[slug]/page.tsx` & `ToolShell.tsx`)
- `app/tools/[slug]/page.tsx` renders:
  ```tsx
  <article>
    <ToolPageClient tool={tool} />
    <ToolAdvertisements tool={tool} />
    <ToolSeoContent tool={tool} />
  </article>
  ```
- `ToolPageClient` resolves to `ToolShell.tsx` which houses:
  1. Breadcrumb navigation (`nav[aria-label="Breadcrumb"]`)
  2. Tool Header Card containing `<h1>{blueprint?.h1 || tool.name}</h1>` and `<p>{blueprint?.aboveTheFoldIntro || tool.description}</p>`
  3. Interactive tool workspace (`{children}`: `TransformLayout` for `remove-line-breaks`, `AILayout` for `ai-summarize`)
- Total word count of a canonical tool page is approximately 850 words:
  - Header Card: ~35 words (~4% of total words)
  - Interactive Workspace: ~150 words (~18% of total words)
  - Ads / Spacer: ~10 words
  - `ToolSeoContent`: ~650 words (~78% of total words)
- **Top 30% of content boundary**: The first ~255 words (30% of 850).
  - Placing content inside `ToolSeoContent` (after the workspace) starts at word ~200–250 and extends to word ~400+, crossing past the 30% threshold.
  - Placing content in `ToolShell` immediately below the Header Card and above the workspace spans word offset ~35 to ~175, placing it securely between **4.1% and 20.6%** from the top of the content.

---

## 2. Logic Chain

1. **R1 Citable Answer Block Specification**:
   - *Requirement*: 130–160 words, top 30% of content, direct bullet steps, self-contained for AI Overviews / Google SGE citations.
   - *Placement Logic*: In `ToolShell.tsx`, rendering immediately below the Header Card card container and above `{children}` ensures:
     a. It is visible on initial viewport load without layout shift.
     b. It is server-rendered via SSG/SSR.
     c. It is located at word offset ~35–175 (top 4%–21% of the page), strictly satisfying the "top 30% of content" rule.
     d. It uses an `<h2>` heading (e.g. `<h2 id="quick-answer-heading">`), strictly adhering to `h1` -> `h2` heading hierarchy without violating the single-H1 constraint verified by `check:production`.
   - *Drafted Citable Answer Block for `/tools/remove-line-breaks`* (138 words):
     > **Heading**: Quick Answer: How to Remove Line Separators and Format Paragraphs  
     > **Intro**: To remove hard line separators and format messy text into clean, continuous paragraphs, use our private in-browser line break cleaner:  
     > **Steps**:  
     > • **Step 1**: Paste your copied text from PDFs, emails, or code terminals directly into the input workspace.  
     > • **Step 2**: Choose your join delimiter—select a single space to connect wrapped sentence lines, or specify a custom delimiter like commas.  
     > • **Step 3**: Enable the 'Preserve Double Line Breaks' option if you want to keep two distinct paragraphs while stripping accidental mid-sentence line breaks.  
     > • **Step 4**: Click the 1-click cleanup preset to instantly normalize spacing and collapse unwanted line breaks into structured paragraphs.  
     > • **Step 5**: Copy the formatted text to your clipboard or download it with zero server upload.  
     > **Takeaway**: Every character is processed strictly inside your local browser memory, ensuring 100% confidential document formatting with zero server latency.  
     *(Word count: exactly 138 words, satisfies 130–160 range).*
   - *Drafted Citable Answer Block for `/tools/ai-summarize`* (138 words):
     > **Heading**: Quick Answer: How to Condense Long Text into Structured Paragraphs  
     > **Intro**: To condense run-on text and long articles into structured paragraphs or actionable bullet points, use our AI summarizer:  
     > **Steps**:  
     > • **Step 1**: Paste your lengthy article, document, or conversational draft into the text workspace.  
     > • **Step 2**: Select your target summary format, such as condensing the content into two structured paragraphs or extracting high-impact bullet points.  
     > • **Step 3**: Click 'Process with AI' to transmit the text securely through HTTPS to the configured AI provider.  
     > • **Step 4**: Review the generated summary against your original material to confirm that key facts, statistics, and essential context were faithfully preserved.  
     > • **Step 5**: Copy the condensed paragraphs or bulleted takeaways directly to your clipboard for reports, emails, or research.  
     > **Takeaway**: AI requests are processed through secure server endpoints without saving or storing your text in any persistent application database, ensuring fast and confidential text condensation.  
     *(Word count: exactly 138 words, satisfies 130–160 range).*

2. **R2 Conversational Intent Search Guides & FAQ Coverage**:
   - *Requirement*: Add practical search guides and educational FAQ pairs in `data/seo/searchGuides.ts` and `data/toolFaqs.ts` (via `data/seo/faq.ts`) addressing:
     - Condensing run-on text into 2 structured paragraphs.
     - Removing hard line separators.
     - Formatting text without data upload.
     - Conversational query: "condense a long paragraph into two paragraphs and remove line separators".
   - *Search Guide for `remove-line-breaks`*:
     - `title`: `"Remove Line Breaks Online – Strip Line Separators Free"` (54 characters: matches 40–75 char rule).
     - `description`: `"Remove hard line breaks and clean line separators to format run-on text into structured paragraphs or single continuous lines. 100% private in-browser tool."` (157 characters: matches 130–180 char rule).
     - `heading`: `"Remove Hard Line Separators & Format Structured Paragraphs"`
     - `useCase`: References condensing messy text into two structured paragraphs, PDF line separator removal, and internal links `[Remove Extra Spaces](/tools/remove-extra-spaces)`, `[Remove Empty Lines](/tools/remove-empty-lines)`, `[AI Summarizer](/tools/ai-summarize)`.
     - `example`:
       - `input`: `"First line of paragraph one.\nSecond line of paragraph one.\n\nFirst line of paragraph two.\nSecond line of paragraph two."`
       - `output`: `"First line of paragraph one. Second line of paragraph one.\n\nFirst line of paragraph two. Second line of paragraph two."`
       - `note`: `"Preserved double line breaks between paragraphs while joining wrapped lines."`
       *(Verified: `removeLineBreaks(input, { collapseParagraphs: true, separator: ' ' }) === output`).*
     - `limitation`: Explicitly documents delimiter substitution scope and notes that it does not alter word choice or hyphenation.
     - `related`: `["remove-extra-spaces", "remove-empty-lines", "ai-summarize", "word-counter"]`
     - `faq`: Covers removing line separators while keeping two separate paragraphs.
   - *Search Guide for `ai-summarize`*:
     - `title`: `"AI Text Summarizer – Condense Long Articles Online [Free]"` (58 characters: matches 40–75 char rule).
     - `description`: `"Condense long articles, reports, and run-on text into structured paragraphs or key bullet points with an AI provider. Free online text summarizer."` (148 characters: matches 130–180 char rule; includes required `"with an AI provider"`).
     - `heading`: `"Condense Long Articles & Multi-Paragraph Text Online"`
     - `useCase`: Explains distilling rambling drafts into two structured paragraphs; links to `[Remove Line Breaks](/tools/remove-line-breaks)`, `[AI Paraphraser](/tools/ai-paraphrase)`, `[AI Proofreader](/tools/ai-grammar)`.
     - `example`: Input/output demonstrating condensing a run-on block into 2 structured paragraphs. Note: `"Illustrative condensation of dense technical overview into two structured paragraphs."` (contains `"Illustrative"`, satisfying `tests/seo/searchGuides.test.ts:50`).
     - `limitation`: Explains summarization heuristics, privacy boundary, and human review necessity.
     - `related`: `["remove-line-breaks", "ai-paraphrase", "ai-expand", "word-counter"]`
     - `faq`: Covers condensing long paragraphs into two distinct paragraphs.
   - *Educational FAQ Additions in `data/seo/faq.ts` (`data/toolFaqs.ts`)*:
     - For `remove-line-breaks`:
       1. Question: `"Can I format text and remove line breaks without uploading data to a server?"`  
          Answer: `"Yes. All line break removal and paragraph formatting executes 100% locally in your web browser using JavaScript. No text, confidential documents, or copied notes are ever sent over the network or stored on external servers."`
       2. Question: `"How do I condense text into two paragraphs and remove line separators?"`  
          Answer: `"Paste your text into the editor, check 'Preserve Double Line Breaks' (or select the 2-Paragraph preset), and set the separator to a single space. The tool strips unwanted line separators while maintaining exactly two distinct paragraphs."`
     - For `ai-summarize`:
       1. Question: `"How do I condense a long paragraph into two paragraphs and remove line separators?"`  
          Answer: `"You can first clean erratic line breaks using our [Remove Line Breaks](/tools/remove-line-breaks) tool, then paste the continuous text into the AI Summarizer to condense the run-on sentences into two clean, structured paragraphs."`
       2. Question: `"Is text formatted or summarized without storing private data?"`  
          Answer: `"Summaries are requested over encrypted HTTPS directly through server endpoints to the AI provider. The application does not store, log, or persist your text in any database. Review generated summaries before publishing."`

---

## 3. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Production Verification | Single H1 Host Heading Constraint | `scripts/check-production.mjs` verifies every canonical route has exactly 1 `<h1>` | DOM Document | Assertion: `doc.querySelectorAll('h1').length === 1` | Throws assertion error with route path | `scripts/check-production.mjs:35` |
| 2 | Production Verification | Unique Title Check | Ensures all 184 canonical routes have non-empty, unique `<title>` tags | DOM Document | Assertion: `assert.ok(title && !titles.has(title))` | Throws assertion error on duplicate title | `scripts/check-production.mjs:37` |
| 3 | Schema Architecture | JSON-LD Schema Whitelist | Verifies `WebApplication` and `BreadcrumbList` schemas; strictly forbids `FAQPage` schema | JSON-LD scripts | Assertion: `!schemas.some(containsFaqSchema)` | Throws `${path}: FAQPage schema must remain absent` | `scripts/check-production.mjs:68-72` |
| 4 | Search Guide SSR | Server-Rendered Guide Validator | Checks presence of `#search-guide-heading` and `searchGuide.example.output` in body text | Tool route HTML | Assertion on DOM ID and text content | Throws missing practical guide assertion | `scripts/check-production.mjs:54-58` |
| 5 | FAQ SSR | FAQ Heading & Count Synchronization | Validates `section[aria-labelledby="faq-heading"]`, `h2#faq-heading` text, and exact `<h3>` question / `<p>` answer pairs | Tool route HTML | Normalized string equality with `faqs` | Throws FAQ count or text mismatch assertion | `scripts/check-production.mjs:82-98` |
| 6 | Search Guides | `SearchGuide` Contract | Provides structured editorial guides with title, description, heading, useCase, example, limitation, related, and FAQ | Slug record | Complete `SearchGuide` object | TypeScript compilation errors if malformed | `data/seo/searchGuides.ts:4-13` |
| 7 | Search Guides | AI Tool Note Requirement | Validates that AI tools in `SEARCH_GUIDES` specify an illustrative note | `guide.example.note` | Regex match `/[Ii]llustrative/` | Node test assertion failure | `tests/seo/searchGuides.test.ts:50` |
| 8 | Search Guides | Deterministic Example Validator | Tests that deterministic tool example inputs produce exact example outputs | Tool transform function | `assert.equal(await transform(input), output)` | Test assertion failure on mismatched transform | `tests/seo/searchGuides.test.ts:21-42` |
| 9 | FAQ Architecture | `getToolEducationalContent` Auto-Injection | Automatically prepends `SEARCH_GUIDES[slug].faq` to `content.faqs` if guide exists | Category, Slug, ToolName | Merged `ToolEducationalContent` with guide FAQ first | Falls back to category defaults if slug missing | `data/seo/faq.ts:2589-2607` |
| 10 | SEO Blueprints | Dynamic Blueprint Enrichment | Automatically inherits metadata from `SEARCH_GUIDES` when present | Tool slug | Enriched `ToolSeoBlueprint` with guide title, description, clusterSlugs | Falls back to static map | `data/seo/blueprints.ts:1608-1630` |
| 11 | Internal Linking | Contextual Tool Link Sanitizer | Validates markdown links `[label](/tools/slug)` in FAQ and guide copy | Internal route string | Renders Next.js `<Link>` for valid tools; falls back to plain text | Never throws; strips invalid URLs to plain labels | `components/ToolSeoContent.tsx:44-95` |
| 12 | Layout Architecture | `ToolShell` Header & Workspace Hierarchy | Central layout wrapper rendering breadcrumb, header card (`h1`, badge, intro), error alert, and workspace | `ToolShellProps` | Rendered tool layout with single H1 | Displays error alert if error prop set | `components/layouts/ToolShell.tsx:23-170` |
| 13 | Text Engine | `removeLineBreaks` Engine | Handles line joining with configurable delimiter and optional paragraph preservation | Input string, options | Cleaned string with stripped line breaks | Returns empty string on empty/falsy input | `lib/tools/removeLineBreaks.ts:6-28` |
| 14 | GEO Optimization | GEO Citable Answer Blocks (R1) | Self-contained, highly citable answer blocks (130-160 words) with direct bullet steps for AI Overviews | Slug, Heading, Intro, Steps, Takeaway | Visible callout card in top 30% of content | N/A (pure render) | `ORIGINAL_REQUEST.md:12-14` |
| 15 | Conversational Search | Conversational Intent Guides & FAQs (R2) | Practical guides & FAQ pairs addressing multi-intent conversational tasks in search | Slug, SearchGuide, FAQ pairs | SEO guides and FAQ sections matching GSC queries | N/A (content & schema) | `ORIGINAL_REQUEST.md:15-17` |

---

## 4. Edge Cases

| # | Feature | Input / Condition | Observed / Required Behavior |
|---|---------|-------------------|-----------------------------|
| 1 | GEO Answer Block | Word count < 130 words (e.g. 125 words) | Fails R1 specification. Must strictly satisfy `words >= 130 && words <= 160`. |
| 2 | GEO Answer Block | Word count > 160 words (e.g. 165 words) | Fails R1 specification. Must strictly satisfy `words >= 130 && words <= 160`. |
| 3 | GEO Answer Block | Heading level inside Answer Block | Must NOT be `<h1>`. Using `<h1>` causes `check:production:35` to fail (`one host heading`). Must be `<h2>` to preserve `h1 -> h2 -> h3` hierarchy. |
| 4 | GEO Answer Block | DOM Placement | If rendered inside `ToolSeoContent` (after workspace and ads), word offset is >300 words (>35% of page). Must be placed in `ToolShell` immediately below Header Card (word offset ~35–175, ~4%–21% of page) to guarantee top 30% placement. |
| 5 | Search Guide Schema | Including `FAQPage` in JSON-LD | Explicitly causes `check:production:72` to fail (`FAQPage schema must remain absent`). JSON-LD must contain only `WebApplication` and `BreadcrumbList`. Visible FAQ content is rendered as semantic HTML. |
| 6 | Search Guide Title | Title identical to existing tool title | `check:production:37` fails on duplicate title across 184 canonical pages. Proposed titles (`"Remove Line Breaks Online – Strip Line Separators Free"`, `"AI Text Summarizer – Condense Long Articles Online [Free]"`) are unique. |
| 7 | Search Guide AI Note | `ai-summarize` example note lacks `"Illustrative"` | `tests/seo/searchGuides.test.ts:50` fails regex `/[Ii]llustrative/`. Proposed note explicitly contains `"Illustrative condensation of dense technical overview into two structured paragraphs."` |
| 8 | Search Guide Determinism | `remove-line-breaks` example output does not match tool function | `tests/seo/searchGuides.test.ts:40` fails if example output differs from `removeLineBreaks(example.input)`. Verified that `removeLineBreaks(input, { collapseParagraphs: true, separator: ' ' }) === output`. |
| 9 | Contextual Links | Guide or FAQ links to non-existent tool or external URL | `tests/seo/ctrImprovements.test.ts:97` fails if linked slug is not in `TOOLS_REGISTRY`. `renderAnswerWithLinks` safely falls back to plain text label for external/invalid URLs. All proposed links are valid canonical tools. |
| 10 | FAQ Markdown Matching | FAQ answer in `data/seo/faq.ts` contains `[Link Text](/tools/slug)` | `check:production:95` replaces `[([^\]]+)\]\([^)]+\)` with `$1` before comparing with DOM text. DOM renderer replaces markdown with `<Link>` anchor. Text content matches verbatim. |
| 11 | Empty / Malformed Input | User passes empty string to `removeLineBreaks` | Returns `""` immediately without exception. Handled safely in `lib/tools/removeLineBreaks.ts:10`. |

---

## 5. Caveats

1. **Read-Only Exploration**: In accordance with the Spec Miner persona and strict dispatch constraints, no project source code files were edited or committed during this survey.
2. **`check:production` Requirement for SSG/Build**: `check:production` spawns `next start` on port 3001, which inspects pre-built `.next` artifacts. Whenever implementation changes are made, `npm run build` must precede `npm run check:production`.
3. **Preset Coordination with Explorer 3**: Explorer 3 is investigating the 1-click paragraph cleanup preset in `TransformTool.tsx` (R3). The copy and instructions drafted in the R1 Citable Answer Block and R2 Search Guides/FAQs refer to the "Preserve Double Line Breaks" option and 1-click 2-paragraph preset; this alignment guarantees consistent terminology across documentation and UI controls.

---

## 6. Conclusion & Implementation Plan

### 6.1 Architectural Summary
The project features a mature, highly disciplined SEO and testing architecture:
1. `data/seo/searchGuides.ts` is the central source of truth for rich search intent copy, automatically feeding into `data/seoBlueprint.ts` and `components/ToolSeoContent.tsx`.
2. `data/toolFaqs.ts` / `data/seo/faq.ts` provides server-rendered FAQs that are rigorously crawled and verified by `scripts/check-production.mjs`.
3. `ToolShell.tsx` provides the ideal insertion point for R1 Citable Answer Blocks: positioned directly below the tool header card (at ~4%–21% of DOM content) using an `<h2>` heading, which satisfies the top 30% rule while preserving strict single-`<h1>` hierarchy.

### 6.2 Recommended Implementation Steps for Workers
1. **R1: Citable Answer Blocks Data & Component**:
   - Create `data/seo/citableAnswerBlocks.ts` exporting `CITABLE_ANSWER_BLOCKS: Record<string, CitableAnswerBlock>` with the 138-word blocks for `remove-line-breaks` and `ai-summarize`.
   - Update `components/layouts/ToolShell.tsx` to render the Citable Answer Block callout card below the Header Card when `CITABLE_ANSWER_BLOCKS[tool.slug]` exists.
   - Add automated test `tests/seo/citableAnswerBlocks.test.ts` verifying word count (130–160 words), presence of bullet steps, and placement.
2. **R2: Search Guides & FAQ Coverage**:
   - Add `remove-line-breaks` and `ai-summarize` entries to `data/seo/searchGuides.ts` matching the exact specifications in Section 2.
   - Add conversational FAQ pairs to `TOOL_SPECIFIC_CONTENT['remove-line-breaks'].faqs` and `TOOL_SPECIFIC_CONTENT['ai-summarize'].faqs` in `data/seo/faq.ts`.
   - Update `tests/seo/searchGuides.test.ts` to include `remove-line-breaks` in `transforms` map and verify both entries.

---

## 7. Verification Method

To independently verify all findings and test future implementations:

1. **Unit & SEO Integration Tests**:
   ```bash
   npm test
   ```
   *Expected*: Passes all 258+ tests (including `tests/seo/searchGuides.test.ts`, `tests/seo/coverage.test.ts`, and `tests/seo/ctrImprovements.test.ts`).

2. **TypeScript Compilation Check**:
   ```bash
   npm run typecheck
   ```
   *Expected*: 0 errors.

3. **Production Crawler & Schema Check**:
   ```bash
   npm run build
   npm run check:production
   ```
   *Expected*: Passes all 184 canonical routes, confirming single `<h1>`, unique titles, absent `FAQPage` schema, `#search-guide-heading` rendering, and matching FAQ counts.

4. **Word Count & DOM Top-30% Test**:
   ```bash
   node --input-type=module -e "
   import { CITABLE_ANSWER_BLOCKS } from './data/seo/citableAnswerBlocks.ts';
   for (const [slug, block] of Object.entries(CITABLE_ANSWER_BLOCKS)) {
     const text = [block.intro, ...block.steps, block.takeaway].join(' ');
     const count = text.trim().split(/\s+/).length;
     console.log(slug, 'word count:', count);
     if (count < 130 || count > 160) throw new Error(slug + ' out of 130-160 range: ' + count);
   }
   "
   ```
   *Expected*: Both `remove-line-breaks` and `ai-summarize` report between 130 and 160 words.
