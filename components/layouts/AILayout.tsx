"use client";

import React from "react";
import {
  Cpu,
  FileText,
  Trash2,
  Download,
} from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { WorkspaceProps } from "./types";

export const AILayout: React.FC<WorkspaceProps> = ({
  tool,
  input,
  output,
  onInputChange,
  onRun,
  onClear,
  onDownload,
  isLoading = false,
  error = null,
  customControls,
  inputPlaceholder = "Enter text to transform with AI...",
  resultReady = output !== "",
}) => {
  const canExport = resultReady && !isLoading && !error;
  const isOverLimit = input.length > 10000;

  const handleDownload = () => {
    if (!canExport) return;
    if (onDownload) {
      onDownload();
      return;
    }
    const content = output;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool.slug}-ai-result.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-6">
      {/* 1. AI Options & Model Bar */}
      {customControls && (
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          {customControls}
        </div>
      )}

      {/* 2. Source Text Input Card */}
      <div className="flex flex-col rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs focus-within:border-blue-500/50 transition-colors">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
          <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
            <FileText size={14} className="text-blue-600 dark:text-blue-400" />
            Input Draft
          </span>
          <div className="flex items-center gap-2">
            {tool.sampleInput && (
              <button
                type="button"
                onClick={() => onInputChange(tool.sampleInput || "")}
                className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-md transition-colors cursor-pointer"
              >
                Load Sample
              </button>
            )}
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                disabled={!input && !output}
                aria-label="Clear input and result"
                className="min-w-9 min-h-9 flex items-center justify-center p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                title="Clear"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={inputPlaceholder}
          aria-label="AI text input"
          rows={8}
          className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 font-mono text-sm resize-y focus:outline-hidden leading-relaxed min-h-[180px]"
        />

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs text-slate-500 dark:text-zinc-400 font-mono">
          <span className={isOverLimit ? "text-rose-600 dark:text-rose-400 font-bold" : ""}>
            {input.length.toLocaleString()} / 10,000 max characters
          </span>
          <span className="text-slate-400 dark:text-zinc-500">On-demand generation</span>
        </div>
      </div>

      {/* 3. Primary AI Action Trigger Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400">
          <Cpu size={15} className="text-blue-600 dark:text-blue-400 shrink-0" />
          <span>AI requests are processed through secure server endpoints directly to the configured provider.</span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onRun && (
            <button
              type="button"
              onClick={onRun}
              disabled={isLoading || !input.trim() || isOverLimit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold text-white transition-colors bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Cpu size={14} />
                  <span>{output ? "Regenerate" : "Process with AI"}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 4. AI Result Card */}
      <div className="flex flex-col rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs transition-colors">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
              Generated Result
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!canExport}
              aria-label="Download AI output"
              className="min-w-9 min-h-9 flex items-center justify-center p-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 border border-transparent disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
              title="Download as .txt"
            >
              <Download size={15} />
            </button>
            <CopyButton text={output} disabled={!canExport} allowEmpty={canExport} />
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-4/5 animate-pulse" />
          </div>
        ) : (
          <textarea
            readOnly
            value={output}
            placeholder="Result will appear here after clicking 'Process with AI'..."
            aria-label="AI result output"
            rows={8}
            className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 font-mono text-sm resize-y focus:outline-hidden leading-relaxed min-h-[180px] cursor-default"
          />
        )}

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs text-slate-500 dark:text-zinc-400 font-mono">
          <span>{output ? `${output.length.toLocaleString()} characters generated` : "Awaiting execution"}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">Server Endpoint</span>
        </div>
      </div>
    </div>
  );
};
