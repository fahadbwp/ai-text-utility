"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Tag,
  DollarSign,
  Star,
} from "lucide-react";
import {
  AiToolItem,
  AI_CATEGORIES,
  AiCategory,
  AiPricing,
} from "@/data/aiToolsDirectory";
import { DynamicIcon } from "@/components/DynamicIcon";

interface AiDirectoryClientProps {
  initialTools: AiToolItem[];
}

export const AiDirectoryClient: React.FC<AiDirectoryClientProps> = ({ initialTools }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedPricing, setSelectedPricing] = useState<string>("ALL");

  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return initialTools.filter((tool) => {
      const matchesCategory =
        selectedCategory === "ALL" || tool.category === selectedCategory;
      const matchesPricing =
        selectedPricing === "ALL" || tool.pricing === selectedPricing;
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.tagline.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesPricing && matchesSearch;
    });
  }, [initialTools, searchQuery, selectedCategory, selectedPricing]);

  const featuredTools = useMemo(
    () => initialTools.filter((t) => t.featured).slice(0, 4),
    [initialTools]
  );

  return (
    <div className="space-y-8">
      {/* Search Bar & Primary Filters */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI tools by name, keyword, or feature (e.g. ChatGPT, Claude, React, avatar, voice)..."
            aria-label="Search AI tools database"
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Rail */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            aria-label="Filter all categories"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === "ALL"
                ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
            }`}
          >
            All Categories ({initialTools.length})
          </button>
          {AI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              aria-label={`Filter by ${cat.name}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                  : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
              }`}
            >
              {cat.name.split("&")[0].trim()}
            </button>
          ))}
        </div>

        {/* Pricing Filter Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
              Pricing:
            </span>
            {(["ALL", "Free", "Freemium", "Paid"] as const).map((pr) => (
              <button
                key={pr}
                type="button"
                onClick={() => setSelectedPricing(pr)}
                aria-label={`Filter pricing by ${pr}`}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  selectedPricing === pr
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                }`}
              >
                {pr === "ALL" ? "All Pricing" : pr}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 dark:text-zinc-500">
            Showing {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"}
          </span>
        </div>
      </div>

      {/* Featured Highlight Strip */}
      {selectedCategory === "ALL" && !searchQuery && (
        <section aria-labelledby="featured-tools-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2
              id="featured-tools-heading"
              className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2 uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Featured Frontier AI Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {featuredTools.map((tool) => (
              <div
                key={tool.id}
                className="group relative flex flex-col justify-between p-4 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-gradient-to-b from-amber-50/30 to-white dark:from-amber-950/20 dark:to-zinc-900 shadow-xs hover:border-amber-300 dark:hover:border-amber-700/60 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                      ★ Featured
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400">
                      {tool.startingPrice}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {tool.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                  <Link
                    href={`/ai-tools/alternatives/${tool.slug}`}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Alternatives
                  </Link>
                  <a
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit official website for ${tool.name}`}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    <span>Visit</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Tools Grid */}
      <section aria-labelledby="all-tools-heading" className="space-y-4">
        <h2
          id="all-tools-heading"
          className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2 uppercase tracking-wider"
        >
          <span>Curated AI Software Directory</span>
          <span className="text-xs font-normal text-slate-400">({filteredTools.length})</span>
        </h2>

        {filteredTools.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
              No AI tools match your filter query.
            </p>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Try clearing your search terms or switching category tabs.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
                setSelectedPricing("ALL");
              }}
              aria-label="Reset all filters"
              className="mt-4 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="group flex flex-col justify-between p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700 shadow-xs hover:shadow-sm transition-all"
              >
                <div>
                  {/* Top Category & Pricing Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                      {tool.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        tool.pricing === "Free"
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : tool.pricing === "Freemium"
                          ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          : "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      }`}
                    >
                      {tool.pricing}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {tool.tagline}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    {tool.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 dark:bg-zinc-800/60 text-slate-500 dark:text-zinc-400 border border-slate-100 dark:border-zinc-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Links */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <Link
                    href={`/ai-tools/alternatives/${tool.slug}`}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Alternatives</span>
                    <ArrowRight size={11} />
                  </Link>
                  <a
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit official website for ${tool.name}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 transition-colors"
                  >
                    <span>Visit Tool</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
