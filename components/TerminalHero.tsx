"use client";

import React, { useState, useRef } from "react";
import { ArrowRight, ShieldCheck, Zap, Lock, Check, RefreshCw, Cpu } from "lucide-react";
import { TOOLS_REGISTRY } from "@/data/toolsRegistry";

interface DemoPreset {
  id: string;
  name: string;
  toolName: string;
  sublabel: string;
  input: string;
  output: string;
  charsBefore: number;
  charsAfter: number;
}

const PRESETS: DemoPreset[] = [
  {
    id: "clean-spaces",
    name: "Text Cleaner",
    toolName: "Text Cleaner",
    sublabel: "Remove extra spaces",
    input: "1  Hello   World!\n2  \\n\\n\n3  This is a sample   text   with\n   extra   spaces  .",
    output: "Hello World!\n\nThis is a sample text with\nextra spaces.",
    charsBefore: 68,
    charsAfter: 49,
  },
  {
    id: "word-metrics",
    name: "Word Counter",
    toolName: "Word Counter",
    sublabel: "Real-time metrics",
    input: "Fast, reliable browser utilities running locally inside modern browser memory.",
    output: "10 words · 77 characters · 1 sentence · ~0.05 min read",
    charsBefore: 77,
    charsAfter: 54,
  },
  {
    id: "json-beautify",
    name: "JSON Formatter",
    toolName: "JSON Formatter",
    sublabel: "Format & validate",
    input: `{"service":"ai-text-utility","status":"live","tools":${TOOLS_REGISTRY.length}}`,
    output: `{\n  "service": "ai-text-utility",\n  "status": "live",\n  "tools": ${TOOLS_REGISTRY.length}\n}`,
    charsBefore: 70,
    charsAfter: 84,
  },
];

export const TerminalHero: React.FC = () => {
  const [activePreset, setActivePreset] = useState<DemoPreset>(PRESETS[0]);
  const [copied, setCopied] = useState(false);
  const totalTools = TOOLS_REGISTRY.length;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activePreset.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextIndex = (index + 1) % PRESETS.length;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nextIndex = (index - 1 + PRESETS.length) % PRESETS.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = PRESETS.length - 1;
    } else {
      return;
    }

    const nextPreset = PRESETS[nextIndex];
    setActivePreset(nextPreset);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section className="relative w-full pt-1 pb-4 sm:pt-2 sm:pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Hero Typography & Trust Indicators */}
        <div className="lg:col-span-6 w-full min-w-0 flex flex-col items-start text-left space-y-4 sm:space-y-5">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-medium">
            <Cpu size={13} className="text-blue-600 dark:text-blue-400" />
            <span>Client-Side Engine • {totalTools} Utilities</span>
          </div>

          {/* Primary H1 (Solid, unified high-contrast typography) */}
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 leading-[1.12] font-display">
            Precision text operations for engineers &amp; writers
          </h1>

          {/* Supporting Paragraph */}
          <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg">
            Deterministic, client-side text utilities. Format JSON, test regular expressions, clean lists, and convert encodings without server roundtrips or telemetry.
          </p>

          {/* Compact 3-item Trust Row */}
          <div className="w-full pt-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
            <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 flex items-start gap-2">
              <ShieldCheck size={15} className="text-slate-600 dark:text-zinc-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100">Client-Side</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">Runs locally in browser</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 flex items-start gap-2">
              <Zap size={15} className="text-slate-600 dark:text-zinc-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100">Zero Latency</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">Sub-millisecond execution</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 flex items-start gap-2">
              <Lock size={15} className="text-slate-600 dark:text-zinc-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-zinc-100">Private by Default</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">Zero data retention</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Showcase Sandbox */}
        <div className="lg:col-span-6 w-full min-w-0">
          <div className="relative rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hero-card-3d overflow-hidden">
            {/* Top Bar / App Card Chrome */}
            <div className="h-10 bg-slate-50 dark:bg-[#161b22]/80 border-b border-slate-200 dark:border-zinc-800 px-4 flex items-center justify-between gap-3 select-none">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700 inline-block" />
              </div>

              {/* Preset Selector Tabs */}
              <div
                role="tablist"
                aria-label="Interactive Demo Presets"
                className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 min-w-0"
              >
                {PRESETS.map((preset, index) => (
                  <button
                    key={preset.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    id={`demo-tab-${preset.id}`}
                    role="tab"
                    aria-selected={activePreset.id === preset.id}
                    aria-controls="demo-tabpanel"
                    tabIndex={activePreset.id === preset.id ? 0 : -1}
                    type="button"
                    onClick={() => setActivePreset(preset)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`h-7 px-2.5 rounded-md text-xs transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                      activePreset.id === preset.id
                        ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-semibold border border-slate-200 dark:border-zinc-700 shadow-xs"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/50 font-normal"
                    }`}
                  >
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-[11px] font-medium shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                <span>Live Preview</span>
              </div>
            </div>

            {/* Preview Body: Split Input/Output View */}
            <div
              id="demo-tabpanel"
              role="tabpanel"
              aria-labelledby={`demo-tab-${activePreset.id}`}
              className="p-4 sm:p-5 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3">
                {/* Input Box */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block">
                    Input text
                  </span>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-zinc-800 font-mono text-xs text-slate-700 dark:text-zinc-300 whitespace-pre-wrap break-all min-h-[96px] leading-relaxed">
                    {activePreset.input}
                  </div>
                </div>

                {/* Center Action Arrow */}
                <div className="hidden sm:flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 flex items-center justify-center">
                    <ArrowRight size={13} />
                  </div>
                </div>

                {/* Output Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Formatted result
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      aria-label="Copy demo output"
                      className="btn-secondary h-6 px-2 text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500/40"
                    >
                      {copied ? <Check size={11} className="text-blue-600 dark:text-blue-400" /> : <RefreshCw size={11} />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-zinc-800 font-mono text-xs text-slate-800 dark:text-zinc-200 whitespace-pre-wrap break-all min-h-[96px] leading-relaxed">
                    {activePreset.output}
                  </div>
                </div>
              </div>

              {/* Bottom Status Bar */}
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span className="font-medium text-[11px]">{activePreset.sublabel}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Characters: {activePreset.charsBefore} → {activePreset.charsAfter}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
