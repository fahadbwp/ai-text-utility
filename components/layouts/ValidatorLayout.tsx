"use client";

import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  FileCode,
  Download,
  Trash2,
  ShieldCheck,
  Sliders,
} from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { WorkspaceProps } from "./types";

export const ValidatorLayout: React.FC<WorkspaceProps> = ({
  tool,
  input,
  output,
  onInputChange,
  onClear,
  onDownload,
  error,
  customControls,
  customPreview,
  inputPlaceholder = "Paste code, schema, or token to validate...",
  outputPlaceholder = "Validated and formatted output will appear here...",
  resultReady = output !== "",
  isLoading = false,
}) => {
  const canExport = resultReady && !isLoading && !error;
  const isValid = !error && output.length > 0;
  const hasInput = input.trim().length > 0;

  const validStatus = React.useMemo(() => {
    if (tool.slug === "json-formatter") {
      return {
        title: "Valid JSON",
        description: "Valid syntax parsed and formatted cleanly",
        badge: "Valid JSON",
      };
    }
    if (tool.slug === "jwt-decoder") {
      return {
        title: "Decoded Successfully",
        description: "Payload and header claims decoded cleanly (signature unverified)",
        badge: "Decoded",
      };
    }
    return {
      title: "Parsed Successfully",
      description: "Parsed and formatted cleanly",
      badge: "Parsed",
    };
  }, [tool.slug]);

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
    a.download = `${tool.slug}-validated.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Validation Status Banner */}
      {hasInput && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
            error
              ? "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
              : isValid
              ? "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300"
              : "bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-zinc-400"
          }`}
        >
          <div className="flex items-center gap-3">
            {error ? (
              <AlertCircle size={18} className="text-rose-500 shrink-0" />
            ) : isValid ? (
              <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
            ) : (
              <ShieldCheck size={18} className="text-slate-400 shrink-0" />
            )}
            <div>
              <div className="text-xs font-semibold">
                {error ? "Validation Error" : isValid ? validStatus.title : "Awaiting Validation"}
              </div>
              <div className="text-xs mt-0.5 font-mono">
                {error || (isValid ? validStatus.description : "Type or paste to inspect")}
              </div>
            </div>
          </div>

          {isValid && (
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/30">
              {validStatus.badge}
            </span>
          )}
        </div>
      )}

      {/* Optional Formatting / Inspection Options Bar */}
      {customControls && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-zinc-300">
            <Sliders size={14} className="text-blue-600 dark:text-blue-400" />
            <span>Inspection &amp; Formatting Settings</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">{customControls}</div>
        </div>
      )}

      {/* 2. Dual Workspace or Structured Preview */}
      {customPreview ? (
        <div className="space-y-5">
          {/* Top Token/Code Input */}
          <div className="flex flex-col rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs focus-within:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#161b22]">
              <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                <FileCode size={14} className="text-blue-600 dark:text-blue-400" />
                Raw Input Token / Code
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
                    disabled={!input}
                    aria-label="Clear input"
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
              aria-label="Raw validation input"
              rows={4}
              className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 font-mono text-sm resize-y focus:outline-hidden leading-relaxed min-h-[120px]"
            />
          </div>

          {/* Structured Inspection View */}
          <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#161b22] p-5 sm:p-6 shadow-xs transition-colors">
            {customPreview}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Source Input */}
          <div className="flex flex-col rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs focus-within:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#161b22]">
              <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                <FileCode size={14} className="text-blue-600 dark:text-blue-400" />
                Raw Input
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
                    disabled={!input}
                    aria-label="Clear input"
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
              aria-label="Raw text to format and validate"
              rows={14}
              className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 font-mono text-sm resize-y focus:outline-hidden leading-relaxed min-h-[260px]"
            />

            <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#161b22] text-xs text-slate-500 dark:text-zinc-400 font-mono">
              <span>{input.length.toLocaleString()} characters</span>
              <span className="text-slate-400 dark:text-zinc-500">In-Browser Parser</span>
            </div>
          </div>

          {/* Formatted Output */}
          <div className="flex flex-col rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs transition-colors">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#161b22]">
              <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                Validated &amp; Formatted Result
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!canExport}
                  aria-label="Download validated output"
                  className="min-w-9 min-h-9 flex items-center justify-center p-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 border border-transparent disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                  title="Download as .txt"
                >
                  <Download size={15} />
                </button>
                <CopyButton text={output} disabled={!canExport} allowEmpty={canExport} />
              </div>
            </div>

            <textarea
              readOnly
              value={output}
              placeholder={outputPlaceholder}
              aria-label="Validated result"
              rows={14}
              className="w-full p-4 sm:p-5 bg-transparent text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 font-mono text-sm resize-y focus:outline-hidden leading-relaxed min-h-[260px] cursor-default"
            />

            <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#161b22] text-xs text-slate-500 dark:text-zinc-400 font-mono">
              <span>{output ? `${output.length.toLocaleString()} characters formatted` : "Awaiting input"}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">Read-only</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
