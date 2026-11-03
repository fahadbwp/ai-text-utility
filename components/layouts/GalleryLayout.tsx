"use client";

import React from "react";
import { Layers, FileText } from "lucide-react";
import { WorkspaceProps } from "./types";

export const GalleryLayout: React.FC<WorkspaceProps> = ({
  tool,
  input,
  onInputChange,
  onClear,
  customControls,
  customPreview,
  customWorkspace,
  inputPlaceholder = "Type or paste text to stylize across font gallery...",
}) => {
  // If full custom gallery workspace is provided (as Fancy Fonts currently has)
  if (customWorkspace) {
    return <div className="space-y-6">{customWorkspace}</div>;
  }

  return (
    <div className="space-y-6">
      {/* 1. Full-Width Top Input Box */}
      <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs focus-within:border-blue-500/50 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#161b22]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <FileText size={14} className="text-blue-600 dark:text-blue-400" />
              Source Text to Stylize
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              Live preview enabled
            </span>
          </div>

          <div className="flex items-center gap-2">
            {tool.sampleInput && (
              <button
                type="button"
                onClick={() => onInputChange(tool.sampleInput || "Stylish Text 2026")}
                className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-md transition-colors cursor-pointer"
              >
                Load Sample
              </button>
            )}
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                disabled={!input}
                aria-label="Clear text"
                className="min-h-9 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 border border-slate-200 dark:border-zinc-800 disabled:opacity-30 rounded-md transition-colors cursor-pointer"
                title="Clear text"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-transparent">
          <textarea aria-label="Text to style"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={inputPlaceholder}
            rows={3}
            className="w-full bg-transparent text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 font-sans text-base resize-y focus:outline-hidden leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#161b22] text-xs text-slate-500 dark:text-zinc-400 font-mono">
          <span>{input.length.toLocaleString()} characters in input</span>
          <span className="text-slate-400 dark:text-zinc-500">In-browser Unicode font generation</span>
        </div>
      </div>

      {/* 2. Gallery Filter & Search Controls */}
      {customControls && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          {customControls}
        </div>
      )}

      {/* 3. Style Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-zinc-300">
          <Layers size={14} className="text-blue-600 dark:text-blue-400" />
          <span>Style Variations Gallery</span>
        </div>

        {customPreview ? (
          customPreview
        ) : (
          <div className="p-8 text-center text-slate-400 dark:text-zinc-500 text-xs rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-2">
            <Layers size={20} className="text-slate-300 dark:text-zinc-600" />
            <span>Type text above to preview font styles.</span>
          </div>
        )}
      </div>
    </div>
  );
};
