/**
 * Local-First PII & Prompt Sanitizer Engine
 * 100% In-Browser Deterministic Anonymizer & Restoration Utility
 */

export type PiiEntityType =
  | "email"
  | "phone"
  | "ip"
  | "creditCard"
  | "apiKey"
  | "ssn"
  | "name";

export type SanitizationMode = "reversible" | "redacted" | "mask";

export interface PiiSanitizerOptions {
  enabledTypes?: Partial<Record<PiiEntityType, boolean>>;
  mode?: SanitizationMode;
  customMask?: string;
}

export interface DetectedEntity {
  type: PiiEntityType;
  original: string;
  token: string;
  startIndex: number;
  endIndex: number;
}

export interface PiiSanitizeResult {
  sanitizedText: string;
  mapping: Record<string, string>; // token -> original
  reverseMapping: Record<string, string>; // original -> token
  detectedEntities: DetectedEntity[];
  counts: Record<PiiEntityType, number>;
  totalCount: number;
}

// Luhn algorithm check for credit cards
function isValidLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let alternate = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits.charAt(i), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n = (n % 10) + 1;
    }
    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

interface RawSpan {
  type: PiiEntityType;
  original: string;
  startIndex: number;
  endIndex: number;
}

export function sanitizePii(
  input: string,
  options: PiiSanitizerOptions = {}
): PiiSanitizeResult {
  if (!input) {
    return {
      sanitizedText: "",
      mapping: {},
      reverseMapping: {},
      detectedEntities: [],
      counts: {
        email: 0,
        phone: 0,
        ip: 0,
        creditCard: 0,
        apiKey: 0,
        ssn: 0,
        name: 0,
      },
      totalCount: 0,
    };
  }

  const {
    enabledTypes = {},
    mode = "reversible",
    customMask = "[REDACTED]",
  } = options;

  const isEnabled = (type: PiiEntityType): boolean =>
    enabledTypes[type] !== false;

  const spans: RawSpan[] = [];

  // 1. Private Keys and High-Entropy Secrets / API Keys
  if (isEnabled("apiKey")) {
    // Private Key Blocks
    const privateKeyRegex =
      /-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]+?-----END [A-Z ]+PRIVATE KEY-----/g;
    let match: RegExpExecArray | null;
    while ((match = privateKeyRegex.exec(input)) !== null) {
      spans.push({
        type: "apiKey",
        original: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }

    // AWS Access Key ID
    const awsRegex = /\bAKIA[0-9A-Z]{16}\b/g;
    while ((match = awsRegex.exec(input)) !== null) {
      spans.push({
        type: "apiKey",
        original: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }

    // GitHub Personal Access Tokens
    const githubRegex = /\bgh[pousr]_[A-Za-z0-9_]{36,255}\b/g;
    while ((match = githubRegex.exec(input)) !== null) {
      spans.push({
        type: "apiKey",
        original: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }

    // Bearer token / JWT
    const bearerRegex =
      /\bBearer\s+([A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.?[A-Za-z0-9\-_.+/=]*)\b/gi;
    while ((match = bearerRegex.exec(input)) !== null) {
      spans.push({
        type: "apiKey",
        original: match[1],
        startIndex: match.index + match[0].indexOf(match[1]),
        endIndex: match.index + match[0].indexOf(match[1]) + match[1].length,
      });
    }

    // Explicit Key/Secret label assignments
    const keyAssignmentRegex =
      /(?:api[_-]?key|secret|private[_-]?key|client[_-]?secret|auth[_-]?token|access[_-]?token)\s*[:=]\s*['"]?([a-zA-Z0-9_\-.~+]{16,})['"]?/gi;
    while ((match = keyAssignmentRegex.exec(input)) !== null) {
      const captured = match[1];
      const start = match.index + match[0].indexOf(captured);
      spans.push({
        type: "apiKey",
        original: captured,
        startIndex: start,
        endIndex: start + captured.length,
      });
    }
  }

  // 2. Email Addresses
  if (isEnabled("email")) {
    const emailRegex =
      /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+/g;
    let match: RegExpExecArray | null;
    while ((match = emailRegex.exec(input)) !== null) {
      spans.push({
        type: "email",
        original: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }

  // 3. Social Security Numbers (US SSN: 000-00-0000)
  if (isEnabled("ssn")) {
    const ssnRegex = /\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b/g;
    let match: RegExpExecArray | null;
    while ((match = ssnRegex.exec(input)) !== null) {
      spans.push({
        type: "ssn",
        original: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }

  // 4. Credit Card Numbers (13-19 digits, optional dashes/spaces, Luhn validated)
  if (isEnabled("creditCard")) {
    const ccRegex =
      /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|(?:[0-9]{4}[-\s]?){3}[0-9]{4})\b/g;
    let match: RegExpExecArray | null;
    while ((match = ccRegex.exec(input)) !== null) {
      const candidate = match[0];
      if (isValidLuhn(candidate)) {
        spans.push({
          type: "creditCard",
          original: candidate,
          startIndex: match.index,
          endIndex: match.index + candidate.length,
        });
      }
    }
  }

  // 5. IP Addresses (IPv4 and IPv6)
  if (isEnabled("ip")) {
    const ipv4Regex =
      /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
    let match: RegExpExecArray | null;
    while ((match = ipv4Regex.exec(input)) !== null) {
      spans.push({
        type: "ip",
        original: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }

    const ipv6Regex =
      /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b|\bfe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}\b|\b::1\b/g;
    while ((match = ipv6Regex.exec(input)) !== null) {
      spans.push({
        type: "ip",
        original: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }

  // 6. Phone Numbers (Domestic / International)
  if (isEnabled("phone")) {
    const phoneRegex =
      /(?:\+?\d{1,3}[\s.-]+)?(?:\(?\d{2,5}\)?[\s.-]*)?\d{3,4}[\s.-]*\d{3,4}(?:[\s.-]*\d{1,4})?/g;
    let match: RegExpExecArray | null;
    while ((match = phoneRegex.exec(input)) !== null) {
      const raw = match[0].trim();
      const digits = raw.replace(/\D/g, "");
      // Exclude simple 4-digit years or short numbers
      if (digits.length >= 7 && digits.length <= 15) {
        spans.push({
          type: "phone",
          original: raw,
          startIndex: match.index,
          endIndex: match.index + raw.length,
        });
      }
    }
  }

  // 7. Personal Names (Preceded by Salutations or Labels)
  if (isEnabled("name")) {
    // Salutations: Mr., Mrs., Ms., Dr., Prof.
    const titleRegex =
      /\b(?:Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;
    let match: RegExpExecArray | null;
    while ((match = titleRegex.exec(input)) !== null) {
      const name = match[1];
      const start = match.index + match[0].indexOf(name);
      spans.push({
        type: "name",
        original: name,
        startIndex: start,
        endIndex: start + name.length,
      });
    }

    // Labeled names (Name: John Doe, Patient: Jane Smith, etc.)
    const labelRegex =
      /\b(?:Name|Patient|Customer|Employee|Client|Doctor|Author)\s*:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b/g;
    while ((match = labelRegex.exec(input)) !== null) {
      const name = match[1];
      const start = match.index + match[0].indexOf(name);
      spans.push({
        type: "name",
        original: name,
        startIndex: start,
        endIndex: start + name.length,
      });
    }
  }

  // Sort spans by start index, longer spans first on collision
  spans.sort((a, b) => {
    if (a.startIndex !== b.startIndex) {
      return a.startIndex - b.startIndex;
    }
    return b.endIndex - a.endIndex;
  });

  // Filter overlapping spans: higher priority / longer span wins
  const nonOverlapping: RawSpan[] = [];
  let lastEnd = -1;

  for (const span of spans) {
    if (span.startIndex >= lastEnd) {
      nonOverlapping.push(span);
      lastEnd = span.endIndex;
    }
  }

  // Build tokens, mappings and counts
  const typeCounter: Record<PiiEntityType, number> = {
    email: 0,
    phone: 0,
    ip: 0,
    creditCard: 0,
    apiKey: 0,
    ssn: 0,
    name: 0,
  };

  const originalToToken = new Map<string, string>();
  const tokenToOriginal: Record<string, string> = {};
  const detectedEntities: DetectedEntity[] = [];

  const typePrefixMap: Record<PiiEntityType, string> = {
    email: "EMAIL",
    phone: "PHONE",
    ip: "IP_ADDRESS",
    creditCard: "CREDIT_CARD",
    apiKey: "API_KEY",
    ssn: "SSN",
    name: "NAME",
  };

  // Assign tokens consistently: identical original strings get the same token
  for (const span of nonOverlapping) {
    let token = originalToToken.get(span.original);
    if (!token) {
      if (mode === "reversible") {
        typeCounter[span.type]++;
        token = `[${typePrefixMap[span.type]}_${typeCounter[span.type]}]`;
      } else if (mode === "redacted") {
        token = customMask;
      } else {
        // mask mode (asterisks)
        token = "*".repeat(Math.min(span.original.length, 12));
      }
      originalToToken.set(span.original, token);
      if (mode === "reversible") {
        tokenToOriginal[token] = span.original;
      }
    }

    detectedEntities.push({
      type: span.type,
      original: span.original,
      token,
      startIndex: span.startIndex,
      endIndex: span.endIndex,
    });
  }

  // Reconstruct sanitized text from nonOverlapping spans
  let sanitizedText = "";
  let currentIndex = 0;

  for (const entity of detectedEntities) {
    sanitizedText += input.slice(currentIndex, entity.startIndex);
    sanitizedText += entity.token;
    currentIndex = entity.endIndex;
  }
  sanitizedText += input.slice(currentIndex);

  const reverseMapping: Record<string, string> = {};
  for (const [orig, tok] of originalToToken.entries()) {
    reverseMapping[orig] = tok;
  }

  const counts: Record<PiiEntityType, number> = {
    email: 0,
    phone: 0,
    ip: 0,
    creditCard: 0,
    apiKey: 0,
    ssn: 0,
    name: 0,
  };

  for (const entity of detectedEntities) {
    counts[entity.type]++;
  }

  return {
    sanitizedText,
    mapping: tokenToOriginal,
    reverseMapping,
    detectedEntities,
    counts,
    totalCount: detectedEntities.length,
  };
}

/**
 * Restores original sensitive data into AI response or sanitized text
 * Uses reverse mapping dictionary [TOKEN_N] -> original string
 */
export function restorePii(
  text: string,
  mapping: Record<string, string>
): string {
  if (!text || !mapping || Object.keys(mapping).length === 0) {
    return text || "";
  }

  // Sort tokens by descending length to prevent sub-string replacement collisions
  const tokens = Object.keys(mapping).sort((a, b) => b.length - a.length);

  let restored = text;
  for (const token of tokens) {
    const original = mapping[token];
    if (typeof original === "string") {
      // Global literal replacement without regex metacharacter issues
      restored = restored.split(token).join(original);
    }
  }

  return restored;
}
