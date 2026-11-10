# Task Assignment: Worker for Milestone 2 (R2 Conversational Intent Search Guides & FAQ Coverage)

Working directory: d:\ai-text-tool\.agents\teamwork\m2_worker_1
Authoritative request: d:\ai-text-tool\.agents\teamwork\ORIGINAL_REQUEST.md
Project plan: d:\ai-text-tool\PROJECT.md
Spec Miner Survey: d:\ai-text-tool\.agents\teamwork\survey_explorer_2\handoff.md (Sections 1.2, 1.3, 2.2, 6.2)

## Mission
Implement R2: Conversational Intent Search Guides & FAQ Coverage in `data/seo/searchGuides.ts` and `data/seo/faq.ts` (`data/toolFaqs.ts`) for `/tools/remove-line-breaks` and `/tools/ai-summarize`.

## Write Ownership
You EXCLUSIVELY own:
- `data/seo/searchGuides.ts`
- `data/seo/faq.ts`
- `tests/seo/searchGuides.test.ts`

DO NOT edit any other files.

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Technical Specifications
1. In `data/seo/searchGuides.ts`, add entries for `"remove-line-breaks"` and `"ai-summarize"` exactly as specified in `survey_explorer_2/handoff.md`:
   - `remove-line-breaks`:
     - `title`: `"Remove Line Breaks Online – Strip Line Separators Free"` (54 chars: 40-75 bounds)
     - `description`: `"Remove hard line breaks and clean line separators to format run-on text into structured paragraphs or single continuous lines. 100% private in-browser tool."` (157 chars: 130-180 bounds)
     - `heading`: `"Remove Hard Line Separators & Format Structured Paragraphs"`
     - `useCase`: References condensing messy text into two structured paragraphs, PDF line separator removal, and internal links `[Remove Extra Spaces](/tools/remove-extra-spaces)`, `[Remove Empty Lines](/tools/remove-empty-lines)`, `[AI Summarizer](/tools/ai-summarize)`.
     - `example`:
       - `input`: `"First line of paragraph one.\nSecond line of paragraph one.\n\nFirst line of paragraph two.\nSecond line of paragraph two."`
       - `output`: `"First line of paragraph one. Second line of paragraph one.\n\nFirst line of paragraph two. Second line of paragraph two."`
       - `note`: `"Preserved double line breaks between paragraphs while joining wrapped lines."`
     - `limitation`: Documents delimiter substitution and note that it does not alter word choice.
     - `related`: `["remove-extra-spaces", "remove-empty-lines", "ai-summarize", "word-counter"]` (>= 3 valid slugs, no self-links)
     - `faq`: question and answer matching the first FAQ in `data/seo/faq.ts`.
   - `ai-summarize`:
     - `title`: `"AI Text Summarizer – Condense Long Articles Online [Free]"` (58 chars: 40-75 bounds)
     - `description`: `"Condense long articles, reports, and run-on text into structured paragraphs or key bullet points with an AI provider. Free online text summarizer."` (148 chars: 130-180 bounds, contains `"with an AI provider"`)
     - `heading`: `"Condense Long Articles & Multi-Paragraph Text Online"`
     - `useCase`: Explains distilling drafts into two structured paragraphs; links to `[Remove Line Breaks](/tools/remove-line-breaks)`, `[AI Paraphraser](/tools/ai-paraphrase)`, `[AI Proofreader](/tools/ai-grammar)`.
     - `example`: input and 2-paragraph output. Note MUST contain `"Illustrative"` (e.g. `"Illustrative condensation of dense technical overview into two structured paragraphs."`).
     - `limitation`: Notes summarization heuristics and privacy boundary.
     - `related`: `["remove-line-breaks", "ai-paraphrase", "ai-expand", "word-counter"]`
     - `faq`: question and answer matching the first FAQ in `data/seo/faq.ts`.

2. In `data/seo/faq.ts`, update `TOOL_SPECIFIC_CONTENT["remove-line-breaks"].faqs` and `TOOL_SPECIFIC_CONTENT["ai-summarize"].faqs` to include educational FAQ pairs addressing:
   - Condensing run-on text into two structured paragraphs and removing line separators.
   - Formatting and cleaning text with 100% in-browser privacy and zero server upload.
   - Ensure the first FAQ in each tool matches `SEARCH_GUIDES[slug].faq` verbatim so that `getToolEducationalContent()` synchronizes cleanly.

3. In `tests/seo/searchGuides.test.ts`:
   - In the `transforms` map (lines 20-33), register `"remove-line-breaks"`:
     ```typescript
     "remove-line-breaks": async (input) => {
       const { removeLineBreaks } = await import("@/lib/tools/removeLineBreaks");
       return removeLineBreaks(input, { collapseParagraphs: true, separator: " " });
     },
     ```

4. Verify by running:
   - `npm run typecheck`
   - `npm test`
   - `node --import tsx --test "tests/e2e/geo-and-presets.test.ts"`

## Completion
Write your completion handoff report to `d:\ai-text-tool\.agents\teamwork\m2_worker_1\handoff.md` and notify caller via send_message.


## 2026-11-10T04:06:20Z
You are m2_worker_1.
Your working directory is d:\ai-text-tool\.agents\teamwork\m2_worker_1.
Read your instructions at d:\ai-text-tool\.agents\teamwork\m2_worker_1\DISPATCH.md, the authoritative request at d:\ai-text-tool\.agents\teamwork\ORIGINAL_REQUEST.md, and the survey findings at d:\ai-text-tool\.agents\teamwork\survey_explorer_2\handoff.md.
MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work.
Implement R2 in data/seo/searchGuides.ts and data/seo/faq.ts (conversational guides, FAQ pairs addressing privacy and 2-paragraph condensing), and update tests/seo/searchGuides.test.ts.
Verify by running typecheck and tests.
Write your handoff report to d:\ai-text-tool\.agents\teamwork\m2_worker_1\handoff.md.
Notify me via send_message when complete.
