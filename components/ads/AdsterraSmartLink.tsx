"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

interface AdsterraSmartLinkProps {
  label?: string;
  className?: string;
  variant?: "button" | "badge" | "link";
}

export const AdsterraSmartLink: React.FC<AdsterraSmartLinkProps> = ({
  label = "Explore Premium Partner Deals",
  className = "",
  variant = "badge",
}) => {
  const smartLinkUrl =
    "https://www.profitableratecpmnetwork.com/wpnm4nd8?key=3c4dfd2355641f0419fce1f81a541b61";

  if (variant === "button") {
    return (
      <a
        href={smartLinkUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 shadow-2xs hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors ${className}`}
      >
        <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-300 dark:border-zinc-700 leading-none">
          Ad
        </span>
        <span>{label}</span>
        <ExternalLink size={12} className="opacity-70" />
      </a>
    );
  }

  if (variant === "link") {
    return (
      <a
        href={smartLinkUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors ${className}`}
      >
        <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-300 dark:border-zinc-700 leading-none">
          Ad
        </span>
        <span>{label}</span>
        <ExternalLink size={11} className="opacity-70" />
      </a>
    );
  }

  return (
    <a
      href={smartLinkUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 shadow-2xs hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors ${className}`}
    >
      <span className="px-1 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-300 dark:border-zinc-700 leading-none">
        Ad
      </span>
      <span>{label}</span>
      <ExternalLink size={10} className="text-slate-400 dark:text-zinc-500" />
    </a>
  );
};
