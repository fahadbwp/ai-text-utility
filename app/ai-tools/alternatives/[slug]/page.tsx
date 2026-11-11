import { serializeStructuredData } from "@/lib/structuredData";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllAiTools,
  getAiToolBySlug,
  getAlternativesForTool,
} from "@/data/aiToolsDirectory";
import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Star,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tools = getAllAiTools();
  return tools.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getAiToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
      robots: { index: false, follow: false },
    };
  }

  const alts = getAlternativesForTool(slug);
  const altNames = alts.slice(0, 3).map((a) => a.name).join(", ");
  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app").replace(/\/+$/, "");
  const canonicalUrl = `${baseUrl}/ai-tools/alternatives/${tool.slug}`;

  return {
    title: `Best ${tool.name} Alternatives in 2026 (Free & Paid) | AI Text Utility`,
    description: `Looking for top alternatives to ${tool.name}? Compare leading AI options like ${altNames || "similar tools"} with verified pricing, pros, and cons.`,
    keywords: [
      `${tool.name.toLowerCase()} alternatives`,
      `best ${tool.name.toLowerCase()} alternative`,
      `free ${tool.name.toLowerCase()} alternatives`,
      `tools like ${tool.name.toLowerCase()}`,
      "ai tool comparison",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Best ${tool.name} Alternatives in 2026 (Free & Paid) | AI Text Utility`,
      description: `Compare leading alternatives to ${tool.name} with honest pricing, features, and user ratings.`,
      url: canonicalUrl,
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${tool.name} Alternatives` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Best ${tool.name} Alternatives in 2026 (Free & Paid)`,
      description: `Compare leading alternatives to ${tool.name} with honest pricing, features, and user ratings.`,
      images: ["/og-image.png"],
    },
  };
}

export default async function AiAlternativesPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getAiToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const alternatives = getAlternativesForTool(slug);
  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app").replace(/\/+$/, "");
  const pageUrl = `${baseUrl}/ai-tools/alternatives/${tool.slug}`;

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
        item: `${baseUrl}/ai-tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${tool.name} Alternatives`,
        item: pageUrl,
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Top Alternatives to ${tool.name}`,
    description: `Recommended software alternatives and competitors to ${tool.name}.`,
    url: pageUrl,
    numberOfItems: alternatives.length,
    itemListElement: alternatives.map((alt, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: alt.name,
        applicationCategory: "BusinessApplication",
        description: alt.tagline,
        url: alt.websiteUrl,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeStructuredData(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeStructuredData(itemListSchema) }}
      />

      <div className="w-full max-w-6xl mx-auto space-y-8 pb-16">
        {/* Breadcrumb Back */}
        <div className="pt-3">
          <Link
            href="/ai-tools"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to AI Directory</span>
          </Link>
        </div>

        {/* Header with exactly 1 H1 */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Software Comparison & Alternatives</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            Best {tool.name} Alternatives in 2026
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            While {tool.name} is a leading platform for {tool.category}, creators and businesses frequently seek alternatives offering better pricing, specialized features, or privacy guarantees. Here are the top competing options:
          </p>
        </div>

        {/* Current Tool Quick Card */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                  {tool.name} (Overview)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {tool.pricing} ({tool.startingPrice})
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{tool.tagline}</p>
            </div>

            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              aria-label={`Visit official website for ${tool.name}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 self-start sm:self-auto"
            >
              <span>Visit Official Site</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-200/70 dark:border-zinc-800">
            <div>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                <Check size={13} /> Pros
              </p>
              <ul className="space-y-1 text-slate-600 dark:text-zinc-400">
                {tool.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-1.5">
                    <span className="text-emerald-500">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1">
                <X size={13} /> Limitations / Cons
              </p>
              <ul className="space-y-1 text-slate-600 dark:text-zinc-400">
                {tool.cons.map((con) => (
                  <li key={con} className="flex items-start gap-1.5">
                    <span className="text-rose-500">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Top Alternatives Comparison Grid */}
        <section aria-labelledby="alternatives-list-heading" className="space-y-4">
          <h2
            id="alternatives-list-heading"
            className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100"
          >
            Top Ranked Alternatives to {tool.name}
          </h2>

          <div className="space-y-4">
            {alternatives.map((alt, index) => (
              <div
                key={alt.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                          {alt.name}
                        </h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                          {alt.pricing} ({alt.startingPrice})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                        {alt.tagline}
                      </p>
                    </div>
                  </div>

                  <a
                    href={alt.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    aria-label={`Visit official website for ${alt.name}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs self-start sm:self-auto cursor-pointer"
                  >
                    <span>Visit {alt.name}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {alt.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100 dark:border-zinc-800">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                      Why choose {alt.name}:
                    </span>
                    <ul className="space-y-1 text-slate-600 dark:text-zinc-400">
                      {alt.pros.map((p) => (
                        <li key={p} className="flex items-center gap-1.5">
                          <Check size={12} className="text-emerald-500 shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 block mb-1">
                      Trade-offs to consider:
                    </span>
                    <ul className="space-y-1 text-slate-600 dark:text-zinc-400">
                      {alt.cons.map((c) => (
                        <li key={c} className="flex items-center gap-1.5">
                          <X size={12} className="text-rose-500 shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section aria-labelledby="faq-section-heading" className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h2 id="faq-section-heading" className="text-base font-bold text-slate-900 dark:text-zinc-100">
            Frequently Asked Questions: {tool.name} Alternatives
          </h2>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80">
              <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                What is the best overall free alternative to {tool.name}?
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                If you are looking for a free or freemium alternative to {tool.name}, we recommend starting with {alternatives[0]?.name || "leading freemium models"}, which offers generous free monthly quotas and high-quality outputs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800/80">
              <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                Are these alternatives safe and reliable?
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Yes. Every alternative listed is vetted for active development, transparent pricing terms, and secure data handling standards.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
