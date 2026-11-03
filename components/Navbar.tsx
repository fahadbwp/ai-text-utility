"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Star } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";
import { getFavorites } from "@/lib/storage";

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const [favCount, setFavCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isMac, setIsMac] = useState(false);
  useEffect(() => { setIsMac(/Mac|iPhone|iPod|iPad/.test(navigator.platform)); }, []);

  useEffect(() => {
    const updateFav = () => {
      setFavCount(getFavorites().length);
    };
    updateFav();
    window.addEventListener("favorites-updated", updateFav);
    window.addEventListener("storage", updateFav);
    return () => {
      window.removeEventListener("favorites-updated", updateFav);
      window.removeEventListener("storage", updateFav);
    };
  }, []);

  useEffect(() => {
    let prevScrolled = false;
    let prevPastHero = false;

    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const isScrolled = y > 16;
      const isPastHero = y > 380;

      if (isScrolled !== prevScrolled) {
        prevScrolled = isScrolled;
        setScrolled(isScrolled);
      }
      if (isPastHero !== prevPastHero) {
        prevPastHero = isPastHero;
        setPastHero(isPastHero);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFavoritesClick = () => {
    if (pathname === "/") {
      window.dispatchEvent(new CustomEvent("show-favorites"));
      document.getElementById("tools-section")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#favorites");
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-150 navbar-glass ${
        pastHero ? "navbar-past-hero" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 rounded-lg p-1 -ml-1 group shrink-0"
          aria-label="AI Text Utility home"
        >
          <BrandLogo size="md" showSubtitle={true} />
        </Link>

        {/* Desktop Primary Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              pathname === "/" ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              pathname === "/about" ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
            }`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              pathname === "/contact" ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Actions: Compact Search, Theme */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop Compact Search Launcher */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label={`Search tools (Press ${isMac ? "⌘K" : "Ctrl K"})`}
            className="hidden sm:flex items-center justify-between gap-2.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 text-xs text-slate-500 dark:text-zinc-400 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Search size={13} className="text-slate-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              <span className="font-normal text-slate-500 dark:text-zinc-400">
                Search tools...
              </span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-medium">
              {isMac ? "⌘K" : "Ctrl K"}
            </kbd>
          </button>

          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Search tools"
            className="sm:hidden p-2 rounded-lg text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
          >
            <Search size={18} aria-hidden="true" />
          </button>

          {/* Favorites Indicator Button */}
          <button
            type="button"
            onClick={handleFavoritesClick}
            aria-label={`View ${favCount} favorite tools`}
            className="relative p-2 rounded-lg text-slate-600 hover:text-amber-500 dark:text-zinc-400 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer group"
            title={favCount > 0 ? `View ${favCount} favorite tools` : "View favorites"}
          >
            <Star
              size={17}
              className={favCount > 0 ? "fill-amber-400 text-amber-400" : ""}
              aria-hidden="true"
            />
            {favCount > 0 && (
              <span className="absolute top-1 right-1 px-1 min-w-[15px] h-[15px] rounded-full bg-amber-500 text-[9px] font-bold text-slate-950 flex items-center justify-center leading-none">
                {favCount}
              </span>
            )}
          </button>

          {/* Theme Switcher */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
