# Test Suite Ready: GEO & Presets E2E Suite (Tiers 1–4)

**Test Suite File**: `tests/e2e/geo-and-presets.test.ts`  
**Total Test Cases**: 41  
**Runner Framework**: Node.js Native Test Runner (`node:test`) + `node:assert/strict`  
**Status**: Ready & Active (Passing 15/15 currently implemented features, 26 progressively waiting for M2/M3 milestones)

---

## 1. Test Runner Commands

### Run Only E2E Test Suite
```bash
npm test -- tests/e2e/geo-and-presets.test.ts
```
Or directly via Node:
```bash
node --import tsx --test "tests/e2e/geo-and-presets.test.ts"
```

### Run Full Project Test Suite
```bash
npm test
```

### Run TypeScript Verification
```bash
npm run typecheck
```

### Run Production Auditor (Single H1, Guide SSR, Schemas)
```bash
npm run check:production
```

---

## 2. Coverage Breakdown Across Tiers 1–4

| Tier | Category / Feature | Tests | Passing | Pending Milestones | Description |
|------|--------------------|:-----:|:-------:|:------------------:|-------------|
| **Tier 1** | **Feature Coverage** | **15** | **6** | **9** | Core functionality, happy path, and interface contracts for R1, R2, R3 |
| • Tier 1 | R1: GEO Citable Blocks | 5 | 5 | 0 | Registry existence, 130-160 word counts, direct steps, context, helper lookup |
| • Tier 1 | R2: Search Guides & FAQs | 5 | 0 | 5 (M2) | Guide existence, 40-75 title / 130-180 description bounds, transform sync, FAQ injection |
| • Tier 1 | R3: Presets & 2-Paragraph | 5 | 1 | 4 (M3) | 1-click preset option, formatTwoParagraphs, hyphen cleanup, rule removal, backward compatibility |
| **Tier 2** | **Boundary & Corner Cases** | **15** | **7** | **8** | Strict boundaries, extreme inputs, heading hierarchy, security guardrails |
| • Tier 2 | R1 Boundaries | 5 | 5 | 0 | 130/160 word bounds, single-H1 preservation, non-empty steps, case resiliency, non-target tools |
| • Tier 2 | R2 Boundaries | 5 | 2 | 3 (M2) | >=3 related tools, valid internal links, HTML/script sanitization, no FAQPage schema, char safety |
| • Tier 2 | R3 Boundaries | 5 | 0 | 5 (M3) | Empty/null safety, single run-on sentence split, odd sentence counts, idempotency, 50k+ char stress |
| **Tier 3** | **Cross-Feature Combinations** | **6** | **2** | **4** | Pairwise interactions between R1, R2, and R3 |
| • Tier 3 | R1 ↔ R3 Steps/Presets | 1 | 1 | 0 | Answer block step 3/4 prescribes R3 double-break / 1-click presets |
| • Tier 3 | R2 ↔ R3 Transform Sync | 1 | 0 | 1 (M2) | R2 guide example input transformed with R3 engine produces verbatim guide output |
| • Tier 3 | R1 ↔ R2 Privacy Alignment | 1 | 0 | 1 (M2) | R1 takeaway and R2 educational FAQ confirm 100% in-browser, zero server upload |
| • Tier 3 | R2 Cross-Linking | 1 | 0 | 1 (M2) | `remove-line-breaks` and `ai-summarize` mutual cross-reference in related tools |
| • Tier 3 | R2 ↔ Blueprint SEO Sync | 1 | 0 | 1 (M2) | Blueprint dynamic inheritance of title and description from SearchGuide |
| • Tier 3 | Heading Hierarchy Contract | 1 | 1 | 0 | Strict single-H1 constraint across ToolShell, answer blocks (H2), and guides (H2) |
| **Tier 4** | **Real-World Application Scenarios**| **5** | **0** | **5 (M3)** | Multi-intent user queries executed against messy, dirty text artifacts |
| • Tier 4 | Scenario 1: PDF Artifact | 1 | 0 | 1 (M3) | Multi-intent query: 60-char wrapped text with hyphens (`prac-\ntice`) condensed to 2 paragraphs |
| • Tier 4 | Scenario 2: Email Artifact | 1 | 0 | 1 (M3) | Multi-intent query: Raw email with mixed CRLF, spaces, and 4 blank lines condensed to 2 paragraphs |
| • Tier 4 | Scenario 3: Markdown Artifact | 1 | 0 | 1 (M3) | Multi-intent query: Documentation with horizontal rules (`---`, `***`) stripped and formatted |
| • Tier 4 | Scenario 4: OCR Scan Artifact | 1 | 0 | 1 (M3) | Multi-intent query: OCR scanned text with broken margins partitioned into 2 balanced paragraphs |
| • Tier 4 | Scenario 5: Pipeline Workflow | 1 | 0 | 1 (M3) | Multi-intent query: Raw messy text -> R3 formatting into 2 paragraphs -> AI summarizer input |
| **Total** | **All Tiers (1–4)** | **41** | **15** | **26** | **100% verifiable pipeline gate** |

---

## 3. Feature Checklist

### R1: Generative Engine Optimization (GEO) & Citable Answer Blocks
- [x] Registry `CITABLE_ANSWER_BLOCKS` created in `data/seo/citableAnswerBlocks.ts`.
- [x] Includes target tools `/tools/remove-line-breaks` and `/tools/ai-summarize`.
- [x] Word count strictly between 130 and 160 words per block.
- [x] At least 4 direct, sequential bullet steps per block.
- [x] Includes introductory context (`intro`) and privacy-affirming takeaway (`takeaway`).
- [x] Helper `getCitableAnswerBlock(slug)` returns block or `undefined`.
- [x] Preserves single-H1 hierarchy (uses `<h2>` heading).
- [x] Non-target tools safely return `undefined`.

### R2: Conversational Intent Search Guides & FAQ Coverage
- [ ] Search guides registered in `data/seo/searchGuides.ts` for `remove-line-breaks` and `ai-summarize` (M2).
- [ ] Title lengths strictly between 40 and 75 characters (M2).
- [ ] Description lengths strictly between 130 and 180 characters (M2).
- [ ] Deterministic tool example output matches `removeLineBreaks` transformation (M2).
- [ ] AI tool example note contains `/[Ii]llustrative/` (M2).
- [ ] Guide FAQ prepended as question #1 in `getToolEducationalContent()` (M2).
- [ ] Educational FAQs in `data/seo/faq.ts` address zero server upload and multi-intent queries (M2).
- [x] Strictly prohibits `FAQPage` JSON-LD schema (prevents rich snippet conflicts).
- [ ] At least 3 related tools per guide with zero self-links (M2).
- [ ] All internal markdown links resolve to existing tools in `TOOLS_REGISTRY` (M2).

### R3: 1-Click Paragraph Formatting & Cleanup Preset
- [ ] `removeLineBreaks` supports `preset: "two-paragraphs"` (M3).
- [ ] `removeLineBreaks` supports `formatTwoParagraphs: true` (M3).
- [ ] `formatIntoTwoParagraphs` cleans hyphenated line breaks (`"word-\nwrap"` -> `"wordwrap"`) (M3).
- [ ] `formatIntoTwoParagraphs` strips horizontal rule line dividers (`---`, `***`, `___`) (M3).
- [x] Backward compatibility: default single-line and preserve-paragraphs options work unchanged.
- [ ] Handles empty, null, and whitespace-only input safely (M3).
- [ ] Splits single run-on sentences without terminal punctuation near median word (M3).
- [ ] Balanced paragraph splitting for odd sentence counts (M3).
- [ ] Idempotent on text that is already two paragraphs (M3).
- [ ] Handles extreme input sizes (50,000+ characters) in < 250ms (M3).
- [ ] Accessible UI preset button in `TransformTool.tsx` (`aria-pressed`, `aria-label`) (M3).

---

## 4. Progressive Testability Verification

### Isolated E2E Run
```text
> node --import tsx --test "tests/e2e/geo-and-presets.test.ts"

✔ Tier 1 - R1.1: Citable answer block registry exists and contains target high-impression tools (1.574ms)
✔ Tier 1 - R1.2: Citable answer block word counts strictly satisfy 130-160 range (0.3016ms)
✔ Tier 1 - R1.3: Citable answer blocks contain direct, sequential bullet steps (0.4336ms)
✔ Tier 1 - R1.4: Citable answer blocks include introductory context and authoritative takeaway (0.1487ms)
✔ Tier 1 - R1.5: Helper getCitableAnswerBlock resolves valid blocks and returns undefined for unknown slugs (0.2193ms)
﹣ Tier 1 - R2.1: Search guides exist for remove-line-breaks and ai-summarize (0.2652ms) # pending M2
﹣ Tier 1 - R2.2: Search guide metadata conforms to length bounds and keyword requirements (0.1728ms) # pending M2
﹣ Tier 1 - R2.3: Search guide example inputs and outputs adhere to tool transform contracts (0.1561ms) # pending M2
﹣ Tier 1 - R2.4: Tool educational content integrates conversational search guide FAQs as primary item (0.1843ms) # pending M2
﹣ Tier 1 - R2.5: Conversational FAQs explicitly address privacy, 2-paragraph formatting, and zero upload (0.5385ms) # pending M2
﹣ Tier 1 - R3.1: removeLineBreaks supports 1-click two-paragraphs preset (0.3118ms) # pending M3
﹣ Tier 1 - R3.2: removeLineBreaks supports formatTwoParagraphs boolean flag (0.1534ms) # pending M3
﹣ Tier 1 - R3.3: formatIntoTwoParagraphs cleans hyphenated line breaks (0.1651ms) # pending M3
﹣ Tier 1 - R3.4: formatIntoTwoParagraphs strips horizontal line dividers (0.094ms) # pending M3
✔ Tier 1 - R3.5: Backward compatibility: default single-line and preserve-paragraphs options remain intact (0.1774ms)
✔ Tier 2 - R1.1: Citable answer block word count exact boundaries (no underflow < 130 or overflow > 160) (0.1943ms)
✔ Tier 2 - R1.2: Citable answer block heading does not contain H1 or HTML markup (0.0953ms)
✔ Tier 2 - R1.3: Citable answer block steps do not have empty or whitespace-only elements (0.0995ms)
✔ Tier 2 - R1.4: Citable answer block lookup is resilient to casing and whitespace (0.0686ms)
✔ Tier 2 - R1.5: Non-target tools return undefined for citable answer blocks (0.0847ms)
﹣ Tier 2 - R2.1: Search guide related tools array contains >= 3 registered slugs without self-reference (0.1002ms) # pending M2
﹣ Tier 2 - R2.2: Search guide internal markdown links point exclusively to existing canonical tools (0.0989ms) # pending M2
✔ Tier 2 - R2.3: Educational FAQ answers format without HTML tags and with valid markdown links (0.0903ms)
✔ Tier 2 - R2.4: Absence of FAQPage schema is strictly guarded (0.142ms)
﹣ Tier 2 - R2.5: Search guide example inputs contain realistic punctuation and zero control characters (0.078ms) # pending M2
﹣ Tier 2 - R3.1: formatIntoTwoParagraphs handles empty, null, and whitespace-only input safely (0.0746ms) # pending M3
﹣ Tier 2 - R3.2: formatIntoTwoParagraphs handles single sentence input by midpoint word split (0.0862ms) # pending M3
﹣ Tier 2 - R3.3: formatIntoTwoParagraphs handles odd number of sentences gracefully (0.0755ms) # pending M3
﹣ Tier 2 - R3.4: formatIntoTwoParagraphs is idempotent on text that is already two paragraphs (0.0712ms) # pending M3
﹣ Tier 2 - R3.5: formatIntoTwoParagraphs handles extreme input size (50,000+ characters) efficiently (0.0833ms) # pending M3
✔ Tier 3 - Cross 1: R1 answer block steps align with R3 presets and parameters (0.1669ms)
﹣ Tier 3 - Cross 2: R2 search guide example input transformed with R3 engine produces exact guide output (0.0897ms) # pending M2
﹣ Tier 3 - Cross 3: R1 takeaway privacy guarantees align with R2 educational FAQ answers (0.1121ms) # pending M2
﹣ Tier 3 - Cross 4: R2 related tools cross-reference between remove-line-breaks and ai-summarize (0.0708ms) # pending M2
﹣ Tier 3 - Cross 5: Blueprint integration dynamically propagates search guide metadata to page SEO (0.0687ms) # pending M2
✔ Tier 3 - Cross 6: Strict single H1 and valid heading hierarchy contract across components (0.0962ms)
﹣ Tier 4 - Scenario 1: Multi-intent query: PDF copy-paste artifact (0.0903ms) # pending M3
﹣ Tier 4 - Scenario 2: Multi-intent query: Email newsletter / raw text artifact (0.1507ms) # pending M3
﹣ Tier 4 - Scenario 3: Multi-intent query: Terminal log & markdown artifact (0.0881ms) # pending M3
﹣ Tier 4 - Scenario 4: Multi-intent query: OCR scan artifact (0.0846ms) # pending M3
﹣ Tier 4 - Scenario 5: End-to-end multi-intent pipeline: Raw messy text -> R3 formatting -> AI summarizer (0.0856ms) # pending M3
ℹ tests 41
ℹ suites 0
ℹ pass 15
ℹ fail 0
ℹ cancelled 0
ℹ skipped 26
ℹ todo 0
ℹ duration_ms 352.7ms
```

### Full Project Pipeline Run (`npm test`)
```text
ℹ tests 304
ℹ suites 0
ℹ pass 278
ℹ fail 0
ℹ cancelled 0
ℹ skipped 26
ℹ todo 0
ℹ duration_ms 13574.3459
```
Exited with code 0.
