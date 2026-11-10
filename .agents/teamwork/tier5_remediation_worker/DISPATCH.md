# Task Assignment: Tier 5 Remediation Worker

Working directory: d:\ai-text-tool\.agents\teamwork\tier5_remediation_worker
Authoritative request: d:\ai-text-tool\.agents\teamwork\ORIGINAL_REQUEST.md
Challenger handoff: d:\ai-text-tool\.agents\teamwork\tier5_challenger_1\handoff.md

## Mission
Apply the Tier 5 adversarial fixes to `lib/tools/removeLineBreaks.ts` and verify the full automated pipeline.

## Write Ownership
You EXCLUSIVELY own:
- `lib/tools/removeLineBreaks.ts`
- `tests/tools/cleanupTools.test.ts` (or `tests/adversarial.test.ts` if adding test cases)

## Tasks
1. In `lib/tools/removeLineBreaks.ts`:
   - Replace `splitIntoSentences`:
     ```typescript
     function splitIntoSentences(text: string): string[] {
       const sentences = text
         .split(/(?<=[.!?]["')\]]?)\s+/)
         .map((s) => s.trim())
         .filter(Boolean);
       return sentences.length > 0 ? sentences : [text];
     }
     ```
   - In `formatIntoTwoParagraphs`, update hyphen replacement:
     `cleaned = cleaned.replace(/(\p{L}+)-[ \t]*\r?\n[ \t]*(\p{L}+)/gu, "$1$2");`
   - In `formatIntoTwoParagraphs`, update divider replacement:
     `cleaned = cleaned.replace(/^[ \t]*[-*_](?:[ \t]*[-*_]){2,}[ \t]*$/gm, "");`
2. Add test cases in `tests/tools/cleanupTools.test.ts` verifying:
   - Decimals (`$19.99`), emails (`user@site.com`), URLs (`https://site.org`), quotes (`"Stop!" he said`) are not dropped.
   - Accented words (`café-\nstyle` -> `caféstyle`) are rejoined.
   - Number ranges (`10-\n11`) are not concatenated.
   - Spaced dividers (`- - -`, `* * *`) are stripped.
3. Verify:
   - `npm run typecheck` (0 errors)
   - `npm test` (all tests passing)
   - `npm run build` (239 static routes)
   - `npm run check:production` (184 canonical routes)
   - Commit any changes and check git sync with `fahadbwp/main` and `origin/main`.

## Completion
Write your report to `d:\ai-text-tool\.agents\teamwork\tier5_remediation_worker\handoff.md` and notify caller via send_message.


## 2026-11-10T04:44:17Z
[Message] timestamp=2026-11-10T04:44:17Z sender=79340a7f-ea06-4433-abc9-447aa6cb7b2b priority=MESSAGE_PRIORITY_HIGH content=You are tier5_remediation_worker.
Your working directory is d:\ai-text-tool\.agents\teamwork\tier5_remediation_worker.
Read your instructions at d:\ai-text-tool\.agents\teamwork\tier5_remediation_worker\DISPATCH.md and the challenger report at d:\ai-text-tool\.agents\teamwork\tier5_challenger_1\handoff.md.
Apply the Tier 5 fixes to lib/tools/removeLineBreaks.ts (splitIntoSentences lookbehind, unicode letter hyphenation, spaced markdown dividers).
Add tests in tests/tools/cleanupTools.test.ts.
Verify with npm run typecheck, npm test, npm run build, npm run check:production, and git sync.
Write your handoff report to d:\ai-text-tool\.agents\teamwork\tier5_remediation_worker\handoff.md.
Notify me via send_message when complete.
