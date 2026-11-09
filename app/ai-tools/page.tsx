import { serializeStructuredData } from "@/lib/structuredData";
import { Metadata } from "next";
import Link from "next/link";
import { getAllAiTools, AI_CATEGORIES } from "@/data/aiToolsDirectory";
import { AiDirectoryClient } from "@/components/ai-directory/AiDirectoryClient";
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Tools & Software Directory 2026 – Top AI Software [Free & Paid]",
  description:
    "Explore 100+ top curated AI tools for writing, coding, image generation, video, audio, and SEO. Verified links, pricing tags, pros, cons, and alternatives.",
  keywords: [
    "ai tools directory",
    "best ai tools 2026",
    "top ai software",
    "free ai tools",
    "ai writing tools",
    "ai coding tools",
    "ai image generators",
    "ai alternatives",
  ],
  alternates: {
    canonical: "https://ai-text-utility.vercel.app/ai-tools",
  },
  openGraph: {
    title: "AI Tools & Software Directory 2026 – Top AI Software [Free & Paid]",
    description:
      "Explore 100+ top curated AI tools for writing, coding, image generation, video, audio, and SEO. Verified links, pricing tags, and alternatives.",
    url: "https://ai-text-utility.vercel.app/ai-tools",
    siteName: "AI Text Utility",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Tools Directory" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools & Software Directory 2026 – Top AI Software [Free & Paid]",
    description:
      "Explore 100+ top curated AI tools across writing, coding, image, video, audio, and SEO.",
    images: ["/og-image.png"],
  },
};

export default function AiToolsDirectoryPage() {
  const allTools = getAllAiTools();
  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app").replace(/\/+$/, "");
  const pageUrl = `${baseUrl}/ai-tools`;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Curated Directory of Top AI Tools & Software",
    description: "Comprehensive directory of generative AI software, developer tools, and productivity applications.",
    url: pageUrl,
    numberOfItems: allTools.length,
    itemListElement: allTools.map((t, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: t.name,
        applicationCategory: "BusinessApplication",
        description: t.tagline,
        url: t.websiteUrl,
        offers: {
          "@type": "Offer",
          price: t.pricing === "Free" ? "0" : "Varies",
          priceCurrency: "USD",
        },
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "AI Tools Directory",
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeStructuredData(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeStructuredData(breadcrumbSchema) }}
      />

      <div className="w-full max-w-7xl mx-auto space-y-10 pb-16">
        {/* Page Hero Header with exactly 1 H1 */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-4 sm:pt-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Updated for 2026 • 100+ Curated Tools</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            AI Tools & Software Directory
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
            Discover, filter, and compare the most powerful generative AI software across writing, coding, image creation, video, audio, and SEO workflows.
          </p>
        </div>

        {/* Categories Rail Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {AI_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/ai-tools/${cat.slug}`}
              className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-xs hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.name.split("&")[0].trim()}
                </span>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5 line-clamp-1">
                  {cat.name.split("&")[1]?.trim() || "Tools"}
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-blue-600 dark:text-blue-400">
                <span>Browse</span>
                <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Interactive Client Directory (Search, Filters, Grid) */}
        <AiDirectoryClient initialTools={allTools} />

        {/* Educational SEO Guide Section */}
        <section aria-labelledby="guide-heading" className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <h2 id="guide-heading" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100">
              How to Choose the Best AI Tools for Your Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              With thousands of generative artificial intelligence apps launching every month, picking software with genuine utility and reliable privacy policies is essential. Here is our criteria for vetting every platform in our directory:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                1. Underlying Model & Speed
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Determine whether the software runs on proprietary frontier models (like Claude 3.5 Sonnet, GPT-4o) or fine-tuned open-source checkpoints (like FLUX.1 or Llama 3).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                2. Transparent Pricing Structure
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                We verify whether tools offer genuine free tiers or credit allowances before locking features behind aggressive paywalls or confusing token limits.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                3. Data Privacy & Enterprise Safety
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Check whether your prompts and uploaded files are used to train future public models, and favor platforms that offer zero data retention policies.
              </p>
            </div>
          </div>

          {/* Directory FAQs (Visible content without spammy FAQPage JSON-LD) */}
          <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">
              Frequently Asked Questions About AI Software
            </h2>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-800/60">
                <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                  Are the tools listed in this directory free to use?
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  Most tools in our directory provide either a permanently free tier or daily refreshed free credits (such as ChatGPT, Claude, Ideogram, and Suno). Where a tool is strictly commercial, it is marked with a &ldquo;Paid&rdquo; badge.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-800/60">
                <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                  How can I submit my own AI application to this directory?
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  If you are a founder or developer who built an innovative AI product, reach out via our [Contact Page](/contact) with your product name, official URL, pricing model, and description.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
