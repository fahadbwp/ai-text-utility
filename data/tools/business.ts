import type { ToolDefinition } from "./types.ts";

export const BUSINESS_TOOLS: ToolDefinition[] = [
  {
    id: "invoice-generator",
    name: "Invoice Generator & Slip Maker",
    slug: "invoice-generator",
    category: "Business",
    layout: "compact",
    description: "Create professional digital invoices, shop receipts, and billing slips with custom logo, tax, discounts, and PDF download.",
    icon: "Receipt",
    keywords: [
      "invoice generator",
      "free invoice maker",
      "receipt maker online",
      "shop bill generator",
      "create invoice pdf",
      "estimate generator",
      "billing slip",
    ],
    featured: true,
    supportsLiveMode: false,
    requiresAI: false,
    customComponent: "invoice-generator",
    aliases: ["bill-maker", "receipt-generator"],
  },
];
