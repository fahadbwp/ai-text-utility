"use client";

import React, { useMemo } from "react";
import {
  FileText,
  Trash2,
  ArrowLeftRight,
  Download,
  Clock,
  Sliders,
} from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { WorkspaceProps } from "./types";

export const TransformLayout: React.FC<WorkspaceProps> = ({
  tool,
  input,
  output,
  onInputChange,
  onClear,
  onSwap,
  onDownload,
  downloadTitle = "Download as .txt",
  customControls,
  inputPlaceholder = "Enter or paste your text here...",
  outputPlaceholder = "Transformed text will appear here automatically...",
  canSwap = true,
  canDownload = true,
  resultReady = output !== "",
  isLoading = false,
  error = null,
}) => {
  const canExport = resultReady && !isLoading && !error;
  // Live input stats
  const stats = useMemo(() => {
    const chars = input.length;
    const trimmed = input.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const lines = input ? input.split("\n").length : 0;
    const readingTimeSec = Math.ceil((words / 200) * 60);
    return { chars, words, lines, readingTimeSec };
  }, [input]);

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
    a.download = `${tool.slug}-result.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-5">
      {/* Contextual Controls Bar */}
      {customControls && (
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-3">
            <Sliders size={14} className="text-blue-600 dark:text-blue-400" />
            <span>Options &amp; Mode</span>
          </div>
          {customControls}
        </div>
      )}

      {/* Editor Grid: Input ➔ Live Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input Panel */}
        <div className="flex flex-col rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs focus-within:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
            <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <FileText size={14} className="text-blue-600 dark:text-blue-400" />
              Source Input
            </span>
            <div className="flex items-center gap-1.5">
              {tool.sampleInput && (
                <button
                  type="button"
                  onClick={() => onInputChange(tool.sampleInput || "")}
                  className="btn-secondary h-7 px-2.5 text-xs font-medium cursor-pointer inline-flex items-center"
                >
                  Load Sample
                </button>
              )}
              {onClear && (
                <button
                  type="button"
                  onClick={onClear}
                  disabled={!input && !output}
                  aria-label="Clear all text"
                  className="btn-icon text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 cursor-pointer"
                  title="Clear"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          <textarea
            id="source-text-input"
            name="sourceTextInput"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={inputPlaceholder}
            aria-label="Source text input"
            rows={12}
            className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 font-mono text-sm resize-y focus:outline-hidden leading-relaxed min-h-[220px]"
          />

          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-[11px] text-slate-500 dark:text-zinc-400 font-mono flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span>{stats.words.toLocaleString()} words</span>
              <span className="text-slate-300 dark:text-zinc-700">•</span>
              <span>{stats.chars.toLocaleString()} chars</span>
              <span className="text-slate-300 dark:text-zinc-700">•</span>
              <span>{stats.lines.toLocaleString()} lines</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 dark:text-zinc-500">
              <Clock size={12} />
              <span>{stats.readingTimeSec}s read</span>
            </div>
          </div>
        </div>

        {/* Live Output Panel */}
        <div className="flex flex-col rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs transition-colors">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                Live Result
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Result updates automatically" />
            </div>
            <div className="flex items-center gap-1.5">
              {canSwap && onSwap && (
                <button
                  type="button"
                  onClick={onSwap}
                  disabled={!output}
                  aria-label="Swap result to input"
                  className="btn-icon text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Swap output to input"
                >
                  <ArrowLeftRight size={14} />
                </button>
              )}
              {canDownload && (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!canExport}
                  aria-label="Download result as text file"
                  className="btn-icon text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                  title={downloadTitle}
                >
                  <Download size={14} />
                </button>
              )}
              <CopyButton text={output} disabled={!canExport} allowEmpty={canExport} />
            </div>
          </div>

          <textarea
            id="transformed-result-output"
            name="transformedResultOutput"
            readOnly
            value={output}
            placeholder={outputPlaceholder}
            aria-label="Transformed result output"
            rows={12}
            className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 font-mono text-sm resize-y focus:outline-hidden leading-relaxed min-h-[220px] cursor-default"
          />

          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs text-slate-500 dark:text-zinc-400 font-mono">
            <span>{output ? `${output.length.toLocaleString()} characters generated` : "Instant browser conversion"}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">Read-only</span>
          </div>
        </div>
      </div>
    </div>
  );
};
