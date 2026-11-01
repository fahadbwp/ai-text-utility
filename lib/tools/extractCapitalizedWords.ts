/**
 * Extract Capitalized Words Pure Logic
 * Extracts words starting with uppercase, all-caps acronyms, or consecutive capitalized proper nouns.
 */

export type CapitalizedExtractionMode = "all-capitalized" | "uppercase-only" | "consecutive";

export interface ExtractCapitalizedWordsOptions {
  mode?: CapitalizedExtractionMode;
  deduplicate?: boolean;
  minWordLength?: number;
}

export function extractCapitalizedWords(
  input: string,
  options: ExtractCapitalizedWordsOptions = {}
): string {
  if (!input) return "";

  const {
    mode = "all-capitalized",
    deduplicate = false,
    minWordLength = 2,
  } = options;

  let matches: string[] = [];

  if (mode === "uppercase-only") {
    // Matches words in full UPPERCASE letters only (e.g., NASA, FBI, HTML, API)
    const regex = /\b[A-Z]{2,}\b/g;
    const rawMatches = input.match(regex) || [];
    matches = rawMatches.filter((w) => w.length >= minWordLength);
  } else if (mode === "consecutive") {
    // Matches consecutive capitalized words (e.g. "The New York Times", "Alice Johnson", "Google DeepMind")
    const regex = /\b[A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)+\b/g;
    const rawMatches = input.match(regex) || [];
    matches = rawMatches;
  } else {
    // "all-capitalized": words starting with an uppercase letter
    const regex = /\b[A-Z][a-zA-Z0-9_-]*\b/g;
    const rawMatches = input.match(regex) || [];
    matches = rawMatches.filter((w) => w.length >= minWordLength);
  }

  if (deduplicate) {
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const w of matches) {
      if (!seen.has(w)) {
        seen.add(w);
        unique.push(w);
      }
    }
    matches = unique;
  }

  return matches.join("\n");
}
