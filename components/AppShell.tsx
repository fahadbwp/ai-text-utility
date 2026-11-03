"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/CommandPalette";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.isComposing || document.querySelector("dialog[open]")) return;
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };

    const handleOpenEvent = () => setPaletteOpen(true);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpenEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenEvent);
    };
  }, []);

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-zinc-100 flex flex-col transition-colors selection:bg-brand-500/20 selection:text-brand-700 dark:selection:text-brand-300 overflow-x-clip">
      {/* Clean Technical Backdrop */}
      <div className="app-backdrop" aria-hidden="true" />

      {/* Main App Content Stack */}
      <div className="relative z-10 flex flex-col flex-1">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Navbar onOpenCommandPalette={() => setPaletteOpen(true)} />
        <main id="main-content" tabIndex={-1} className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 sm:pt-6 sm:pb-16">
          {children}
        </main>
        <Footer />
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
};
