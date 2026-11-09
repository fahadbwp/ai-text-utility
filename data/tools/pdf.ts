import type { ToolDefinition } from "./types.ts";

export const PDF_TOOLS: ToolDefinition[] = [
  {
    id: "pdf-merger",
    name: "PDF Merger & Splitter",
    slug: "pdf-merger",
    category: "PDF & Documents",
    layout: "compact",
    description: "Combine multiple PDF files into one or extract selected pages in your browser with 100% private client-side processing.",
    icon: "FileCheck",
    keywords: [
      "pdf merger",
      "merge pdf files",
      "split pdf",
      "combine pdf",
      "extract pdf pages",
      "pdf joiner",
      "merge pdf online free",
    ],
    featured: true,
    supportsLiveMode: false,
    requiresAI: false,
    customComponent: "pdf-merger",
    aliases: ["merge-pdf", "split-pdf"],
  },
];
