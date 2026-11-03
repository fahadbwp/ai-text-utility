"use client";

import React, { useState, useMemo } from "react";
import type { ToolDefinition } from "@/data/toolsRegistry";
import { ToolShell } from "@/components/layouts/ToolShell";
import { CopyButton } from "@/components/CopyButton";
import {
  sanitizePii,
  restorePii,
  type PiiEntityType,
  type SanitizationMode,
} from "@/lib/tools/piiSanitizer";
import { trackEvent } from "@/lib/analytics";
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Mail,
  Phone,
  Server,
  CreditCard,
  User,
  Cpu,
  Download,
  Upload,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";

interface PiiSanitizerToolProps {
  tool: ToolDefinition;
}

export function PiiSanitizerTool({ tool }: PiiSanitizerToolProps) {
  const [activeTab, setActiveTab] = useState<"sanitize" | "restore">("sanitize");
  const [inputText, setInputText] = useState("");
  const [sanitizationMode, setSanitizationMode] = useState<SanitizationMode>("reversible");
  const [customMask, setCustomMask] = useState("[REDACTED]");

  // Entity Toggles
  const [enabledTypes, setEnabledTypes] = useState<Record<PiiEntityType, boolean>>({
    email: true,
    phone: true,
    apiKey: true,
    ip: true,
    creditCard: true,
    ssn: true,
    name: true,
  });

  // Restore Tab States
  const [aiResponseText, setAiResponseText] = useState("");
  const [mappingJson, setMappingJson] = useState("");
  const [manualMappingError, setManualMappingError] = useState<string | null>(null);

  // Compute Sanitization
  const sanitizeResult = useMemo(() => {
    return sanitizePii(inputText, {
      enabledTypes,
      mode: sanitizationMode,
      customMask,
    });
  }, [inputText, enabledTypes, sanitizationMode, customMask]);

  // Active Session Mapping (or manually edited JSON)
  const activeMapping = useMemo(() => {
    if (mappingJson.trim()) {
      try {
        const parsed = JSON.parse(mappingJson);
        if (typeof parsed === "object" && parsed !== null) {
          return parsed as Record<string, string>;
        }
      } catch {
        // Handled in UI
      }
    }
    return sanitizeResult.mapping;
  }, [mappingJson, sanitizeResult.mapping]);

  // Compute Restored Text
  const restoredText = useMemo(() => {
    if (!aiResponseText.trim()) return "";
    return restorePii(aiResponseText, activeMapping);
  }, [aiResponseText, activeMapping]);

  const toggleEntityType = (type: PiiEntityType) => {
    setEnabledTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleClear = () => {
    if (activeTab === "sanitize") {
      setInputText("");
    } else {
      setAiResponseText("");
    }
  };

  const downloadMappingJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sanitizeResult.mapping, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "pii-mapping.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    trackEvent("tool_used", { toolSlug: tool.slug, action: "download_mapping" });
  };

  const loadSampleData = () => {
    const sample =
      "Hello team, please update customer record for Dr. Gregory House.\n" +
      "Contact email: gregory.house@princeton-plainsboro.org\n" +
      "Direct line: +1 (555) 019-2834\n" +
      "Production host: 192.168.1.105\n" +
      "AWS Token: AKIAIOSFODNN7EXAMPLE\n" +
      "Visa test card: 4532-0151-1283-0366";
    setInputText(sample);
    trackEvent("tool_used", { toolSlug: tool.slug, action: "load_sample" });
  };

  return (
    <ToolShell tool={tool} onClear={handleClear}>
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "sanitize"}
            aria-label="Tab Sanitize and Prompt"
            onClick={() => setActiveTab("sanitize")}
            className={`flex items-center gap-2 py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "sanitize"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Lock className="w-4 h-4" />
            1. Sanitize & Prompt
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "restore"}
            aria-label="Tab Restore AI Response"
            onClick={() => setActiveTab("restore")}
            className={`flex items-center gap-2 py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "restore"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Unlock className="w-4 h-4" />
            2. Restore AI Response
          </button>
        </div>

        {activeTab === "sanitize" ? (
          <div className="space-y-6">
            {/* Security Badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-100/80 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                  100% In-Browser Zero-Knowledge Privacy: Text never leaves your device.
                </span>
              </div>
              <button
                type="button"
                onClick={loadSampleData}
                aria-label="Load Sample Data"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Load Sample Data
              </button>
            </div>

            {/* Filter Toggle Chips */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Detect & Anonymize Entities:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { type: "apiKey" as PiiEntityType, label: "API Keys & Secrets", icon: KeyRound },
                  { type: "email" as PiiEntityType, label: "Emails", icon: Mail },
                  { type: "phone" as PiiEntityType, label: "Phone Numbers", icon: Phone },
                  { type: "ip" as PiiEntityType, label: "IP Addresses", icon: Server },
                  { type: "creditCard" as PiiEntityType, label: "Credit Cards", icon: CreditCard },
                  { type: "name" as PiiEntityType, label: "Personal Names", icon: User },
                ].map(({ type, label, icon: Icon }) => {
                  const active = enabledTypes[type];
                  const count = sanitizeResult.counts[type] || 0;
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-label={`Toggle ${label}`}
                      onClick={() => toggleEntityType(type)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        active
                          ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300"
                          : "bg-gray-100 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{label}</span>
                      {active && count > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-600 text-white font-mono">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode Selector */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Anonymization Mode:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="sanitizationMode"
                  aria-label="Reversible Tokens"
                  checked={sanitizationMode === "reversible"}
                  onChange={() => setSanitizationMode("reversible")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Reversible Tokens ([TOKEN_1])</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="sanitizationMode"
                  aria-label="Redacted Blackout"
                  checked={sanitizationMode === "redacted"}
                  onChange={() => setSanitizationMode("redacted")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Redacted ([REDACTED])</span>
              </label>
            </div>

            {/* Input & Output Split Workspace */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Input Prompt */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="pii-input-textarea"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Confidential Input Text / Prompt
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {inputText.length} characters
                  </span>
                </div>
                <textarea
                  id="pii-input-textarea"
                  aria-label="Confidential Input Text / Prompt"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste confidential text containing customer names, emails, API keys, or IP addresses here..."
                  className="w-full h-80 p-4 font-mono text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 focus:ring-2 focus:ring-blue-500/40 focus:border-transparent resize-none"
                />
              </div>

              {/* Right Column: Sanitized Safe Output */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="pii-output-textarea"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Safe Sanitized Text (For AI Prompt)
                    </label>
                    {sanitizeResult.totalCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                        {sanitizeResult.totalCount} Scrubbed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {sanitizationMode === "reversible" &&
                      Object.keys(sanitizeResult.mapping).length > 0 && (
                        <button
                          type="button"
                          onClick={downloadMappingJson}
                          aria-label="Download Mapping JSON"
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                          title="Download session mapping dictionary"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Mapping</span>
                        </button>
                      )}
                    <CopyButton
                      text={sanitizeResult.sanitizedText}
                      label="Copy Sanitized Text"
                    />
                  </div>
                </div>
                <textarea
                  id="pii-output-textarea"
                  aria-label="Safe Sanitized Text"
                  readOnly
                  value={sanitizeResult.sanitizedText}
                  placeholder="Sanitized text with secure [TOKEN_N] placeholders will appear here..."
                  className="w-full h-80 p-4 font-mono text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 resize-none"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: Restore AI Response */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                  Paste the response you received from ChatGPT or Claude. The tool will automatically substitute synthetic tokens back to your original confidential data.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: AI Response */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="ai-response-textarea"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    AI Model Response (Contains [TOKEN_N])
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {aiResponseText.length} characters
                  </span>
                </div>
                <textarea
                  id="ai-response-textarea"
                  aria-label="AI Model Response"
                  value={aiResponseText}
                  onChange={(e) => setAiResponseText(e.target.value)}
                  placeholder="Paste response from ChatGPT / Claude containing tokens like [NAME_1], [EMAIL_1]..."
                  className="w-full h-80 p-4 font-mono text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 focus:ring-2 focus:ring-blue-500/40 focus:border-transparent resize-none"
                />
              </div>

              {/* Right Column: Restored Original Text */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="restored-output-textarea"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    De-Anonymized Restored Text
                  </label>
                  <CopyButton
                    text={restoredText}
                    label="Copy Restored Text"
                  />
                </div>
                <textarea
                  id="restored-output-textarea"
                  aria-label="De-Anonymized Restored Text"
                  readOnly
                  value={restoredText}
                  placeholder="Restored text with your original confidential data will appear here automatically..."
                  className="w-full h-80 p-4 font-mono text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 resize-none"
                />
              </div>
            </div>

            {/* Active Mapping Dictionary Drawer */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Active Session Tokens ({Object.keys(activeMapping).length} registered)
                </span>
              </div>
              {Object.keys(activeMapping).length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No active tokens yet. First anonymize a prompt in Tab 1, or tokens will automatically register when you enter text.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(activeMapping).map(([tok, val]) => (
                    <span
                      key={tok}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    >
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{tok}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{val}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}

export default PiiSanitizerTool;
