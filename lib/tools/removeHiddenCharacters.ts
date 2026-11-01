/**
 * Remove Hidden Characters Logic
 * Purges zero-width spaces, invisible characters, soft hyphens, BOMs, and directional markers.
 */

export interface RemoveHiddenCharactersOptions {
  stripZeroWidth?: boolean;
  normalizeNonBreakingSpaces?: boolean;
  stripDirectionalMarkers?: boolean;
  stripControlCharacters?: boolean;
}

export interface HiddenCharacterBreakdown {
  zeroWidthSpaces: number;
  zeroWidthNoBreak: number;
  zeroWidthJoiners: number;
  softHyphens: number;
  directionalMarkers: number;
  nonBreakingSpaces: number;
  otherInvisible: number;
  total: number;
}

// Common invisible and zero-width Unicode code points
export const ZERO_WIDTH_REGEX = /[\u200B\u200C\u200D\u2060\u180E]/g;
export const BOM_REGEX = /\uFEFF/g;
export const SOFT_HYPHEN_REGEX = /\u00AD/g;
export const DIRECTIONAL_REGEX = /[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;
export const NBSP_REGEX = /[\u00A0\u202F]/g;
export const OTHER_INVISIBLE_REGEX = /[\u2000-\u200A\u205F]/g;

export function detectHiddenCharacters(input: string): HiddenCharacterBreakdown {
  if (!input) {
    return {
      zeroWidthSpaces: 0,
      zeroWidthNoBreak: 0,
      zeroWidthJoiners: 0,
      softHyphens: 0,
      directionalMarkers: 0,
      nonBreakingSpaces: 0,
      otherInvisible: 0,
      total: 0,
    };
  }

  const zwMatches = input.match(/[\u200B\u2060\u180E]/g) || [];
  const bomMatches = input.match(/\uFEFF/g) || [];
  const joinerMatches = input.match(/[\u200C\u200D]/g) || [];
  const shMatches = input.match(/\u00AD/g) || [];
  const dirMatches = input.match(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g) || [];
  const nbspMatches = input.match(/[\u00A0\u202F]/g) || [];
  const otherMatches = input.match(/[\u2000-\u200A\u205F]/g) || [];

  const total =
    zwMatches.length +
    bomMatches.length +
    joinerMatches.length +
    shMatches.length +
    dirMatches.length +
    nbspMatches.length +
    otherMatches.length;

  return {
    zeroWidthSpaces: zwMatches.length,
    zeroWidthNoBreak: bomMatches.length,
    zeroWidthJoiners: joinerMatches.length,
    softHyphens: shMatches.length,
    directionalMarkers: dirMatches.length,
    nonBreakingSpaces: nbspMatches.length,
    otherInvisible: otherMatches.length,
    total,
  };
}

export function removeHiddenCharacters(
  input: string,
  options: RemoveHiddenCharactersOptions = {}
): string {
  if (!input) return "";

  const {
    stripZeroWidth = true,
    normalizeNonBreakingSpaces = true,
    stripDirectionalMarkers = true,
    stripControlCharacters = false,
  } = options;

  let cleaned = input;

  if (stripZeroWidth) {
    cleaned = cleaned.replace(/[\u200B\u200C\u200D\u2060\u180E\uFEFF\u00AD]/g, "");
  }

  if (stripDirectionalMarkers) {
    cleaned = cleaned.replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "");
  }

  if (normalizeNonBreakingSpaces) {
    cleaned = cleaned.replace(/[\u00A0\u202F\u2000-\u200A\u205F]/g, " ");
  }

  if (stripControlCharacters) {
    cleaned = cleaned.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "");
  }

  return cleaned;
}
