"use client";

import React, { useState, useMemo, useCallback } from "react";
import type { ToolDefinition } from "@/data/toolsRegistry";
import { ToolShell } from "@/components/layouts/ToolShell";
import { CopyButton } from "@/components/CopyButton";
import {
  convertJsonToTypescript,
  type JsonToTypescriptOptions,
} from "@/lib/tools/jsonToTypescript";
import { trackEvent } from "@/lib/analytics";
import {
  Code2,
  FileCode,
  Download,
  Trash2,
  Sparkles,
  Layers,
  ShieldCheck,
  Check,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface JsonToTypescriptToolProps {
  tool: ToolDefinition;
}

const SAMPLE_PRESETS: Record<string, { label: string; json: string }> = {
  user: {
    label: "User Profile",
    json: JSON.stringify(
      {
        id: 1042,
        username: "ada_lovelace",
        email: "ada@algorithm.org",
        isActive: true,
        roles: ["admin", "developer"],
        profile: {
          firstName: "Ada",
          lastName: "Lovelace",
          bio: "First computer programmer",
          avatarUrl: "https://example.com/avatar.jpg",
          social: {
            github: "ada-lovelace",
            twitter: "@adalovelace",
          },
        },
        metadata: {
          lastLogin: "2026-11-09T14:30:00Z",
          loginAttempts: 1,
        },
      },
      null,
      2
    ),
  },
  order: {
    label: "E-Commerce Order",
    json: JSON.stringify(
      {
        orderId: "ORD-98231",
        customer: {
          id: "CUST-441",
          name: "Alan Turing",
          verified: true,
        },
        items: [
          {
            sku: "TECH-001",
            name: "Mechanical Keyboard",
            quantity: 1,
            unitPrice: 129.99,
          },
          {
            sku: "CABLE-02",
            name: "Braided USB-C Cable",
            quantity: 2,
            unitPrice: 14.5,
            discount: 2.0,
          },
        ],
        shippingAddress: {
          street: "10 Bletchley Park Rd",
          city: "Milton Keynes",
          postalCode: "MK3 6EB",
          country: "UK",
        },
        totalAmount: 156.99,
        isPaid: true,
      },
      null,
      2
    ),
  },
  apiResponse: {
    label: "API Response (List)",
    json: JSON.stringify(
      {
        status: "success",
        page: 1,
        perPage: 2,
        totalResults: 42,
        data: [
          {
            id: "evt_1",
            type: "payment_received",
            amount: 5000,
            currency: "usd",
            captured: true,
            createdAt: "2026-11-09T10:00:00Z",
          },
          {
            id: "evt_2",
            type: "refund_issued",
            amount: 1500,
            currency: "usd",
            captured: false,
            notes: "Customer requested return",
            createdAt: "2026-11-09T12:00:00Z",
          },
        ],
      },
      null,
      2
    ),
  },
};

export function JsonToTypescriptTool({ tool }: JsonToTypescriptToolProps) {
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_PRESETS.user.json);
  const [rootName, setRootName] = useState<string>("User");
  const [outputMode, setOutputMode] = useState<"interface" | "type" | "zod">("interface");
  const [useExport, setUseExport] = useState<boolean>(true);
  const [useReadonly, setUseReadonly] = useState<boolean>(false);
  const [useOptional, setUseOptional] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Conversion computation
  const result = useMemo(() => {
    return convertJsonToTypescript(jsonInput, {
      rootName,
      outputMode,
      useExport,
      useReadonly,
      useOptional,
    });
  }, [jsonInput, rootName, outputMode, useExport, useReadonly, useOptional]);

  const handleCopy = useCallback(() => {
    if (!result.code) return;
    navigator.clipboard.writeText(result.code);
    setCopied(true);
    trackEvent("tool_copied", {
      toolSlug: tool.slug,
      action: "copy_typescript",
    });
    setTimeout(() => setCopied(false), 2000);
  }, [result.code, tool.slug]);

  const handleDownload = useCallback(() => {
    if (!result.code) return;
    const blob = new Blob([result.code], { type: "text/typescript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename = `${rootName.toLowerCase() || "types"}.${outputMode === "zod" ? "zod.ts" : "types.ts"}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    trackEvent("tool_used", {
      toolSlug: tool.slug,
      action: "download_typescript",
    });
  }, [result.code, rootName, outputMode, tool.slug]);

  const handleFormatJson = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch {
      // Ignore if syntax is invalid
    }
  }, [jsonInput]);

  const loadPreset = (presetKey: string) => {
    const preset = SAMPLE_PRESETS[presetKey];
    if (preset) {
      setJsonInput(preset.json);
      if (presetKey === "user") setRootName("User");
      else if (presetKey === "order") setRootName("Order");
      else if (presetKey === "apiResponse") setRootName("ApiResponse");
    }
  };

  return (
    <ToolShell tool={tool} onClear={() => setJsonInput("")}>
      <div className="space-y-6">
        {/* Preset & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
              Load Sample:
            </span>
            {Object.entries(SAMPLE_PRESETS).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => loadPreset(key)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                aria-label={`Load ${item.label} sample`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>100% In-Browser Local Processing</span>
          </div>
        </div>

        {/* Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Pane: JSON Input */}
          <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/40">
              <div className="flex items-center gap-2">
                <FileCode size={16} className="text-brand-600 dark:text-brand-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                  JSON Input
                </span>
                <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                  ({jsonInput.length} chars)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFormatJson}
                  className="px-2 py-1 text-xs font-medium rounded-md text-slate-600 dark:text-zinc-300 hover:bg-slate-200/70 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Format and beautify JSON input"
                >
                  Beautify JSON
                </button>
                <button
                  type="button"
                  onClick={() => setJsonInput("")}
                  className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  aria-label="Clear JSON input"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="relative flex-1 min-h-[360px]">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste valid JSON object or array here..."
                aria-label="JSON Input"
                className="w-full h-full min-h-[360px] p-4 text-xs sm:text-sm font-mono leading-relaxed bg-transparent resize-y border-0 focus:outline-hidden focus:ring-0 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                spellCheck={false}
              />
            </div>

            {result.error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border-t border-red-200 dark:border-red-900/50 flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                <span>
                  <strong>JSON Syntax Error:</strong> {result.error}
                </span>
              </div>
            )}
          </div>

          {/* Right Pane: Generated TypeScript Output */}
          <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/40">
              {/* Output Mode Switcher */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-200/70 dark:bg-zinc-800 text-xs">
                {(["interface", "type", "zod"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setOutputMode(mode)}
                    className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                      outputMode === mode
                        ? "bg-white dark:bg-zinc-900 text-brand-600 dark:text-brand-400 shadow-xs"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
                    }`}
                    aria-label={`Switch to ${mode} mode`}
                  >
                    {mode === "interface" ? "Interfaces" : mode === "type" ? "Types" : "Zod"}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!result.code}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                  aria-label="Copy generated TypeScript code"
                >
                  {copied ? <Check size={13} /> : <Code2 size={13} />}
                  <span>{copied ? "Copied!" : "Copy Code"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!result.code}
                  className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 rounded-lg hover:bg-slate-200/70 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Download TypeScript definition file"
                  title="Download .ts file"
                >
                  <Download size={15} />
                </button>
              </div>
            </div>

            {/* Config Options Bar */}
            <div className="px-4 py-2.5 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/40 dark:bg-zinc-900/60 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="root-name-input"
                  className="font-medium text-slate-600 dark:text-zinc-400"
                >
                  Root Name:
                </label>
                <input
                  id="root-name-input"
                  type="text"
                  value={rootName}
                  onChange={(e) => setRootName(e.target.value)}
                  placeholder="RootObject"
                  aria-label="Root interface or type name"
                  className="px-2 py-0.5 rounded-md border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs w-28 focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={useExport}
                  onChange={(e) => setUseExport(e.target.checked)}
                  aria-label="Export generated interfaces"
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>export</span>
              </label>

              {outputMode !== "zod" && (
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={useReadonly}
                    onChange={(e) => setUseReadonly(e.target.checked)}
                    aria-label="Make properties readonly"
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>readonly</span>
                </label>
              )}

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={useOptional}
                  onChange={(e) => setUseOptional(e.target.checked)}
                  aria-label="Make all properties optional"
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>optional (?)</span>
              </label>

              {result.interfaceCount > 0 && (
                <span className="ml-auto text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                  {result.interfaceCount} {outputMode === "zod" ? "schemas" : "types"}
                </span>
              )}
            </div>

            {/* Code Output Area */}
            <div className="relative flex-1 min-h-[320px] bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-100 overflow-auto">
              {result.code ? (
                <pre className="whitespace-pre leading-relaxed select-text font-mono">
                  <code>{result.code}</code>
                </pre>
              ) : (
                <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-slate-500 text-center space-y-2">
                  <Code2 size={28} className="text-slate-600" />
                  <p className="text-xs">
                    {result.error
                      ? "Fix JSON syntax error on the left to see generated code"
                      : "Paste JSON to generate TypeScript interfaces"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
