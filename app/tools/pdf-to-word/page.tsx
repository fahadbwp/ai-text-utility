import { serializeStructuredData } from "@/lib/structuredData";
import { Metadata } from "next";
import Link from "next/link";
import { DocumentConverterTool } from "@/components/tools/DocumentConverterTool";
import { FileText, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "PDF to Word Converter Online Free - 100% Private Browser Tool",
  description:
    "Convert PDF to editable Word (.docx) free in your browser. 100% client-side conversion ensures total privacy — your files are never uploaded to any server.",
  keywords: [
    "pdf to word",
    "pdf to docx converter",
    "convert pdf to word free",
    "free pdf to word converter online",
    "private pdf to docx",
    "browser pdf to word",
    "client-side pdf converter",
  ],
  alternates: {
    canonical: "https://ai-text-utility.vercel.app/tools/pdf-to-word",
  },
  openGraph: {
    title: "PDF to Word Converter Online Free - 100% Private Browser Tool",
    description:
      "Instant, private, in-browser PDF to editable Word document (.docx) conversion without uploading files to remote servers.",
    url: "https://ai-text-utility.vercel.app/tools/pdf-to-word",
    siteName: "AI Text Utility",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Word Converter Online Free - 100% Private Browser Tool",
    description:
      "Convert digital PDFs to editable Word documents (.docx) with 100% client-side privacy.",
  },
};

export default function PdfToWordPage() {
  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app").replace(/\/+$/, "");
  const canonicalUrl = `${baseUrl}/tools/pdf-to-word`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${canonicalUrl}#webapp`,
        name: "AI Text Utility - PDF to Word Converter",
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
          "Free and secure in-browser PDF to Word (.docx) document conversion without server uploads.",
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Is this PDF to Word converter completely free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, this tool is 100% free with no account creation, no subscription fees, and no daily limits.",
            },
          },
          {
            "@type": "Question",
            name: "Are my PDF documents uploaded to your servers?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. All conversion is executed 100% client-side inside your browser's memory using JavaScript and Web Workers. Your files never touch our servers.",
            },
          },
          {
            "@type": "Question",
            name: "Can I convert scanned (image-only) PDFs?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. This tool requires digital, selectable-text PDFs. Scanned image-only PDFs require server-side OCR processing, which is intentionally excluded to ensure your files stay strictly on your device.",
            },
          },
          {
            "@type": "Question",
            name: "What formatting survives during PDF to Word conversion?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Digital text, paragraph order, headings, and bold weights are extracted into an editable DOCX. Complex multi-column magazine layouts or advanced tables may require minor post-editing.",
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
            Free Online <span className="text-indigo-600 dark:text-indigo-400">PDF to Word</span> Converter
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Convert digital, selectable PDFs into editable Microsoft Word (.docx) documents directly inside your browser. No server uploads, no privacy compromises.
          </p>
        </div>

        {/* Converter Workspace */}
        <DocumentConverterTool mode="pdf-to-word" />

        {/* Educational Content & How It Works */}
        <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              How to Convert PDF to Word Online
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Select Digital PDF</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Drag and drop any standard digital PDF up to 25 MB into the upload zone above.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
                  2
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">In-Browser Processing</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Our Web Worker engine parses digital glyphs and builds OpenXML Word structures in memory.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
                  3
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Download .docx</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Download your editable Word document instantly and open it in Microsoft Word or Google Docs.
                </p>
              </div>
            </div>
          </div>

          {/* Contextual Links */}
          <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                Need to convert Word to PDF instead?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Use our companion browser tool to export DOCX documents to standardized PDF.
              </p>
            </div>
            <Link
              href="/tools/word-to-pdf"
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shrink-0 inline-flex items-center gap-1.5"
            >
              <span>Word to PDF Converter</span>
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
                  <span>Is this PDF to Word converter completely free?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Yes, this tool is 100% free with no account creation, no subscription fees, and no daily limits.
                </p>
              </details>

              <details className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 transition-all">
                <summary className="font-semibold text-sm text-slate-900 dark:text-slate-100 cursor-pointer list-none flex items-center justify-between">
                  <span>Are my PDF documents uploaded to your servers?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  No. All conversion is executed 100% client-side inside your browser's memory using JavaScript and Web Workers. Your files never touch our servers.
                </p>
              </details>

              <details className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 transition-all">
                <summary className="font-semibold text-sm text-slate-900 dark:text-slate-100 cursor-pointer list-none flex items-center justify-between">
                  <span>Can I convert scanned (image-only) PDFs?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  No. This tool requires digital, selectable-text PDFs. Scanned image-only PDFs require server-side OCR processing, which is intentionally excluded to ensure your files stay strictly on your device.
                </p>
              </details>

              <details className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 transition-all">
                <summary className="font-semibold text-sm text-slate-900 dark:text-slate-100 cursor-pointer list-none flex items-center justify-between">
                  <span>What formatting survives during PDF to Word conversion?</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Digital text, paragraph order, headings, and bold weights are extracted into an editable DOCX. Complex multi-column magazine layouts or advanced tables may require minor post-editing.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
