import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenFeaturedLab: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenFeaturedLab }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090D16]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-6">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#overview"
          className="font-display text-lg font-bold tracking-tight text-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
        >
          HEINSITT.LAB
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400"
        >
          <a
            href="#overview"
            className="hover:text-slate-100 transition-colors duration-150 whitespace-nowrap shrink-0 underline-offset-8 hover:underline decoration-sky-400/70"
          >
            Overview
          </a>
          <a
            href="#labs"
            className="hover:text-slate-100 transition-colors duration-150 whitespace-nowrap shrink-0 underline-offset-8 hover:underline decoration-sky-400/70"
          >
            Lab Modules
          </a>
          <a
            href="#journey"
            className="hover:text-slate-100 transition-colors duration-150 whitespace-nowrap shrink-0 underline-offset-8 hover:underline decoration-sky-400/70"
          >
            Journey
          </a>
          <a
            href="#footer"
            className="hover:text-slate-100 transition-colors duration-150 whitespace-nowrap shrink-0 underline-offset-8 hover:underline decoration-sky-400/70"
          >
            Studio
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenFeaturedLab}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-400/10 border border-sky-400/30 px-4 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-400/20 hover:border-sky-400/50 hover:text-sky-200 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <span>Inspect Lab</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
