import { serializeStructuredData } from "@/lib/structuredData";
import { Metadata } from "next";
import Link from "next/link";
import { DocumentConverterTool } from "@/components/tools/DocumentConverterTool";
import { FileCode, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Word to PDF Converter Online Free - 100% Private In-Browser",
  description:
    "Convert Word (.docx) to PDF free directly in your web browser. 100% client-side execution ensures your documents are never uploaded to any remote server.",
  keywords: [
    "word to pdf",
    "docx to pdf converter",
    "convert word to pdf online free",
    "free docx to pdf",
    "private word to pdf",
    "browser word converter",
    "in-browser docx to pdf",
  ],
  alternates: {
    canonical: "https://ai-text-utility.vercel.app/tools/word-to-pdf",
  },
  openGraph: {
    title: "Word to PDF Converter Online Free - 100% Private In-Browser",
    description:
      "Instant, private Word to PDF document conversion inside your browser without uploading files to remote servers.",
    url: "https://ai-text-utility.vercel.app/tools/word-to-pdf",
    siteName: "AI Text Utility",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Word to PDF Converter Online Free - 100% Private In-Browser",
    description:
      "Convert Word (.docx) documents to standard PDF with 100% client-side privacy.",
  },
};

export default function WordToPdfPage() {
  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app").replace(/\/+$/, "");
  const canonicalUrl = `${baseUrl}/tools/word-to-pdf`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${canonicalUrl}#webapp`,
        name: "AI Text Utility - Word to PDF Converter",
        url: canonicalUrl,
        applicationCategory: "BusinessApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "Free and secure in-browser Word (.docx) to PDF document conversion without server uploads.",
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Is this Word to PDF converter completely free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, this tool is 100% free with no sign-ups, no subscription tiers, and no daily conversion limits.",
            },
          },
          {
            "@type": "Question",
            name: "Are my Word documents sent to a third party or server?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. All conversion is performed 100% in your browser's memory using JavaScript. No document content is ever sent over the network.",
            },
          },
          {
            "@type": "Question",
            name: "What elements are preserved in the generated PDF?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Standard headings, paragraph formatting, bold, italics, bullet/numbered lists, bordered tables, and multi-page page breaks are preserved.",
            },
          },
          {
            "@type": "Question",
            name: "Are complex Word macros (.docm) or SmartArt supported?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Advanced proprietary Word features such as SmartArt, WordArt, dynamic Excel charts, and macros are not rendered by browser-based open-source engines.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(structuredData),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* Tool Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Private • Local Browser Execution</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Free Online <span className="text-indigo-600 dark:text-indigo-400">Word to PDF</span> Converter
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Convert Microsoft Word (.docx) documents into clean, paginated PDF files directly in your web browser. Fast, free, and completely confidential.
          </p>
        </div>

        {/* Converter Workspace */}
        <DocumentConverterTool mode="word-to-pdf" />

        {/* Educational Content & How It Works */}
        <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              How to Convert Word to PDF Online
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Select Word Document</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Choose or drag and drop any .docx file up to 25 MB into the dropzone above.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
                  2
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">In-Browser Parsing</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Our client-side engine renders styles, headings, tables, and page splits into a PDF stream.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
                  3
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Download PDF</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Download your standardized, printable PDF file immediately with zero server lag.
                </p>
              </div>
            </div>
          </div>

          {/* Contextual Links */}
          <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                Need to convert PDF to Word instead?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Use our companion browser tool to turn digital PDFs into editable Word (.docx) files.
              </p>
            </div>
            <Link
              href="/tools/pdf-to-word"
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shrink-0 inline-flex items-center gap-1.5"
            >
              <span>PDF to Word Converter</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              <details className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 transition-all">
                <summary className="font-semibold text-sm text-slate-900 dark:text-slate-100 cursor-pointer list-none flex items-center justify-between">
                  <span>Is this Word to PDF converter completely free?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Yes, this tool is 100% free with no sign-ups, no subscription tiers, and no daily conversion limits.
                </p>
              </details>

              <details className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 transition-all">
                <summary className="font-semibold text-sm text-slate-900 dark:text-slate-100 cursor-pointer list-none flex items-center justify-between">
                  <span>Are my Word documents sent to a third party or server?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  No. All conversion is performed 100% in your browser's memory using JavaScript. No document content is ever sent over the network.
                </p>
              </details>

              <details className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 transition-all">
                <summary className="font-semibold text-sm text-slate-900 dark:text-slate-100 cursor-pointer list-none flex items-center justify-between">
                  <span>What elements are preserved in the generated PDF?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Standard headings, paragraph formatting, bold, italics, bullet/numbered lists, bordered tables, and multi-page page breaks are preserved.
                </p>
              </details>

              <details className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 transition-all">
                <summary className="font-semibold text-sm text-slate-900 dark:text-slate-100 cursor-pointer list-none flex items-center justify-between">
                  <span>Are complex Word macros (.docm) or SmartArt supported?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  No. Advanced proprietary Word features such as SmartArt, WordArt, dynamic Excel charts, and macros are not rendered by browser-based open-source engines.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
