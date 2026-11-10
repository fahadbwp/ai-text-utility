"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Star, Clock, LayoutGrid, ArrowRight, Search } from "lucide-react";
import { TOOLS_REGISTRY, CATEGORIES, ToolCategory, ToolDefinition } from "@/data/toolsRegistry";
import { ToolCard } from "@/components/ToolCard";
import { EmptyState } from "@/components/EmptyState";
import { TerminalHero } from "@/components/TerminalHero";
import { DynamicIcon } from "@/components/DynamicIcon";
import { getFavorites, getRecentTools } from "@/lib/storage";
import { getCategoryTheme } from "@/lib/toolThemes";

export function HomeToolsClient({ children }: { children: React.ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favoritesList, setFavoritesList] = useState<string[]>([]);
  const [recentList, setRecentList] = useState<string[]>([]);

  useEffect(() => {
    const updateStorage = () => {
      setFavoritesList(getFavorites());
      setRecentList(getRecentTools());
    };
    const checkFavoritesFromUrl = () => {
      if (typeof window !== "undefined") {
        if (window.location.search.includes("favorites=true") || window.location.hash === "#favorites") {
          setOnlyFavorites(true);
          setTimeout(() => document.getElementById("tools-section")?.scrollIntoView({ behavior: "smooth" }), 100);
          return;
        }
        if (window.location.hash.startsWith("#category-")) {
          const hashCat = window.location.hash.replace("#category-", "");
          const matched = CATEGORIES.find(
            (c) => c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === hashCat
          );
          if (matched) {
            setSelectedCategory(matched.name);
            setOnlyFavorites(false);
            setTimeout(() => document.getElementById("tools-section")?.scrollIntoView({ behavior: "smooth" }), 100);
          }
        }
      }
    };
    updateStorage();
    checkFavoritesFromUrl();
    const handleShowFavorites = () => {
      setOnlyFavorites(true);
      setTimeout(() => document.getElementById("tools-section")?.scrollIntoView({ behavior: "smooth" }), 50);
    };
    window.addEventListener("show-favorites", handleShowFavorites);
    window.addEventListener("favorites-updated", updateStorage);
    window.addEventListener("recent-updated", updateStorage);
    window.addEventListener("storage", updateStorage);
    window.addEventListener("hashchange", checkFavoritesFromUrl);
    window.addEventListener("popstate", checkFavoritesFromUrl);
    return () => {
      window.removeEventListener("show-favorites", handleShowFavorites);
      window.removeEventListener("favorites-updated", updateStorage);
      window.removeEventListener("recent-updated", updateStorage);
      window.removeEventListener("storage", updateStorage);
      window.removeEventListener("hashchange", checkFavoritesFromUrl);
      window.removeEventListener("popstate", checkFavoritesFromUrl);
    };
  }, []);

  const filteredTools = useMemo(() => TOOLS_REGISTRY.filter((tool) => {
    const matchesCat = selectedCategory === "ALL" || tool.category === selectedCategory;
    const matchesFav = !onlyFavorites || favoritesList.includes(tool.id);
    return matchesCat && matchesFav;
  }), [selectedCategory, onlyFavorites, favoritesList]);

  const recentTools = useMemo(() => recentList.map((id) => TOOLS_REGISTRY.find((t) => t.id === id)).filter((t): t is ToolDefinition => Boolean(t)).slice(0, 3), [recentList]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-16">
      <TerminalHero />

      {/* Modern Command Search Launcher */}
      <div className="w-full max-w-2xl -mt-2 sm:-mt-3">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
          aria-label="Search tools, categories or features"
          className="search-glass-bar w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl cursor-pointer group text-left"
        >
          <div className="flex items-center gap-2.5">
            <Search size={16} className="text-slate-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0" />
            <span className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-normal group-hover:text-slate-800 dark:group-hover:text-zinc-200">
              Search tools, categories or features...
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-flex items-center text-[11px] font-medium text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 px-2 py-0.5 rounded">
              ⌘K
            </kbd>
          </div>
        </button>
      </div>

      {/* Category Filter Rail */}
      <section id="tools-section" className="w-full min-w-0 scroll-mt-24 -mt-2 sm:-mt-3">
        <div className="flex items-center justify-start overflow-x-auto pb-1.5 scrollbar-none gap-2">
          <button
            type="button"
            onClick={() => { setSelectedCategory("ALL"); setOnlyFavorites(false); }}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              selectedCategory === "ALL" && !onlyFavorites
                ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                : "text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
            }`}
          >
            <LayoutGrid size={13} />
            <span>All Tools ({TOOLS_REGISTRY.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { setOnlyFavorites((prev) => !prev); if (!onlyFavorites) setSelectedCategory("ALL"); }}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              onlyFavorites
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40"
                : "text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
            }`}
          >
            <Star size={13} className={onlyFavorites ? "fill-amber-500 text-amber-500" : "text-amber-500"} />
            <span>Favorites ({favoritesList.length})</span>
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name && !onlyFavorites;
            const catTheme = getCategoryTheme(cat.name);
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => { setSelectedCategory(cat.name); setOnlyFavorites(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                    : "text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
                }`}
              >
                <DynamicIcon
                  name={cat.icon}
                  size={13}
                  className={isSelected ? "text-white dark:text-zinc-900" : catTheme.text}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* AI Tools Directory Discovery Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-white dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-zinc-900 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="text-sm">🤖</span>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100">
              New: Curated AI Software Directory
            </p>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-zinc-400">
              Compare 100+ top tools for Writing, Coding, Video, Audio, and Image creation.
            </p>
          </div>
        </div>
        <Link
          href="/ai-tools"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors shrink-0 self-start sm:self-auto"
        >
          <span>Explore Directory</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* Recently Used Section */}
      {selectedCategory === "ALL" && !onlyFavorites && recentTools.length > 0 && (
        <section id="recent" aria-labelledby="recent-heading" className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#1685FF] shrink-0" />
              <div>
                <h2 id="recent-heading" className="text-sm sm:text-base font-bold text-[#17264A] tracking-tight">
                  Recently Used
                </h2>
                <p className="text-xs text-[#647797]">
                  Quick access to tools you used recently
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {recentTools.map((tool) => (
              <ToolCard key={`recent-${tool.id}`} tool={tool} badgeLabel="Recent" />
            ))}
          </div>
        </section>
      )}

      {/* Main Tools Display */}
      {filteredTools.length === 0 ? (
        <EmptyState
          title={onlyFavorites ? "No favorites yet" : "No utilities found"}
          description={onlyFavorites ? "You haven't saved any favorite tools yet. Click the star icon on any tool to save it here for quick access." : "No tools found in this category. Try selecting a different category."}
          actionText="Browse All Tools"
          onAction={() => { setSelectedCategory("ALL"); setOnlyFavorites(false); }}
        />
      ) : selectedCategory === "ALL" && !onlyFavorites ? (
        <div className="space-y-10 sm:space-y-12">
          {CATEGORIES.map((cat) => {
            const toolsInCat = TOOLS_REGISTRY.filter((t) => t.category === cat.name);
            const isAI = cat.name === ("AI Magic" as ToolCategory);
            const catTheme = getCategoryTheme(cat.name);
            return (
              <section
                key={cat.name}
                id={`category-${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="space-y-4 scroll-mt-20"
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-[10px] ${catTheme.iconBg} flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      <DynamicIcon name={cat.icon} size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-bold text-[#17264A] tracking-tight">
                          {cat.name} Tools
                        </h2>
                        {isAI && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-[#DB2777] border border-pink-200/80">
                            Assisted Writing
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#647797] mt-0.5">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-[#17264A] border border-slate-200/80">
                      {toolsInCat.length} tools
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className="text-xs font-semibold text-[#1685FF] hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>View all</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {toolsInCat.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#17264A] tracking-tight">
                {onlyFavorites ? "Your Favorited Utilities" : `${selectedCategory} Utilities`}
              </h2>
              <p className="text-xs sm:text-sm text-[#647797] mt-0.5">
                {onlyFavorites ? `${filteredTools.length} saved tools` : `${filteredTools.length} tools found`}
              </p>
            </div>
            {(selectedCategory !== "ALL" || onlyFavorites) && (
              <button
                type="button"
                onClick={() => { setOnlyFavorites(false); setSelectedCategory("ALL"); }}
                className="h-8 px-3.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-[#17264A] hover:bg-slate-50 inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <span>View all tools</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {children}
    </div>
  );
}
