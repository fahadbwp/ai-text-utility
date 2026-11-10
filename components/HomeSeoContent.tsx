import React from "react";
import Link from "next/link";
import { ArrowRight, Type, Code2, ShieldCheck } from "lucide-react";
import { getToolBySlug } from "@/data/toolsRegistry";
import { getToolSeoBlueprint, TOP_10_P0_TOOLS } from "@/data/seoBlueprint";
import { AdsterraResponsiveBanner, AdsterraNativeBanner } from "@/components/ads";
import { ToolCard } from "@/components/ToolCard";

export function HomeSeoContent() {
  return (
    <>
      <section aria-labelledby="workflows-heading" className="max-w-4xl mx-auto space-y-4">
        <h2 id="workflows-heading" className="scroll-mt-24 text-xl font-bold text-slate-900 dark:text-white">Start with the task you need to finish</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Prepare a page for publishing", text: "Format its URL, check the length and fill design mockups.", slugs: ["slug-generator", "word-counter", "lorem-ipsum"] },
            { title: "Clean a pasted list", text: "Remove repeated entries, unwanted symbols and extra whitespace.", slugs: ["remove-duplicate-lines", "remove-special-chars", "remove-extra-spaces"] },
            { title: "Polish a message", text: "Choose professional tone, warmer wording or proofreading. AI tools send text to an AI provider.", slugs: ["ai-professional", "ai-friendly", "ai-grammar"] },
            { title: "Develop or rephrase a draft", text: "Expand an idea, try different wording or shorten a passage. Check AI output against your source.", slugs: ["ai-expand", "ai-paraphrase", "ai-summarize"] },
            { title: "Convert documents & scrub prompts", text: "Convert PDF documents to editable Word docs, generate PDFs, or mask sensitive PII before prompting AI.", slugs: ["pdf-to-word", "word-to-pdf", "pii-sanitizer"] },
            { title: "Analyze keywords & density", text: "Count word and phrase frequency, measure keyword density percentages, and balance text repetition.", slugs: ["word-frequency", "character-frequency", "word-counter"] },
          ].map((workflow) => (
            <div key={workflow.title} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/65 dark:bg-slate-900/60 p-5 space-y-3">
              <h3 className="font-semibold text-slate-900 dark:text-white">{workflow.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{workflow.text}</p>
              <ul className="space-y-2 text-sm">
                {workflow.slugs.map((slug) => <li key={slug}><Link className="text-brand-600 dark:text-brand-400 underline underline-offset-2" href={`/tools/${slug}`}>{getToolSeoBlueprint(slug)?.popularAnchor || getToolBySlug(slug)?.name}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
      {/* Factual Information & Guidance Card (Moved down to preserve first viewport) */}
      <section className="max-w-4xl mx-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-3.5 shadow-xs" aria-labelledby="intro-heading">
        <h2 id="intro-heading" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">Free online text tools for everyday work</h2>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400 max-w-[72ch]">
          AI Text Utility is a collection of browser-based tools for writers, students, developers, and office workflows. Use the tools to count words and characters, clean lists, change text case, format JSON, test regular expressions, encode data, generate identifiers, work with dates, or prepare text for publishing. Most utilities process your input locally in the browser, so routine text transformations do not need a server upload.
        </p>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400 max-w-[72ch]">
          Each tool page includes practical instructions, feature details, common questions, limitations, and links to related utilities. AI Magic tools are optional and clearly separated from the browser-only tools because they require a server request to an AI provider.
        </p>
      </section>

      <section aria-labelledby="how-it-works-heading" className="max-w-4xl mx-auto pt-8 border-t border-slate-200 dark:border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h2 id="how-it-works-heading" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              How to choose the right tool
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
              Select the fastest workflow suited to your task and privacy needs
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2.5 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-2">
              <Type size={16} className="text-slate-700 dark:text-zinc-300 shrink-0" />
              <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">For writing</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
              Use <Link href="/tools/word-counter" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Word Counter</Link> for length checks, <Link href="/tools/case-converter" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Case Converter</Link> for capitalization, <Link href="/tools/remove-extra-spaces" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Cleanup tools</Link> for messy text, and the AI writing tools when you want an assisted rewrite.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2.5 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-2">
              <Code2 size={16} className="text-slate-700 dark:text-zinc-300 shrink-0" />
              <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">For developers</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
              Use <Link href="/tools/json-formatter" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">JSON Formatter</Link>, <Link href="/tools/regex-tester" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Regex Tester</Link>, <Link href="/tools/base64" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Base64</Link>, <Link href="/tools/uuid-generator" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">UUID</Link>, <Link href="/tools/jwt-decoder" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">JWT</Link>, <Link href="/tools/url-encoder" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">URL encoding</Link>, hashing, and date utilities for quick checks during development.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2.5 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-slate-700 dark:text-zinc-300 shrink-0" />
              <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">For privacy</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
              Ordinary transformations process text in your browser without sending it to our backend. AI requests leave the browser. Configured embedded ads use isolated cross-origin frames; sponsored links lead to external sites. Read the <Link href="/privacy" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Privacy Policy</Link> for details.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs pt-2">
          <Link href="/about" className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-xs">
            About the project <ArrowRight size={13} />
          </Link>
          <Link href="/privacy" className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-xs">
            Privacy Policy <ArrowRight size={13} />
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-xs">
            Contact support <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* Sponsored Adsterra Responsive Banner */}
      <AdsterraResponsiveBanner />

      <section aria-labelledby="popular-tools-heading" className="pt-8 border-t border-slate-200 dark:border-zinc-800 space-y-4">
        <div>
          <h2 id="popular-tools-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            Popular Free Developer &amp; Text Tools
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Fast, privacy-focused browser utilities with client-side execution
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {TOP_10_P0_TOOLS.map((slug) => {
            const tool = getToolBySlug(slug);
            if (!tool) return null;
            return (
              <ToolCard key={slug} tool={tool} featured={true} badgeLabel="Popular" />
            );
          })}
        </div>
      </section>

      {/* Sponsored Adsterra Native Banner */}
      <AdsterraNativeBanner />
    </>
  );
}
