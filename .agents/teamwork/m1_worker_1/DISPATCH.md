# Task Assignment: Worker for Milestone 1 (R1 GEO & Citable Answer Blocks)

Working directory: d:\ai-text-tool\.agents\teamwork\m1_worker_1
Authoritative request: d:\ai-text-tool\.agents\teamwork\ORIGINAL_REQUEST.md
Project plan: d:\ai-text-tool\PROJECT.md
Explorer Survey: d:\ai-text-tool\.agents\teamwork\survey_explorer_2\handoff.md (Sections 1.5, 2.1, 6.2)

## Mission
Implement R1: Generative Engine Optimization (GEO) & Citable Answer Blocks for `/tools/remove-line-breaks` and `/tools/ai-summarize`.

## Write Ownership
You EXCLUSIVELY own:
- `data/seo/citableAnswerBlocks.ts` (create model and 138-word citable answer blocks with direct bullet steps)
- `components/layouts/ToolShell.tsx` (render citable answer block below Header Card and above `{children}` using `<h2 id="citable-answer-heading">` to maintain strict single-H1 compliance)
- `tests/seo/citableAnswerBlocks.test.ts` (test word count 130–160, presence of bullet steps, and placement)

DO NOT edit any other files.

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Technical Specifications
1. Create `data/seo/citableAnswerBlocks.ts` defining:
   ```typescript
   export interface CitableAnswerBlock {
     heading: string;
     intro: string;
     steps: string[];
     takeaway: string;
   }
   export const CITABLE_ANSWER_BLOCKS: Record<string, CitableAnswerBlock> = { ... };
   ```
   Provide the 138-word blocks for `remove-line-breaks` and `ai-summarize` detailed in `survey_explorer_2/handoff.md:143-165`.
2. Update `components/layouts/ToolShell.tsx`:
   Check `CITABLE_ANSWER_BLOCKS[tool.slug]`. If present, render the citable answer block callout card directly below the Header Card and above the tool workspace (`{children}`).
   Ensure:
   - Heading uses `<h2>` (e.g., `<h2 id="quick-answer-heading">`) to preserve the single `<h1>` rule.
   - Word count of block is strictly between 130 and 160 words.
   - Render position is at word offset ~35–175 (top 4%–21% of the total ~850 words page), strictly inside the top 30% of content.
3. Add unit test `tests/seo/citableAnswerBlocks.test.ts` verifying:
   - Each registered block has word count between 130 and 160 words.
   - At least 4 direct bullet steps per block.
   - Both `/tools/remove-line-breaks` and `/tools/ai-summarize` are present.
4. Verify by running:
   - `npm run typecheck`
   - `npm test`

## Completion
Write your completion handoff report to `d:\ai-text-tool\.agents\teamwork\m1_worker_1\handoff.md` and notify caller via send_message.


## 2026-11-10T03:44:49Z
You are m1_worker_1.
Your working directory is d:\ai-text-tool\.agents\teamwork\m1_worker_1.
Read your task instructions at d:\ai-text-tool\.agents\teamwork\m1_worker_1\DISPATCH.md, the authoritative request at d:\ai-text-tool\.agents\teamwork\ORIGINAL_REQUEST.md, and the survey findings at d:\ai-text-tool\.agents\teamwork\survey_explorer_2\handoff.md.
MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work.
Implement data/seo/citableAnswerBlocks.ts, render the citable answer block card in components/layouts/ToolShell.tsx below Header Card using an <h2>, and add tests in tests/seo/citableAnswerBlocks.test.ts.
Verify by running typecheck and tests.
Write your handoff report to d:\ai-text-tool\.agents\teamwork\m1_worker_1\handoff.md.
Notify me via send_message when complete.
