import { ToolCategory } from "@/data/toolsRegistry";

export interface ColorTheme {
  emoji: string;
  accent: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  hoverBorder: string;
  hoverShadow: string;
  arrowColor: string;
  // Backward compatibility fields
  bg: string;
  text: string;
  border: string;
}

// 8 Core Brand Accent Palettes
export const PALETTE = {
  blue: {
    accent: "#1685FF",
    iconBg: "bg-[#1685FF]",
    iconColor: "text-white",
    badgeBg: "bg-[#1685FF]/10",
    badgeText: "text-[#1685FF]",
    badgeBorder: "border-[#1685FF]/20",
    hoverBorder: "hover:border-[#1685FF]/40",
    hoverShadow: "hover:shadow-[0_12px_28px_rgba(22,133,255,0.12)]",
    arrowColor: "text-[#1685FF]",
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    text: "text-[#1685FF]",
    border: "border-blue-200 dark:border-blue-900/40",
  },
  sky: {
    accent: "#49B9FF",
    iconBg: "bg-[#49B9FF]",
    iconColor: "text-white",
    badgeBg: "bg-[#49B9FF]/12",
    badgeText: "text-[#0284C7]",
    badgeBorder: "border-[#49B9FF]/25",
    hoverBorder: "hover:border-[#49B9FF]/45",
    hoverShadow: "hover:shadow-[0_12px_28px_rgba(73,185,255,0.12)]",
    arrowColor: "text-[#0284C7]",
    bg: "bg-sky-500/10 dark:bg-sky-500/15",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-200 dark:border-sky-900/40",
  },
  coral: {
    accent: "#FF6B70",
    iconBg: "bg-[#FF6B70]",
    iconColor: "text-white",
    badgeBg: "bg-[#FF6B70]/10",
    badgeText: "text-[#FF6B70]",
    badgeBorder: "border-[#FF6B70]/20",
    hoverBorder: "hover:border-[#FF6B70]/40",
    hoverShadow: "hover:shadow-[0_12px_28px_rgba(255,107,112,0.12)]",
    arrowColor: "text-[#FF6B70]",
    bg: "bg-rose-500/10 dark:bg-rose-500/15",
    text: "text-[#FF6B70]",
    border: "border-rose-200 dark:border-rose-900/40",
  },
  mint: {
    accent: "#39CFA5",
    iconBg: "bg-[#39CFA5]",
    iconColor: "text-white",
    badgeBg: "bg-[#39CFA5]/12",
    badgeText: "text-[#059669]",
    badgeBorder: "border-[#39CFA5]/25",
    hoverBorder: "hover:border-[#39CFA5]/45",
    hoverShadow: "hover:shadow-[0_12px_28px_rgba(57,207,165,0.12)]",
    arrowColor: "text-[#059669]",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900/40",
  },
  teal: {
    accent: "#13B8B8",
    iconBg: "bg-[#13B8B8]",
    iconColor: "text-white",
    badgeBg: "bg-[#13B8B8]/10",
    badgeText: "text-[#0E9494]",
    badgeBorder: "border-[#13B8B8]/20",
    hoverBorder: "hover:border-[#13B8B8]/40",
    hoverShadow: "hover:shadow-[0_12px_28px_rgba(19,184,184,0.12)]",
    arrowColor: "text-[#0E9494]",
    bg: "bg-teal-500/10 dark:bg-teal-500/15",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-200 dark:border-teal-900/40",
  },
  amber: {
    accent: "#FFB547",
    iconBg: "bg-[#FFB547]",
    iconColor: "text-white",
    badgeBg: "bg-[#FFB547]/12",
    badgeText: "text-[#D98200]",
    badgeBorder: "border-[#FFB547]/25",
    hoverBorder: "hover:border-[#FFB547]/45",
    hoverShadow: "hover:shadow-[0_12px_28px_rgba(255,181,71,0.12)]",
    arrowColor: "text-[#D98200]",
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-900/40",
  },
  orange: {
    accent: "#FF8B36",
    iconBg: "bg-[#FF8B36]",
    iconColor: "text-white",
    badgeBg: "bg-[#FF8B36]/12",
    badgeText: "text-[#EA580C]",
    badgeBorder: "border-[#FF8B36]/25",
    hoverBorder: "hover:border-[#FF8B36]/45",
    hoverShadow: "hover:shadow-[0_12px_28px_rgba(255,139,54,0.12)]",
    arrowColor: "text-[#EA580C]",
    bg: "bg-orange-500/10 dark:bg-orange-500/15",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-900/40",
  },
  pink: {
    accent: "#F47FB3",
    iconBg: "bg-[#F47FB3]",
    iconColor: "text-white",
    badgeBg: "bg-[#F47FB3]/12",
    badgeText: "text-[#DB2777]",
    badgeBorder: "border-[#F47FB3]/25",
    hoverBorder: "hover:border-[#F47FB3]/45",
    hoverShadow: "hover:shadow-[0_12px_28px_rgba(244,127,179,0.12)]",
    arrowColor: "text-[#DB2777]",
    bg: "bg-pink-500/10 dark:bg-pink-500/15",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-900/40",
  },
};

// Category Design Identity
export const CATEGORY_THEMES: Record<ToolCategory, ColorTheme> = {
  Text: { emoji: "📝", ...PALETTE.blue },
  Format: { emoji: "⚡", ...PALETTE.coral },
  Cleanup: { emoji: "🧹", ...PALETTE.amber },
  Transform: { emoji: "🔄", ...PALETTE.teal },
  "Date & Time": { emoji: "📅", ...PALETTE.sky },
  "AI Magic": { emoji: "⚡", ...PALETTE.pink },
  Image: { emoji: "🖼️", ...PALETTE.mint },
  "PDF & Documents": { emoji: "📄", ...PALETTE.blue },
  Business: { emoji: "🧾", ...PALETTE.orange },
};

// 59 Utilities Individual Color Identity
export const TOOL_THEMES: Record<string, ColorTheme> = {
  // === Text Tools (15) ===
  "diff-checker": { emoji: "⚖️", ...PALETTE.blue },
  "word-counter": { emoji: "🧮", ...PALETTE.coral },
  "slug-generator": { emoji: "🔗", ...PALETTE.mint },
  "remove-emojis": { emoji: "😊", ...PALETTE.amber },
  "tabs-to-spaces": { emoji: "🔀", ...PALETTE.teal },
  "remove-accents": { emoji: "🔤", ...PALETTE.sky },
  "character-frequency": { emoji: "📊", ...PALETTE.orange },
  "word-frequency": { emoji: "📋", ...PALETTE.blue },
  "extract-emails-urls": { emoji: "📧", ...PALETTE.teal },
  "regex-tester": { emoji: "🎯", ...PALETTE.coral },
  "query-string-parser": { emoji: "🧩", ...PALETTE.mint },
  "extract-capitalized": { emoji: "🔠", ...PALETTE.pink },
  "extract-phone-numbers": { emoji: "📞", ...PALETTE.sky },
  "extract-text-between": { emoji: "✂️", ...PALETTE.amber },
  "find-and-replace": { emoji: "🔄", ...PALETTE.blue },

  // === Format Tools (8) ===
  "json-formatter": { emoji: "📦", ...PALETTE.coral },
  "json-to-csv": { emoji: "🔄", ...PALETTE.teal },
  "csv-to-json": { emoji: "📑", ...PALETTE.sky },
  "add-line-numbers": { emoji: "🔢", ...PALETTE.amber },
  "markdown-to-html": { emoji: "👁️", ...PALETTE.mint },
  "html-minifier": { emoji: "⚡", ...PALETTE.orange },
  "table-generator": { emoji: "📊", ...PALETTE.blue },
  "json-to-typescript": { emoji: "📐", ...PALETTE.coral },

  // === Cleanup Tools (10) ===
  "remove-extra-spaces": { emoji: "🧼", ...PALETTE.amber },
  "remove-duplicate-lines": { emoji: "✂️", ...PALETTE.orange },
  "remove-empty-lines": { emoji: "🗑️", ...PALETTE.coral },
  "trim-lines": { emoji: "✂️", ...PALETTE.teal },
  "strip-html-tags": { emoji: "🏷️", ...PALETTE.sky },
  "remove-line-breaks": { emoji: "📜", ...PALETTE.blue },
  "remove-special-chars": { emoji: "🔣", ...PALETTE.mint },
  "remove-hidden-characters": { emoji: "🔍", ...PALETTE.amber },
  "remove-lines-containing": { emoji: "🚫", ...PALETTE.coral },
  "pii-sanitizer": { emoji: "🛡️", ...PALETTE.teal },

  // === Transform Tools (12) ===
  "case-converter": { emoji: "🔠", ...PALETTE.teal },
  "fancy-fonts": { emoji: "🔤", ...PALETTE.pink },
  "sort-lines": { emoji: "📶", ...PALETTE.mint },
  "reverse-text": { emoji: "🔁", ...PALETTE.sky },
  base64: { emoji: "🔐", ...PALETTE.blue },
  "url-encoder": { emoji: "🌐", ...PALETTE.orange },
  "hash-generator": { emoji: "🔑", ...PALETTE.amber },
  "jwt-decoder": { emoji: "🎫", ...PALETTE.coral },
  "password-generator": { emoji: "🎲", ...PALETTE.teal },
  "uuid-generator": { emoji: "🆔", ...PALETTE.blue },
  "lorem-ipsum": { emoji: "📜", ...PALETTE.mint },
  rot13: { emoji: "🕵️", ...PALETTE.sky },

  // === Date & Time Tools (2) ===
  "unix-timestamp": { emoji: "⏰", ...PALETTE.sky },
  "date-difference": { emoji: "📅", ...PALETTE.mint },

  // === AI Magic Tools (7) ===
  "ai-grammar": { emoji: "✍️", ...PALETTE.pink },
  "ai-professional": { emoji: "💼", ...PALETTE.coral },
  "ai-friendly": { emoji: "😊", ...PALETTE.amber },
  "ai-summarize": { emoji: "💡", ...PALETTE.sky },
  "ai-paraphrase": { emoji: "🪶", ...PALETTE.teal },
  "ai-expand": { emoji: "🚀", ...PALETTE.blue },
  "ai-clarity": { emoji: "✨", ...PALETTE.pink },

  // === Image Tools (3) ===
  "image-compressor": { emoji: "🗜️", ...PALETTE.mint },
  "image-converter": { emoji: "🔄", ...PALETTE.teal },
  "image-resizer": { emoji: "📐", ...PALETTE.sky },

  // === PDF & Documents (1) ===
  "pdf-merger": { emoji: "📑", ...PALETTE.blue },

  // === Business Tools (1) ===
  "invoice-generator": { emoji: "🧾", ...PALETTE.orange },
};

export function getToolTheme(toolId: string, category?: ToolCategory): ColorTheme {
  if (TOOL_THEMES[toolId]) {
    return TOOL_THEMES[toolId];
  }
  if (category && CATEGORY_THEMES[category]) {
    return CATEGORY_THEMES[category];
  }
  return {
    emoji: "⚡",
    ...PALETTE.blue,
  };
}

export function getCategoryTheme(category: ToolCategory): ColorTheme {
  return CATEGORY_THEMES[category] || CATEGORY_THEMES["Text"];
}
