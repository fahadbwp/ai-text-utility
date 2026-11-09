import { serializeStructuredData } from "@/lib/structuredData";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  AI_CATEGORIES,
  getAiToolsByCategory,
  AiCategory,
} from "@/data/aiToolsDirectory";
import { AiDirectoryClient } from "@/components/ai-directory/AiDirectoryClient";
import { Sparkles, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return AI_CATEGORIES.map((c) => ({
    category: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = AI_CATEGORIES.find((c) => c.slug === category);

  if (!meta) {
    return {
      title: "Category Not Found",
      robots: { index: false, follow: false },
    };
  }

  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app").replace(/\/+$/, "");
  const canonicalUrl = `${baseUrl}/ai-tools/${meta.slug}`;

  return {
    title: `Best ${meta.name} in 2026 – Curated Directory | AI Text Utility`,
    description: `Discover top curated ${meta.name.toLowerCase()} in 2026. Compare capabilities, free vs paid pricing tiers, and read honest pros and cons.`,
    keywords: [
      `${meta.slug} ai tools`,
      `best ${meta.slug} ai`,
      `top ${meta.slug} tools 2026`,
      "ai software directory",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Best ${meta.name} in 2026 – Curated Directory | AI Text Utility`,
      description: `Compare top rated ${meta.name.toLowerCase()} with verified links and honest user ratings.`,
      url: canonicalUrl,
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: meta.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Best ${meta.name} in 2026 – Curated Directory`,
      description: `Compare top rated ${meta.name.toLowerCase()} with verified links and honest user ratings.`,
      images: ["/og-image.png"],
    },
  };
}

export default async function AiCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const meta = AI_CATEGORIES.find((c) => c.slug === category);

  if (!meta) {
    notFound();
  }

  const tools = getAiToolsByCategory(meta.id as AiCategory);
  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://ai-text-utility.vercel.app").replace(/\/+$/, "");
  const pageUrl = `${baseUrl}/ai-tools/${meta.slug}`;

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
        name: meta.name,
        item: pageUrl,
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Curated ${meta.name}`,
    description: meta.description,
    url: pageUrl,
    numberOfItems: tools.length,
    itemListElement: tools.map((t, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: t.name,
        applicationCategory: "BusinessApplication",
        description: t.tagline,
        url: t.websiteUrl,
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

      <div className="w-full max-w-7xl mx-auto space-y-8 pb-16">
        {/* Navigation Breadcrumb Back */}
        <div className="pt-3">
          <Link
            href="/ai-tools"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All AI Categories</span>
          </Link>
        </div>

        {/* Category Header with exactly 1 H1 */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Software Category</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">
            Top {meta.name} (2026)
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            {meta.description} We independently compare feature sets, pricing plans, and real-world performance across each platform.
          </p>
        </div>

        {/* Directory Client View */}
        <AiDirectoryClient initialTools={tools} />

        {/* Category Educational Review */}
        <section aria-labelledby="cat-overview-heading" className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-6">
          <h2 id="cat-overview-heading" className="text-lg font-bold text-slate-900 dark:text-zinc-100">
            About {meta.name} in 2026
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            The artificial intelligence landscape for {meta.name.toLowerCase()} has evolved rapidly. Today&apos;s leading platforms offer unprecedented speed, contextual understanding, and multi-format export options that integrate directly into existing production workflows.
          </p>

          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
              Other Popular AI Categories:
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {AI_CATEGORIES.filter((c) => c.slug !== meta.slug).map((c) => (
                <Link
                  key={c.id}
                  href={`/ai-tools/${c.slug}`}
                  className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
