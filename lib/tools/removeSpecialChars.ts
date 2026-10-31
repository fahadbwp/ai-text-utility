export type RemoveSpecialCharsMode =
  | "alphanumeric-only"
  | "alphanumeric-no-spaces"
  | "numeric-spaces"
  | "numeric-only"
  | "ascii-only"
  | "keep-punctuation"
  | "custom";

export interface RemoveSpecialCharsOptions {
  mode?: RemoveSpecialCharsMode;
  preserveSpaces?: boolean;
  preserveNewlines?: boolean;
  customAllowedChars?: string;
  collapseSpaces?: boolean;
}

export function removeSpecialChars(
  input: string,
  options: RemoveSpecialCharsOptions = {}
): string {
  if (!input) return "";

  const mode = options.mode || "alphanumeric-only";
  const preserveSpaces = options.preserveSpaces ?? true;
  const preserveNewlines = options.preserveNewlines ?? true;
  const customAllowed = options.customAllowedChars || "";
  const collapseSpaces = options.collapseSpaces ?? true;

  let result: string;

  if (mode === "ascii-only") {
    // Keep ASCII characters only (0-127), strip non-ASCII / Unicode characters
    result = input.replace(/[^\x00-\x7F]/g, "");
  } else {
    let regexPattern: string;

    if (mode === "alphanumeric-only") {
      // Keep Unicode letters (\p{L}), numbers (\p{N}), and optionally spaces / newlines
      let allowed = "\\p{L}\\p{N}";
      if (preserveSpaces) allowed += " ";
      if (preserveNewlines) allowed += "\\r\\n\\t";
      regexPattern = `[^${allowed}]`;
    } else if (mode === "alphanumeric-no-spaces") {
      // Keep letters and numbers only, explicitly strip spaces
      let allowed = "\\p{L}\\p{N}";
      if (preserveNewlines) allowed += "\\r\\n\\t";
      regexPattern = `[^${allowed}]`;
    } else if (mode === "numeric-spaces") {
      // Keep numbers and spaces, strip letters and all symbols
      let allowed = "\\p{N}";
      if (preserveSpaces) allowed += " ";
      if (preserveNewlines) allowed += "\\r\\n\\t";
      regexPattern = `[^${allowed}]`;
    } else if (mode === "numeric-only") {
      // Keep digits/numbers only, strip letters, symbols, and spaces
      let allowed = "\\p{N}";
      if (preserveNewlines) allowed += "\\r\\n\\t";
      regexPattern = `[^${allowed}]`;
    } else if (mode === "keep-punctuation") {
      // Keep letters, numbers, spaces, newlines, and standard punctuation (. , ! ? ' " - : ; ( ))
      let allowed = "\\p{L}\\p{N}.,!?'\"\\-:;()";
      if (preserveSpaces) allowed += " ";
      if (preserveNewlines) allowed += "\\r\\n\\t";
      regexPattern = `[^${allowed}]`;
    } else {
      // Custom allowed chars
      const escapedCustom = customAllowed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let allowed = `\\p{L}\\p{N}${escapedCustom}`;
      if (preserveSpaces) allowed += " ";
      if (preserveNewlines) allowed += "\\r\\n\\t";
      regexPattern = `[^${allowed}]`;
    }

    const regex = new RegExp(regexPattern, "gu");
    result = input.replace(regex, "");
  }

  if (collapseSpaces && preserveSpaces && mode !== "alphanumeric-no-spaces" && mode !== "numeric-only") {
    // Collapse multi-spaces left by stripped characters
    if (preserveNewlines) {
      result = result
        .split(/\r?\n/)
        .map((line) => line.replace(/[ \t]{2,}/g, " ").trim())
        .join("\n");
    } else {
      result = result.replace(/ {2,}/g, " ").trim();
    }
  }

  return result;
}
