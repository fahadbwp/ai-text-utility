import React from "react";

export interface BrandLogoProps {
  variant?: "full" | "icon" | "compact";
  size?: "sm" | "md" | "lg";
  className?: string;
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "full",
  size = "md",
  className = "",
  showSubtitle = false,
}) => {
  const sizeClasses = {
    sm: "w-7 h-7 sm:w-8 sm:h-8",
    md: "w-8 h-8 sm:w-9 sm:h-9 md:w-[38px] md:h-[38px]",
    lg: "w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12",
  }[size];

  const textClasses = {
    sm: "text-xs sm:text-sm",
    md: "text-sm sm:text-base",
    lg: "text-base sm:text-lg",
  }[size];

  const iconSvg = (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses} shrink-0`}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="40" height="40" rx="10" className="fill-slate-900 dark:fill-zinc-800" />
      {/* Precision developer cursor / bracket glyph */}
      <path
        d="M13 15L8 20L13 25"
        stroke="#38BDF8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 15L32 20L27 25"
        stroke="#38BDF8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 13L18 27"
        stroke="#60A5FA"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === "icon") {
    return <div className={`inline-flex items-center ${className}`}>{iconSvg}</div>;
  }

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-2 group ${className}`}>
        {iconSvg}
        <span className="font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
          AI
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {iconSvg}
      <div className="flex flex-col justify-center">
        <div className="flex items-center">
          <span className={`font-bold tracking-tight text-slate-900 dark:text-zinc-100 leading-tight flex items-center gap-1.5 ${textClasses}`}>
            <span className="text-blue-600 dark:text-blue-400">AI</span>
            <span>Text Utility</span>
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 leading-none mt-0.5 tracking-normal">
            Fast, Private &amp; Client-Side
          </span>
        )}
      </div>
    </div>
  );
};
