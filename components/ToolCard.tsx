"use client";

import React from "react";
import Link from "next/link";
import { ToolDefinition } from "@/data/toolsRegistry";
import { DynamicIcon } from "@/components/DynamicIcon";
import { FavoriteStar } from "@/components/FavoriteStar";
import { ArrowRight } from "lucide-react";
import { getToolTheme } from "@/lib/toolThemes";

export const ToolCard: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  const theme = getToolTheme(tool.id, tool.category);

  return (
    <div className="card-3d group relative flex flex-col justify-between rounded-xl p-3.5 sm:p-4">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
          <div
            className="flex items-center justify-center shrink-0 text-slate-600 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            aria-hidden="true"
          >
            <DynamicIcon
              name={tool.icon}
              size={16}
              className="transition-colors"
            />
          </div>

          <div className="relative z-20 flex items-center -mr-1 -mt-1">
            <FavoriteStar toolId={tool.id} toolName={tool.name} size={15} />
          </div>
        </div>

        <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1 line-clamp-1">
          <Link
            href={`/tools/${tool.slug}`}
            className="focus:outline-hidden focus:underline after:content-[''] after:absolute after:inset-0 after:rounded-xl after:z-0"
          >
            {tool.name}
          </Link>
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 truncate max-w-[70%]">
          {tool.category}
        </span>
        <span
          className="relative z-10 w-6 h-6 rounded-md text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-200 flex items-center justify-center transition-colors shrink-0"
          aria-hidden="true"
        >
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
};
