/**
 * Remove Lines Containing Pure Logic
 * Removes or retains lines containing target text, words, or regex patterns.
 */

export interface RemoveLinesContainingOptions {
  query?: string;
  mode?: "remove" | "keep";
  caseSensitive?: boolean;
  useRegex?: boolean;
  trimLines?: boolean;
  removeEmptyLines?: boolean;
}

export interface RemoveLinesContainingResult {
  result: string;
  removedCount: number;
  remainingCount: number;
  error?: string;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function removeLinesContaining(
  input: string,
  options: RemoveLinesContainingOptions = {}
): RemoveLinesContainingResult {
  if (!input) {
    return { result: "", removedCount: 0, remainingCount: 0 };
  }

  const {
    query = "",
    mode = "remove",
    caseSensitive = false,
    useRegex = false,
    trimLines = false,
    removeEmptyLines = false,
  } = options;

  if (!query) {
    const lines = input.split(/\r?\n/);
    const filtered = removeEmptyLines
      ? lines.filter((l) => (trimLines ? l.trim() : l).length > 0)
      : lines;
    return {
      result: filtered.join("\n"),
      removedCount: 0,
      remainingCount: filtered.length,
    };
  }

  let pattern: RegExp;
  try {
    const flags = caseSensitive ? "" : "i";
    if (useRegex) {
      pattern = new RegExp(query, flags);
    } else {
      pattern = new RegExp(escapeRegExp(query), flags);
    }
  } catch (err) {
    return {
      result: input,
      removedCount: 0,
      remainingCount: input.split(/\r?\n/).length,
      error: `Invalid Regular Expression: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  const lines = input.split(/\r?\n/);
  const remaining: string[] = [];
  let removedCount = 0;

  for (const rawLine of lines) {
    const checkLine = trimLines ? rawLine.trim() : rawLine;

    if (removeEmptyLines && checkLine.length === 0) {
      removedCount++;
      continue;
    }

    const matches = pattern.test(checkLine);
    const shouldKeep = mode === "keep" ? matches : !matches;

    if (shouldKeep) {
      remaining.push(rawLine);
    } else {
      removedCount++;
    }
  }

  return {
    result: remaining.join("\n"),
    removedCount,
    remainingCount: remaining.length,
  };
}
