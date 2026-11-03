"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/Modal";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, X } from "lucide-react";
import { TOOLS_REGISTRY, CATEGORIES } from "@/data/toolsRegistry";
import { DynamicIcon } from "@/components/DynamicIcon";
import { getToolTheme } from "@/lib/toolThemes";

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}) => {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = externalOnOpenChange || setInternalOpen;

  useEffect(() => {
    if (externalOpen !== undefined) return;
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen, externalOpen]);

  if (!isOpen) return null;

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    router.push(`/tools/${slug}`);
  };

  const filteredTools =
    selectedCategory === "ALL"
      ? TOOLS_REGISTRY
      : TOOLS_REGISTRY.filter((t) => t.category === selectedCategory);

  return (
    <Modal label="Search tools" onClose={() => setIsOpen(false)} className="items-start pt-8 sm:pt-20">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl text-slate-900 dark:text-zinc-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Search tools" className="w-full" filter={(value, search) => {
          const query = search.trim().toLowerCase();
          const text = value.toLowerCase();
          if (!query || text.includes(query)) return 1;
          return query.split(/\s+/).every(word => text.includes(word)) ? 0.5 : 0;
        }}>
          <div className="flex items-center border-b border-slate-200 dark:border-zinc-800 px-4 py-3 bg-white dark:bg-zinc-900">
            <Search className="mr-3 h-4 w-4 shrink-0 text-slate-400 dark:text-zinc-500" />
            <Command.Input
              aria-label="Search tools"
              placeholder={`Search all ${TOOLS_REGISTRY.length} utilities by name, category, or task...`}
              className="w-full bg-transparent text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 outline-hidden"
            />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close command palette"
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-200/80 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950 overflow-x-auto text-xs scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              aria-pressed={selectedCategory === "ALL"}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === "ALL"
                  ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Tools ({TOOLS_REGISTRY.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                aria-pressed={selectedCategory === cat.name}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.name
                    ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700">
            <Command.Empty className="py-8 text-center text-xs text-slate-500 dark:text-zinc-400">
              No matching tools found.
            </Command.Empty>

            {CATEGORIES.map((cat) => {
              const toolsInCat = filteredTools.filter((t) => t.category === cat.name);
              if (toolsInCat.length === 0) return null;

              return (
                <Command.Group
                  key={cat.name}
                  heading={cat.name}
                  className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-zinc-400"
                >
                  {toolsInCat.map((tool) => {
                    const theme = getToolTheme(tool.id, tool.category);
                    return (
                      <Command.Item
                        key={tool.id}
                        value={`${tool.name} ${tool.category} ${tool.keywords.join(" ")}`}
                        onSelect={() => handleSelect(tool.slug)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white cursor-pointer data-[selected=true]:bg-slate-100 dark:data-[selected=true]:bg-zinc-800 data-[selected=true]:text-slate-900 dark:data-[selected=true]:text-white transition-colors"
                      >
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 border ${theme.bg} ${theme.border}`}
                        >
                          <DynamicIcon name={tool.icon} size={14} className={theme.text} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900 dark:text-zinc-100 truncate">
                              {tool.name}
                            </span>
                            {tool.category === "AI Magic" && (
                              <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                                Assisted
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                            {tool.description}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500 shrink-0 font-mono">
                          ↵ Open
                        </span>
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              );
            })}
          </Command.List>

          <div className="flex items-center justify-between border-t border-slate-200 dark:border-zinc-800 px-4 py-2 bg-slate-50 dark:bg-zinc-950 text-xs text-slate-500 dark:text-zinc-400 font-mono">
            <span>
              Use <kbd className="bg-white dark:bg-zinc-800 px-1 py-0.5 rounded border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300">↑</kbd> <kbd className="bg-white dark:bg-zinc-800 px-1 py-0.5 rounded border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300">Esc</kbd> to close
            </span>
          </div>
        </Command>
      </div>
    </Modal>
  );
};
