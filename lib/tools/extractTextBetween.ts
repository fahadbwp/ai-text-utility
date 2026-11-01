/**
 * Extract Text Between Pure Logic
 * Extracts substrings enclosed between start and end delimiters (quotes, brackets, tags, etc.)
 */

export interface ExtractTextBetweenOptions {
  startDelimiter?: string;
  endDelimiter?: string;
  includeDelimiters?: boolean;
  deduplicate?: boolean;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractTextBetween(
  input: string,
  options: ExtractTextBetweenOptions = {}
): string {
  if (!input) return "";

  const {
    startDelimiter = '"',
    endDelimiter = '"',
    includeDelimiters = false,
    deduplicate = false,
  } = options;

  if (!startDelimiter && !endDelimiter) return input;

  const escapedStart = escapeRegExp(startDelimiter || "");
  const escapedEnd = escapeRegExp(endDelimiter || "");

  let pattern: RegExp;
  if (startDelimiter && endDelimiter) {
    pattern = new RegExp(`${escapedStart}([\\s\\S]*?)${escapedEnd}`, "g");
  } else if (startDelimiter) {
    pattern = new RegExp(`${escapedStart}([^\\r\\n]+)`, "g");
  } else {
    pattern = new RegExp(`([^\\r\\n]+)${escapedEnd}`, "g");
  }

  const matches: string[] = [];
  const seen = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(input)) !== null) {
    const extracted = includeDelimiters ? match[0] : (match[1] ?? match[0]);
    if (deduplicate) {
      if (!seen.has(extracted)) {
        seen.add(extracted);
        matches.push(extracted);
      }
    } else {
      matches.push(extracted);
    }
  }

  return matches.join("\n");
}
