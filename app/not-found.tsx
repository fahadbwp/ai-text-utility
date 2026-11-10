import React from "react";
import Link from "next/link";
import { ArrowLeft, Search, Terminal, Home, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | AI Text Utility",
  description: "The page or text utility you are looking for could not be found.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  const popularTools = [
    { name: "Diff Checker", href: "/tools/diff-checker" },
    { name: "JSON Formatter", href: "/tools/json-formatter" },
    { name: "Word Counter", href: "/tools/word-counter" },
    { name: "Invoice Generator", href: "/tools/invoice-generator" },
    { name: "Image Compressor", href: "/tools/image-compressor" },
    { name: "AI Directory", href: "/ai-tools" },
  ];

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
          <Terminal size={14} />
          Error 404
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            The page or utility tool you requested does not exist or has been relocated.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            aria-label="Back to Homepage"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 font-semibold text-xs transition-colors shadow-xs"
          >
            <Home size={16} />
            Back to Tools Suite
          </Link>
          <Link
            href="/ai-tools"
            aria-label="Explore AI Tools Directory"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <Sparkles size={16} />
            AI Directory
          </Link>
        </div>

        {/* Popular Shortcuts */}
        <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 space-y-3">
          <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 uppercase tracking-wider">
            Popular Utility Tools
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors border border-slate-200/60 dark:border-zinc-700/60"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
