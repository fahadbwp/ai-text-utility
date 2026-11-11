"use client";

import React from "react";
import Link from "next/link";
import { ToolDefinition } from "@/data/toolsRegistry";
import { DynamicIcon } from "@/components/DynamicIcon";
import { FavoriteStar } from "@/components/FavoriteStar";
import { ArrowRight, Scale, Sparkles } from "lucide-react";
import { getToolTheme, getCategoryTheme } from "@/lib/toolThemes";

export interface ToolCardProps {
  tool: ToolDefinition;
  featured?: boolean;
  badgeLabel?: string;
  className?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  featured: featuredProp,
  badgeLabel,
  className = "",
}) => {
  const isFeatured = featuredProp !== undefined ? featuredProp : Boolean(tool.featured);
  const toolTheme = getToolTheme(tool.id, tool.category);
  const categoryTheme = getCategoryTheme(tool.category);

  // Render high-craft custom icons matching the reference visual direction
  const renderIcon = () => {
    if (tool.id === "word-counter") {
      return (
        <span
          className="font-extrabold text-[16px] sm:text-[17px] tracking-tight leading-none text-white select-none"
          aria-hidden="true"
        >
          Aa
        </span>
      );
    }
    if (tool.id === "diff-checker") {
      return <Scale size={20} className="text-white shrink-0" aria-hidden="true" />;
    }
    return <DynamicIcon name={tool.icon} size={19} className="text-white shrink-0" aria-hidden="true" />;
  };

  return (
    <div
      data-tool-id={tool.id}
      className={`group relative flex flex-col justify-between h-full bg-white rounded-[20px] p-4 sm:p-5 border transition-all duration-200 ease-out hover:-translate-y-1 ${
        isFeatured
          ? "border-[#1685FF]/35 shadow-[0_4px_16px_rgba(22,133,255,0.08)] hover:shadow-[0_14px_30px_rgba(22,133,255,0.15)] ring-1 ring-[#1685FF]/20"
          : "border-[#E8EEF8] shadow-[0_2px_8px_rgba(23,38,74,0.04)] hover:shadow-[0_12px_26px_rgba(23,38,74,0.08)] hover:border-[#1685FF]/30"
      } ${className}`}
    >
      <div>
        {/* Top Header: Icon, Badges, and Favorite Star */}
        <div className="flex items-start justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`${
                isFeatured ? "w-12 h-12 rounded-[14px]" : "w-11 h-11 rounded-[13px]"
              } ${toolTheme.iconBg} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-200`}
              aria-hidden="true"
            >
              {renderIcon()}
            </div>

            {/* Badges on header row if featured or custom label */}
            {isFeatured && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
                <Sparkles size={10} className="text-amber-500 fill-amber-400" />
                <span>Featured</span>
              </span>
            )}
            {!isFeatured && badgeLabel && (
              <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                {badgeLabel}
              </span>
            )}
          </div>

          {/* Favorite Star (stops click propagation so it doesn't navigate) */}
          <div className="relative z-20 shrink-0 -mr-1.5 -mt-1.5">
            <FavoriteStar toolId={tool.id} toolName={tool.name} size={16} />
          </div>
        </div>

        {/* Tool Name */}
        <h3 className="text-[14px] sm:text-[15px] font-bold text-[#17264A] group-hover:text-[#1685FF] transition-colors mb-1.5 line-clamp-1 tracking-tight">
          <Link
            href={`/tools/${tool.slug}`}
            className="focus:outline-hidden focus:underline after:content-[''] after:absolute after:inset-0 after:rounded-[20px] after:z-0"
          >
            {tool.name}
          </Link>
        </h3>

        {/* Tool Description */}
        <p className="text-[12px] sm:text-[13px] text-[#647797] leading-relaxed line-clamp-2 min-h-[36px]">
          {tool.description}
        </p>
      </div>

      {/* Card Footer: Category Pill, Speed/AI Indicator & Arrow Affordance */}
      <div className="mt-3.5 pt-3 border-t border-[#F0F4FA] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 flex-wrap truncate max-w-[80%]">
          {/* Category Badge */}
          <span
            className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${categoryTheme.badgeBg} ${categoryTheme.badgeText} ${categoryTheme.badgeBorder} border truncate`}
          >
            {tool.category}
          </span>

          {/* Speed / Free / AI Indicator */}
          {tool.requiresAI ? (
            <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-pink-50 text-[#9D174D] border border-pink-200/80 shrink-0">
              AI
            </span>
          ) : (
            <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 text-[#065F46] border border-emerald-200/80 shrink-0">
              Instant
            </span>
          )}

          {/* Custom secondary badge if provided on non-featured */}
          {isFeatured && badgeLabel && (
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-[#17264A] border border-slate-200 shrink-0">
              {badgeLabel}
            </span>
          )}
        </div>

        {/* Arrow Affordance */}
        <span
          className="relative z-10 w-7 h-7 rounded-full text-[#1685FF] group-hover:bg-[#1685FF]/10 flex items-center justify-center transition-all shrink-0"
          aria-hidden="true"
        >
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </div>
  );
};
