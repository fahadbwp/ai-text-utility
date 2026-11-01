/**
 * Find and Replace Pure Logic
 * Supports match case, whole word matching, regex patterns, and occurrence counts.
 */

export interface FindAndReplaceOptions {
  find: string;
  replace: string;
  matchCase?: boolean;
  matchWholeWord?: boolean;
  useRegex?: boolean;
}

export interface FindAndReplaceResult {
  result: string;
  count: number;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function findAndReplace(
  input: string,
  options: FindAndReplaceOptions
): FindAndReplaceResult {
  if (!input) {
    return { result: "", count: 0 };
  }

  const {
    find,
    replace = "",
    matchCase = false,
    matchWholeWord = false,
    useRegex = false,
  } = options;

  if (!find) {
    return { result: input, count: 0 };
  }

  let regex: RegExp;
  const flags = matchCase ? "g" : "gi";

  try {
    if (useRegex) {
      regex = new RegExp(find, flags);
    } else {
      let pattern = escapeRegExp(find);
      if (matchWholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
      regex = new RegExp(pattern, flags);
    }
  } catch {
    // If regex is invalid, return original input safely without crashing
    return { result: input, count: 0 };
  }

  const matches = input.match(regex);
  const count = matches ? matches.length : 0;

  if (count === 0) {
    return { result: input, count: 0 };
  }

  const result = input.replace(regex, replace);

  return { result, count };
}
