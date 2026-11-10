import test from "node:test";
import assert from "node:assert/strict";

import { removeDuplicateLines } from "../../lib/tools/removeDuplicateLines.ts";
import { removeEmptyLines } from "../../lib/tools/removeEmptyLines.ts";
import { trimLines } from "../../lib/tools/trimLines.ts";
import { removeExtraSpaces } from "../../lib/tools/removeExtraSpaces.ts";
import { stripHtmlTags } from "../../lib/tools/stripHtmlTags.ts";
import { removeLineBreaks, formatIntoTwoParagraphs } from "../../lib/tools/removeLineBreaks.ts";
import { removeSpecialChars } from "../../lib/tools/removeSpecialChars.ts";

test("1. Remove Duplicate Lines", () => {
  assert.equal(removeDuplicateLines(""), "");
  assert.equal(removeDuplicateLines("   \n   "), "   ");

  // Preserves first occurrence, ordering, and CRLF
  const crlfInput = "apple\r\nbanana\r\napple\r\ncherry\r\nbanana";
  assert.equal(
    removeDuplicateLines(crlfInput),
    "apple\nbanana\ncherry"
  );

  // Case-insensitive deduplication
  const caseInput = "Apple\napple\nAPPLE\nBanana";
  assert.equal(
    removeDuplicateLines(caseInput, { caseSensitive: false }),
    "Apple\nBanana"
  );

  // Unicode support
  const unicodeInput = "café\ncrème\ncafé\nnaïve\ncrème";
  assert.equal(
    removeDuplicateLines(unicodeInput),
    "café\ncrème\nnaïve"
  );
});

test("2. Remove Empty Lines", () => {
  assert.equal(removeEmptyLines(""), "");
  assert.equal(removeEmptyLines("   \n\t\n  "), "");

  // Remove all
  const sample = "line 1\r\n\r\nline 2\n\n\nline 3\r\n";
  assert.equal(
    removeEmptyLines(sample, { mode: "remove-all" }),
    "line 1\nline 2\nline 3"
  );

  // Preserve paragraph structure
  const paragraphs = "P1 line 1\nP1 line 2\n\n\n\nP2 line 1\n\n\nP3 line 1";
  assert.equal(
    removeEmptyLines(paragraphs, { mode: "preserve-paragraphs" }),
    "P1 line 1\nP1 line 2\n\nP2 line 1\n\nP3 line 1"
  );
});

test("3. Trim Lines", () => {
  assert.equal(trimLines(""), "");

  // Leading, trailing, both with mixed CRLF/LF
  const input = "  line 1   \r\n\t\tline 2\t\t\n   line 3   ";
  assert.equal(
    trimLines(input, { mode: "both" }),
    "line 1\nline 2\nline 3"
  );
  assert.equal(
    trimLines("  hello   ", { mode: "leading" }),
    "hello   "
  );
  assert.equal(
    trimLines("  hello   ", { mode: "trailing" }),
    "  hello"
  );
});

test("4. Remove Extra Spaces", () => {
  assert.equal(removeExtraSpaces(""), "");

  // Preserves tabs and newlines in spaces-only mode
  const code = "\tconst  x   =    10;\n\tconst  y   =    20;";
  const cleaned = removeExtraSpaces(code, { collapseType: "spaces-only" });
  assert.equal(cleaned, "\tconst x = 10;\n\tconst y = 20;");

  // All whitespace collapsed
  const blob = "Text   with \t tabs \n\n and   newlines.";
  assert.equal(
    removeExtraSpaces(blob, { collapseType: "all-whitespace" }),
    "Text with tabs and newlines."
  );
});

test("5. Strip HTML Tags", () => {
  assert.equal(stripHtmlTags(""), "");

  // Strips script/style, decodes entities, avoids word concatenation
  const html = `
    <html>
      <head><style>body { color: red; }</style></head>
      <body>
        <script>const x = 1;</script>
        <h1>Welcome to &ldquo;AI Text Utility&rdquo;!</h1>
        <p>First paragraph &amp; info.</p>
        <p>Second paragraph with <a href="https://example.com">a link</a> &copy; 2026.</p>
      </body>
    </html>
  `;
  const plain = stripHtmlTags(html, { preserveLineBreaks: true });

  assert.ok(!plain.includes("script"));
  assert.ok(!plain.includes("style"));
  assert.ok(plain.includes("Welcome to “AI Text Utility”!"));
  assert.ok(plain.includes("First paragraph & info."));
  assert.ok(plain.includes("Second paragraph with a link © 2026."));

  // Malformed markup
  const malformed = "<div class='test'<p>Unclosed tag and text</p>";
  assert.ok(stripHtmlTags(malformed).includes("Unclosed tag and text"));
});

test("6. Remove Line Breaks", () => {
  assert.equal(removeLineBreaks(""), "");

  // Avoids accidental word concatenation with CRLF/LF
  const text = "First line.\r\nSecond line.\nThird line.";
  assert.equal(
    removeLineBreaks(text, { separator: " " }),
    "First line. Second line. Third line."
  );
  assert.equal(
    removeLineBreaks(text, { separator: ", " }),
    "First line., Second line., Third line."
  );

  // Collapse paragraph preservation
  const multiline = "P1 L1\nP1 L2\n\nP2 L1\nP2 L2";
  assert.equal(
    removeLineBreaks(multiline, { collapseParagraphs: true, separator: " " }),
    "P1 L1 P1 L2\n\nP2 L1 P2 L2"
  );

  // Preset: single-line
  assert.equal(
    removeLineBreaks(multiline, { preset: "single-line", separator: " " }),
    "P1 L1 P1 L2 P2 L1 P2 L2"
  );

  // Preset: preserve-paragraphs
  assert.equal(
    removeLineBreaks(multiline, { preset: "preserve-paragraphs", separator: " " }),
    "P1 L1 P1 L2\n\nP2 L1 P2 L2"
  );

  // Preset: two-paragraphs
  const fourSentences =
    "Sentence one is here.\nSentence two is here.\nSentence three is here.\nSentence four is here.";
  const twoParasPreset = removeLineBreaks(fourSentences, { preset: "two-paragraphs" });
  assert.equal(
    twoParasPreset,
    "Sentence one is here. Sentence two is here.\n\nSentence three is here. Sentence four is here."
  );

  // formatTwoParagraphs boolean flag
  const twoParasFlag = removeLineBreaks(fourSentences, { formatTwoParagraphs: true });
  assert.equal(twoParasFlag, twoParasPreset);
});

test("6b. Format Into Two Paragraphs Helper", () => {
  // Empty, null, whitespace handling
  assert.equal(formatIntoTwoParagraphs(""), "");
  assert.equal(formatIntoTwoParagraphs("   "), "");
  assert.equal(formatIntoTwoParagraphs("\n\n\t\n"), "");
  assert.equal(formatIntoTwoParagraphs(null as any), "");
  assert.equal(formatIntoTwoParagraphs(undefined as any), "");

  // Multi-sentence single block split into 2 balanced paragraphs
  const input =
    "Line one of first thought.\nLine two of first thought.\n" +
    "Line three of second thought.\nLine four of second thought.";
  assert.equal(
    formatIntoTwoParagraphs(input),
    "Line one of first thought. Line two of first thought.\n\nLine three of second thought. Line four of second thought."
  );

  // Odd number of sentences (5 sentences -> 3 and 2)
  const oddSentences = "Sentence 1.\nSentence 2.\nSentence 3.\nSentence 4.\nSentence 5.";
  assert.equal(
    formatIntoTwoParagraphs(oddSentences),
    "Sentence 1. Sentence 2. Sentence 3.\n\nSentence 4. Sentence 5."
  );

  // Hyphenated line wrap removal
  const hyphenated = "This text has a break-\ning hyphen inside a word.";
  assert.equal(
    formatIntoTwoParagraphs(hyphenated),
    "This text has a breaking hyphen inside a word."
  );

  // Horizontal rule dividers (---, ***, ___)
  const dividers = "Header block of text.\nMore header context.\n---\nFooter block of text.\n***\nFinal thoughts.";
  const strippedDividers = formatIntoTwoParagraphs(dividers);
  assert.ok(!strippedDividers.includes("---"));
  assert.ok(!strippedDividers.includes("***"));
  assert.equal(strippedDividers.split(/\n\s*\n/).length, 2);

  // Multi-paragraph condensation (>2 paragraphs condensed into 2)
  const fourParas = "Paragraph 1.\n\nParagraph 2.\n\nParagraph 3.\n\nParagraph 4.";
  assert.equal(
    formatIntoTwoParagraphs(fourParas),
    "Paragraph 1. Paragraph 2.\n\nParagraph 3. Paragraph 4."
  );

  // Idempotency: text already in 2 paragraphs remains unchanged
  const alreadyTwo = "First paragraph content.\n\nSecond paragraph content.";
  assert.equal(formatIntoTwoParagraphs(alreadyTwo), alreadyTwo);
  assert.equal(formatIntoTwoParagraphs(formatIntoTwoParagraphs(alreadyTwo)), alreadyTwo);

  // Single run-on sentence without punctuation: cleanly splits at median word boundary
  const runOn = "This is a single continuous run on sentence without any ending period that should be divided into two halves";
  const runOnResult = formatIntoTwoParagraphs(runOn);
  const runOnParas = runOnResult.split(/\n\s*\n/);
  assert.equal(runOnParas.length, 2);
  assert.ok(runOnParas[0].length > 0 && runOnParas[1].length > 0);
});

test("7. Remove Special Characters", () => {
  assert.equal(removeSpecialChars(""), "");

  // Unicode letters and numbers preserved
  const text = "Hello, World! @#$% 123 +-= Café & Résumé 100%!";
  const alphanumeric = removeSpecialChars(text, { mode: "alphanumeric-only" });
  assert.equal(alphanumeric, "Hello World 123 Café Résumé 100");

  // Keep punctuation
  const withPunctuation = removeSpecialChars(text, { mode: "keep-punctuation" });
  assert.equal(withPunctuation, "Hello, World! 123 - Café Résumé 100!");

  // Custom allowed
  const custom = removeSpecialChars("user@domain.com #test!", {
    mode: "custom",
    customAllowedChars: "@.",
  });
  assert.equal(custom, "user@domain.com test");
});
