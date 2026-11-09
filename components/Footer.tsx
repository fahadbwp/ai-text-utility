"use client";

import React from "react";
import Link from "next/link";
import { Shield, Zap, Lock } from "lucide-react";
import { TOOLS_REGISTRY, CATEGORIES } from "@/data/toolsRegistry";
import { BrandLogo } from "@/components/BrandLogo";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0d1117] transition-colors mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-8 border-b border-slate-200/80 dark:border-zinc-800/80">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-4 space-y-4 max-w-sm">
            <Link href="/" className="inline-flex items-center group" aria-label="AI Text Utility home">
              <BrandLogo size="md" showSubtitle={true} />
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
              A high-performance suite of {TOOLS_REGISTRY.length} tools for formatting, converting, analyzing, and cleaning text. Built for developers, writers, students, and professionals who demand speed, privacy, and precision.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-zinc-400 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <Shield size={14} className="text-slate-600 dark:text-zinc-400" />
                Standard Tools Run Client-Side
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" />
                Sub-Millisecond Processing
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock size={14} className="text-blue-500" />
                Zero Data Retention
              </span>
            </div>
          </div>

          {/* Col 2: Popular Tools */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-zinc-100 tracking-normal">
              Popular Tools
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-zinc-400">
              <li>
                <Link href="/tools/pdf-to-word" className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
                  PDF to Word Converter
                </Link>
              </li>
              <li>
                <Link href="/tools/word-to-pdf" className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
                  Word to PDF Converter
                </Link>
              </li>
              <li>
                <Link href="/tools/word-frequency" className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
                  Keyword Frequency Counter
                </Link>
              </li>
              <li>
                <Link href="/tools/ai-professional" className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
                  AI Professional Tone Rewriter
                </Link>
              </li>
              <li>
                <Link href="/tools/pii-sanitizer" className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
                  PII Sanitizer &amp; Prompt Masker
                </Link>
              </li>
              <li>
                <Link href="/tools/word-counter" className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
                  Word &amp; Character Counter
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-zinc-100 tracking-normal">
              Tool Categories
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-zinc-400">
              {CATEGORIES.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={`/#category-${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {cat.name} Tools
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Resources & Trust */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-zinc-100 tracking-normal">
              Legal &amp; Resources
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Privacy Badge */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-400">
          <div>
            © {new Date().getFullYear()} AI Text Utility. All rights reserved.
          </div>
          <div className="text-slate-500 dark:text-zinc-500 text-center sm:text-right">
            Most standard utilities run locally in your browser; AI tools use secure server-side requests to the configured AI provider.
          </div>
        </div>
      </div>
    </footer>
  );
};
