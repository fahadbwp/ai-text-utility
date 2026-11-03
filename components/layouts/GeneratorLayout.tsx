"use client";

import React from "react";
import { Layers, RefreshCw, Download, Sliders } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { WorkspaceProps } from "./types";

export const GeneratorLayout: React.FC<WorkspaceProps> = ({
  tool,
  output,
  onRun,
  onDownload,
  isLoading = false,
  customControls,
  customPreview,
  outputPlaceholder = "Generated output will appear here...",
  resultReady = output !== "",
  error = null,
}) => {
  const canExport = resultReady && !isLoading && !error;
  const handleDownload = () => {
    if (!canExport) return;
    if (onDownload) {
      onDownload();
      return;
    }
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = tool.slug === "password-generator" ? "generated-passwords.txt" : `${tool.slug}-result.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Options & Configuration Card */}
      {customControls && (
        <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 pb-3 border-b border-slate-100 dark:border-zinc-800 mb-4">
            <Sliders size={14} className="text-blue-600 dark:text-blue-400" />
            <span>Generation Parameters</span>
          </div>
          {customControls}
        </div>
      )}

      {/* 2. Primary Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        <div className="text-xs text-slate-500 dark:text-zinc-400">
          Generated in browser according to selected parameters
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onRun && (
            <button
              type="button"
              onClick={onRun}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold text-white transition-colors bg-blue-600 hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              <span>Generate New</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Prominent Generated Result Display */}
      <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs transition-colors">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#161b22]">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
              Generated Value
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!canExport}
              aria-label="Download generated output"
              className="min-w-9 min-h-9 flex items-center justify-center p-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 border border-transparent disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
              title="Download as .txt"
            >
              <Download size={15} />
            </button>
            <CopyButton text={output} disabled={!canExport} allowEmpty={canExport} />
          </div>
        </div>

        {/* Specialized Visual Preview or Fallback Textarea */}
        {customPreview ? (
          <div className="p-5">{customPreview}</div>
        ) : (
          <div className="p-4 sm:p-5">
            <textarea
              readOnly
              value={output}
              placeholder={outputPlaceholder}
              aria-label="Generated output text"
              rows={8}
              className="w-full p-4 bg-slate-50 dark:bg-[#161b22] rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 font-mono text-sm resize-y focus:outline-hidden leading-relaxed min-h-[160px] cursor-default"
            />
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#161b22] text-xs text-slate-500 dark:text-zinc-400 font-mono">
          <span>{output ? `${output.length.toLocaleString()} characters generated` : "Ready to generate"}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">Generated result</span>
        </div>
      </div>
    </div>
  );
};
