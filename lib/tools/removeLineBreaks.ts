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
  const sentences = text
    .split(/(?<=[.!?]["')\]]?)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.length > 0 ? sentences : [text];
}

/**
 * Formats text into exactly two cohesive paragraphs.
 * - Cleans hyphenated line breaks (word-\nbreak -> wordbreak).
 * - Cleans horizontal rule dividers (---, ***, ___).
 * - If input has >2 paragraphs, balances them into 2 paragraphs.
 * - If single continuous text block, unwraps line breaks, splits sentences,
 *   and distributes sentences evenly into Paragraph 1 and Paragraph 2 separated by \n\n.
 * - Fallback for single run-on sentence without punctuation: cleanly splits at median word boundary.
 */
export function formatIntoTwoParagraphs(
  input: string,
  options: { separator?: string } = {}
): string {
  if (!input || !input.trim()) return "";
  const sep = options.separator !== undefined ? options.separator : " ";

  // 1. Normalize line endings to LF
  let cleaned = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // 2. Clean hyphenated line breaks (e.g. "prac-\ntice" -> "practice")
  cleaned = cleaned.replace(/(\p{L}+)-[ \t]*\r?\n[ \t]*(\p{L}+)/gu, "$1$2");

  // 3. Remove horizontal rule dividers (e.g. ---, ***, ___)
  cleaned = cleaned.replace(/^[ \t]*[-*_](?:[ \t]*[-*_]){2,}[ \t]*$/gm, "");

  // 4. Inspect existing paragraphs if separated by double line breaks
  const rawParagraphs = cleaned
    .split(/\n\s*\n+/)
    .map((p) => {
      return p
        .split(/\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .join(sep);
    })
    .filter((p) => p.trim().length > 0);

  if (rawParagraphs.length === 2) {
    return rawParagraphs.join("\n\n");
  }

  if (rawParagraphs.length > 2) {
    const mid = Math.ceil(rawParagraphs.length / 2);
    const p1 = rawParagraphs.slice(0, mid).join(" ");
    const p2 = rawParagraphs.slice(mid).join(" ");
    return `${p1}\n\n${p2}`;
  }

  // 5. Single continuous text block (rawParagraphs.length === 1 or 0)
  if (rawParagraphs.length === 0) return "";

  const unwrapped = rawParagraphs[0];
  const sentences = splitIntoSentences(unwrapped);

  if (sentences.length >= 2) {
    const splitIndex = Math.ceil(sentences.length / 2);
    const p1 = sentences.slice(0, splitIndex).join(" ");
    const p2 = sentences.slice(splitIndex).join(" ");
    return `${p1}\n\n${p2}`;
  }

  // 6. Fallback for single run-on sentence without terminal punctuation: split near median word
  const isPunctuationTerminated = /[.!?]$/.test(unwrapped.trim());
  if (!isPunctuationTerminated) {
    const words = unwrapped.split(/\s+/).filter(Boolean);
    if (words.length >= 4) {
      const mid = Math.ceil(words.length / 2);
      return `${words.slice(0, mid).join(" ")}\n\n${words.slice(mid).join(" ")}`;
    }
  }

  return unwrapped;
}

export function removeLineBreaks(
  input: string,
  options: RemoveLineBreaksOptions = {}
): string {
  if (!input) return "";

  const separator = options.separator !== undefined ? options.separator : " ";
  const isTwoParagraphs =
    Boolean(options.formatTwoParagraphs) || options.preset === "two-paragraphs";
  const collapseParagraphs =
    Boolean(options.collapseParagraphs) || options.preset === "preserve-paragraphs";

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

