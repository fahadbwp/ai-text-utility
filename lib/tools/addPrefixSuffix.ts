/**
 * Add Prefix and Suffix to Lines Pure Logic
 * Prepends and appends custom text, quotes, or tags to each line.
 */

export interface AddPrefixSuffixOptions {
  prefix?: string;
  suffix?: string;
  skipEmptyLines?: boolean;
  trimOriginalLines?: boolean;
}

export function addPrefixSuffix(
  input: string,
  options: AddPrefixSuffixOptions = {}
): string {
  if (!input) return "";

  const {
    prefix = "",
    suffix = "",
    skipEmptyLines = true,
    trimOriginalLines = false,
  } = options;

  const lines = input.split(/\r?\n/);
  const result: string[] = [];

  for (const rawLine of lines) {
    const line = trimOriginalLines ? rawLine.trim() : rawLine;

    if (skipEmptyLines && line.trim().length === 0) {
      result.push("");
      continue;
    }

    result.push(`${prefix}${line}${suffix}`);
  }

  return result.join("\n");
}
