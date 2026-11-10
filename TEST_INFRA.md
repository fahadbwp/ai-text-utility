# Test Infrastructure & Methodology: GEO & Presets (Tiers 1–4)

## 1. Overview & Test Architecture

The E2E test infrastructure for `ai-text-utility` provides end-to-end, opaque-box test coverage for Google Generative AI Search (AI Overviews, SGE) and multi-intent conversational text processing.

The test suite is located at `tests/e2e/geo-and-presets.test.ts` and runs within Node.js native test runner via `tsx`:
- **Runner**: Node.js native test runner (`node:test`)
- **Assertions**: Strict assertions (`node:assert/strict`)
- **Loader**: `tsx` (TypeScript Execution Engine) via `node --import tsx --test`
- **Execution Mode**: 100% offline, deterministic, in-browser emulation with zero external server dependencies

```
                     ┌────────────────────────────────────────────────────────┐
                     │              tests/e2e/geo-and-presets.test.ts         │
                     └──────────────────────────┬─────────────────────────────┘
                                                │
         ┌────────────────────────┬─────────────┴────────────┬────────────────────────┐
         │                        │                          │                        │
         ▼                        ▼                          ▼                        ▼
 ┌───────────────┐        ┌───────────────┐          ┌───────────────┐        ┌───────────────┐
 │    Tier 1     │        │    Tier 2     │          │    Tier 3     │        │    Tier 4     │
 │    Feature    │        │  Boundaries   │          │ Cross-Feature │        │  Real-World   │
 │   Coverage    │        │  & Corners    │          │ Combinations  │        │   Scenarios   │
 └───────┬───────┘        └───────┬───────┘          └───────┬───────┘        └───────┬───────┘
         │                        │                          │                        │
         ├─ R1: Citable Blocks    ├─ R1: 130-160 Words       ├─ R1 ↔ R3 Steps/Presets ├─ PDF Artifacts
         ├─ R2: Search Guides     ├─ R2: 40-75 Title Bounds  ├─ R2 ↔ R3 Engine Sync   ├─ Email Artifacts
         └─ R3: 1-Click Presets   └─ R3: Extreme Size/Odd    └─ R1 ↔ R2 Privacy Align └─ OCR / Markdown
```

---

## 2. 4-Tier Test Methodology

The test suite strictly follows the 4-Tier testing methodology defined in `PROJECT.md` and `DISPATCH.md`:

### Tier 1: Feature Coverage (>=5 test cases per feature)
Verifies the core happy path and functional contract of each feature:
- **R1 (Generative Engine Optimization & Citable Answer Blocks)**:
  - `Tier 1 - R1.1`: Citable answer block registry exists and contains target high-impression tools (`remove-line-breaks`, `ai-summarize`).
  - `Tier 1 - R1.2`: Word counts strictly satisfy the 130–160 range.
  - `Tier 1 - R1.3`: Blocks contain direct, sequential bullet steps (`>= 4` steps).
  - `Tier 1 - R1.4`: Structured context: non-empty intro (`>= 40` chars) and takeaway (`>= 50` chars).
  - `Tier 1 - R1.5`: Helper `getCitableAnswerBlock` resolves valid blocks and returns `undefined` for unknown tools.
- **R2 (Conversational Intent Search Guides & FAQ Coverage)**:
  - `Tier 1 - R2.1`: Search guides exist in `data/seo/searchGuides.ts` for target tools.
  - `Tier 1 - R2.2`: Metadata conforms to length bounds (`title`: 40–75 chars, `description`: 130–180 chars, `heading`: `> 10` chars).
  - `Tier 1 - R2.3`: Deterministic example inputs/outputs match tool transform contracts (`removeLineBreaks`) and AI note states `/[Ii]llustrative/`.
  - `Tier 1 - R2.4`: Educational content in `data/seo/faq.ts` prepends search guide FAQ as question #1.
  - `Tier 1 - R2.5`: Conversational FAQs address privacy, 2-paragraph formatting, and zero server upload.
- **R3 (1-Click Paragraph Formatting & Cleanup Preset)**:
  - `Tier 1 - R3.1`: `removeLineBreaks` supports 1-click `preset: "two-paragraphs"`.
  - `Tier 1 - R3.2`: `removeLineBreaks` supports `formatTwoParagraphs: true` boolean flag.
  - `Tier 1 - R3.3`: `formatIntoTwoParagraphs` cleans hyphenated line breaks (`"docu-\nment"` -> `"document"`).
  - `Tier 1 - R3.4`: `formatIntoTwoParagraphs` removes horizontal line dividers (`---`, `***`).
  - `Tier 1 - R3.5`: Backward compatibility for default single-line and preserve-paragraphs options.

### Tier 2: Boundary & Corner Cases (>=5 test cases per feature)
Adversarial and extreme boundary conditions:
- **R1 Boundaries**:
  - `Tier 2 - R1.1`: Exact word count boundaries (130 min, 160 max; no underflow or overflow).
  - `Tier 2 - R1.2`: Heading string does not contain `<h1>` or unescaped HTML, preserving single-H1 rule.
  - `Tier 2 - R1.3`: Steps array contains no empty or whitespace-only elements.
  - `Tier 2 - R1.4`: Resilient lookup across casing and whitespace.
  - `Tier 2 - R1.5`: Non-target tools (`word-counter`, `base64`) safely return `undefined`.
- **R2 Boundaries**:
  - `Tier 2 - R2.1`: Related tools array contains `>= 3` registered slugs without self-reference.
  - `Tier 2 - R2.2`: Internal markdown links point exclusively to existing canonical tools in `TOOLS_REGISTRY`.
  - `Tier 2 - R2.3`: FAQ answers format without HTML tags and with valid markdown links.
  - `Tier 2 - R2.4`: Absence of `FAQPage` JSON-LD schema is strictly guarded against rich snippet conflicts.
  - `Tier 2 - R2.5`: Search guide example inputs contain realistic punctuation and zero control characters.
- **R3 Boundaries**:
  - `Tier 2 - R3.1`: `formatIntoTwoParagraphs` handles empty, null, and whitespace-only input safely (`""`).
  - `Tier 2 - R3.2`: Single run-on sentence without terminal punctuation splits near median word.
  - `Tier 2 - R3.3`: Odd sentence count (e.g. 5 sentences) splits into balanced $\lceil N/2 \rceil$ paragraphs.
  - `Tier 2 - R3.4`: Idempotence on text that is already two paragraphs.
  - `Tier 2 - R3.5`: Extreme input stress test (`50,000+` characters) finishes in `< 250ms` with zero stack overflow.

### Tier 3: Cross-Feature Combinations (Pairwise Interactions R1 + R2 + R3)
Verifies coherence across the multi-feature boundaries:
- `Tier 3 - Cross 1`: R1 answer block steps prescribe the exact options and 1-click presets implemented in R3.
- `Tier 3 - Cross 2`: R2 search guide example input transformed with R3 engine produces verbatim guide output.
- `Tier 3 - Cross 3`: R1 takeaway privacy guarantees align with R2 educational FAQ answers (100% in-browser, zero server compute).
- `Tier 3 - Cross 4`: R2 related tools cross-reference between `remove-line-breaks` and `ai-summarize`.
- `Tier 3 - Cross 5`: Blueprint integration dynamically propagates search guide metadata to page SEO.
- `Tier 3 - Cross 6`: Strict single-H1 and valid heading hierarchy (`H1` in `ToolShell`, `H2` for citable blocks and search guides, `H3` for FAQs).

### Tier 4: Real-World Application Scenarios (Multi-Intent Conversational Queries)
End-to-end execution of real user queries against un-sanitized, dirty text artifacts:
- `Tier 4 - Scenario 1`: Multi-intent query: "condense a long paragraph into two paragraphs and remove line separators" with PDF copy-paste artifact (60-char line wraps, hyphenated breaks).
- `Tier 4 - Scenario 2`: Multi-intent query: Email newsletter / raw text with erratic hard wraps, mixed CRLF, and multiple blank line separators (`\n\n\n\n`).
- `Tier 4 - Scenario 3`: Multi-intent query: Terminal log & markdown artifact with horizontal rule dividers (`---`, `***`) and code separators.
- `Tier 4 - Scenario 4`: Multi-intent query: OCR scan artifact with uneven sentence breaks and messy line wraps.
- `Tier 4 - Scenario 5`: End-to-end pipeline: Raw messy text -> R3 formatting into 2 paragraphs -> AI summarizer input preparation.

---

## 3. Progressive Testability Model

During multi-agent parallel milestone execution (Track-E, M1, M2, M3, M4):
1. **Zero Pipeline Disruption**: Tests use native `t.skip()` checks for modules or exports that are pending parallel worker commits.
2. **Immediate Activation**: When a parallel worker completes a milestone (e.g. M1 `citableAnswerBlocks.ts`), the corresponding tests immediately un-skip and execute real assertions.
3. **No Facade Testing**: Tests contain full, authentic invariant assertions. Skipped tests do not produce fake passes; they explicitly report pending status until the underlying implementation is present.
4. **Final Gate (M4)**: In Milestone 4, 100% of all 41 test cases must pass with 0 skips and 0 failures.

---

## 4. Test Execution & Verification

### Run E2E Test Suite Only
```bash
npm test -- tests/e2e/geo-and-presets.test.ts
```

### Run Full Test Suite
```bash
npm test
```

### Verify Static Type Compliance
```bash
npm run typecheck
```

### Run Production Auditor (Single H1, SEO Guides, Schemas)
```bash
npm run check:production
```
