export interface CitableAnswerBlock {
  heading: string;
  intro: string;
  steps: string[];
  takeaway: string;
}

export const CITABLE_ANSWER_BLOCKS: Record<string, CitableAnswerBlock> = {
  "remove-line-breaks": {
    heading: "Quick Answer: How to Remove Line Separators and Format Paragraphs",
    intro: "To remove hard line separators and format messy text into clean, continuous paragraphs, use our private in-browser line break cleaner:",
    steps: [
      "Step 1: Paste your copied text from PDFs, emails, or code terminals directly into the clean input workspace.",
      "Step 2: Choose your join delimiter — select a single space to connect wrapped sentence lines, or specify a custom delimiter like commas.",
      "Step 3: Enable the Preserve Double Line Breaks option if you want to keep two distinct paragraphs while stripping accidental mid-sentence line breaks.",
      "Step 4: Click the 1-click cleanup preset to instantly normalize spacing and collapse unwanted line breaks into structured paragraphs.",
      "Step 5: Copy the formatted text to your clipboard or download it with zero server upload.",
    ],
    takeaway: "Every character is processed strictly inside your local browser memory, ensuring 100% confidential document formatting with zero server latency.",
  },
  "ai-summarize": {
    heading: "Quick Answer: How to Condense Long Text into Structured Paragraphs",
    intro: "To condense run-on text and long articles into structured paragraphs or actionable bullet points, use our AI summarizer:",
    steps: [
      "Step 1: Paste your lengthy article, document, or conversational draft directly into the text workspace.",
      "Step 2: Select your target summary format, such as condensing the source content into two structured paragraphs or extracting high-impact bullet points.",
      "Step 3: Click Process with AI to transmit the text securely through HTTPS to the configured AI provider.",
      "Step 4: Review the generated summary against your original material to confirm that key facts, statistics, and essential context were faithfully preserved.",
      "Step 5: Copy the condensed paragraphs or bulleted takeaways directly to your clipboard for reports, emails, or research.",
    ],
    takeaway: "AI requests are processed through secure server endpoints without saving or storing your text in any persistent application database, ensuring fast and confidential text condensation.",
  },
};

export function getCitableAnswerBlock(slug: string): CitableAnswerBlock | undefined {
  return CITABLE_ANSWER_BLOCKS[slug];
}
