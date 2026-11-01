/**
 * Extract Phone Numbers Pure Logic
 * Extracts international, standard national, and formatted telephone numbers.
 */

export interface ExtractPhoneNumbersOptions {
  deduplicate?: boolean;
  format?: "clean" | "digits-only" | "raw";
  minDigits?: number;
}

export interface ExtractPhoneNumbersResult {
  numbers: string[];
  count: number;
}

// Regex to capture international and domestic telephone patterns
// Matches e.g. +1 (555) 123-4567, +44 20 7946 0912, 0300-1234567, 555-123-4567, 1-800-555-0199
const PHONE_PATTERN =
  /(?:\+?\d{1,3}[\s.-]+)?(?:\(?\d{2,5}\)?[\s.-]*)?\d{3,4}[\s.-]*\d{3,4}(?:[\s.-]*\d{1,4})?/g;

export function extractPhoneNumbers(
  input: string,
  options: ExtractPhoneNumbersOptions = {}
): string {
  if (!input) return "";

  const {
    deduplicate = true,
    format = "clean",
    minDigits = 7,
  } = options;

  const matches = input.match(PHONE_PATTERN) || [];
  const extracted: string[] = [];
  const seen = new Set<string>();

  for (const rawMatch of matches) {
    const trimmed = rawMatch.trim();
    // Count actual digit count to avoid false positive short numeric codes/years
    const digitsOnly = trimmed.replace(/\D/g, "");

    if (digitsOnly.length < minDigits || digitsOnly.length > 15) {
      continue;
    }

    let formatted = trimmed;

    if (format === "digits-only") {
      formatted = trimmed.startsWith("+") ? `+${digitsOnly}` : digitsOnly;
    } else if (format === "clean") {
      // Strip trailing sentence punctuation, trim brackets and collapse excess whitespace
      formatted = trimmed
        .replace(/[.,;:)\]'">]+$/, "")
        .replace(/^[<('"]+/, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    const dedupeKey = digitsOnly;
    if (deduplicate) {
      if (!seen.has(dedupeKey)) {
        seen.add(dedupeKey);
        extracted.push(formatted);
      }
    } else {
      extracted.push(formatted);
    }
  }

  return extracted.join("\n");
}
