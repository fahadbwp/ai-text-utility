# Task Assignment: Worker for Milestone 3 (R3 1-Click Paragraph Formatting & Cleanup Preset)

Working directory: d:\ai-text-tool\.agents\teamwork\m3_worker_1
Authoritative request: d:\ai-text-tool\.agents\teamwork\ORIGINAL_REQUEST.md
Project plan: d:\ai-text-tool\PROJECT.md
Survey Report: d:\ai-text-tool\.agents\teamwork\survey_explorer_3\handoff.md (Sections 2, 3, 6.2)

## Mission
Implement R3: 1-Click Paragraph Formatting & Cleanup Preset in `lib/tools/removeLineBreaks.ts` and `components/tools/TransformTool.tsx`.

## Write Ownership
You EXCLUSIVELY own:
- `lib/tools/removeLineBreaks.ts`
- `components/tools/TransformTool.tsx`
- `tests/tools/cleanupTools.test.ts`

DO NOT edit any other files.

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Technical Specifications
1. In `lib/tools/removeLineBreaks.ts`:
   - Implement `formatIntoTwoParagraphs(input, options)` helper function:
     - Cleans hyphenated line breaks (`word-\nbreak` -> `wordbreak`).
     - Cleans horizontal rule dividers (`---`, `***`, `___`).
     - Normalizes paragraphs.
     - If input has $>2$ paragraphs, joins them into 2 balanced blocks separated by `\n\n`.
     - If single continuous text block, unwraps line breaks with separator (`" "`), splits sentences using standard delimiters (`.`, `!`, `?`), and distributes sentences evenly into Paragraph 1 and Paragraph 2 separated by `\n\n`.
     - Fallback for single run-on sentence without punctuation: cleanly splits at median word boundary.
   - Update `removeLineBreaks(input, options)`:
     - Support `options.formatTwoParagraphs?: boolean`.
     - Support `options.preset?: "single-line" | "preserve-paragraphs" | "two-paragraphs"`.
     - If `formatTwoParagraphs` is true or `preset === "two-paragraphs"`, return `formatIntoTwoParagraphs(input, { separator })`.
     - Maintain strict backward compatibility for `collapseParagraphs: boolean` and default `separator`.

2. In `components/tools/TransformTool.tsx`:
   - Add state: `lineBreaksPreset` ("custom" | "two-paragraphs" | "preserve-paragraphs" | "single-line").
   - In `executeTool("remove-line-breaks")`, pass `formatTwoParagraphs: lineBreaksPreset === "two-paragraphs"`.
   - Update UI controls for `"remove-line-breaks"` with an accessible **1-Click Presets Bar**:
     - Button 1: `"Clean & Format into 2 Paragraphs"` (aria-label: "Clean line separators and format into 2 paragraphs", aria-pressed)
     - Button 2: `"Normalize Paragraphs (Double Break)"` (aria-label: "Normalize paragraphs with double line breaks", aria-pressed)
     - Button 3: `"Single Continuous Line"` (aria-label: "Remove all line breaks into a single continuous line", aria-pressed)
     - Style buttons with accessible tokens matching CaseConverter presets.
     - Retain advanced separator dropdown and checkbox below separator divider.
   - Ensure 100% in-browser client-side execution, zero external network calls.

3. In `tests/tools/cleanupTools.test.ts`:
   - Add unit tests verifying `formatIntoTwoParagraphs` and `removeLineBreaks` presets (multi-sentence split, hyphenated line wraps, 4-paragraph condensation, backward compatibility).

4. Verify by running:
   - `npm run typecheck`
   - `npm test`
   - `node --import tsx --test "tests/e2e/geo-and-presets.test.ts"`

## Completion
Write your completion handoff report to `d:\ai-text-tool\.agents\teamwork\m3_worker_1\handoff.md` and notify caller via send_message.


## 2026-11-10T04:06:20Z
You are m3_worker_1.
Your working directory is d:\ai-text-tool\.agents\teamwork\m3_worker_1.
Read your instructions at d:\ai-text-tool\.agents\teamwork\m3_worker_1\DISPATCH.md, the authoritative request at d:\ai-text-tool\.agents\teamwork\ORIGINAL_REQUEST.md, and the survey findings at d:\ai-text-tool\.agents\teamwork\survey_explorer_3\handoff.md.
MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work.
Implement R3 in lib/tools/removeLineBreaks.ts (formatIntoTwoParagraphs helper and preset options) and components/tools/TransformTool.tsx (accessible 1-click presets bar), and update tests/tools/cleanupTools.test.ts.
Verify by running typecheck and tests.
Write your handoff report to d:\ai-text-tool\.agents\teamwork\m3_worker_1\handoff.md.
Notify me via send_message when complete.
