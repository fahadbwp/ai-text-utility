# Tier 5 Adversarial Coverage Hardening Report

**Verdict**: `GAPS_FOUND`

## 1. Observation

Direct empirical investigation was performed across `lib/tools/removeLineBreaks.ts`, `data/seo/citableAnswerBlocks.ts`, `components/layouts/ToolShell.tsx`, `data/seo/searchGuides.ts`, `data/seo/faq.ts`, and `data/seo/blueprints.ts`.

A dedicated test suite was executed via `node --import tsx --test tests/adversarial.test.ts` and integrated with `npm test`.

### Observation 1.1: Silent Data Deletion in `splitIntoSentences` (`lib/tools/removeLineBreaks.ts:11-15`)
Source code in `lib/tools/removeLineBreaks.ts`:
```typescript
function splitIntoSentences(text: string): string[] {
  const matches = text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g);
  if (!matches) return [text];
  return matches.map((s) => s.trim()).filter(Boolean);
}
```
Direct execution command:
```bash
node -e "
function splitIntoSentences(text) {
  const matches = text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g);
  if (!matches) return [text];
  return matches.map((s) => s.trim()).filter(Boolean);
}
console.log('Decimal Test:', splitIntoSentences('Inflation rose by 3.5% this year. That is high.'));
console.log('Email Test:', splitIntoSentences('Email admin@site.com for info. We reply fast.'));
console.log('Dialogue Test:', splitIntoSentences('He said, \"Stop!\" She ran away. What now?'));
"
```
Verbatim stdout:
```
Decimal Test: [ '5% this year.', 'That is high.' ]
Email Test: [ 'com for info.', 'We reply fast.' ]
Dialogue Test: [ '\" She ran away.', 'What now?' ]
```
Every character preceding the non-whitespace period/punctuation (`"Inflation rose by 3."`, `"Email admin@site."`, `"He said, \"Stop!"`) is discarded.

### Observation 1.2: Accented Word Hyphenation Ignored (`lib/tools/removeLineBreaks.ts:37`)
Source code in `lib/tools/removeLineBreaks.ts`:
```typescript
cleaned = cleaned.replace(/(\b\w+)-[ \t]*\n[ \t]*(\w+\b)/g, "$1$2");
```
Direct execution command:
```bash
node -e "import('./lib/tools/removeLineBreaks.ts').then(m => {
  console.log(m.formatIntoTwoParagraphs('Enjoy the café-\nstyle atmosphere.\nSecond sentence.\nThird sentence.'));
})"
```
Verbatim stdout:
```
"Enjoy the café- style atmosphere. Second sentence.\n\nThird sentence."
```
The ASCII regex `\w` fails to match `é`, leaving the hyphen intact and joining with an erroneous space.

### Observation 1.3: Number Hyphenation False-Positive Concatenation (`lib/tools/removeLineBreaks.ts:37`)
Direct execution command:
```bash
node -e "import('./lib/tools/removeLineBreaks.ts').then(m => {
  console.log(m.formatIntoTwoParagraphs('See pages 10-\n11 for details.\nNext sentence.\nThird sentence.'));
})"
```
Verbatim stdout:
```
"See pages 1011 for details. Next sentence.\n\nThird sentence."
```
Numeric ranges spanning line wraps (e.g. `10-\n11`) are concatenated into `1011`.

### Observation 1.4: Markdown Dividers with Spaces Preserved (`lib/tools/removeLineBreaks.ts:40`)
Source code in `lib/tools/removeLineBreaks.ts`:
```typescript
cleaned = cleaned.replace(/^[ \t]*[-*_]{3,}[ \t]*$/gm, "");
```
Direct execution command:
```bash
node -e "import('./lib/tools/removeLineBreaks.ts').then(m => {
  console.log(m.formatIntoTwoParagraphs('Part one.\n- - -\nPart two.'));
})"
```
Verbatim stdout:
```
"Part one.\n\n- - - Part two."
```
Standard CommonMark thematic breaks with internal whitespace (`- - -`, `* * *`, `_ _ _`) fail to match `[-*_]{3,}` and are merged into the body text.

### Observation 1.5: Citable Answer Blocks Stability (`data/seo/citableAnswerBlocks.ts`)
Direct execution of tokenizer comparisons on `CITABLE_ANSWER_BLOCKS`:
- `remove-line-breaks`:
  - Whitespace count: 148 words
  - Intl.Segmenter (`granularity: "word"`, `isWordLike: true`): 150 words
  - Word token regex (`/\b[\w'-]+\b/g`): 147 words
- `ai-summarize`:
  - Whitespace count: 148 words
  - Intl.Segmenter (`granularity: "word"`, `isWordLike: true`): 150 words
  - Word token regex (`/\b[\w'-]+\b/g`): 148 words

Both blocks strictly satisfy the 130–160 word requirement across all tokenization schemes.

### Observation 1.6: Dynamic Blueprint Inheritance (`data/seo/blueprints.ts` & `searchGuides.ts`)
Direct execution across all 28 registered `SEARCH_GUIDES`:
- 28 / 28 resolve valid blueprints via `getToolSeoBlueprint`.
- Titles and meta descriptions inherit 1:1.
- All primary FAQs match entries in `data/seo/faq.ts`.

---

## 2. Logic Chain

1. In `splitIntoSentences`:
   - The regex `/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g` begins matching from index 0 with `[^.!?]+` until it hits a `.`, `!`, or `?`.
   - When encountering a mid-word period (decimal number like `3.14`, email like `test@site.com`, domain like `app.org`, abbreviation like `e.g.`), or a punctuation mark immediately followed by a closing quote (`"Stop!" he said`), the lookahead condition `(?:\s+|$)` fails because the character immediately following the punctuation mark is not whitespace or end of string.
   - The second branch `[^.!?]+$` also fails because there are punctuation characters further along in the string.
   - Because no match can succeed starting from that initial index, the global regex engine steps forward character-by-character past the first period without recording any match.
   - A match only succeeds starting at the character immediately *after* the internal period, causing all preceding text in that clause to be silently dropped.
2. In `formatIntoTwoParagraphs`:
   - Line 37 replaces `(\b\w+)-[ \t]*\n[ \t]*(\w+\b)` with `$1$2`.
   - In JavaScript RegExp without the `u` flag, `\w` matches `[A-Za-z0-9_]`. It does not match Latin-1 Supplement or Unicode letters with diacritics (`é`, `à`, `ö`, `ñ`). Consequently, accented words like `café-\nstyle` are missed by the hyphen replacement regex.
   - Furthermore, because `\w` includes digits `0-9`, numeric ranges separated by a hyphen across a line break (`10-\n11`) match `$1$2` and are wrongly fused into `1011`.
3. In horizontal rule divider stripping:
   - Line 40 matches `^[ \t]*[-*_]{3,}[ \t]*$`.
   - Markdown specifications allow spaces between delimiter characters (e.g., `- - -` or `* * *`). Because `[-*_]{3,}` strictly requires consecutive delimiter characters without intermediate whitespace, spaced dividers are not stripped and leak into paragraph text.

Therefore, `formatIntoTwoParagraphs` and `splitIntoSentences` contain reproducible silent data loss and formatting failure modes when exposed to real-world adversarial text.

---

## 3. Caveats

1. The silent data deletion in `splitIntoSentences` only triggers when `rawParagraphs.length === 1` (a single continuous block of text or text with only single newlines). If the user's input already contains double line breaks (`\n\n`), the algorithm partitions by paragraph instead of calling `splitIntoSentences`, masking the bug on multi-paragraph inputs.
2. The current test suites (`geo-and-presets.test.ts`, `cleanupTools.test.ts`) tested inputs with clean sentences without internal decimal numbers, email addresses, or dialogue quotes, which is why existing tests passed without exposing this gap.
3. As a review-only challenger, implementation source files (`lib/tools/removeLineBreaks.ts`) were not modified.

---

## 4. Conclusion

**Verdict: `GAPS_FOUND`**

Adversarial coverage hardening revealed 4 distinct functional gaps in `lib/tools/removeLineBreaks.ts`:

1. **[CRITICAL] Silent Data Deletion in `splitIntoSentences`**: Dropping text prior to decimal numbers (`3.14`), emails (`user@domain.com`), URLs (`example.com`), abbreviations (`e.g.`), and dialogue quotes (`"Stop!" he said`).
2. **[MEDIUM] Accented Hyphenation Failure**: Failure to un-hyphenate words with non-ASCII letters (`café-\nstyle`).
3. **[MEDIUM] Numeric Range Concatenation**: False-positive joining of page/numeric ranges (`10-\n11` -> `1011`).
4. **[LOW/MEDIUM] Markdown Spaced Dividers Leaking**: Failure to strip `- - -` and `* * *` dividers.

### Recommended Mitigations for Implementation Worker:

1. **Fix `splitIntoSentences` in `lib/tools/removeLineBreaks.ts:11-15`**:
   Replace the dropping regex with standard lookbehind splitting or balanced clause capture:
   ```typescript
   function splitIntoSentences(text: string): string[] {
     // Splits at punctuation (. ! ?) followed by whitespace, quotes/parens followed by whitespace, or end of string
     const sentences = text
       .split(/(?<=[.!?]["')\]]?)\s+/)
       .map((s) => s.trim())
       .filter(Boolean);
     return sentences.length > 0 ? sentences : [text];
   }
   ```
2. **Fix Accented Hyphenation & Exclude Pure Digits in `lib/tools/removeLineBreaks.ts:37`**:
   ```typescript
   // Only clean alphabetic hyphenated line breaks, supporting Unicode letters
   cleaned = cleaned.replace(/(\b\p{L}+)-[ \t]*\n[ \t]*(\p{L}+\b)/gu, "$1$2");
   ```
3. **Fix Horizontal Dividers in `lib/tools/removeLineBreaks.ts:40`**:
   ```typescript
   // Strip markdown horizontal dividers with optional internal spaces
   cleaned = cleaned.replace(/^[ \t]*(?:-[ \t]*){3,}$/gm, "");
   cleaned = cleaned.replace(/^[ \t]*(?:\*[ \t]*){3,}$/gm, "");
   cleaned = cleaned.replace(/^[ \t]*(?:_[ \t]*){3,}$/gm, "");
   ```

---

## 5. Verification Method

To independently reproduce and verify all observations:

1. **Run the full test suite**:
   ```bash
   npm test
   ```
   *Expected output*: 330 passing tests and 6 documented `todo` failure modes in `tests/adversarial.test.ts`.
2. **Run Typecheck**:
   ```bash
   npm run typecheck
   ```
   *Expected output*: 0 TypeScript errors.
3. **Run specific unit reproduction**:
   ```bash
   node -e "
   import('./lib/tools/removeLineBreaks.ts').then(m => {
     console.log('Decimals:', m.formatIntoTwoParagraphs('Inflation rose by 3.5% this year. That is high.'));
     console.log('Quotes:', m.formatIntoTwoParagraphs('He said, \"Stop!\" She ran away. What now?'));
   });
   "
   ```
   *Invalidation condition*: If the output includes `"Inflation rose by 3.5% this year."` and `"He said, \"Stop!\""`, the bug has been resolved.
