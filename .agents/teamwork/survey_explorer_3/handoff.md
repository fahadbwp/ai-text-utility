# Survey & Architecture Report: 1-Click Paragraph Formatting & Cleanup Preset (R3)

**Author**: `survey_explorer_3`  
**Date**: 2026-11-10T03:38:00Z  
**Target Milestone**: R3 (1-Click Paragraph Formatting & Cleanup Preset)  
**Authoritative Reference**: `d:\ai-text-tool\.agents\teamwork\ORIGINAL_REQUEST.md`

---

## 1. Observation

### 1.1 Baseline Test & Verification Pipeline
- **Command**: `npm test` (`node --import tsx --test "tests/**/*.test.ts"`)
  - **Result**: Exactly **258 passing tests** (0 failed, 0 skipped, duration 23.4s).
- **Command**: `npm run typecheck` (`tsc --noEmit`)
  - **Result**: **0 TypeScript compilation errors** (exit code 0).

### 1.2 Tool Routing & Architecture for `/tools/remove-line-breaks`
- **File**: `app/tools/[slug]/ToolPageClient.tsx`
  - Lines 89–91: All text transformations and cleanup tools, including `remove-line-breaks`, route to `TransformTool`:
    ```tsx
    // 8. Text Transformations & Cleanups (18 tools)
    return <TransformTool tool={tool} />;
    ```
- **File**: `data/tools/cleanup.ts`
  - Lines 89–103: Defines the `remove-line-breaks` metadata:
    ```ts
    {
      id: "remove-line-breaks",
      name: "Remove Line Breaks",
      slug: "remove-line-breaks",
      category: "Cleanup",
      layout: "transform",
      description: "Join multi-line paragraphs into a single continuous paragraph or delimited line.",
      icon: "CornerDownLeft",
      keywords: ["remove line breaks", "join lines", "single line", "unwrap paragraphs"],
      featured: false,
      logicReference: "removeLineBreaks",
      supportsLiveMode: true,
      requiresAI: false,
      sampleInput: "Breaking lines\nacross multiple\nseparate paragraphs\ninto one smooth flow.",
    }
    ```

### 1.3 TransformTool State & Controls
- **File**: `components/tools/TransformTool.tsx`
  - Line 17: Imports `removeLineBreaks` from `@/lib/tools/index`.
  - Lines 64–65: Defines cleanup options state:
    ```tsx
    const [lineBreaksSep, setLineBreaksSep] = useState<string>(" ");
    const [lineBreaksParagraphs, setLineBreaksParagraphs] = useState<boolean>(false);
    ```
  - Lines 194–201: In `executeTool(currentInput)`:
    ```tsx
    case "remove-line-breaks":
      setOutput(
        removeLineBreaks(currentInput, {
          separator: lineBreaksSep,
          collapseParagraphs: lineBreaksParagraphs,
        })
      );
      break;
    ```
  - Lines 408–420: `useEffect` executes `executeTool(input)` reactively because `tool.supportsLiveMode` is `true`. Input $\ge 2000$ characters is debounced by 120ms to avoid main thread jank:
    ```tsx
    useEffect(() => {
      if (!tool.supportsLiveMode) return;
      if (input.length >= 2000) {
        const timer = setTimeout(() => {
          executeTool(input);
        }, 120);
        return () => clearTimeout(timer);
      }
      executeTool(input);
    }, [input, tool.supportsLiveMode, executeTool]);
    ```
  - Lines 695–723: Current `customControls` for `remove-line-breaks`:
    ```tsx
    case "remove-line-breaks":
      return (
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Replace With:</span>
            <select
              aria-label="Replace line breaks with"
              value={lineBreaksSep}
              onChange={(e) => setLineBreaksSep(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-brand-500 shadow-2xs"
            >
              <option value=" ">Single Space (&quot; &quot;)</option>
              <option value=", ">Comma & Space (&quot;, &quot;)</option>
              <option value="; ">Semicolon & Space (&quot;; &quot;)</option>
              <option value="">Nothing (Join Directly)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={lineBreaksParagraphs}
              onChange={(e) => setLineBreaksParagraphs(e.target.checked)}
              className="rounded-sm border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
            />
            <span>Preserve Double Line Breaks (Paragraphs)</span>
          </label>
        </div>
      );
    ```
  - **Observation on current state**: Currently, `remove-line-breaks` lacks preset buttons. Users can only manually change the replacement separator dropdown or check the "Preserve Double Line Breaks" checkbox. There is no 1-click option to format/condense text into 2 balanced paragraphs or normalize line separators with a single tap.

### 1.4 Underlying Utility Implementation
- **File**: `lib/tools/removeLineBreaks.ts`
  - Lines 1–28:
    ```ts
    export interface RemoveLineBreaksOptions {
      separator?: string;
      collapseParagraphs?: boolean;
    }

    export function removeLineBreaks(
      input: string,
      options: RemoveLineBreaksOptions = {}
    ): string {
      if (!input) return "";

      const separator = options.separator !== undefined ? options.separator : " ";
      const collapseParagraphs = options.collapseParagraphs ?? false;

      if (collapseParagraphs) {
        // Keep double newlines as paragraph breaks, but join single newlines
        const paragraphs = input.split(/\n\s*\n/);
        const cleanedParagraphs = paragraphs.map((p) => {
          const lines = p.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
          return lines.join(separator);
        });
        return cleanedParagraphs.filter(Boolean).join("\n\n");
      }

      // Join all lines with separator, ensuring words do not collide
      const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      return lines.join(separator);
    }
    ```
  - **Observation on current logic**: If an input text is a single continuous wall of text with single hard line breaks (as copied from PDFs, OCR, or terminal outputs), `collapseParagraphs: true` produces a single paragraph because no `\n\s*\n` exists in the input. It cannot format/distribute run-on text into 2 clean, structured paragraphs.

### 1.5 Client-Side Execution & Privacy Model
- **File**: `components/tools/TransformTool.tsx` and `components/layouts/TransformLayout.tsx`
  - Pure synchronous calculation in `executeTool`.
  - Zero `fetch` calls, zero network endpoints, zero third-party scripts.
  - Telemetry (`trackEvent` in `lib/analytics.ts`) tracks only event metadata and character counts, never user input text.
  - 100% in-browser RAM execution with $0 server hosting compute cost.

### 1.6 Existing Tests & Accessibility
- **File**: `tests/tools/cleanupTools.test.ts`
  - Lines 120–140 test `removeLineBreaks`: empty string, CRLF/LF join with space/comma, and `collapseParagraphs: true`.
- **File**: `tests/accessibility-component.test.ts`
  - Confirms dialog focus trap, keyboard events, and `<button>` accessibility.
- **File**: `tests/result-state-component.test.ts`
  - Lines 61–74 verify `TransformTool` live execution, empty-result status display, debouncing on 3000-char input, download, and copy handlers.

---

## 2. Logic Chain

1. **User Requirement & Search Intent Mapping**:
   - The authoritative request targets conversational multi-intent queries: `"condense a long paragraph into two paragraphs and remove line separators"`.
   - Users bringing messy copied text (from PDFs, emails, ChatGPT run-on generations, OCR scans) have two simultaneous needs:
     1. Strip hard line separators/breaks and accidental hyphens.
     2. Structure or normalize the text into clean, readable paragraphs (specifically formatting into 2 balanced paragraphs or double-break paragraph normalization).

2. **UI Architecture in TransformTool**:
   - In `TransformTool.tsx`, tools like `case-converter` (lines 759–789) and `remove-empty-lines` (lines 575–606) use accessible button groups (`aria-pressed`, `px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer`).
   - For `remove-line-breaks`, adding a dedicated **1-Click Presets Bar** allows users to immediately click:
     - Preset 1: `"Clean Line Separators & Format into 2 Paragraphs"` (1-click conversational target)
     - Preset 2: `"Double-Break Paragraph Normalization"` (collapses multiple blank lines into standard `\n\n` while joining single wraps)
     - Preset 3: `"Single Continuous Line"` (joins all lines into a single flow)
   - When clicked, the preset updates the state. Since `supportsLiveMode: true`, the transformation executes instantaneously in-browser without requiring manual "Run" clicks.

3. **Algorithmic Requirements for `lib/tools/removeLineBreaks.ts`**:
   - To support "Clean Line Separators & Format into 2 Paragraphs" cleanly:
     - Option flags: `formatTwoParagraphs?: boolean` or `preset?: "single-line" | "preserve-paragraphs" | "two-paragraphs"`.
     - Step 1: Clean line breaks and line-break hyphens (`word-\nbreak` $\rightarrow$ `wordbreak`).
     - Step 2: If input already has multiple paragraphs:
       - If exactly 2 paragraphs, clean line breaks within each and separate with `\n\n`.
       - If $>2$ paragraphs, balance them into 2 paragraphs divided at `Math.ceil(paragraphs.length / 2)`.
     - Step 3: If input is a single paragraph or wall of text with line breaks:
       - Join internal breaks with the specified separator (`" "`).
       - Detect sentence boundaries using standard delimiters (`.`, `!`, `?` followed by space or end-of-text).
       - If $\ge 2$ sentences exist, split sentences evenly at `Math.ceil(sentences.length / 2)` into Paragraph 1 and Paragraph 2, joined by `\n\n`.
       - If only 1 long sentence exists without terminal punctuation, split cleanly at the nearest punctuation clause (`;`, `:`, `,`) or word boundary closest to the 50% character length mark.

4. **Accessibility Compliance**:
   - All preset buttons must use standard `<button type="button">`, with explicit `aria-label` describing the full action (e.g., `aria-label="Clean line separators and format text into two structured paragraphs"`).
   - Use `aria-pressed={activePreset === "two-paragraphs"}` to communicate active toggle state to screen readers.
   - Maintain contrast $>4.5:1$ in light and dark modes with project standard Tailwind tokens (`bg-brand-600 text-white` active, `text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700` inactive).
   - Keyboard navigable via standard Tab/Shift+Tab and Enter/Space keys.

5. **Testability**:
   - The algorithmic enhancement in `lib/tools/removeLineBreaks.ts` is 100% pure and deterministic.
   - Can be verified via unit tests in `tests/tools/cleanupTools.test.ts` covering:
     - 4-sentence single block split into $2 \times 2$ sentences.
     - Multi-paragraph condensation into 2 paragraphs.
     - Hyphenated line break removal.
     - Single sentence midpoint split.
     - Backward compatibility for existing options (`collapseParagraphs: true`, `separator: ", "`).

---

## 3. Proposed Implementation Specifications

### 3.1 Changes in `lib/tools/removeLineBreaks.ts`

```typescript
export interface RemoveLineBreaksOptions {
  separator?: string;
  collapseParagraphs?: boolean;
  formatTwoParagraphs?: boolean;
  preset?: "single-line" | "preserve-paragraphs" | "two-paragraphs";
}

/**
 * Splits text into sentences based on standard typographic punctuation (. ! ?).
 */
function splitIntoSentences(text: string): string[] {
  const matches = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
  if (!matches) return [text];
  return matches.map((s) => s.trim()).filter(Boolean);
}

/**
 * Formats text into exactly two cohesive paragraphs.
 */
export function formatIntoTwoParagraphs(
  input: string,
  options: { separator?: string } = {}
): string {
  if (!input || !input.trim()) return "";
  const sep = options.separator !== undefined ? options.separator : " ";

  // 1. Clean hyphenated line breaks (e.g. "sep-\narators" -> "separators")
  let cleaned = input.replace(/(\b\w+)-\r?\n(\w+\b)/g, "$1$2");

  // 2. Remove horizontal rule dividers (e.g. ---, ***, ___)
  cleaned = cleaned.replace(/^[ \t]*[-*_]{3,}[ \t]*$/gm, "");

  // 3. Inspect existing paragraphs if separated by double line breaks
  const rawParagraphs = cleaned.split(/\n\s*\n/).map((p) => {
    return p.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).join(sep);
  }).filter(Boolean);

  if (rawParagraphs.length === 2) {
    return rawParagraphs.join("\n\n");
  }

  if (rawParagraphs.length > 2) {
    const mid = Math.ceil(rawParagraphs.length / 2);
    const p1 = rawParagraphs.slice(0, mid).join(" ");
    const p2 = rawParagraphs.slice(mid).join(" ");
    return `${p1}\n\n${p2}`;
  }

  // 4. Single continuous text block: unwrap single line breaks
  const unwrapped = cleaned.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).join(sep);
  const sentences = splitIntoSentences(unwrapped);

  if (sentences.length >= 2) {
    const splitIndex = Math.ceil(sentences.length / 2);
    const p1 = sentences.slice(0, splitIndex).join(" ");
    const p2 = sentences.slice(splitIndex).join(" ");
    return `${p1}\n\n${p2}`;
  }

  // 5. Fallback for single run-on sentence without terminal punctuation: split near median word
  const words = unwrapped.split(/\s+/);
  if (words.length >= 4) {
    const mid = Math.ceil(words.length / 2);
    return `${words.slice(0, mid).join(" ")}\n\n${words.slice(mid).join(" ")}`;
  }

  return unwrapped;
}

export function removeLineBreaks(
  input: string,
  options: RemoveLineBreaksOptions = {}
): string {
  if (!input) return "";

  const separator = options.separator !== undefined ? options.separator : " ";
  const isTwoParagraphs = options.formatTwoParagraphs || options.preset === "two-paragraphs";
  const collapseParagraphs = options.collapseParagraphs || options.preset === "preserve-paragraphs";

  if (isTwoParagraphs) {
    return formatIntoTwoParagraphs(input, { separator });
  }

  if (collapseParagraphs) {
    // Keep double newlines as paragraph breaks, but join single newlines
    const paragraphs = input.split(/\n\s*\n/);
    const cleanedParagraphs = paragraphs.map((p) => {
      const lines = p.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      return lines.join(separator);
    });
    return cleanedParagraphs.filter(Boolean).join("\n\n");
  }

  // Join all lines with separator, ensuring words do not collide
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return lines.join(separator);
}
```

### 3.2 Changes in `components/tools/TransformTool.tsx`

1. **State Addition** (around line 65):
   ```tsx
   const [lineBreaksPreset, setLineBreaksPreset] = useState<"custom" | "two-paragraphs" | "preserve-paragraphs" | "single-line">("custom");
   ```

2. **Execution Handling** (around line 196):
   ```tsx
   case "remove-line-breaks":
     setOutput(
       removeLineBreaks(currentInput, {
         separator: lineBreaksSep,
         collapseParagraphs: lineBreaksParagraphs,
         formatTwoParagraphs: lineBreaksPreset === "two-paragraphs",
       })
     );
     break;
   ```

3. **Accessible Custom Controls UI** (replacing lines 695–723):
   ```tsx
   case "remove-line-breaks":
     return (
       <div className="space-y-3 w-full text-xs">
         {/* 1-Click Presets Bar */}
         <div className="flex flex-wrap items-center gap-2">
           <span className="text-slate-700 dark:text-slate-300 font-medium">1-Click Presets:</span>
           <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Paragraph cleanup presets">
             <button
               type="button"
               onClick={() => {
                 setLineBreaksPreset("two-paragraphs");
                 setLineBreaksParagraphs(true);
                 setLineBreaksSep(" ");
               }}
               aria-pressed={lineBreaksPreset === "two-paragraphs"}
               aria-label="Clean line separators and format into 2 paragraphs"
               className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                 lineBreaksPreset === "two-paragraphs"
                   ? "bg-brand-600 text-white shadow-2xs"
                   : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
               }`}
             >
               Clean &amp; Format into 2 Paragraphs
             </button>

             <button
               type="button"
               onClick={() => {
                 setLineBreaksPreset("preserve-paragraphs");
                 setLineBreaksParagraphs(true);
                 setLineBreaksSep(" ");
               }}
               aria-pressed={lineBreaksPreset === "preserve-paragraphs"}
               aria-label="Normalize paragraphs with double line breaks"
               className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                 lineBreaksPreset === "preserve-paragraphs"
                   ? "bg-brand-600 text-white shadow-2xs"
                   : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
               }`}
             >
               Normalize Paragraphs (Double Break)
             </button>

             <button
               type="button"
               onClick={() => {
                 setLineBreaksPreset("single-line");
                 setLineBreaksParagraphs(false);
                 setLineBreaksSep(" ");
               }}
               aria-pressed={lineBreaksPreset === "single-line"}
               aria-label="Remove all line breaks into a single continuous line"
               className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                 lineBreaksPreset === "single-line"
                   ? "bg-brand-600 text-white shadow-2xs"
                   : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
               }`}
             >
               Single Continuous Line
             </button>
           </div>
         </div>

         {/* Advanced Separator Options */}
         <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-2">
             <span className="text-slate-700 dark:text-slate-300 font-medium">Separator:</span>
             <select
               aria-label="Replace line breaks with"
               value={lineBreaksSep}
               onChange={(e) => {
                 setLineBreaksSep(e.target.value);
                 setLineBreaksPreset("custom");
               }}
               className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-brand-500 shadow-2xs"
             >
               <option value=" ">Single Space (&quot; &quot;)</option>
               <option value=", ">Comma &amp; Space (&quot;, &quot;)</option>
               <option value="; ">Semicolon &amp; Space (&quot;; &quot;)</option>
               <option value="">Nothing (Join Directly)</option>
             </select>
           </div>

           <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
             <input
               type="checkbox"
               checked={lineBreaksParagraphs}
               onChange={(e) => {
                 setLineBreaksParagraphs(e.target.checked);
                 setLineBreaksPreset("custom");
               }}
               className="rounded-sm border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-800"
             />
             <span>Preserve Double Line Breaks (Paragraphs)</span>
           </label>
         </div>
       </div>
     );
   ```

4. **Update dependencies** in `useCallback` (line 366) and `useMemo` (line 1327) to include `lineBreaksPreset`.

---

## 4. Caveats
1. **Hyphenation Boundary**: Word hyphenation cleanups (`word-\nbreak`) assume English alphabet characters (`\w+`). Non-Latin hyphenated compounds will remain joined with a space.
2. **Ambiguous Abbreviation Punctuation**: Standard sentence splitting uses punctuation (`. ! ?`). In extreme cases where sentences contain abbreviations (e.g. `Dr.` or `e.g.`), splitting operates on sentence-end boundary heuristics (`[.!?]+(\s+|$)`).
3. **No External Server AI Required**: The algorithm executes 100% deterministically in-browser using pure regular expressions, ensuring zero server costs, zero API rate limits, and 100% privacy compliance.

---

## 5. Conclusion
- The requirements for R3 are fully scoped, architecturally isolated, and ready for surgical implementation.
- Extending `lib/tools/removeLineBreaks.ts` with `formatIntoTwoParagraphs` and adding the 1-click preset bar in `components/tools/TransformTool.tsx`:
  1. Satisfies the target conversational query: *"condense a long paragraph into two paragraphs and remove line separators"*.
  2. Preserves 100% in-browser client-side privacy ($0 compute cost).
  3. Adheres to strict WCAG accessibility guidelines (`aria-pressed`, `aria-label`, keyboard focusable).
  4. Maintains 100% backward compatibility for all existing tests and tool usages.

---

## 6. Verification Method

### 6.1 Automated Verification Commands
1. **TypeScript Typecheck**:
   ```bash
   npm run typecheck
   ```
   *Expected*: 0 errors.

2. **Unit Test Suite**:
   ```bash
   npm test
   ```
   *Expected*: Passes all 258+ tests (including new unit tests for `formatIntoTwoParagraphs` and presets).

3. **Production Validation**:
   ```bash
   npm run check:production
   ```
   *Expected*: 184 canonical pages pass with valid schemas, single H1s, and proper SSR rendering.

### 6.2 Proposed Unit Tests for `tests/tools/cleanupTools.test.ts`
```typescript
test("6. Remove Line Breaks - Presets & Two Paragraph Formatting", () => {
  // Test A: Single long run-on block with hard line breaks formatted into 2 paragraphs
  const runOnInput =
    "Line one of first thought.\nLine two of first thought.\n" +
    "Line three of second thought.\nLine four of second thought.";
  const twoParas = removeLineBreaks(runOnInput, { formatTwoParagraphs: true });
  assert.equal(
    twoParas,
    "Line one of first thought. Line two of first thought.\n\nLine three of second thought. Line four of second thought."
  );

  // Test B: Hyphenated line wrap removal
  const hyphenated = "This text has a break-\ning hyphen inside a word.";
  assert.equal(
    removeLineBreaks(hyphenated, { formatTwoParagraphs: true }),
    "This text has a breaking hyphen inside a word."
  );

  // Test C: Existing multi-paragraphs condensed to 2 paragraphs
  const fourParas = "Paragraph 1.\n\nParagraph 2.\n\nParagraph 3.\n\nParagraph 4.";
  const condensed = removeLineBreaks(fourParas, { formatTwoParagraphs: true });
  assert.equal(condensed, "Paragraph 1. Paragraph 2.\n\nParagraph 3. Paragraph 4.");

  // Test D: Backward compatibility
  const normalText = "First line.\nSecond line.";
  assert.equal(removeLineBreaks(normalText, { separator: " " }), "First line. Second line.");
});
```
